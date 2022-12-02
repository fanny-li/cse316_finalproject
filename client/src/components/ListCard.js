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
    const { idNamePair, selected, isPublished } = props;
    const [songsActive, setSongsActive] = useState(false);

    function toggleLoadSongs(event, id) {
        let newActive = !songsActive;
        if (newActive) {
            handleLoadList(event, id);
        }
        else {
            store.closeCurrentList();
        }
        setSongsActive(newActive);
    }

    function handleLoadList(event, id) {
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

    function handleClick(event) {
        if (event.detail === 2) {
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
                store.changeListName(id, text);
            }
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }

    let cardStatus = store.currentList ? (store.currentList._id == idNamePair._id ? "list-card-open" : "list-card-unopen") : "list-card-unopen";

    // List card how they look based on if they are published or not
    let cardElementDescription =
        <Box className="list-card-item-1">
            <Box style={{ fontWeight: "bold" }}>
                {idNamePair.name}
            </Box>
            <Box style={{ fontSize: "18pt" }}>
                By: <p style={{ display: "inline", color: "blue", textDecoration: "underline" }}>{auth.user.firstName} {auth.user.lastName}</p>
            </Box>
        </Box>

    let cardElementPublished = isPublished ?
        <Box className="list-card-item2">
            <Box style={{ fontSize: '20pt' }}>
                <IconButton>
                    <ThumbUpOutlinedIcon />
                </IconButton>
                {idNamePair.likes}
                <IconButton>
                    <ThumbDownOutlinedIcon style={{ marginLeft: "30pt" }} />
                </IconButton>
                {idNamePair.dislikes}
            </Box>
            <Box style={{ fontSize: '18pt' }}>
                Listens: {idNamePair.totalPlays}
            </Box>
        </Box> : <div></div>


    let cardStyle =
    {
        width: '100%',
        fontSize: '25pt',
        borderRadius: 10,
        border: "2px solid black",
        boxShadow: "5px 3px 3px #dbdbdb",
        background: "#FEFBEA"
    }

    if (isPublished) {
        cardStyle = {
            width: '100%',
            fontSize: '25pt',
            borderRadius: 10,
            border: "2px solid black",
            boxShadow: "5px 3px 3px #dbdbdb",
            background: "#BBBEFE"
        }
    }

    // put the song cards inside the list card div

    let songCards = "";

    if (songsActive) {
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

            songCards = <List
                id="playlist-cards"
                sx={{ width: '100%' }}
            >
                {store.currentList.songs.map((song, index) => (
                    <SongCard
                        id={'playlist-song-' + (index)}
                        key={'playlist-song-' + (index)}
                        index={index}
                        song={song}
                    />
                ))
                }
                <EditToolbar idNamePair={idNamePair} />
                {modalJSX}
            </List>

        }

    }

    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={cardStyle}
            button
            onClick={handleClick}
        >
            <Box sx={{ p: 1, flexGrow: 1 }} className={cardStatus}>
                {cardElementDescription}

                {cardElementPublished}
                {songCards}
                <Box className="list-card-item3">
                    <Box sx={{ p: 1 }}>
                        <IconButton onClick={(event) => { toggleLoadSongs(event, idNamePair._id) }} aria-label='edit'>
                            {songsActive ? <KeyboardDoubleArrowUpOutlinedIcon style={{ fontSize: '25pt' }} /> : <KeyboardDoubleArrowDownIcon style={{ fontSize: '25pt' }} />
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