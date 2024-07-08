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
import { cancelApprovalRequest, getApprovalRequestById, submitApprovalRequest, updateApprovalRequest } from '../../API/approvalRequestRequests';
import { ApprovalRequest } from '../../Types/ApprovalRequest';

export default function ApprovalRequestPage() {
    let { ApprovalRequestId } = useParams();
    const navigator = useNavigate()
    const [approvalRequestExists, setApprovalRequestExists] = useState(true);
    const [approvalRequest, setApprovalRequest] = useState<ApprovalRequest>();
    const [leaveRequestExists, setLeaveRequestExists] = useState(true);
    const [leaveRequest, setLeaveRequest] = useState<LeaveRequest>();
    const User = useSelector((state: RootState) => state.account.Account);

    const fetchApprovalRequest = () =>
        getApprovalRequestById(parseInt(ApprovalRequestId!)).subscribe({
            next(user) {
                if (user === null) {
                    setApprovalRequestExists(false);
                    return;
                }
                setApprovalRequest(user);
            },
            error(err) {
            },
        })

    useEffect(() => {
        fetchApprovalRequest();
    }, [ApprovalRequestId])


    const fetchLeaveRequest = () =>
        getLeaveRequestById(parseInt(approvalRequest?.leaveRequestId!)).subscribe({
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
        if (!approvalRequest?.leaveRequestId) return;
        fetchLeaveRequest();
    }, [approvalRequest?.leaveRequestId])

    // edit
    const [openEdit, setOpenEdit] = useState(false);
    const [error, setError] = useState<String>('');

    const handleSubmitEdit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const comment = data.get('comment')!.toString().trim();

        updateApprovalRequest(approvalRequest?.id!, comment).subscribe({
            next(value) {
                ShowSuccess(value);
                setError('');
                setOpenEdit(false);
                fetchApprovalRequest();
            },
            error(err) {
                ShowFailure(err.message);
            },
        })
    }

    const handleCancelApprovalRequest = () => {
        cancelApprovalRequest(approvalRequest?.id!).subscribe({
            next(value) {
                ShowSuccess(value);
                fetchApprovalRequest();
            },
            error(err) {
                ShowFailure(err.message);
            },
        })
    }

    const handleSubmitApprovalRequest = () => {
        submitApprovalRequest(approvalRequest?.id!).subscribe({
            next(value) {
                ShowSuccess(value);
                fetchApprovalRequest();
            },
            error(err) {
                ShowFailure(err.message);
            },
        })
    }

    return (
        <>
            {approvalRequestExists ?
                <>
                    {approvalRequest != undefined ?
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
                                                Approval request
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
                                                                label="Comment"
                                                                name="comment"
                                                                required
                                                                fullWidth
                                                                inputProps={{ maxLength: 5000 }}
                                                                multiline
                                                                minRows={4}
                                                                defaultValue={approvalRequest.comment}
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
                                                            <Typography>Approver Id: {approvalRequest.approverId}</Typography>
                                                            <Typography>Status: {approvalRequest.status}</Typography>
                                                            <Divider sx={{ mb: 3 }} />
                                                            {approvalRequest.comment &&
                                                                <>
                                                                    <Typography>Comment:</Typography>
                                                                    <Typography>{approvalRequest.comment}</Typography>
                                                                </>
                                                            }

                                                            {User.id === approvalRequest.approverId &&
                                                                <Box sx={{ ml: 'auto', mt: 3, width: 'fit-content', display: 'flex', flexDirection: 'row' }}>
                                                                    {approvalRequest.status === "New" &&
                                                                        <Button
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            sx={{ mr: 1 }}
                                                                            onClick={handleSubmitApprovalRequest}
                                                                        >
                                                                            Submit
                                                                        </Button>
                                                                    }
                                                                    {approvalRequest.status === "New" &&
                                                                        <Button
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            sx={{ mr: 1 }}
                                                                            onClick={handleCancelApprovalRequest}
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                    }
                                                                    <Button
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        onClick={() => setOpenEdit(!openEdit)}
                                                                    >
                                                                        Comment
                                                                    </Button>
                                                                </Box>
                                                            }
                                                        </Box>
                                                    </>
                                                }
                                            </Paper>


                                            {leaveRequest != undefined &&

                                                <Grid container spacing={3} sx={{ mt: 3 }}>
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
                                                                <Box sx={{ ml: 'auto', mt: 3, width: 'fit-content', display: 'flex', flexDirection: 'row' }}>
                                                                    <Button
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        onClick={() => navigator("/leaverequest/" + leaveRequest.id)}
                                                                    >
                                                                        Visit
                                                                    </Button>
                                                                </Box>
                                                            </Box>
                                                        </Paper>
                                                    </Grid>
                                                </Grid>
                                            }
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