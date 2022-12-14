import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import SongCard from './SongCard';
import MUIEditSongModal from './MUIEditSongModal';
import MUIRemoveSongModal from './MUIRemoveSongModal';
import { List } from '@mui/material';
import EditToolbar from './EditToolbar';
/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, isPublished } = props;
    const [songsActive, setSongsActive] = useState(false);
    const [selected, setSelected] = useState(false);

    function toggleLoadSongs(event, id) {
        event.stopPropagation();
        let newActive = !songsActive;
        if (newActive) {
            if (store.currentList) {
                if (store.currentList._id === id) {
                    handleLoadList(event, id);
                }
                else {
                    console.log("HERE");
                    store.closeCurrentList();
                    handleLoadList(event, id);
                }
            }
            else {
                handleLoadList(event, id);
                setSelected(true);
            }

        }
        else {
            store.closeCurrentList();
            setSelected(false);
        }
        setSongsActive(newActive);
    }

    function handleLoadList(event, id) {
        event.stopPropagation();
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    function handleClick(event, id) {
        if (event.detail === 1) {
            store.loadPlayer(idNamePair._id, 0);
            setSelected(true);
        }
        else if (event.detail === 2 && !songsActive && !isPublished) {
            toggleEdit();
        }
    }
    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            if (text !== "") {
                // check to see if newname is unique
                let playlists = store.idNamePairs.filter((list) => { return list.name === text && list._id !== id });
                if (playlists.length !== 0) {
                    store.showRenameErrorModal();
                }
                else {
                    store.changeListName(id, text);
                    toggleEdit();
                }
            }
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleLikePlaylist(event, id) {
        event.stopPropagation();
        store.likePlaylist(id);
    }

    function handleDislikePlaylist(event, id) {
        event.stopPropagation();
        store.dislikePlaylist(id);
    }



    let cardStatus = store.currentList ? (store.currentList._id == idNamePair._id ? "list-card-open" : "list-card-unopen") : "list-card-unopen";

    // List card how they look based on if they are published or not
    let cardElementDescription =
        <Box style={{ marginTop: '8pt' }}>
            <Box style={{ fontWeight: "bold" }}>
                {idNamePair.name}
            </Box>
            <Box style={{ fontSize: "15pt" }}>
                By: <p style={{ display: "inline", color: "blue", textDecoration: "underline" }}>{idNamePair.ownerUserName}</p>
            </Box>
        </Box>

    let cardElementPublished = isPublished ?
        <Box className="list-card-item2">
            <Box style={{ fontSize: '15pt' }}>
                <IconButton onClick={(event) => { handleLikePlaylist(event, idNamePair._id) }}>
                    <ThumbUpOutlinedIcon />
                </IconButton>
                {idNamePair.likes}
                <IconButton onClick={(event) => { handleDislikePlaylist(event, idNamePair._id) }}>
                    <ThumbDownOutlinedIcon style={{ marginLeft: "30pt" }} />
                </IconButton>
                {idNamePair.dislikes}
            </Box>

        </Box> : <div></div>


    let cardStyle =
    {
        width: '100%',
        fontSize: '18pt',
        borderRadius: 10,
        border: "2px solid black",
        boxShadow: "5px 3px 3px #dbdbdb",
        background: "#FEFBEA",
    }

    if (isPublished) {
        cardStyle = {
            width: '100%',
            fontSize: '18pt',
            borderRadius: 10,
            border: "2px solid black",
            boxShadow: "5px 3px 3px #dbdbdb",
            background: "#BBBEFE",
        }
    }
    if (store.currentList != null) {
        if (selected && isPublished && store.currentList._id === idNamePair._id) {
            cardStyle = {
                width: '100%',
                fontSize: '18pt',
                borderRadius: 10,
                border: "2px solid black",
                boxShadow: "5px 3px 3px #dbdbdb",
                background: "#d598c0",
            }
        }
    }

    // put the song cards inside the list card div

    let songCards = "";

    if (store.currentList != null) {
        if (songsActive && store.currentList._id === idNamePair._id) {
            if (store.currentList == null) {
                // store.history.push("/");
                return null;
            }
            else {

                let modalJSX = "";
                if (store.isEditSongModalOpen()) {
                    modalJSX = <MUIEditSongModal />;
                }
                else if (store.isRemoveSongModalOpen()) {
                    modalJSX = <MUIRemoveSongModal />;
                }

                songCards =
                    <div onClick={(event) => { event.stopPropagation() }}>

                        <List
                            id="playlist-cards"
                            sx={{ width: '100%' }}
                            className={isPublished ? "song-card-container-published" : "song-card-container-unpublished"}
                        >
                            {store.currentList.songs.map((song, index) => (
                                <SongCard
                                    id={'playlist-song-' + (index)}
                                    key={'playlist-song-' + (index)}
                                    index={index}
                                    song={song}
                                    isPublished={isPublished}
                                />
                            ))
                            }

                        </List>
                        <EditToolbar idNamePair={idNamePair} handleClose={toggleLoadSongs} />
                        {modalJSX}
                    </div>

            }

        }
    }
    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginBottom: '8px', display: 'flex' }}
            style={cardStyle}
            button
            onClick={(event) => { handleClick(event, (idNamePair._id)) }}
            disabled={store.currentModal != "NONE"}
        >
            <Box sx={{ p: 1, flexGrow: 1 }} className={cardStatus}>
                <Box className="list-card-item1">
                    {cardElementDescription}

                    {cardElementPublished}
                </Box>
                {songCards}
                <Box className="list-card-item3">
                    {isPublished ?
                        <Box style={{ fontSize: '13pt', display: "grid", gridTemplateColumns: "3fr 1fr" }}>
                            <Box style={{}}>
                                <Box>Published: <p style={{ color: "green", display: "inline" }}>{idNamePair.publishedDate}</p></Box>
                            </Box>
                            <Box>
                                <Box>Listens: <p style={{ color: "red", display: "inline" }}>{idNamePair.totalPlays}</p></Box>
                            </Box>
                        </Box> : <div></div>}

                    <Box>
                        <IconButton onClick={(event) => { toggleLoadSongs(event, idNamePair._id) }} aria-label='edit'>
                            {songsActive ? <KeyboardDoubleArrowUpOutlinedIcon style={{ fontSize: '22pt' }} /> : <KeyboardDoubleArrowDownIcon style={{ fontSize: '22pt' }} />
                            }
                        </IconButton>
                    </Box>

                </Box>
            </Box>
        </ListItem>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{ style: { fontSize: 48 } }}
                InputLabelProps={{ style: { fontSize: 24 } }}
                autoFocus
            />

    }
    return (
        cardElement
    );
}

export default ListCard;