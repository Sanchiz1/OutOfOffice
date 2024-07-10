import CloseIcon from '@mui/icons-material/Close';
import { Alert, Collapse, Container, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, LinearProgress, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { requestEmployeeById, updateEmployeePassword, updateUserRequest } from '../../API/employeeRequests';
import { RootState } from '../../Redux/store';
import { Employee, UpdateUserInput } from '../../Types/Employee';
import NotFoundPage from '../UtilComponents/NotFoundPage';
import SelectPeoplePartnerDataTable from '../Employees/SelectPeoplePartnerDataTable';

const validUsernamePattern = /^[a-zA-Z0-9_]+$/;
const validEmailPattern = /^(?=.{0,64}$)[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const roles = {
  1: "User",
  2: "Administrator",
  3: "Moderator",
};

export default function UserPage() {
  const [employee, setEmployee] = useState<Employee>();
  const [userExists, setUserExists] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  let { EmployeeId } = useParams();
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { state } = useLocation()

  const Account = useSelector((state: RootState) => state.account.Account);

  useEffect(() => {
    requestEmployeeById(parseInt(EmployeeId!)).subscribe({
      next(user) {
        if (user === null) {
          setUserExists(false);
          return;
        }
        setEmployee(user);
        setPosition(user?.position!);
        setStatus(user?.status!);
        setPeaoplePartnerId(user.peoplePartner);
      },
      error(err) {
      },
    })
  }, [EmployeeId])

  const [error, setError] = useState<String>('');

  const [position, setPosition] = useState(Account.position);
  const [status, setStatus] = useState(Account.position);

  const handleSubmitEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fullName = data.get('fullName')!.toString().trim();
    const email = data.get('email')!.toString().trim();
    const subdivision = data.get('subdivision')!.toString().trim();
    const peoplePartner = data.get('peoplePartner')!.toString().trim();
    const outOfOfficeBalance = data.get('outOfOfficeBalance')!.toString().trim();

    const userInput: UpdateUserInput = {
      FullName: fullName,
      Email: email,
      Position: position,
      Subdivision: subdivision,
      Status: status,
      PeoplePartner: peoplePartner ? parseInt(peoplePartner) : undefined,
      OutOfOfficeBalance: outOfOfficeBalance ? parseInt(outOfOfficeBalance) : 0
    }

    updateUserRequest(employee?.id!, userInput).subscribe({
      next(value) {
        enqueueSnackbar(value, {
          variant: 'success', anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
          autoHideDuration: 1500
        });
        setError('');
        setOpenEdit(false);
      },
      error(err) {
        setError(err.message)
      },
    })
  }

  const handlePostionChange = (event: SelectChangeEvent) => {
    setPosition(event.target.value);
  };
  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };


  const handleSubmitChangePassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get('password')!.toString().trim();

    if (password.length === 0) return;

    updateEmployeePassword(employee?.id!, password).subscribe({
      next(value) {
        enqueueSnackbar(value, {
          variant: 'success', anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
          autoHideDuration: 1500
        });
        setError('');
        setOpenEdit(false);
      },
      error(err) {
        setError(err.message)
      },
    })
  }

  // select people partner
  
  const [peoplePartnerId, setPeaoplePartnerId] = useState(employee?.peoplePartner);
  const [openSelectPeoplePartner, setOpenSelectPeoplePartner] = useState(false);

  const handleClickOpenSelectPeoplePartnerOpen = () => {
    setOpenSelectPeoplePartner(true);
  };

  const handleCloseSelectPeoplePartner = () => {
    setOpenSelectPeoplePartner(false);
  };

  return (
    <>
      {userExists ?
        <>
          {employee != undefined ?
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
                  minHeight: '100vh',
                  overflow: 'auto',
                  display: 'flex'
                }}
              >
                <Container maxWidth='lg' sx={{
                  mt: 4, mb: 4, width: 1
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Grid item xs={12}>
                        <Paper
                          sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 1,
                          }}
                        >
                          <Grid sx={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}>
                            <Typography variant="h4" color="text.secondary" component="p">
                              {employee.fullName}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="p">
                              Status: {employee.status}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="p">
                              Email: {employee.email}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="p">
                              Subdivision: {employee.subdivision}
                            </Typography>
                            {["HR Manager", "Administrator"].includes(Account.position) &&
                              <>
                                <Divider sx={{ mt: 2 }} />
                                <Button onClick={() => setOpenEdit(!openEdit)}>Edit</Button>
                                <Collapse in={openEdit}>
                                  <Box component="form" onSubmit={handleSubmitEdit} noValidate sx={{ mt: 1, mb: 3 }}>
                                    <TextField
                                      required
                                      margin="normal"
                                      fullWidth
                                      id="fullName"
                                      label="Full Name"
                                      name="fullName"
                                      autoComplete="off"
                                      autoFocus
                                      defaultValue={employee.fullName}
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
                                      defaultValue={employee.email}
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
                                    <TextField
                                      margin="normal"
                                      required
                                      fullWidth
                                      id="Subdivision"
                                      label="Subdivision"
                                      name="subdivision"
                                      autoComplete="off"
                                      autoFocus
                                      defaultValue={employee.subdivision}
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
                                      defaultValue={employee.outOfOfficeBalance}
                                    />
                                    <Collapse in={error != ''} >
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
                                    >
                                      Submit
                                    </Button>
                                  </Box>
                                  <Divider sx={{ my: 2 }} />
                                </Collapse>
                                <Divider sx={{ mt: 2 }} />
                                <Button onClick={() => setOpenChangePassword(!openChangePassword)}>Change password</Button>
                                <Collapse in={openChangePassword}>
                                  <Box component="form" onSubmit={handleSubmitChangePassword} noValidate sx={{ mt: 1, mb: 3 }}>
                                    <TextField
                                      margin="normal"
                                      required
                                      fullWidth
                                      id="password"
                                      label="New password"
                                      name="password"
                                      type='password'
                                      autoComplete="off"
                                      autoFocus
                                    />
                                    <Collapse in={error != ''} >
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
                                          </IconButton  >
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
                                    >
                                      Submit
                                    </Button>
                                  </Box>
                                  <Divider sx={{ my: 2 }} />
                                </Collapse>
                              </>}
                          </Grid>
                        </Paper>
                      </Grid>
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
            :
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          }
        </>
        :
        <NotFoundPage input='User not found'></NotFoundPage>
      }
    </>
  );
}