import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginRequest } from '../../API/loginRequests';
import { getUserAccount } from '../../Redux/Epics/AccountEpics';
import { setGlobalError } from '../../Redux/Reducers/AccountReducer';
import { ShowFailure } from '../../Helpers/SnackBarHelper';

export default function SignIn() {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { state } = useLocation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    
    let email = data.get('email')!.toString();
    let password = data.get('password')!.toString();
    
    if(email === '' || password === ''){
      dispatch(setGlobalError('Fill all fields'));
      return;
    }

    LoginRequest(email, password).subscribe({
      next() {
        dispatch(getUserAccount());
        if(state === null){
            navigator('/');
            return;
        }
        navigator(state);
      },
      error(err) {
        ShowFailure(err.message);
      },
    });
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username or email address"
              name="email"
              autoComplete="off"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="off"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}