import CloseIcon from '@mui/icons-material/Close';
import { Alert, Collapse, Container, CssBaseline, Dialog, DialogActions, DialogTitle, IconButton, LinearProgress, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
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
import { DeleteUserRequest, requestEmployeeById, updateUserRequest, updateUserRoleRequest } from '../../API/userRequests';
import { RootState } from '../../Redux/store';
import { Employee, UserInput } from '../../Types/Employee';
import { BootstrapInput } from '../UtilComponents/BootstrapInput';
import NotFoundPage from '../UtilComponents/NotFoundPage';
import UploadAvatar from './UploadAvatar';

const validUsernamePattern = /^[a-zA-Z0-9_]+$/;
const validEmailPattern = /^(?=.{0,64}$)[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const roles = {
  1: "User",
  2: "Administrator",
  3: "Moderator",
};

export default function UserPage() {
  const [employee, setEmployee] = useState<Employee>();
  const [role, setRole] = useState(1);
  const [userExists, setUserExists] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  let { UserId } = useParams();
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { state } = useLocation()

  const Account = useSelector((state: RootState) => state.account.Account);

  useEffect(() => {
    requestEmployeeById(parseInt(UserId!)).subscribe({
      next(user) {
        if (user === null) {
          setUserExists(false);
          return;
        }
        setEmployee(user);
        //setRole(user.RoleId);
      },
      error(err) {
      },
    })
  }, [UserId])

  //Edit
  const [usernameError, SetUsernameError] = useState('');
  const [emailError, SetEmailError] = useState('');
  const [bioError, SetBioError] = useState('');
  const [error, setError] = useState<String>('');

  const handleSubmitEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get('username')!.toString().trim();
    const email = data.get('email')!.toString().trim();
    const bio = data.get('bio')!.toString().trim();

    if (!validUsernamePattern.test(username)) {
      SetUsernameError('Invalid username');
      return;
    }
    if (!validEmailPattern.test(email)) {
      SetEmailError('Invalid email');
      return;
    }
    if (bio.length > 100) {
      SetBioError('Bio can have maximum of 100 characters');
      return;
    }

    const userInput: UserInput = {
      username: username,
      email: email,
      bio: bio
    }

    updateUserRequest(userInput).subscribe({
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
        navigator("/user/" + userInput.username);
      },
      error(err) {
        setError(err.message)
      },
    })
  }

  const [order, setOrder] = useState("DateCreated");

  // edit role 
  const handleChange = (event: SelectChangeEvent) => {
    setRole(parseInt(event.target.value));
  };

  const handleSubmitEditRole = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let role_id: number = role;

    updateUserRoleRequest(employee?.id!, role_id).subscribe({
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
        navigator("/user/" + UserId);
      },
      error(err) {
        setError(err.message)
      },
    })
  }


  // delete
  const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
  const handleSubmitDeleteUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password = data.get('password')!.toString();
    if (password == '') {
      setError('Fill password field');
      return;
    }
    DeleteUserRequest(employee!.Id, password).subscribe({
      next(value) {
        enqueueSnackbar(value, {
          variant: 'success', anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
          autoHideDuration: 1500
        });
        navigator('/');
      },
      error(err) {
        setError(err.message);
      },
    });
  }

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
                    <Grid item xs={12} md={4} lg={4}>
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
                              <Typography variant="subtitle1" color="text.secondary" component="p" sx={{ mt: 2, whiteSpace: 'pre-line', overflowWrap: 'break-word' }}>
                                {employee.subdivision}
                              </Typography>
                              {(Account != null && employee.id === Account.id) &&
                                <>
                                  <Divider sx={{ mt: 2 }} />
                                  <Button onClick={() => setOpenEdit(!openEdit)}>Edit</Button>
                                  <Collapse in={openEdit}>
                                    <Box component="form" onSubmit={handleSubmitEdit} noValidate sx={{ mt: 1, mb: 3 }}>
                                      <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        autoComplete="off"
                                        autoFocus
                                        defaultValue={Account.fullName}
                                        error={usernameError != ''}
                                        onFocus={() => SetUsernameError('')}
                                        helperText={usernameError}
                                      />
                                      <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email address"
                                        name="email"
                                        autoComplete="off"
                                        autoFocus
                                        defaultValue={Account.email}
                                        error={emailError != ''}
                                        onFocus={() => SetEmailError('')}
                                        helperText={emailError}
                                      />
                                      <Collapse in={error != ''}>
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
                                    <UploadAvatar></UploadAvatar>
                                  </Collapse>
                                </>}
                              {(Account.Role === 'Administrator' && employee.Role !== 'Administrator') &&
                                <>
                                  <Divider sx={{ mt: 2 }} />
                                  <Button onClick={() => setOpenEdit(!openEdit)}>Settings</Button>
                                  <Collapse in={openEdit}>
                                    <Box component="form" onSubmit={handleSubmitEditRole} noValidate sx={{ mt: 1, mb: 3 }}>
                                      <Select
                                        labelId="role-label"
                                        id="role"
                                        value={role.toString()}
                                        fullWidth
                                        onChange={handleChange}
                                        sx={{ mb: 2 }}
                                      >
                                        <MenuItem value={1}>User</MenuItem>
                                        <MenuItem value={2}>Moderator</MenuItem>
                                        <MenuItem value={3}>Administrator</MenuItem>
                                      </Select>
                                      <Button
                                        type="submit"
                                        fullWidth
                                        variant="outlined"
                                      >
                                        Submit
                                      </Button>
                                    </Box>
                                    <Button color='error' sx={{ width: "100%" }} onClick={() => { setOpenDeleteAccount(true) }}>Delete user</Button>
                                  </Collapse>
                                </>}
                          </Grid>
                        </Paper>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} md={8} lg={8}>
                      <Grid item xs={12} sx={{ mb: 2 }}>
                        <Paper
                          sx={{
                            p: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 1,
                          }}
                        >
                          <Grid item xs={12} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" color="text.primary" component="p">
                              {employee.Posts} posts
                            </Typography>
                            <Typography variant="subtitle1" color="text.primary" component="p">
                              {employee.Comments} comments
                            </Typography>
                          </Grid>
                          <Divider sx={{ mb: 1 }} />
                          <Grid item xs={12} sx={{
                            width: 1,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'stretch',
                          }}>
                            <Typography variant="subtitle1" color="text.primary" component="p" sx={{ display: 'flex', alignItems: 'center' }}>
                              {employee.Username}`s posts
                            </Typography>
                            <Typography variant="subtitle1" sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                              <Select
                                value={order}
                                onChange={(e) => setOrder(e.target.value)}
                                input={<BootstrapInput sx={{ height: 1, display: 'flex' }} />}
                              >
                                <MenuItem value={"Likes"}>Top</MenuItem>
                                <MenuItem value={"DateCreated"}>New</MenuItem>
                              </Select>
                            </Typography>
                          </Grid>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Grid>
                </Container>
              </Box>

              <Dialog
                open={openDeleteAccount}
                onClose={() => setOpenDeleteAccount(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
              >
                <Box component="form"
                  noValidate sx={{ m: 0 }}
                  onSubmit={handleSubmitDeleteUser}
                >
                  <DialogTitle id="alert-dialog-title" sx={{ pb: 0 }}>
                    <Typography sx={{ mb: 2 }}>
                      Are You sure You want to delete this user? There is no going back.
                    </Typography>
                    <TextField
                      variant='outlined'
                      size='small'
                      placeholder='Password'
                      name="password"
                      type='password'
                      required
                      fullWidth
                      inputProps={{ maxLength: 50 }}
                      minRows={1}
                      sx={{ mb: 2 }}
                      error={error != ''}
                      onFocus={() => setError('')}
                      helperText={error}
                    />
                  </DialogTitle>
                  <DialogActions>
                    <Button onClick={() => setOpenDeleteAccount(false)}>Cancel</Button>
                    <Button type='submit' autoFocus>
                      Delete
                    </Button>
                  </DialogActions>
                </Box>
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