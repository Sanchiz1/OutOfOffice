import { Box, Container, Divider, Grid, Typography } from '@mui/material';
import AddToProjectEmployeesDataTable from './AddToProjectEmployeesDataTable';
import { useParams } from 'react-router-dom';

export default function AddToProjectPage() {
    let { ProjectId } = useParams();

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
                    <Grid item xs={12} md={12} lg={12}>
                        <Typography variant="h5" color="text.secondary" component="p" gutterBottom>
                            Add to project
                        </Typography>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <AddToProjectEmployeesDataTable ProjectId={parseInt(ProjectId!)}></AddToProjectEmployeesDataTable>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )


}