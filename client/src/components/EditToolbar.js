import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/HighlightOff';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar(props) {
    const { store } = useContext(GlobalStoreContext);
    const { idNamePair } = props;

    function handleAddNewSong() {
        store.addNewSong();
    }
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handlePublish(event, id) {
        event.stopPropagation();
        store.publishPlaylist(id);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id);
    }

    return (
        <div id="edit-toolbar">
            <div className='list-card list-card-add' onClick={handleAddNewSong}>+</div>
            <div id="edit-toolbar-buttons">


                <div id="edit-toolbar-left">


                    <button id='undo-button' className="edit-toolbar-button" onClick={handleUndo}>Undo</button>
                    <button id='redo-button' className="edit-toolbar-button" onClick={handleRedo}>Redo</button>
                </div>
                <div id="edit-toolbar-right">
                    <button id='publish-button' className="edit-toolbar-button" onClick={(event) => handlePublish(event, idNamePair._id)}>Publish</button>
                    <button id='delete-list-button' className="edit-toolbar-button" onClick={(event) => handleDeleteList(event, idNamePair._id)} >Delete</button>
                    <button id='duplicate-button' className="edit-toolbar-button" >Duplicate</button>
                </div>
            </div>
            {/* <Button
                disabled={!store.canAddNewSong()}
                id='add-song-button'
                onClick={handleAddNewSong}
                variant="contained">
                <AddIcon />
            </Button>
            <Button 
                disabled={!store.canUndo()}
                id='undo-button'
                onClick={handleUndo}
                variant="contained">
                    <UndoIcon />
            </Button>
            <Button 
                disabled={!store.canRedo()}
                id='redo-button'
                onClick={handleRedo}
                variant="contained">
                    <RedoIcon />
            </Button>
            <Button 
                disabled={!store.canClose()}
                id='close-button'
                onClick={handleClose}
                variant="contained">
                    <CloseIcon />
            </Button> */}
        </div>
    )
}

export default EditToolbar;