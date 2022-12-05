import { React, useContext, useState } from 'react';
import YouTube from 'react-youtube';
import { IconButton } from '@mui/material';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FastForwardIcon from '@mui/icons-material/FastForward';
import GlobalStoreContext from '../store';

export default function YouTubePlaylister() {
    // THIS EXAMPLE DEMONSTRATES HOW TO DYNAMICALLY MAKE A
    // YOUTUBE PLAYER AND EMBED IT IN YOUR SITE. IT ALSO
    // DEMONSTRATES HOW TO IMPLEMENT A PLAYLIST THAT MOVES
    // FROM ONE SONG TO THE NEXT

    const { store } = useContext(GlobalStoreContext);
    const [songTitle, setSongTitle] = useState("");
    const [songArtist, setSongArtist] = useState("");
    const [songIndex, setSongIndex] = useState(0);

    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST
    let target = null;
    let list = store.currentList ? store.currentList.name : "";
    let playlist = store.currentList ? store.currentList.songs.map((key) => { return key.youTubeId }) : [];
    let currentSong = store.currentList ? store.currentSongIndex : -1;

    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST

    const playerOptions = {
        height: 300,
        width: "100%",
        margin: 0,
        padding: 0,
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo();

    }

    function playSong() {
        target.playVideo();
    }
    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        currentSong++;
        currentSong = currentSong % playlist.length;
        console.log(currentSong);
        loadAndPlayCurrentSong(target);
        // store.incSong();
    }

    // THIS FUNCTION DECREMENTS THE PLAYLIST SONG TO THE PREVIOUS ONE
    function decSong() {
        if (currentSong === 0) {
            currentSong += playlist.length - 1;
        }
        else {
            currentSong--;
        }
        currentSong = currentSong % playlist.length;
        loadAndPlayCurrentSong(target);
    }

    function stopVideo() {
        target.pauseVideo();
    }
    function onPlayerReady(event) {
        target = event.target;
        loadAndPlayCurrentSong(event.target);
        event.target.playVideo();
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();

            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
    }

    const buttonStyle = {
        color: "black",
        fontSize: "25pt"
    }
    return <div>

        <YouTube
            videoId={playlist[currentSong]}
            opts={playerOptions}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
        />
        <div>
            <div id='youtube-section-bottom'>
                <div id='youtube-section-description'>
                    <div style={{ textAlign: "center", lineHeight: 0 }}><p>Now Playing</p></div>
                    <p>Playlist: {list}</p>
                    <p>Song #: {store.currentSongIndex}</p>
                    <p>Title: {songTitle}</p>
                    <p>Artist: {songArtist}</p>

                </div>
                <div id='youtube-section-toolbar'>
                    <div >
                        <IconButton onClick={decSong}>
                            <FastRewindIcon style={buttonStyle} />
                        </IconButton>
                        <IconButton onClick={stopVideo}>
                            <StopIcon style={buttonStyle} />
                        </IconButton >
                        <IconButton onClick={playSong}>
                            <PlayArrowIcon style={buttonStyle} />
                        </IconButton>
                        <IconButton onClick={incSong}>
                            <FastForwardIcon style={buttonStyle} />
                        </IconButton>
                    </div>
                </div>

            </div>
        </div>
    </div>;
}