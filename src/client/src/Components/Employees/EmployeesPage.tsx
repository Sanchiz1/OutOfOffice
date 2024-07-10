import { Box, Button, Container, Grid } from '@mui/material';
import EmployeesDataTable from './EmployeesDataTable';
import { useNavigate } from 'react-router-dom';

export default function EmployeesPage() {
    const navigate = useNavigate();

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
                <Grid container spacing={0}>
                    <Button sx={{ mb: 3 }} onClick={() => navigate("/createEmployee")}>Create employee</Button>
                    <Grid item xs={12}>
                        <EmployeesDataTable></EmployeesDataTable>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )


}