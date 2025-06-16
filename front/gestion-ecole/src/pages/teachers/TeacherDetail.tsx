// src/pages/teachers/TeacherDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teacherService } from '../../services/teacher.service';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  CircularProgress, 
  Paper, 
  Alert, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Card,
  CardContent,
  Divider,
  Chip,
  Avatar,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Cake,
  Work,
  School,
  Description,
  Edit,
  Delete,
  ArrowBack,
  Male,
  Female
} from '@mui/icons-material';

interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string;
  hireDate: string;
  specialization: string;
  taskDescription: string;
}

const TeacherDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        if (id) {
          const data = await teacherService.getTeacherById(Number(id));
          console.log('Détails de l\'enseignant reçus:', data);
          setTeacher(data);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des détails de l\'enseignant.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (id) {
        await teacherService.deleteTeacher(Number(id));
        console.log('Enseignant supprimé, redirection vers: /teachers');
        navigate('/dashboard/teachers');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de l\'enseignant.');
      console.error('Erreur:', err);
    }
    setOpenDialog(false);
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  if (loading) {
    return (
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Chargement des détails...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error || !teacher) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'Enseignant non trouvé.'}
          </Alert>
          <Button 
            variant="contained" 
            startIcon={<ArrowBack />}
            onClick={() => navigate('/dashboard/teachers')}
            size="large"
          >
            Retour à la liste
          </Button>
        </Card>
      </Container>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return dateString ? new Date(dateString).toLocaleDateString('fr-FR') : 'Non spécifiée';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête avec avatar et informations principales */}
      <Card elevation={2} sx={{ mb: 4, overflow: 'visible' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                fontSize: '2rem',
                bgcolor: 'primary.main',
                mr: 3
              }}
            >
              {getInitials(teacher.firstName, teacher.lastName)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
                {teacher.firstName} {teacher.lastName}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip
                  icon={teacher.gender === 'MALE' ? <Male /> : <Female />}
                  label={teacher.gender === 'MALE' ? 'Masculin' : 'Féminin'}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={<School />}
                  label={teacher.specialization}
                  color="secondary"
                />
              </Stack>
            </Box>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Retour à la liste">
                <IconButton
                  onClick={() => navigate('/teachers')}
                  size="large"
                  sx={{ bgcolor: 'grey.100' }}
                >
                  <ArrowBack />
                </IconButton>
              </Tooltip>
              <Tooltip title="Modifier">
                <IconButton
                  onClick={() => navigate(`/dashboard/teachers/edit/${teacher.id}`)}
                  size="large"
                  sx={{ bgcolor: 'primary.50', color: 'primary.main' }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Supprimer">
                <IconButton
                  onClick={handleOpenDialog}
                  size="large"
                  sx={{ bgcolor: 'error.50', color: 'error.main' }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Informations de contact */}
        <Grid item xs={12} md={6}>
          <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 3,
                fontWeight: 600
              }}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                Informations de contact
              </Typography>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {teacher.email}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Téléphone
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {teacher.phone || 'Non spécifié'}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Informations personnelles */}
        <Grid item xs={12} md={6}>
          <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 3,
                fontWeight: 600
              }}>
                <Cake sx={{ mr: 1, color: 'primary.main' }} />
                Informations personnelles
              </Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Date de naissance
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formatDate(teacher.birthDate)}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Work sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Date d'embauche
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(teacher.hireDate)}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Description des tâches */}
        <Grid item xs={12}>
          <Card elevation={1}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 3,
                fontWeight: 600
              }}>
                <Description sx={{ mr: 1, color: 'primary.main' }} />
                Description des tâches
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}
              >
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  {teacher.taskDescription || 'Aucune description fournie'}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions principales */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: 2,
        mt: 4
      }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/teachers')}
          size="large"
          sx={{ minWidth: 150 }}
        >
          Retour
        </Button>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/dashboard/teachers/edit/${teacher.id}`)}
          size="large"
          sx={{ minWidth: 150 }}
        >
          Modifier
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<Delete />}
          onClick={handleOpenDialog}
          size="large"
          sx={{ minWidth: 150 }}
        >
          Supprimer
        </Button>
      </Box>

      {/* Boîte de dialogue de confirmation */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Delete sx={{ mr: 1, color: 'error.main' }} />
          Confirmer la suppression
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <DialogContentText sx={{ fontSize: '1rem' }}>
            Êtes-vous sûr de vouloir supprimer l'enseignant{' '}
            <strong>{teacher.firstName} {teacher.lastName}</strong> ?{' '}
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined" 
            size="large"
            sx={{ minWidth: 100 }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained" 
            color="error"
            size="large"
            sx={{ minWidth: 100 }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TeacherDetail;