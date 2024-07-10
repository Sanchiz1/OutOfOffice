import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, Button, Collapse, Container, CssBaseline, Dialog, DialogContent, DialogTitle, IconButton, MenuItem, Paper, Select, SelectChangeEvent, TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLeaveRequest } from '../../API/leaveRequestRequests';
import { createProject } from '../../API/projectRequests';
import { CreateUserInput } from '../../Types/Employee';
import { createEmployeeRequest } from '../../API/employeeRequests';
import SelectPeoplePartnerDataTable from './SelectPeoplePartnerDataTable';

export default function CreateEmployee() {
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

    const [position, setPosition] = useState("Employee");
    const [error, setError] = useState<String>('');
    const handlePostSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const fullName = data.get('fullName')!.toString().trim();
        const email = data.get('email')!.toString().trim();
        const subdivision = data.get('subdivision')!.toString().trim();
        const outOfOfficeBalance = data.get('outOfOfficeBalance')!.toString().trim();
        const password = data.get('password')!.toString().trim();

        if (fullName.length === 0 ||
            email.length === 0 ||
            subdivision.length === 0 ||
            password.length === 0) {
            setError("Fill all required fields");
            return;
        }

        const userInput: CreateUserInput = {
            FullName: fullName,
            Email: email,
            Position: position,
            Subdivision: subdivision,
            Status: status,
            PeoplePartner: peoplePartnerId,
            OutOfOfficeBalance: outOfOfficeBalance ? parseInt(outOfOfficeBalance) : 0,
            Password: password
        }

        createEmployeeRequest(userInput).subscribe({
            next(value) {
                enqueueSnackbar(value, {
                    variant: 'success', anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    },
                    autoHideDuration: 1500
                });
                setError('');
            },
            error(err) {
                setError(err.message)
            },
        })
    };

    const handlePostionChange = (event: SelectChangeEvent) => {
        setPosition(event.target.value);
    };


    // select people partner

    const [peoplePartnerId, setPeaoplePartnerId] = useState<number | undefined>(undefined);
    const [openSelectPeoplePartner, setOpenSelectPeoplePartner] = useState(false);

    const handleClickOpenSelectPeoplePartnerOpen = () => {
        setOpenSelectPeoplePartner(true);
    };

    const handleCloseSelectPeoplePartner = () => {
        setOpenSelectPeoplePartner(false);
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
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Container maxWidth='lg' sx={{
                    pt: 4,
                    overflow: 'hidden',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant="h5" color="text.secondary" component="p" gutterBottom>
                                Create employee
                            </Typography>
                            <Divider />
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Box component="form" onSubmit={handlePostSubmit} noValidate sx={{ mt: 1, display: 'flex', flexDirection: 'column' }}>
                                <TextField
                                    required
                                    margin="normal"
                                    fullWidth
                                    id="fullName"
                                    label="Full Name"
                                    name="fullName"
                                    autoComplete="off"
                                    autoFocus
                                />
                                <TextField
                                    required
                                    margin="normal"
                                    fullWidth
                                    id="email"
                                    label="Email address"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                />
                                <Select
                                    required
                                    labelId="role-label"
                                    id="role"
                                    value={position}
                                    fullWidth
                                    onChange={handlePostionChange}
                                    sx={{ my: 1 }}
                                >
                                    <MenuItem value={"Employee"}>Employee</MenuItem>
                                    <MenuItem value={"HR Manager"}>HR Manager</MenuItem>
                                    <MenuItem value={"Project Manager"}>Project Manager</MenuItem>
                                    <MenuItem value={"Administrator"}>Administrator</MenuItem>
                                </Select>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="Subdivision"
                                    label="Subdivision"
                                    name="subdivision"
                                    autoComplete="off"
                                    autoFocus
                                />
                                <Button variant='outlined'
                                    onClick={handleClickOpenSelectPeoplePartnerOpen}>People partner: {peoplePartnerId ? peoplePartnerId : "no partner"}</Button>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="outOfOfficeBalance"
                                    label="Out Of Office Balance"
                                    name="outOfOfficeBalance"
                                    autoComplete="off"
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    type='password'
                                    required
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    name="password"
                                    autoComplete="off"
                                    autoFocus
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
                                    sx={{ ml: 'auto', width: 'fit-content' }}
                                >
                                    Create
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <Dialog
                open={openSelectPeoplePartner}
                onClose={handleCloseSelectPeoplePartner}
                fullWidth
                maxWidth="lg"
            >
                <DialogTitle>
                    {"Select people partner"}
                </DialogTitle>
                <DialogContent>
                    <SelectPeoplePartnerDataTable onSelect={(id) => {
                        setPeaoplePartnerId(id);
                        handleCloseSelectPeoplePartner();
                    }}></SelectPeoplePartnerDataTable>
                </DialogContent>
            </Dialog>
        </Box>
    )


}