// src/pages/students/StudentDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/student.service';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  CircularProgress, 
  Alert, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  Fade,
  Slide
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  School as SchoolIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  Person as PersonGenericIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  AccountCircle as ParentIcon
} from '@mui/icons-material';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender?: string;
  birthDate?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  registrationDate?: string;
  section?: 'CRECHE' | 'MATERNELLE' | 'PRIMAIRE';
  studentClass?: { id: number; name: string };
}

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (id) {
          const data = await studentService.getStudentById(Number(id));
          console.log('Étudiant reçu:', data);
          setStudent(data);
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (id) {
        await studentService.deleteStudent(Number(id));
        console.log('Étudiant supprimé, redirection vers: /dashboard/students');
        navigate('/dashboard/students');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Erreur:', err);
    }
    setOpenDialog(false);
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const getGenderIcon = (gender?: string) => {
    switch (gender?.toLowerCase()) {
      case 'masculin':
      case 'homme':
      case 'male':
        return <MaleIcon color="primary" />;
      case 'féminin':
      case 'femme':
      case 'female':
        return <FemaleIcon color="secondary" />;
      default:
        return <PersonGenericIcon color="action" />;
    }
  };

  const getSectionColor = (section?: string) => {
    switch (section) {
      case 'CRECHE':
        return 'success';
      case 'MATERNELLE':
        return 'warning';
      case 'PRIMAIRE':
        return 'primary';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non spécifiée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Chargement des détails...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error || !student) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Fade in={true}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: '2rem'
              }
            }}
          >
            <Typography variant="h6" gutterBottom>
              Oops ! Une erreur s'est produite
            </Typography>
            {error || 'Étudiant non trouvé.'}
          </Alert>
        </Fade>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/students')}
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Slide direction="down" in={true} mountOnEnter unmountOnExit>
        <Box>
          {/* Header avec bouton retour */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton
              onClick={() => navigate('/dashboard/students')}
              sx={{ 
                mr: 2,
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s'
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{
                fontWeight: 600,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Profil Étudiant
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Carte principale avec photo et infos de base */}
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', position: 'relative', zIndex: 1, py: 4 }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      border: '4px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                    }}
                  >
                    {getInitials(student.firstName, student.lastName)}
                  </Avatar>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {student.firstName} {student.lastName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                    <EmailIcon fontSize="small" />
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {student.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {student.section && (
                      <Chip
                        label={student.section}
                        color={getSectionColor(student.section) as any}
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    )}
                    {student.studentClass && (
                      <Chip
                        label={student.studentClass.name}
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Informations détaillées */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                {/* Informations personnelles */}
                <Grid item xs={12}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: 'primary.main',
                        fontWeight: 600
                      }}
                    >
                      <PersonIcon />
                      Informations personnelles
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          {getGenderIcon(student.gender)}
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Genre
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {student.gender || 'Non spécifié'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <CakeIcon color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Date de naissance
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {formatDate(student.birthDate)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <CalendarIcon color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Date d'inscription
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {formatDate(student.registrationDate)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <SchoolIcon color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Classe
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {student.studentClass?.name || 'Aucune'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Informations parent */}
                <Grid item xs={12}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        color: 'primary.main',
                        fontWeight: 600
                      }}
                    >
                      <ParentIcon />
                      Informations du parent/tuteur
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <GroupIcon color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Nom du parent
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {student.parentName || 'Non spécifié'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <EmailIcon color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Email du parent
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {student.parentEmail || 'Non spécifié'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <PhoneIcon color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Téléphone du parent
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {student.parentPhone || 'Non spécifié'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Boutons d'action */}
          <Box sx={{ 
            mt: 4, 
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <Tooltip title="Modifier les informations" arrow>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/dashboard/students/edit/${student.id}`)}
                size="large"
                sx={{ 
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                  },
                  transition: 'all 0.2s'
                }}
              >
                Modifier
              </Button>
            </Tooltip>
            <Tooltip title="Supprimer définitivement" arrow>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<DeleteIcon />}
                onClick={handleOpenDialog}
                size="large"
                sx={{ 
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(211, 47, 47, 0.3)',
                  },
                  transition: 'all 0.2s'
                }}
              >
                Supprimer
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Slide>

      {/* Dialog de confirmation amélioré */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'error.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <DeleteIcon />
          Confirmer la suppression
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            Cette action est irréversible !
          </Alert>
          <DialogContentText sx={{ fontSize: '1.1rem' }}>
            Êtes-vous sûr de vouloir supprimer définitivement l'étudiant{' '}
            <strong>{student.firstName} {student.lastName}</strong> ?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined"
            size="large"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained"
            color="error"
            size="large"
            startIcon={<DeleteIcon />}
            sx={{ 
              borderRadius: 2, 
              px: 3,
              boxShadow: '0 4px 15px rgba(211, 47, 47, 0.3)'
            }}
          >
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentDetail;