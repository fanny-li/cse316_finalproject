import { useContext, useState } from 'react'
import AuthContext from '../auth'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
    display: 'flex',
    flexDirection: "column",
    alignItems: "center"
};



export default function MUIAlertModal() {
    const { auth } = useContext(AuthContext);

    let message = "";

    if (auth.hasAlert) {
        message = auth.alertMessage;
    }

    function handleCloseAlert() {
        auth.closeAlertModal();
    }

    return (
        <Modal open={auth.alertMessage}>
            <Box sx={style}>
                <Alert
                    variant="outlined"
                    severity='error'
                >
                    {message}
                </Alert>
                <Button
                    variant="outlined"
                    onClick={handleCloseAlert}
                    size="small"
                    style={{ marginTop: 20 }}
                >
                    Close
                </Button>
            </Box>
        </Modal>
    )
}