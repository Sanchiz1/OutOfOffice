import { Box, Container, Grid } from '@mui/material';
import EmployeesDataTable from './EmployeesDataTable';

export default function EmployeesPage() {

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
                <Grid item xs={12}>
                    <EmployeesDataTable></EmployeesDataTable>
                </Grid>
            </Grid>
        </Container>
    </Box>
  )


}