import { Icon, IconButton, TextField, textFieldClasses, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useContext, useState } from 'react';
import GlobalStoreContext from '../store';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SubjectIcon from '@mui/icons-material/Subject';


const HomeBanner = (props) => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(GlobalStoreContext);
    const { home } = props;
    const [text, setText] = useState("");
    const [isHomeActive, setIsHomeActive] = useState(true);
    const [isAllListActive, setAllListActive] = useState(false);
    const [isUserActive, setUserActive] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);

    const handleHome = () => {
        setAllListActive(false);
        setUserActive(false);
        setIsHomeActive(true);
        console.log(store.currentList);
        store.loadIdNamePairs();
    }
    const handleAllLists = (event) => {
        event.stopPropagation();
        let newActive = !isAllListActive;
        setUserActive(false);
        setIsHomeActive(false);
        if (newActive) {
            store.setSearchByType("allLists");
        }
        setAllListActive(newActive);

    }

    const handleUserLists = (event) => {
        event.stopPropagation();
        let newActive = !isAllListActive;
        setAllListActive(false);
        setIsHomeActive(false);
        if (newActive) {
            store.setSearchByType("users");
        }
        setUserActive(newActive);
    }

    const handleUpdateText = (event) => {
        setText(event.target.value);
    }

    const handleKeyPress = (event) => {
        if (event.code === "Enter") {
            if (isUserActive || isAllListActive) {
                let type = isAllListActive ? "allLists" : "users";
                store.searchFor(type, text);
            }
        }
    }

    const toggleSortByMenu = (event) => {
        setMenuOpen(!isMenuOpen);
    }

    const handleSort = (event, type) => {
        event.stopPropagation();
        console.log(type);
        store.sortPlaylist(type);
        toggleSortByMenu();
    }


    const styling = {
        fontSize: '30pt'
    }
    const activeStyling = {
        fontSize: '30pt',
        color: 'purple'
    }

    const sortMenu = <div id="sort-menu">
        <div className='sort-menu-item' onClick={(event) => handleSort(event, "name")}>
            <p>Name (A - Z)</p>
        </div>
        <div className='sort-menu-item' onClick={(event) => handleSort(event, "publishedDate")}>
            <p>Published Date (Newest)</p>
        </div>
        <div className='sort-menu-item' onClick={(event) => handleSort(event, "listens")}>
            <p>Listens (High - Low)</p>
        </div>
        <div className='sort-menu-item' onClick={(event) => handleSort(event, "likes")}>
            <p>Likes (High - Low)</p>
        </div>
        <div className='sort-menu-item' onClick={(event) => handleSort(event, "dislikes")}>
            <p>Dislikes (High - Low)</p>
        </div>
    </div>
    return (
        <div id="homebanner">
            <div className='homebanner-item' style={{ justifyContent: "center" }}>
                <IconButton onClick={handleHome}>
                    <HomeOutlinedIcon className="homebanner-icons" style={home || isHomeActive ? activeStyling : styling} />
                </IconButton>
                <IconButton onClick={(event) => { handleAllLists(event) }}>
                    <GroupsOutlinedIcon className="homebanner-icons" style={!home && isAllListActive ? activeStyling : styling} />
                </IconButton>
                <IconButton onClick={(event) => { handleUserLists(event) }}>
                    <PersonOutlineOutlinedIcon className="homebanner-icons" style={!home && isUserActive ? activeStyling : styling} />
                </IconButton>
            </div>
            <div className='homebanner-item'>
                <TextField
                    fullWidth
                    id="search-field"
                    label="Search"
                    variant="filled"
                    style={{ background: "white" }}
                    onChange={handleUpdateText}
                    onKeyPress={handleKeyPress}
                />
            </div>
            <div className='homebanner-item'>
                <Typography variant="h6">Sort By</Typography>
                <IconButton onClick={toggleSortByMenu}>
                    <SubjectIcon style={{ fontSize: "25pt" }} />
                </IconButton>
                {isMenuOpen ? sortMenu : null}
            </div>
        </div>
    )
}
export default HomeBanner;