import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { equipmentService } from '../../services/equipment.service';
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
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Inventory as InventoryIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Euro as EuroIcon
} from '@mui/icons-material';

interface Equipment {
  id: number;
  name: string;
  description?: string;
  serialNumber: string;
  category?: string;
  brand?: string;
  model?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  warrantyExpiryDate?: string;
  maintenanceDate?: string;
  status: string;
  location?: string;
  assignedTo?: string;
}

const EquipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        if (id) {
          const data = await equipmentService.getEquipmentById(Number(id));
          console.log('Équipement reçu:', data);
          setEquipment(data);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des détails de l\'équipement.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (id) {
        await equipmentService.deleteEquipment(Number(id));
        console.log('Équipement supprimé, redirection vers: /dashboard/equipment');
        navigate('/dashboard/equipment');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de l\'équipement.');
      console.error('Erreur:', err);
    }
    setOpenDialog(false);
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatPrice = (price?: number) => {
    if (price == null) return 'Non spécifié';
    return `${price.toFixed(2)} €`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'actif':
      case 'disponible':
        return 'success';
      case 'maintenance':
      case 'réparation':
        return 'warning';
      case 'hors service':
      case 'défaillant':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Chargement des détails...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error || !equipment) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            boxShadow: theme.shadows[1]
          }}
        >
          {error || 'Équipement non trouvé.'}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/equipment')}
          sx={{ borderRadius: 2 }}
        >
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/equipment')}
          sx={{ 
            mb: 2,
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08)
            }
          }}
        >
          Retour à la liste
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <InventoryIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="600" color="text.primary">
            {equipment.name}
          </Typography>
          <Chip 
            label={equipment.status} 
            color={getStatusColor(equipment.status) as any}
            variant="filled"
            sx={{ fontWeight: 500 }}
          />
        </Box>
        
        <Typography variant="subtitle1" color="text.secondary">
          #{equipment.serialNumber}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Informations principales */}
        <Grid item xs={12} lg={8}>
          <Card elevation={0} sx={{ 
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
              p: 3,
              borderBottom: `1px solid ${theme.palette.divider}`
            }}>
              <Typography variant="h6" fontWeight="600" color="primary.main">
                Informations Générales
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CategoryIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="500">
                      Catégorie
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="500">
                    {equipment.category || 'Non spécifiée'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <InventoryIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="500">
                      Marque
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="500">
                    {equipment.brand || 'Non spécifiée'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="500" sx={{ mb: 1 }}>
                    Modèle
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {equipment.model || 'Non spécifié'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="500">
                      Emplacement
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="500">
                    {equipment.location || 'Non spécifié'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="500">
                      Assigné à
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="500">
                    {equipment.assignedTo || 'Non assigné'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <EuroIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="500">
                      Prix d'achat
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight="500">
                    {formatPrice(equipment.purchasePrice)}
                  </Typography>
                </Grid>
              </Grid>

              {equipment.description && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="500" sx={{ mb: 2 }}>
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    p: 2, 
                    backgroundColor: alpha(theme.palette.grey[500], 0.05),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`
                  }}>
                    {equipment.description}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Dates et maintenance */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Dates importantes */}
            <Card elevation={0} sx={{ 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3
            }}>
              <Box sx={{ 
                background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)}, ${alpha(theme.palette.warning.main, 0.05)})`,
                p: 2,
                borderBottom: `1px solid ${theme.palette.divider}`
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                  <Typography variant="h6" fontWeight="600" color="warning.dark">
                    Dates Importantes
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="500">
                      Date d'achat
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {formatDate(equipment.purchaseDate)}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="500">
                      Expiration garantie
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {formatDate(equipment.warrantyExpiryDate)}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="500">
                      Dernière maintenance
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {formatDate(equipment.maintenanceDate)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card elevation={0} sx={{ 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                  Actions
                </Typography>
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/dashboard/equipment/edit/${equipment.id}`)}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                    fullWidth
                  >
                    Modifier l'équipement
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleOpenDialog}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                    fullWidth
                  >
                    Supprimer
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteIcon sx={{ color: 'error.main' }} />
            <Typography variant="h6" fontWeight="600">
              Confirmer la suppression
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '1rem' }}>
            Êtes-vous sûr de vouloir supprimer l'équipement <strong>{equipment.name}</strong> ? 
            Cette action est irréversible et toutes les données associées seront perdues.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained"
            color="error"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Supprimer définitivement
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EquipmentDetail;