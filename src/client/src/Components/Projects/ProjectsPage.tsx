import { Box, Button, Container, Grid } from '@mui/material';
import ProjectsDataTable from './ProjectDataTable';
import { useNavigate } from 'react-router-dom';

export default function ProjectsPage() {
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
                <Button sx={{ mb: 3 }} onClick={() => navigate("/createProject")}>Create project</Button>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <ProjectsDataTable></ProjectsDataTable>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )


}