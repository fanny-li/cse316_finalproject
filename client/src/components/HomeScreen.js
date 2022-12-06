import React, { useState, useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import YouTubePlaylister from './YouTubePlaylister'


import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import HomeBanner from './HomeBanner';
import CommentsSection from './CommentsSection'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [playerActive, setPlayerActive] = useState(true);
    const [commentsActive, setCommentsActive] = useState(false);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function loadPlayerSection(event) {
        setPlayerActive(true);
        setCommentsActive(false);
    }

    function loadCommentsSection(event) {
        setPlayerActive(false);
        setCommentsActive(true);
    }
    let listCard = "";
    if (store) {
        listCard =
            store.searchByType ? <List sx={{ width: '90%', left: '5%' }}>
                {
                    store.searchedLists.map((pair) => (
                        <ListCard
                            key={pair._id}
                            idNamePair={pair}

                            isPublished={pair.published}

                        />
                    ))
                }
            </List>
                :
                <List sx={{ width: '90%', left: '5%' }}>
                    {
                        store.idNamePairs.map((pair) => (
                            <ListCard
                                key={pair._id}
                                idNamePair={pair}
                                isPublished={pair.published}

                            />
                        ))
                    }
                </List>;
    }

    return (
        <div id="home-screen-root">
            <HomeBanner
                home={store.searchByType == null} />
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
                    <div id='youtube-section-selector'>
                        <div onClick={loadPlayerSection} style={playerActive ? { backgroundColor: "white" } : { backgroundColor: "#DADADA" }}>
                            <p>Player</p>
                        </div>
                        <div onClick={loadCommentsSection} style={commentsActive ? { backgroundColor: "white" } : { backgroundColor: "#DADADA" }}>
                            <p>Comments</p>
                        </div>

                    </div>
                    {playerActive ?
                        <YouTubePlaylister /> : <CommentsSection />}
                </div>


            </div>
        </div>
    )
}

export default HomeScreen;