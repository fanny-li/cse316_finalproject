import { useContext } from 'react'
import GlobalStoreContext from '../store';
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
    width: 300,
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
    display: 'flex',
    flexDirection: "column",
    alignItems: "center"
};


export default function MUIRenameErrorModal() {
    const { store } = useContext(GlobalStoreContext);

    function handleCloseModal(event) {
        store.hideModals();
    }

    return (
        <Modal open={true}>
            <Box sx={style}>
                <Alert
                    variant="outlined"
                    severity='error'
                >
                    Please enter a unique name.
                </Alert>
                <Button
                    variant="outlined"
                    onClick={handleCloseModal}
                    size="small"
                    style={{ marginTop: 20 }}
                >
                    Close
                </Button>
            </Box>
        </Modal>
    );
}