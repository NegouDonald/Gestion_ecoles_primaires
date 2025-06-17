import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { staffService } from '../../services/staff.service';
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
  Chip,
  Divider,
  Card,
  CardContent,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  Fade,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import type { Staff } from '../../types/staff.types';

const StaffDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        if (id) {
          const data = await staffService.getStaffById(Number(id));
          console.log('Personnel reçu:', data);
          setStaff(data);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des détails du personnel.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (id) {
        await staffService.deleteStaff(Number(id));
        console.log('Personnel supprimé, redirection vers: /dashboard/staff');
        navigate('/dashboard/staff');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression du personnel.');
      console.error('Erreur:', err);
    }
    setOpenDialog(false);
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString('fr-FR') : 'Non spécifiée';
  const formatPrice = (price?: number) => price ? `${price.toFixed(2)} €` : 'Non spécifié';

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getGenderColor = (gender?: string) => {
    switch (gender?.toLowerCase()) {
      case 'homme':
      case 'male':
        return 'primary';
      case 'femme':
      case 'female':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
      <Box sx={{ color: theme.palette.primary.main, display: 'flex', alignItems: 'center' }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Chargement des détails...
        </Typography>
      </Container>
    );
  }

  if (error || !staff) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Fade in>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-message': { fontSize: '1.1rem' }
            }}
          >
            {error || 'Personnel non trouvé.'}
          </Alert>
        </Fade>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/staff')}
          size="large"
        >
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in>
        <Box>
          {/* Header avec navigation */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => navigate('/dashboard/staff')}
              sx={{ 
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': { boxShadow: 2 }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Profil du Personnel
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Carte principale avec avatar et infos essentielles */}
            <Grid item xs={12} md={4}>
              <Card 
                elevation={3} 
                sx={{ 
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: theme.palette.primary.main,
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      boxShadow: 3
                    }}
                  >
                    {getInitials(staff.firstName, staff.lastName)}
                  </Avatar>
                  
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {staff.firstName} {staff.lastName}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {staff.position || 'Poste non spécifié'}
                  </Typography>

                  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
                    {staff.role && (
                      <Chip 
                        label={staff.role} 
                        color="primary" 
                        variant="outlined"
                        size="small"
                      />
                    )}
                    {staff.gender && (
                      <Chip 
                        label={staff.gender} 
                        color={getGenderColor(staff.gender) as any}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Stack>

                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="Modifier">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/dashboard/staff/edit/${staff.id}`)}
                        sx={{ 
                          bgcolor: 'background.paper',
                          boxShadow: 1,
                          '&:hover': { boxShadow: 2 }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton
                        color="error"
                        onClick={handleOpenDialog}
                        sx={{ 
                          bgcolor: 'background.paper',
                          boxShadow: 1,
                          '&:hover': { boxShadow: 2 }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Informations détaillées */}
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                {/* Informations personnelles */}
                <Card elevation={2} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="primary" />
                      Informations Personnelles
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <InfoItem 
                          icon={<EmailIcon />}
                          label="Email"
                          value={staff.email}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InfoItem 
                          icon={<PhoneIcon />}
                          label="Téléphone"
                          value={staff.phone || 'Non spécifié'}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InfoItem 
                          icon={<LocationIcon />}
                          label="Adresse"
                          value={staff.address || 'Non spécifiée'}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InfoItem 
                          icon={<CalendarIcon />}
                          label="Date de naissance"
                          value={formatDate(staff.birthDate)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InfoItem 
                          icon={<PersonIcon />}
                          label="Nom d'utilisateur"
                          value={staff.user?.username || 'Non spécifié'}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Informations professionnelles */}
                <Card elevation={2} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkIcon color="primary" />
                      Informations Professionnelles
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <InfoItem 
                          icon={<BusinessIcon />}
                          label="Département"
                          value={staff.department || 'Non spécifié'}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InfoItem 
                          icon={<CalendarIcon />}
                          label="Date d'embauche"
                          value={formatDate(staff.hireDate)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InfoItem 
                          icon={<MoneyIcon />}
                          label="Salaire"
                          value={formatPrice(staff.salary)}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: { borderRadius: 3, minWidth: 400 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '1.1rem' }}>
            Êtes-vous sûr de vouloir supprimer <strong>{staff.firstName} {staff.lastName}</strong> ? 
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined"
            size="large"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            variant="contained"
            size="large"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StaffDetail;