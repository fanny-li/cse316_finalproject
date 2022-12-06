import { ListItem } from '@mui/material';
import { Box } from '@mui/system';
import { React, useContext } from 'react';
import GlobalStoreContext from '../store';


const CommentCard = (props) => {
    const { store } = useContext(GlobalStoreContext);
    const { user, description } = props;

    return (
        <div id="comment-card">
            <div id="comment-card-item">
                <div>
                    <a href="" style={{ color: "blue", padding: "10pt 0" }}>{user}</a>
                </div>
                <div>
                    <p>{description}</p>
                </div>
            </div>
        </div >
    )
}

export default CommentCard;

