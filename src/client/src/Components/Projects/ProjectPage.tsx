import { Box, Button, Container, CssBaseline, LinearProgress, MenuItem, Paper, Select, SelectChangeEvent, TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { cancelLeaveRequest, getLeaveRequestById, submitLeaveRequest, updateLeaveRequest } from '../../API/leaveRequestRequests';
import { GetDateString } from '../../Helpers/DateFormatHelper';
import { ShowFailure, ShowSuccess } from '../../Helpers/SnackBarHelper';
import { RootState } from '../../Redux/store';
import { LeaveRequest } from '../../Types/LeaveRequest';
import NotFoundPage from '../UtilComponents/NotFoundPage';
import { getProjectById, updateProject } from '../../API/projectRequests';
import { Project } from '../../Types/Project';
import ProjectEmployeesDataTable from './ProjectEmployeesDataTable';

export default function ProjectPage() {
    let { ProjectId } = useParams();
    const navigator = useNavigate()
    const [leaveRequestExists, setLeaveRequestExists] = useState(true);
    const [project, setProject] = useState<Project>();
    const User = useSelector((state: RootState) => state.account.Account);
    const [status, setStatus] = useState(project?.status!);


    const fetchProject = () =>
        getProjectById(parseInt(ProjectId!)).subscribe({
            next(user) {
                if (user === null) {
                    setLeaveRequestExists(false);
                    return;
                }
                setProject(user);
                setStatus(user.status);
            },
            error(err) {
            },
        })

    useEffect(() => {
        fetchProject();
    }, [ProjectId])

    // edit
    const [openEdit, setOpenEdit] = useState(false);
    const [error, setError] = useState<String>('');
    const [projectTypeError, setProjectTypeError] = useState('');
    const [startDateError, SetStartDateError] = useState('');
    const [endDateError, SetEndDateError] = useState('');

    const handleSubmitEdit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const projectType = data.get('projectType')!.toString().trim();
        const startDate = data.get('startDate')!.toString();
        const endDate = data.get('endDate')!.toString().trim();
        const comment = data.get('comment')!.toString().trim();

        if (projectType.length === 0) {
            setProjectTypeError('Fill project type!');
            return;
        }

        if (startDate.length === 0) {
            SetStartDateError('Fill start date!');
            return;
        }

        updateProject(project?.id!, projectType, status, new Date(startDate), endDate ? new Date(endDate) : undefined, comment).subscribe({
            next(value) {
                ShowSuccess(value);
                setError('');
                setOpenEdit(false);
                fetchProject();
            },
            error(err) {
                ShowFailure(err.message);
            },
        })
    }

    const handleStatusChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value);
    };
    return (
        <>
            {leaveRequestExists ?
                <>
                    {project != undefined ?
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
                                                Project
                                            </Typography>
                                            <Divider />
                                        </Grid>
                                        <Divider sx={{ mb: 1 }} />

                                        <Grid item xs={12} md={12} lg={12} sx={{ mb: 3 }}>
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
                                                                label="Project type"
                                                                name="projectType"
                                                                required
                                                                fullWidth
                                                                inputProps={{ maxLength: 500 }}
                                                                error={projectTypeError !== ''}
                                                                onFocus={() => setProjectTypeError('')}
                                                                helperText={projectTypeError}
                                                                defaultValue={project.projectType}
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
                                                                defaultValue={new Date(project.startDate).toISOString().split('T')[0]}
                                                            />
                                                            <TextField
                                                                margin="normal"
                                                                id="outlined-multiline-flexible"
                                                                label="End date"
                                                                placeholder=''
                                                                name="endDate"
                                                                type='date'
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
                                                                fullWidth
                                                                inputProps={{ maxLength: 5000 }}
                                                                multiline
                                                                minRows={4}
                                                                defaultValue={project.comment}
                                                            />

                                                            <Select
                                                                required
                                                                labelId="role-label"
                                                                id="role"
                                                                value={status}
                                                                fullWidth
                                                                onChange={handleStatusChange}
                                                                sx={{ my: 1 }}
                                                            >
                                                                <MenuItem value={"Active"}>Active</MenuItem>
                                                                <MenuItem value={"Inactive"}>Inactive</MenuItem>
                                                            </Select>
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
                                                            <Typography>Project type: {project.projectType}</Typography>
                                                            <Typography>From {GetDateString(new Date(project.startDate))} {project.endDate ? `to ${GetDateString(new Date(project.endDate))}` : ""}</Typography>
                                                            <Typography>Status: {project.status}</Typography>
                                                            <Divider sx={{ mb: 3 }} />
                                                            {project.comment &&
                                                                <>
                                                                    <Typography>Comment:</Typography>
                                                                    <Typography>{project.comment}</Typography>
                                                                </>
                                                            }

                                                            {(User.id === project.projectManagerId || User.position === "Administrator") &&
                                                                <Box sx={{ ml: 'auto', mt: 3, width: 'fit-content', display: 'flex', flexDirection: 'row' }}>
                                                                    <Button
                                                                        fullWidth
                                                                        variant="outlined"
                                                                        onClick={() => setOpenEdit(!openEdit)}
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                </Box>
                                                            }
                                                        </Box>
                                                    </>
                                                }
                                            </Paper>
                                            {(User.position === "Administrator" || project.projectManagerId === User.id) &&
                                                <Box sx={{ mt: 3, width: 'fit-content', display: 'flex', flexDirection: 'row' }}>
                                                    <Button
                                                        fullWidth
                                                        variant="outlined"
                                                        onClick={() => navigator("/project/" + project.id + "/add")}
                                                    >
                                                        AddUser
                                                    </Button>
                                                </Box>
                                            }
                                        </Grid>
                                    </Grid>
                                    {(User.position === "Administrator" || project.projectManagerId === User.id) &&
                                        <ProjectEmployeesDataTable ProjectId={project.id}></ProjectEmployeesDataTable>
                                    }
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