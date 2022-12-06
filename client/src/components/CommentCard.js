import { React, useContext } from 'react';
import GlobalStoreContext from '../store';


const CommentCard = (props) => {
    const { store } = useContext(GlobalStoreContext);
    const { user, description } = props;

    return (
        <div>

        </div>
    )
}

export default CommentCard;

