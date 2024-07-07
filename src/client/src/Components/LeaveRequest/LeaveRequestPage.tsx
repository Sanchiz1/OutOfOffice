import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, Button, Collapse, Container, CssBaseline, IconButton, LinearProgress, Paper, TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cancelLeaveRequest, createLeaveRequest, getLeaveRequestById, submitLeaveRequest, updateLeaveRequest } from '../../API/leaveRequestRequests';
import { LeaveRequest } from '../../Types/LeaveRequest';
import NotFoundPage from '../UtilComponents/NotFoundPage';
import { GetDateString } from '../../Helpers/DateFormatHelper';
import { ShowFailure, ShowSuccess } from '../../Helpers/SnackBarHelper';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

export default function LeaveRequestPage() {
    let { LeaveRequestId } = useParams();
    const navigator = useNavigate()
    const [leaveRequestExists, setLeaveRequestExists] = useState(true);
    const [leaveRequest, setLeaveRequest] = useState<LeaveRequest>();
    const User = useSelector((state: RootState) => state.account.Account);

    const fetchLeaveRequest = () =>
        getLeaveRequestById(parseInt(LeaveRequestId!)).subscribe({
            next(user) {
                if (user === null) {
                    setLeaveRequestExists(false);
                    return;
                }
                setLeaveRequest(user);
            },
            error(err) {
            },
        })

    useEffect(() => {
        fetchLeaveRequest();
    }, [LeaveRequestId])

    // edit
    const [openEdit, setOpenEdit] = useState(false);
    const [openCategortyEdit, setOpenCategortyEdit] = useState(false);
    const [error, setError] = useState<String>('');
    const [absenceReasonError, SetAbsenceReasonError] = useState('');
    const [startDateError, SetStartDateError] = useState('');
    const [endDateError, SetEndDateError] = useState('');

    const handleSubmitEdit = (event: React.FormEvent<HTMLFormElement>) => {
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

        updateLeaveRequest(leaveRequest?.id!, absenceReason, new Date(startDate), new Date(endDate), comment).subscribe({
            next(value) {
                ShowSuccess(value);
                setError('');
                setOpenEdit(false);
                fetchLeaveRequest();
            },
            error(err) {
                ShowFailure(err.message);
            },
        })
    }

    const handleCancelLeaveRequest = () => {
        cancelLeaveRequest(leaveRequest?.id!).subscribe({
            next(value) {
                ShowSuccess(value);
                fetchLeaveRequest();
            },
            error(err) {
                ShowFailure(err.message);
            },
        })
    }

    const handleSubmitLeaveRequest = () => {
        submitLeaveRequest(leaveRequest?.id!).subscribe({
            next(value) {
                ShowSuccess(value);
                fetchLeaveRequest();
            },
            error(err) {
                ShowFailure(err.message);
            },
        })
    }

    return (
        <>
            {leaveRequestExists ?
                <>
                    {leaveRequest != undefined ?
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
                                                Leave request
                                            </Typography>
                                            <Divider />
                                        </Grid>
                                        <Divider sx={{ mb: 1 }} />

                                        <Grid item xs={12} md={12} lg={12}>
                                            <Paper sx={{
                                                p: 1,
                                                width: 1,
                                            }}>
                                                {openEdit ?
                                                    <>
                                                        <Box component="form" onSubmit={handleSubmitEdit} noValidate sx={{ mt: 2 }}>
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
                                                                defaultValue={leaveRequest.absenceReason}
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
                                                                defaultValue={new Date(leaveRequest.startDate).toISOString().split('T')[0]}
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
                                                                defaultValue={new Date(leaveRequest.startDate).toISOString().split('T')[0]}
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
                                                                defaultValue={leaveRequest.comment}
                                                            />
                                                            <Box sx={{ my: 1, display: 'flex' }}>
                                                                <Button
                                                                    color='secondary'
                                                                    sx={{ ml: 'auto', mr: 1 }}
                                                                    onClick={() => setOpenEdit(false)}
                                                                    variant="outlined"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    type="submit"
                                                                    variant="outlined"
                                                                >
                                                                    Submit
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    </>
                                                    :
                                                    <>
                                                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column' }}>
                                                            <Typography>Reason: {leaveRequest.absenceReason}</Typography>
                                                            <Typography>From {GetDateString(new Date(leaveRequest.startDate))} to {GetDateString(new Date(leaveRequest.endDate))}</Typography>
                                                            <Typography>Status: {leaveRequest.status}</Typography>
                                                            <Divider sx={{ mb: 3 }} />
                                                            {leaveRequest.comment &&
                                                                <>
                                                                    <Typography>Comment:</Typography>
                                                                    <Typography>{leaveRequest.comment}</Typography>
                                                                </>
                                                            }

                                                            {User.id === leaveRequest.employeeId &&
                                                                <Box sx={{ ml: 'auto', mt: 3, width: 'fit-content', display: 'flex', flexDirection: 'row' }}>
                                                                    {leaveRequest.status !== "Submitted" &&
                                                                        <Button
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            sx={{ mr: 1 }}
                                                                            onClick={handleSubmitLeaveRequest}
                                                                        >
                                                                            Submit
                                                                        </Button>
                                                                    }
                                                                    {leaveRequest.status === "Submitted" &&
                                                                        <Button
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            sx={{ mr: 1 }}
                                                                            onClick={handleCancelLeaveRequest}
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                    }
                                                                    {leaveRequest.status !== "Submitted" &&
                                                                        <Button
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            onClick={() => setOpenEdit(!openEdit)}
                                                                        >
                                                                            Edit
                                                                        </Button>
                                                                    }
                                                                </Box>
                                                            }
                                                        </Box>
                                                    </>
                                                }
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Container>
                            </Box>
                        </Box>
                        :
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    }
                </>
                :
                <NotFoundPage input='LeaveRequest not found'></NotFoundPage>
            }
        </>
    )


}