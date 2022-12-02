import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { IconButton, Typography } from '@mui/material'
import AuthContext from '../auth';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    function handleCreateNewList() {
        store.createNewList();
    }

    let text = "";
    if (store.currentList)
        text = store.currentList.name;
    else {
        text = "Your Lists"
    }


    if (auth.loggedIn) {
        return (
            <div id="playlister-statusbar">
                <IconButton

                    id="add-list-button"
                    onClick={handleCreateNewList}
                >
                    <AddOutlinedIcon style={{ fontSize: '30pt', color: 'black' }} />
                </IconButton>

                <Typography variant="h4">{text}</Typography>
            </div>
        );
    }
    else {
        return null;
    }
}

export default Statusbar;