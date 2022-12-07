import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const { idNamePair, handleClose } = props;

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
        handleClose(event, id);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id);
    }

    function handleDuplicatePlaylist(event, id) {
        event.stopPropagation();
        handleClose(event, id);
        store.duplicatePlaylist(id);
    }

    return (
        <div id="edit-toolbar">
            {!idNamePair.published ?
                <div className='list-card list-card-add' onClick={handleAddNewSong}>+</div> : null
            }
            <div id="edit-toolbar-buttons">

                {idNamePair.published ? <div id="edit-toolbar-left"></div> :
                    <div id="edit-toolbar-left">


                        <button id='undo-button' className="edit-toolbar-button" onClick={handleUndo}>Undo</button>
                        <button id='redo-button' className="edit-toolbar-button" onClick={handleRedo}>Redo</button>

                    </div>
                }
                <div id="edit-toolbar-right">
                    {!idNamePair.published ?
                        <button id='publish-button' className="edit-toolbar-button" onClick={(event) => handlePublish(event, idNamePair._id)}>Publish</button> : <div></div>}
                    <button id='delete-list-button' className="edit-toolbar-button" onClick={(event) => handleDeleteList(event, idNamePair._id)} >Delete</button>
                    {!auth.guest ?
                        <button id='duplicate-button' className="edit-toolbar-button" onClick={(event) => { handleDuplicatePlaylist(event, idNamePair._id) }} >Duplicate</button> : null}
                </div>
            </div>

        </div>
    )
}

export default EditToolbar;