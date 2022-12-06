import { List } from '@mui/material';
import { React, useState, useContext } from 'react';
import AuthContext from '../auth';
import GlobalStoreContext from '../store';
import CommentCard from './CommentCard';

const CommentsSection = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [text, setText] = useState("");

    let commentCard = "";
    if (store) {
        console.log(store.currentList);
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
        <div id="comment-section">
            {commentCard}
        </div>
    )
}

export default CommentsSection;