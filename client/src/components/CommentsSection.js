import { List, TextField } from '@mui/material';
import { React, useState, useContext, useRef } from 'react';
import AuthContext from '../auth';
import GlobalStoreContext from '../store';
import CommentCard from './CommentCard';

const CommentsSection = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [text, setText] = useState("");
    const ref = useRef(null);

    const handleUpdateText = (event) => {
        setText(event.target.value);
    }

    const handleAddComment = (event) => {
        if (event.code === "Enter") {
            store.addComment(auth.user.userName, text);
            ref.current.value = '';
        }
    }
    let commentCard = "";
    if (store) {
        if (store.currentList) {
            commentCard =
                <List>
                    {store.currentList.comments.map((comment) => (
                        <CommentCard
                            user={comment.user}
                            description={comment.description}
                        />
                    ))}
                </List>
        }
    }
    return (
        <div id="comments-section">
            <div id="comments">
                {commentCard}
            </div>
            <div id="add-comment-section">
                <div style={{ width: "100%" }}>
                    <input type="text" name="comments" id="comment-search-field" placeholder="Add Comment" ref={ref} onChange={handleUpdateText} onKeyDown={handleAddComment} disabled={store.currentList ? false : true} />
                </div>
            </div>
        </div>
    )
}

export default CommentsSection;