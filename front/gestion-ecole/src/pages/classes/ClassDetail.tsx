// src/pages/classes/ClassDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { classService } from '../../services/class.service';
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  Card,
  CardContent,
  Chip,
  Divider,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  Groups as GroupsIcon
} from '@mui/icons-material';

interface Class {
  id: number;
  name: string;
  level: string;
  section: 'CRECHE' | 'MATERNELLE' | 'PRIMAIRE';
  language: 'FRANCOPHONE' | 'ANGLOPHONE';
  academicYear: string;
  maxCapacity: number;
  teacher?: {
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
  };
  subjects?: { id: number; name: string }[];
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Statistics {
  studentCount: number;
  maxCapacity: number;
  availableSpots: number;
}

const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [classItem, setClassItem] = useState<Class | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        if (id) {
          const classData = await classService.getClassById(Number(id));
          const studentData = await classService.getClassStudents(Number(id));
          const statsData = await classService.getClassStatistics(Number(id));
          console.log('Détails de la classe reçus:', classData);
          console.log('Étudiants reçus:', studentData);
          console.log('Statistiques reçues:', statsData);
          setClassItem(classData);
          setStudents(studentData);
          setStatistics(statsData);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des détails de la classe.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClassData();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (id) {
        await classService.deleteClass(Number(id));
        console.log('Classe supprimée, redirection vers: /classes');
        navigate('/classes');
      }
    } catch (err: any) {
      setError(err.message.includes('contient des élèves') ? 'Impossible de supprimer une classe contenant des élèves.' : err.message);
      console.error('Erreur:', err);
    }
    setOpenDialog(false);
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'CRECHE': return 'success';
      case 'MATERNELLE': return 'warning';
      case 'PRIMAIRE': return 'primary';
      default: return 'default';
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'FRANCOPHONE': return 'info';
      case 'ANGLOPHONE': return 'secondary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Chargement des détails...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error || !classItem) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error || 'Classe non trouvée.'}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/classes')}
          sx={{ borderRadius: 2 }}
        >
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header avec navigation et titre */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => navigate('/dashboard/classes')}
              sx={{ 
                bgcolor: 'grey.100', 
                '&:hover': { bgcolor: 'grey.200' },
                borderRadius: 2
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
              {classItem.name}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Modifier la classe">
              <IconButton 
                color="primary"
                onClick={() => navigate(`/dashboard/classes/edit/${classItem.id}`)}
                sx={{ 
                  bgcolor: 'primary.50', 
                  '&:hover': { bgcolor: 'primary.100' },
                  borderRadius: 2
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Supprimer la classe">
              <IconButton 
                color="error"
                onClick={handleOpenDialog}
                sx={{ 
                  bgcolor: 'error.50', 
                  '&:hover': { bgcolor: 'error.100' },
                  borderRadius: 2
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={classItem.section} 
            color={getSectionColor(classItem.section) as any}
            variant="filled"
            size="small"
          />
          <Chip 
            label={classItem.language} 
            color={getLanguageColor(classItem.language) as any}
            variant="outlined"
            size="small"
          />
          <Chip 
            label={classItem.academicYear} 
            variant="outlined"
            size="small"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Informations principales */}
        <Grid item xs={12} md={8}>
          <Card elevation={2} sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon color="primary" />
                Informations de la classe
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="medium">
                      NIVEAU
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {classItem.level}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="medium">
                      CAPACITÉ MAXIMALE
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {classItem.maxCapacity || 'Non spécifiée'} élèves
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="medium">
                      ENSEIGNANT ASSIGNÉ
                    </Typography>
                    {classItem.teacher ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {classItem.teacher.firstName} {classItem.teacher.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {classItem.teacher.email}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Aucun enseignant assigné
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistiques */}
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GroupsIcon color="primary" />
                Statistiques
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" color="primary.main" fontWeight="bold">
                  {statistics?.studentCount || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Élèves inscrits
                </Typography>
                
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Places disponibles
                  </Typography>
                  <Typography variant="h6" color={statistics?.availableSpots === 0 ? 'error.main' : 'success.main'}>
                    {statistics?.availableSpots || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Matières */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MenuBookIcon color="primary" />
                Matières associées
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {classItem.subjects && classItem.subjects.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {classItem.subjects.map((subject) => (
                    <Chip 
                      key={subject.id}
                      label={subject.name}
                      variant="outlined"
                      color="primary"
                      size="small"
                    />
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Aucune matière associée
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Liste des étudiants */}
        <Grid item xs={12}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GroupsIcon color="primary" />
                Étudiants ({students.length})
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {students.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Aucun étudiant dans cette classe
                  </Typography>
                </Box>
              ) : (
                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <Table>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Prénom</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Nom</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map((student, index) => (
                        <TableRow 
                          key={student.id}
                          sx={{ 
                            '&:nth-of-type(odd)': { bgcolor: 'grey.25' },
                            '&:hover': { bgcolor: 'primary.50' }
                          }}
                        >
                          <TableCell>{student.id}</TableCell>
                          <TableCell sx={{ fontWeight: 'medium' }}>{student.firstName}</TableCell>
                          <TableCell sx={{ fontWeight: 'medium' }}>{student.lastName}</TableCell>
                          <TableCell>{student.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Boutons d'action principaux (version mobile) */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 2, mt: 3, flexDirection: 'column' }}>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/classes')}
          sx={{ borderRadius: 2 }}
          fullWidth
        >
          Retour à la liste
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/dashboard/classes/edit/${classItem.id}`)}
          sx={{ borderRadius: 2 }}
          fullWidth
        >
          Modifier
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleOpenDialog}
          sx={{ borderRadius: 2 }}
          fullWidth
        >
          Supprimer
        </Button>
      </Box>

      {/* Dialog de confirmation */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" component="div">
            Confirmer la suppression
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.primary' }}>
            Êtes-vous sûr de vouloir supprimer la classe <strong>{classItem.name}</strong> ? 
            Cette action est irréversible et supprimera toutes les données associées.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClassDetail;