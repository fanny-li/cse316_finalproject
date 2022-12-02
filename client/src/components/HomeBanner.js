import { TextField, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useContext, useState } from 'react';
import GlobalStoreContext from '../store';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SubjectIcon from '@mui/icons-material/Subject';

const HomeBanner = () => {

    const handleHome = () => { }
    const handleAllLists = () => { }
    const handleUserLists = () => { }

    return (
        <div id="homebanner">
            <div className='homebanner-item'>

                <HomeOutlinedIcon className="homebanner-icons" style={{ fontSize: "30pt", margin: "7pt" }} onClick={handleHome} />
                <GroupsOutlinedIcon className="homebanner-icons" style={{ fontSize: "30pt", margin: "7pt" }} onClick={handleAllLists} />
                <PersonOutlineOutlinedIcon className="homebanner-icons" style={{ fontSize: "30pt", margin: "7pt" }} onClick={handleUserLists} />
            </div>
            <div className='homebanner-item'>
                <TextField fullWidth id="search-field" label="Search" variant="filled" style={{ background: "white", border: "1px solid black" }} />
            </div>
            <div className='homebanner-item'>
                <Typography variant="h5">Sort By</Typography>
                <SubjectIcon style={{ fontSize: "30pt" }} />
            </div>
        </div>
    )
}
export default HomeBanner;