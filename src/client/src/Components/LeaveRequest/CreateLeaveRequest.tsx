import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, Button, Collapse, Container, CssBaseline, IconButton, Paper, TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLeaveRequest } from '../../API/leaveRequestRequests';

export default function CreateLeaveRequest() {
    const navigator = useNavigate()

    useEffect(() => {
        window.addEventListener('beforeunload', alertUser)
        return () => {
            window.removeEventListener('beforeunload', alertUser)
        }
    }, [])

    const alertUser = (e: any) => {
        e.preventDefault()
        e.returnValue = ''
    }


    const [error, setError] = useState<String>('');
    const [absenceReasonError, SetAbsenceReasonError] = useState('');
    const [startDateError, SetStartDateError] = useState('');
    const [endDateError, SetEndDateError] = useState('');
    const handlePostSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const absenceReason = data.get('absenceReason')!.toString().trim();
        const startDate = data.get('startDate')!.toString();
        const endDate = data.get('endDate')!.toString().trim();
        const comment = data.get('comment')!.toString().trim();
        
        if (absenceReason.length === 0) {
            SetAbsenceReasonError('Fill absence reason!');
            return;
        }

        if (startDate.length === 0) {
            SetStartDateError('Fill start date!');
            return;
        }

        if (endDate.length === 0) {
            SetEndDateError('Fill end date!');
            return;
        }

        createLeaveRequest(absenceReason, new Date(startDate), new Date(endDate), comment).subscribe({
            next(value) {
                enqueueSnackbar(value, {
                    variant: 'success', anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    },
                    autoHideDuration: 1500
                });
                setError('');
                navigator("/");
            },
            error(err) {
                setError(err.message)
            },
        })
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                    display: 'flex'
                }}
            >
                <Container maxWidth='lg' sx={{
                    mt: 4, mb: 4
                }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant="h5" color="text.secondary" component="p" gutterBottom>
                                Create leave request
                            </Typography>
                            <Divider />
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Paper sx={{
                                p: 1,
                                width: 1,
                            }}>

                                <Box component="form" onSubmit={handlePostSubmit} noValidate sx={{ mt: 1, display: 'flex', flexDirection: 'column' }}>
                                    <TextField
                                        margin="normal"
                                        id="outlined-multiline-flexible"
                                        label="Absence reason"
                                        name="absenceReason"
                                        required
                                        fullWidth
                                        inputProps={{ maxLength: 500 }}
                                        error={absenceReasonError !== ''}
                                        onFocus={() => SetAbsenceReasonError('')}
                                        helperText={absenceReasonError}
                                    />
                                    <TextField
                                        margin="normal"
                                        id="outlined-multiline-flexible"
                                        label="Start date"
                                        placeholder=''
                                        name="startDate"
                                        type='date'
                                        required
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={startDateError !== ''}
                                        onFocus={() => SetStartDateError('')}
                                        helperText={startDateError}
                                    />
                                    <TextField
                                        margin="normal"
                                        id="outlined-multiline-flexible"
                                        label="End date"
                                        placeholder=''
                                        name="endDate"
                                        type='date'
                                        required
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={endDateError !== ''}
                                        onFocus={() => SetEndDateError('')}
                                        helperText={endDateError}
                                    />
                                    <TextField
                                        margin="normal"
                                        id="outlined-multiline-flexible"
                                        label="Comment"
                                        name="comment"
                                        required
                                        fullWidth
                                        inputProps={{ maxLength: 5000 }}
                                        multiline
                                        minRows={4}
                                    />
                                    <Collapse in={error !== ''}>
                                        <Alert
                                            severity="error"
                                            action={
                                                <IconButton
                                                    aria-label="close"
                                                    color="inherit"
                                                    onClick={() => {
                                                        setError('');
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            }
                                            sx={{ mb: 2, fontSize: 15 }}
                                        >
                                            {error}
                                        </Alert>
                                    </Collapse>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="outlined"
                                        sx={{ml: 'auto', width:'fit-content'}}
                                    >
                                        Create
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    )


}