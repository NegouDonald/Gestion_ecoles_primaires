import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { disciplineService } from '../../services/discipline.service';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  TextField,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Person,
  Category,
  CalendarToday,
  Description,
  Assignment,
  ReportProblem,
  CheckCircle,
  Edit,
  Delete,
  ArrowBack,
  Save,
} from '@mui/icons-material';
import type { DisciplineResponse } from '../../types/discipline.types';
import { DisciplineTypeDisplayNames } from '../../types/discipline.types';

const DisciplineDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [discipline, setDiscipline] = useState<DisciplineResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<string>('');
  const [resolving, setResolving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError('ID de mesure disciplinaire invalide.');
      setLoading(false);
      return;
    }

    const fetchDiscipline = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await disciplineService.getDisciplineById(Number(id));
        setDiscipline(data);
      } catch (e: any) {
        setError(e.message || 'Erreur lors du chargement des détails de la mesure disciplinaire.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscipline();
  }, [id]);

  const handleResolve = async () => {
    if (!id || isNaN(Number(id)) || !action.trim()) {
      setError('Veuillez fournir une action de résolution.');
      return;
    }
    setResolving(true);
    setError(null);
    try {
      const updatedDiscipline = await disciplineService.markAsResolved(Number(id), action);
      setDiscipline(updatedDiscipline);
      setAction('');
    } catch (e: any) {
      setError(e.message || 'Erreur lors de la résolution de la mesure disciplinaire.');
    } finally {
      setResolving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || isNaN(Number(id))) {
      setError('ID de mesure disciplinaire invalide.');
      return;
    }
    if (!window.confirm('Voulez-vous vraiment supprimer cette mesure disciplinaire ?')) {
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      await disciplineService.deleteDiscipline(Number(id));
      navigate('/dashboard/disciplines');
    } catch (e: any) {
      setError(e.message || 'Erreur lors de la suppression de la mesure disciplinaire.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Chargement des détails...
        </Typography>
      </Box>
    );
  }

  if (error || !discipline) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            bgcolor: 'error.light',
            color: 'error.contrastText',
            borderRadius: 3
          }}
        >
          <ReportProblem sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />
          <Typography variant="h5" gutterBottom>
            {error || 'Mesure disciplinaire non trouvée'}
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            onClick={() => navigate('/dashboard/disciplines')}
            startIcon={<ArrowBack />}
          >
            Retour à la liste
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            <Assignment sx={{ fontSize: 30 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Mesure Disciplinaire
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              ID: {discipline.id} • {formatDate(discipline.createdAt)}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Chip
            icon={discipline.resolved ? <CheckCircle /> : <ReportProblem />}
            label={discipline.resolved ? 'Résolu' : 'En cours'}
            color={discipline.resolved ? 'success' : 'warning'}
            size="large"
            sx={{ px: 2, py: 1 }}
          />
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Informations principales */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                Informations Générales
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Person sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Étudiant
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        {discipline.studentName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Category sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Type d'incident
                      </Typography>
                      <Chip 
                        label={DisciplineTypeDisplayNames[discipline.type]} 
                        color="secondary"
                        variant="outlined"
                        size="medium"
                      />
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarToday sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date de l'incident
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formatDate(discipline.incidentDate)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ReportProblem sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Signalé par
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {discipline.reportedBy || 'Non spécifié'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Description de l'incident
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    minHeight: 80
                  }}
                >
                  <Typography variant="body1">
                    {discipline.description}
                  </Typography>
                </Paper>
              </Box>
              
              {discipline.action && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Action prise
                  </Typography>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'success.light',
                      borderColor: 'success.main',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="body1">
                      {discipline.action}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Actions et résolution */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Actions rapides */}
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                  Actions
                </Typography>
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/dashboard/disciplines/${id}/edit`)}
                    disabled={resolving || deleting}
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    startIcon={<Delete />}
                    onClick={handleDelete}
                    disabled={resolving || deleting}
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    {deleting ? <CircularProgress size={24} /> : 'Supprimer'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    disabled={resolving || deleting}
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Retour
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Résolution */}
            {!discipline.resolved && (
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'success.main', fontWeight: 600 }}>
                    Résoudre l'incident
                  </Typography>
                  <TextField
                    label="Action de résolution"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                    disabled={resolving || deleting}
                    sx={{ mb: 2 }}
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<Save />}
                    onClick={handleResolve}
                    disabled={resolving || deleting || !action.trim()}
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    {resolving ? <CircularProgress size={24} /> : 'Marquer comme résolu'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mt: 3, 
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontSize: '1rem'
            }
          }}
        >
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default DisciplineDetails;