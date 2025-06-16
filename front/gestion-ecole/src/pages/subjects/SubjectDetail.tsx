import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subjectService } from '../../services/subject.service';
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
  Subject as SubjectIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Language as LanguageIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Class as ClassIcon,
  Group as GroupIcon,
  Star as StarIcon,
  TrendingUp as CoefficientIcon
} from '@mui/icons-material';

interface Subject {
  id: number;
  name: string;
  code?: string;
  description?: string;
  section?: 'CRECHE' | 'MATERNELLE' | 'PRIMAIRE';
  language?: 'FRANCOPHONE' | 'ANGLOPHONE';
  level?: string;
  credits?: number;
  coefficient?: number;
  teacher?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  classes?: { id: number; name: string }[];
  teachers?: { id: number; firstName: string; lastName: string }[];
}

const SubjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        if (id) {
          const data = await subjectService.getSubjectById(Number(id));
          console.log('Matière reçue:', data);
          setSubject(data);
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (id) {
        await subjectService.deleteSubject(Number(id));
        console.log('Matière supprimée, redirection vers: /dashboard/subjects');
        navigate('/dashboard/subjects');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Erreur:', err);
    }
    setOpenDialog(false);
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

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

  const getLanguageLabel = (language?: string) => {
    switch (language) {
      case 'FRANCOPHONE':
        return 'Francophone';
      case 'ANGLOPHONE':
        return 'Anglophone';
      default:
        return 'Non spécifiée';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
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

  if (error || !subject) {
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
            {error || 'Matière non trouvée.'}
          </Alert>
        </Fade>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/subjects')}
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
              onClick={() => navigate('/dashboard/subjects')}
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
              Détails de la Matière
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Carte principale avec icône et infos de base */}
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
                    {getInitials(subject.name)}
                  </Avatar>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {subject.name}
                  </Typography>
                  {subject.code && (
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                      Code: {subject.code}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {subject.section && (
                      <Chip
                        label={subject.section}
                        color={getSectionColor(subject.section) as any}
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    )}
                    {subject.language && (
                      <Chip
                        label={getLanguageLabel(subject.language)}
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
                {/* Informations générales */}
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
                      <SubjectIcon />
                      Informations générales
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <SchoolIcon color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Niveau
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {subject.level || 'Non spécifié'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <LanguageIcon color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Langue
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {getLanguageLabel(subject.language)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <StarIcon color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Crédits
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {subject.credits ?? 1}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <CoefficientIcon color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Coefficient
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {subject.coefficient ?? 1}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                          <SubjectIcon color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Description
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {subject.description || 'Aucune description'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Enseignants */}
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
                      Enseignants
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <PersonIcon color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Enseignant principal
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {subject.teacher
                                ? `${subject.teacher.firstName} ${subject.teacher.lastName}`
                                : 'Aucun'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                          <GroupIcon color="action" />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Autres enseignants
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                              {subject.teachers && subject.teachers.length > 0
                                ? subject.teachers.map(t => `${t.firstName} ${t.lastName}`).join(', ')
                                : 'Aucun'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Classes associées */}
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
                      <ClassIcon />
                      Classes associées
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {subject.classes && subject.classes.length > 0 ? (
                        subject.classes.map(cls => (
                          <Chip
                            key={cls.id}
                            label={cls.name}
                            sx={{
                              bgcolor: 'primary.light',
                              color: 'primary.contrastText',
                              fontWeight: 600
                            }}
                          />
                        ))
                      ) : (
                        <Typography variant="body1" color="text.secondary">
                          Aucune classe associée
                        </Typography>
                      )}
                    </Box>
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
                onClick={() => navigate(`/dashboard/subjects/edit/${subject.id}`)}
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

      {/* Dialog de confirmation */}
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
            Êtes-vous sûr de vouloir supprimer définitivement la matière{' '}
            <strong>{subject.name}</strong> ?
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

export default SubjectDetail;