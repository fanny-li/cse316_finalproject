import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'


import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import HomeBanner from './HomeBanner';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    if (store) {
        listCard =
            <List sx={{ width: '90%', left: '5%' }}>
                {
                    store.idNamePairs.map((pair) => (
                        <ListCard
                            key={pair._id}
                            idNamePair={pair}
                            selected={false}
                            isPublished={pair.published}

                        />
                    ))
                }
            </List>;
    }

    // let addListStyling = "primary";

    // if (store.modalActive) {
    //     addListStyling = "grey"
    // }
    return (
        <div id="home-screen-root">
            <HomeBanner />
            <div id="home-screen-items">
                <div id="playlist-selector">
                    <div id="list-selector-list">
                        {
                            listCard
                        }
                        <MUIDeleteModal />
                    </div>
                </div>
                <div id="youtube-section">
                    <div id="player">

                    </div>
                    <div id="comments"></div>
                </div>
            </div>
        </div>
    )
}

export default HomeScreen;