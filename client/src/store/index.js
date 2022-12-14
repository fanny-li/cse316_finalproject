import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    PUBLISH_PLAYLIST: "PUBLISH_PLAYLIST",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    SEARCH_BY_TYPE: "SEARCH_BY_TYPE",
    SEARCHED_LISTS: "SEARCHED_LISTS",
    SORT_BY: "SORT_BY",
    LOAD_PLAYER: "LOAD_PLAYER",
    RENAME_ERROR: "RENAME_ERROR",
    LOAD_ALL_LISTS: "LOAD_ALL_LISTS"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE: "NONE",
    DELETE_LIST: "DELETE_LIST",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    RENAME_ERROR: "RENAME_ERROR"
}

const SortBy = {
    NONE: "NONE",
    BY_NAME: "BY_NAME",
    BY_PUBLISH_DATE: "BY_PUBLISH_DATE",
    BY_LISTENS: "BY_LISTENS",
    BY_LIKES: "BY_LIKES",
    BY_DISLIKES: "BY_DISLIKES",
    BY_CREATION_DATE: "BY_CREATION_DATE",
    BY_EDIT_DATE: "BY_EDIT_DATE"
}



// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal: CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex: -1,
        currentSong: null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        songMarkedForDeletion: null,
        editSong: null,
        modalActive: false,
        publishedPlaylists: [],
        searchByType: null,
        searchedText: null,
        searchedLists: [],
        sortBy: SortBy.NONE,
        comments: []
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME

            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    publishedPlaylists: store.publishedPlaylists,
                    searchByType: null,
                    searchedText: null,
                    searchedLists: [],
                    sortBy: store.sortBy,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    publishedPlaylists: store.publishedPlaylists,
                    searchByType: store.searchByType,
                    searchedText: store.searchedText,
                    searchedLists: store.searchedLists,
                    sortBy: store.sortBy
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.newList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    publishedPlaylists: store.publishedPlaylists,
                    searchByType: store.searchByType,
                    searchedText: store.searchedText,
                    searchedLists: store.searchedLists,
                    sortBy: store.sortBy
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    publishedPlaylists: store.publishedPlaylists,
                    searchByType: null,
                    searchedText: null,
                    searchedLists: [],
                    sortBy: store.sortBy
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal: CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    modalActive: true,
                    publishedPlaylists: store.publishedPlaylists,
                    searchByType: null,
                    searchedText: null,
                    searchedLists: [],
                    sortBy: store.sortBy
                });
            }

            case GlobalStoreActionType.DELETE_MARKED_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter - 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    modalActive: false,
                    publishedPlaylists: store.publishedPlaylists,
                    searchByType: null,
                    searchedText: null,
                    searchedLists: [],
                    sortBy: store.sortBy
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    publishedPlaylists: store.publishedPlaylists,
                    searchByType: store.searchByType,
                    searchedText: store.searchedText,
                    searchedLists: store.searchedLists,
                    sortBy: store.sortBy
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    publishedPlaylists: store.publishedPlaylists,
                    searchByType: null,
                    searchedText: null,
                    searchedLists: [],
                    sortBy: store.sortBy
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal: CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    editSong: payload.currentSong,
                    modalActive: true,
                    publishedPlaylists: store.publishedPlaylists,
                    searchByType: null,
                    searchedText: null,
                    searchedLists: [],
                    sortBy: store.sortBy
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal: CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    songMarkedForDeletion: payload.currentSong,
                    modalActive: true,
                    publishedPlaylists: store.publishedPlaylists,
                    searchByType: null,
                    searchedText: null,
                    searchedLists: [],
                    sortBy: store.sortBy
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    songMarkedForDeletion: null,
                    editSong: null,
                    modalActive: false,
                    publishedPlaylists: store.publishedPlaylists,
                    searchByType: null,
                    searchedText: null,
                    searchedLists: [],
                    sortBy: store.sortBy
                });
            }
            case GlobalStoreActionType.PUBLISH_PLAYLIST: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    songMarkedForDeletion: null,
                    editSong: null,
                    modalActive: false,
                    publishedPlaylists: [...store.publishedPlaylists, payload.newPublished],
                    searchByType: null,
                    searchedText: null,
                    searchedLists: [],
                    sortBy: store.sortBy
                })
            }
            case GlobalStoreActionType.SEARCH_BY_TYPE: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    songMarkedForDeletion: null,
                    editSong: null,
                    modalActive: false,
                    publishedPlaylists: store.publishedPlaylists,
                    searchByType: payload.searchType,
                    searchedText: null,
                    searchedLists: payload.allLists,
                    sortBy: store.sortBy
                })
            }
            case GlobalStoreActionType.SEARCHED_LISTS: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    songMarkedForDeletion: null,
                    editSong: null,
                    modalActive: false,
                    publishedPlaylists: store.publishedPlaylists,
                    searchByType: store.searchByType,
                    searchedText: payload.text,
                    searchedLists: payload.list,
                    sortBy: store.sortBy
                })
            }
            case GlobalStoreActionType.SORT_BY: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    songMarkedForDeletion: null,
                    editSong: null,
                    modalActive: false,
                    publishedPlaylists: store.publishedPlaylists,
                    searchByType: store.searchByType,
                    searchedText: store.searchedText,
                    searchedLists: payload.searchedLists,
                    sortBy: payload.sortBy
                })
            }
            case GlobalStoreActionType.LOAD_PLAYER: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload.playlist,
                    currentSongIndex: payload.index,
                    currentSong: payload.song,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    songMarkedForDeletion: null,
                    editSong: null,
                    modalActive: false,
                    publishedPlaylists: store.publishedPlaylists,
                    searchByType: store.searchByType,
                    searchedText: store.searchedText,
                    searchedLists: store.searchedLists,
                    sortBy: store.sortBy
                })
            }
            case GlobalStoreActionType.RENAME_ERROR: {
                return setStore({
                    currentModal: CurrentModal.RENAME_ERROR,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: null,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    songMarkedForDeletion: null,
                    editSong: null,
                    modalActive: true,
                    publishedPlaylists: store.publishedPlaylists,
                    searchByType: store.searchByType,
                    searchedText: store.searchedText,
                    searchedLists: store.searchedLists,
                    sortBy: store.sortBy
                })
            }
            case GlobalStoreActionType.LOAD_ALL_LISTS: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: null,
                    currentList: null,
                    currentSongIndex: null,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    songMarkedForDeletion: null,
                    editSong: null,
                    modalActive: false,
                    publishedPlaylists: store.publishedPlaylists,
                    searchByType: store.searchByType,
                    searchedText: store.searchedText,
                    searchedLists: payload,
                    sortBy: store.sortBy
                })
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistById(id);
                            playlist = response.data.playlist;
                            let pairsArray = store.idNamePairs.map((list) => list._id == playlist._id ? playlist : list);

                            if (store.sortBy === "NONE") {
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                })
                            }
                            else {
                                store.sortPlaylist(store.sortBy, pairsArray, store.searchedLists, playlist);
                            }
                            // response = await api.getPlaylistPairs();
                            // if (response.data.success) {
                            //     let pairsArray = response.data.idNamePairs;




                            // }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        let list = store.idNamePairs.filter((list) => {
            return list.name === newListName || list.name.slice(0, -1) === newListName;
        })
        console.log(list);
        if (list.length !== 0) {
            let lastchar = list[list.length - 1].name.slice(-1);
            if (lastchar >= '0' && lastchar <= '9') {
                let number = Number(lastchar);
                number += 1;
                newListName = newListName.slice(0, -1) + number;
            }
            else {
                newListName = newListName + 1;
            }
        }
        let response = await api.createPlaylist(newListName, [], auth.user.email, auth.user.userName, false, 0, 0, 0, 0, []);
        console.log("createNewList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: {
                        idNamePairs: pairsArray,
                        newList: newList
                    }
                }
                );
                // IF IT'S A VALID LIST THEN LET'S START EDITING IT
                history.push("/playlist/" + newList._id);
            }
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.loadAllPlaylists = function () {
        async function asyncLoadAllPlaylists() {
            const response = await api.getPlaylists();
            if (response.data.success) {
                let playlists = response.data.data.filter((list) => {
                    return list.published;
                });
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ALL_LISTS,
                    payload: playlists
                })
            }
        }
        asyncLoadAllPlaylists();
    }
    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: { id: id, playlist: playlist }
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.DELETE_MARKED_LIST,
                    payload: {}
                });
                store.loadIdNamePairs();

                history.push("/");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function () {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    store.showRenameErrorModal = () => {
        console.log("show modal function");
        storeReducer({
            type: GlobalStoreActionType.RENAME_ERROR,
            payload: {}
        })
    }
    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: { currentSongIndex: songIndex, currentSong: songToEdit }
        });
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: { currentSongIndex: songIndex, currentSong: songToRemove }
        });
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });
    }
    store.isRenameErrorModalOpen = () => {
        return store.currentModal == CurrentModal.RENAME_ERROR;
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, redo, publish
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            if (auth.guest) {
                let response = await api.getPlaylists();
                if (response.data.success) {
                    let allLists = response.data.data;
                    let playlist = allLists.filter((list) => { return list._id == id })[0];
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    history.push("/playlist/" + playlist._id);
                }
            }
            else {
                let response = await api.getPlaylistById(id);
                if (response.data.success) {
                    let playlist = response.data.playlist;

                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.SET_CURRENT_LIST,
                            payload: playlist
                        });
                        history.push("/playlist/" + playlist._id);
                    }
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function () {
        return store.currentList.songs.length;
    }

    // publish playlist
    store.publishPlaylist = function (id) {
        async function asyncPublishPlaylist(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.published = true;
                let date = new Date();

                let month = date.toLocaleString('default', { month: 'short' });
                let day = date.getDate();
                let year = date.getFullYear();

                playlist.publishedDate = `${month} ${day}, ${year}`;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.PUBLISH_PLAYLIST,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });

                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncPublishPlaylist(id);
    }

    store.duplicatePlaylist = function (id) {
        async function asyncDuplicatePlaylist(id) {
            store.closeCurrentList();
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                let name = playlist.name;
                let list = store.idNamePairs.filter((list) => {
                    return list.name === name || list.name.slice(0, -1) === name;
                })
                console.log(list);
                if (list.length !== 0) {
                    let lastchar = list[list.length - 1].name.slice(-1);
                    console.log(lastchar);
                    if (lastchar >= '0' && lastchar <= '9') {
                        let number = Number(lastchar);
                        number += 1;
                        name = name.slice(0, -1) + number;
                        console.log(name);
                    }
                    else {
                        name = name + 1;
                    }
                }
                response = await api.createPlaylist(name, playlist.songs, auth.user.email, auth.user.userName, false, 0, 0, 0, 0, []);
                if (response.status === 201) {
                    tps.clearAllTransactions();
                    let newList = response.data.playlist;
                    response = await api.getPlaylistPairs();
                    if (response.data.success) {
                        let pairsArray = response.data.idNamePairs;
                        storeReducer({
                            type: GlobalStoreActionType.CREATE_NEW_LIST,
                            payload: {
                                idNamePairs: pairsArray,
                                newList: newList
                            }
                        }
                        );

                        history.push("/");
                    }
                }
                else {
                    console.log("API FAILED TO DUPLICATE PLAYLIST");
                }
            }
        }
        asyncDuplicatePlaylist(id);
    }

    store.likePlaylist = function (id) {
        async function asyncLikePlaylist(id) {
            let playlist = [];
            if (auth.guest) {
                let response = await api.getPlaylists();
                if (response.data.success) {
                    let allLists = response.data.data;
                    playlist = allLists.filter((list) => { return list._id == id })[0];
                }
            }
            else {
                let response = await api.getPlaylistById(id);

                if (response.data.success) {
                    playlist = response.data.playlist;

                }
            }

            playlist.likes += 1;

            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success) {
                if (store.searchedLists) {
                    let newList = store.searchedLists.map((list) => {
                        return list._id === playlist._id ? playlist : list;
                    })
                    store.sortPlaylist(store.sortBy, [], newList, playlist);
                }
                else {
                    let pairsArray = store.idNamePairs.map((list) => list._id === playlist._id ? playlist : list);
                    store.sortPlaylist(store.sortBy, pairsArray, [], playlist);
                }


            }

        }
        asyncLikePlaylist(id);
    }
    store.dislikePlaylist = function (id) {
        async function asyncDislikePlaylist(id) {
            let playlist = [];
            if (auth.guest) {
                let response = await api.getPlaylists();
                if (response.data.success) {
                    let allLists = response.data.data;
                    playlist = allLists.filter((list) => { return list._id == id })[0];
                }
            }
            else {
                let response = await api.getPlaylistById(id);

                if (response.data.success) {
                    playlist = response.data.playlist;

                }
            }

            playlist.dislikes += 1;

            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success) {
                if (store.searchedLists) {
                    let newList = store.searchedLists.map((list) => {
                        return list._id === playlist._id ? playlist : list;
                    })
                    store.sortPlaylist(store.sortBy, [], newList, playlist);
                }
                else {
                    let pairsArray = store.idNamePairs.map((list) => list._id === playlist._id ? playlist : list);
                    store.sortPlaylist(store.sortBy, pairsArray, [], playlist);
                }


            }

        }
        asyncDislikePlaylist(id);
    }

    store.setSearchByType = function (searchType) {
        async function asyncSetSearchByType(searchType) {

            let response = await api.getPlaylists();
            if (response.data.success) {
                let playlists = response.data.data;
                const filteredList = playlists.filter(playlist => {
                    return playlist.published;
                })

                storeReducer({
                    type: GlobalStoreActionType.SEARCH_BY_TYPE,
                    payload: {
                        allLists: filteredList,
                        searchType: searchType
                    }
                })

                history.push("/");
            }

        }
        asyncSetSearchByType(searchType);
    }

    store.searchFor = function (type, text) {
        async function asyncSearchFor(type, text) {
            let response = await api.getPlaylists();
            if (response.data.success) {
                let playlists = response.data.data;
                if (text === "") {
                    storeReducer({
                        type: GlobalStoreActionType.SEARCHED_LISTS,
                        payload: {
                            text: null,
                            list: []
                        }
                    })
                }
                else if (type === "allLists") {
                    if (text !== "") {
                        const filteredList = playlists.filter(playlist => {
                            return playlist.published && playlist.name.includes(text);
                        })
                        if (filteredList !== []) {
                            storeReducer({
                                type: GlobalStoreActionType.SEARCHED_LISTS,
                                payload: {
                                    text: text,
                                    list: filteredList
                                }
                            })
                        }
                        else {
                            storeReducer({
                                type: GlobalStoreActionType.SEARCHED_LISTS,
                                payload: []
                            })
                        }
                    }
                }
                else if (type === "users") {
                    const filteredList = playlists.filter(playlist => {
                        return playlist.published && playlist.ownerUserName.includes(text);
                    })

                    storeReducer({
                        type: GlobalStoreActionType.SEARCHED_LISTS,
                        payload: {
                            text: text,
                            list: filteredList
                        }
                    })
                }

                history.push("/");

            }
        }
        asyncSearchFor(type, text);
    }

    store.sortPlaylist = function (type, list, searchedLists, currentList) {
        async function asyncSortPlaylist(type, list, searchedLists, currentList) {

            // let playlists = store.idNamePairs;
            let playlists = list;
            let sortType = type;

            if (!auth.guest) {
                if (playlists.length == 0) {
                    let response = await api.getPlaylists();
                    if (response.data.success) {
                        playlists = response.data.data.filter((playlist) => playlist.ownerUserName === auth.user.userName);
                    }
                }
            }

            let playlists2 = searchedLists;

            if (type === "BY_NAME") {
                if (store.searchByType) {
                    playlists2.sort((a, b) => (a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })));
                }
                else {
                    playlists.sort((a, b) => (a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })));
                }

                sortType = SortBy.BY_NAME
            }
            else if (type === "BY_PUBLISH_DATE") {
                if (store.searchByType) {
                    playlists2.sort((a, b) => (a.publishedDate < b.publishedDate) ? 1 : -1);
                }
                else {
                    playlists.sort((a, b) => (a.publishedDate < b.publishedDate) ? 1 : -1);
                }

                sortType = SortBy.BY_PUBLISH_DATE;
            }
            else if (type === "BY_LISTENS") {
                if (store.searchByType) {
                    playlists2.sort((a, b) => a.totalPlays < b.totalPlays ? 1 : -1);
                }
                else {
                    playlists.sort((a, b) => a.totalPlays < b.totalPlays ? 1 : -1);

                }

                sortType = SortBy.BY_LISTENS;
            }
            else if (type === "BY_LIKES") {
                if (store.searchByType) {
                    playlists2.sort((a, b) => a.likes < b.likes ? 1 : -1);
                }
                else {
                    playlists.sort((a, b) => a.likes < b.likes ? 1 : -1);
                }

                sortType = SortBy.BY_LIKES;
            }
            else if (type === "BY_DISLIKES") {
                if (store.searchByType) {
                    playlists2.sort((a, b) => a.dislikes < b.dislikes ? 1 : -1);
                }
                else {
                    playlists.sort((a, b) => a.dislikes < b.dislikes ? 1 : -1);
                }

                sortType = SortBy.BY_DISLIKES;
            }
            else if (type === "BY_CREATION_DATE") {
                playlists.sort((a, b) => new Date(a.createdA) - new Date(b.createdAt));

                sortType = SortBy.BY_CREATION_DATE;
            }
            else if (type === "BY_EDIT_DATE") {
                playlists.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

                sortType = SortBy.BY_EDIT_DATE;
            }

            storeReducer({
                type: GlobalStoreActionType.SORT_BY,
                payload: {
                    idNamePairs: playlists,
                    searchedLists: playlists2,
                    sortBy: sortType,
                    currentList: currentList
                }
            })
            history.push("/");

        }
        asyncSortPlaylist(type, list, searchedLists, currentList);
    }

    store.loadPlayer = function (id, index) {
        async function asyncLoadPlayer(id, index) {
            let playlist = [];
            if (auth.guest) {
                let response = await api.getPlaylists();
                if (response.data.success) {
                    let allLists = response.data.data;
                    playlist = allLists.filter((list) => { return list._id == id })[0];
                }
            }
            else {
                let response = await api.getPlaylistById(id);

                if (response.data.success) {
                    playlist = response.data.playlist;

                }
            }

            let song = playlist.songs[0];

            if (playlist.published) {
                playlist.totalPlays += 1;

                let response = await api.updatePlaylistById(id, playlist);
                if (response.data.success) {
                    if (store.searchedLists) {
                        let newList = store.searchedLists.map((list) => {
                            return list._id === playlist._id ? playlist : list;
                        })
                        store.sortPlaylist(store.sortBy, [], newList, playlist);
                    }
                    else {
                        let pairsArray = store.idNamePairs.map((list) => list._id === playlist._id ? playlist : list);
                        store.sortPlaylist(store.sortBy, pairsArray, [], playlist);
                    }


                }
            }
            else {

                storeReducer({
                    type: GlobalStoreActionType.LOAD_PLAYER,
                    payload: {
                        playlist: playlist,
                        index: index,
                        song: song
                    }
                })
            }
            history.push("/");


        }

        asyncLoadPlayer(id, index);
    }

    store.addComment = function (user, description) {
        async function asyncAddComment(user, description) {
            let comments = store.currentList.comments;
            comments.push({
                user: user,
                description: description
            })

            let playlist = store.currentList;

            let response = await api.updatePlaylistById(playlist._id, playlist);
            if (response.data.success) {
                store.updateCurrentList();
            }


        }
        asyncAddComment(user, description);
    }

    store.addNewSong = function () {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function (index, song) {
        let list = store.currentList;
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function (start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function (index) {
        let list = store.currentList;
        list.songs.splice(index, 1);

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function (index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function () {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function () {
        return ((store.currentList !== null) && (store.currentModal == CurrentModal.NONE));
    }
    store.canUndo = function () {
        return ((store.currentList !== null) && tps.hasTransactionToUndo() && (store.currentModal == CurrentModal.NONE));
    }
    store.canRedo = function () {
        return ((store.currentList !== null) && tps.hasTransactionToRedo() && (store.currentModal == CurrentModal.NONE));
    }
    store.canClose = function () {
        return ((store.currentList !== null) && (store.currentModal == CurrentModal.NONE));
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };