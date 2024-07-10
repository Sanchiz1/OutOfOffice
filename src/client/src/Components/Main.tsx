import { Box, Button, Container, CssBaseline, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import EmployeeLeaveRequestsDataTable from './LeaveRequest/EmployeeLeaveRequestsDataTable';
import { useNavigate } from 'react-router-dom';
import EmployeeProjectsDataTable from './Projects/EmployeeProjectsDataTable';

export default function Main() {
    const navigate = useNavigate();
    const User = useSelector((state: RootState) => state.account.Account);

    return (
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
                <Button sx={{ mb: 3 }} onClick={() => navigate("/createLeaveRequest")}>Create leave request</Button>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <EmployeeLeaveRequestsDataTable employeeId={User.id}></EmployeeLeaveRequestsDataTable>
                    </Grid>
                </Grid>
                {User.id &&
                    <Grid item xs={12} sx={{mt: 3}}>
                        <EmployeeProjectsDataTable employeeId={User.id}></EmployeeProjectsDataTable>
                    </Grid>
                }
            </Container>
        </Box>
    )
}