import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [draggedTo, setDraggedTo] = useState(0);
    const { song, index, isPublished } = props;

    function handleDragStart(event) {
        event.dataTransfer.setData("song", index);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }
    function handleRemoveSong(event) {
        store.showRemoveSongModal(index, song);
    }
    function handleClick(event) {
        // DOUBLE CLICK IS FOR SONG EDITING
        if (event.detail === 2) {
            store.showEditSongModal(index, song);
        }
    }

    let cardClass = isPublished ? "song-card-published" : "list-card unselected-list-card";
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={isPublished ? null : handleDragStart}
            onDragOver={isPublished ? null : handleDragOver}
            onDragEnter={isPublished ? null : handleDragEnter}
            onDragLeave={isPublished ? null : handleDragLeave}
            onDrop={isPublished ? null : handleDrop}
            draggable={isPublished ? "false" : "true"}
            onClick={handleClick}
        >
            {index + 1}. <p style={{ display: "inline" }}>{song.title} by {song.artist}</p>
            {!isPublished ?
                <input
                    type="button"
                    id={"remove-song-" + index}
                    className="list-card-button"
                    value={"\u2715"}
                    onClick={handleRemoveSong}
                    style={{
                        background: "none",
                        border: "none",
                        color: "white",
                        position: "relative",
                    }}
                /> : <div></div>
            }
        </div>
    );
}

export default SongCard;