import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { purchaseService } from '../../services/purchase.service';
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
  ShoppingCart as ShoppingCartIcon,
  CalendarToday as CalendarIcon,
  Store as StoreIcon,
  Receipt as ReceiptIcon,
  Category as CategoryIcon,
  Euro as EuroIcon,
  Inventory as InventoryIcon,
  Numbers as NumbersIcon
} from '@mui/icons-material';
import type { Purchase } from '../../types/purchase.types';

const PurchaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        if (id) {
          const data = await purchaseService.getPurchaseById(Number(id));
          console.log('Achat reçu:', data);
          setPurchase(data);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des détails de l\'achat.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchase();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (id) {
        await purchaseService.deletePurchase(Number(id));
        console.log('Achat supprimé, redirection vers: /dashboard/purchases');
        navigate('/dashboard/purchases');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de l\'achat.');
      console.error('Erreur:', err);
    }
    setOpenDialog(false);
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const formatPrice = (price: number) => `${price.toFixed(2)} €`;
  const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString('fr-FR') : 'Non spécifiée';

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

  if (error || !purchase) {
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
          {error || 'Achat non trouvé.'}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/purchases')}
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
          onClick={() => navigate('/dashboard/purchases')}
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
          <ShoppingCartIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="600" color="text.primary">
            {purchase.itemName}
          </Typography>
          <Chip 
            label={`${purchase.quantity} unité${purchase.quantity > 1 ? 's' : ''}`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        </Box>
        
        <Typography variant="h5" color="primary.main" fontWeight="600">
          {formatPrice(purchase.totalAmount)}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Informations principales */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            {/* Détails de l'article */}
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
                  Détails de l'Article
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <NumbersIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="500">
                        Quantité
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="500">
                      {purchase.quantity} unité{purchase.quantity > 1 ? 's' : ''}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EuroIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="500">
                        Prix unitaire
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="500">
                      {formatPrice(purchase.unitPrice)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CategoryIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="500">
                        Catégorie
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="500">
                      {purchase.category || 'Non spécifiée'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <StoreIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="500">
                        Fournisseur
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="500">
                      {purchase.supplier || 'Non spécifié'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <ReceiptIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="500">
                        N° de facture
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="500">
                      {purchase.invoiceNumber || 'Non spécifié'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CalendarIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="500">
                        Date d'achat
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="500">
                      {formatDate(purchase.purchaseDate)}
                    </Typography>
                  </Grid>
                </Grid>

                {purchase.description && (
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
                      {purchase.description}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Récapitulatif financier et actions */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            {/* Récapitulatif financier */}
            <Card elevation={0} sx={{ 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3
            }}>
              <Box sx={{ 
                background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.success.main, 0.05)})`,
                p: 2,
                borderBottom: `1px solid ${theme.palette.divider}`
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EuroIcon sx={{ color: 'success.main', fontSize: 20 }} />
                  <Typography variant="h6" fontWeight="600" color="success.dark">
                    Récapitulatif Financier
                  </Typography>
                </Box>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Prix unitaire
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {formatPrice(purchase.unitPrice)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Quantité
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {purchase.quantity}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="600" color="success.main">
                      Total
                    </Typography>
                    <Typography variant="h6" fontWeight="600" color="success.main">
                      {formatPrice(purchase.totalAmount)}
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
                    onClick={() => navigate(`/dashboard/purchases/edit/${purchase.id}`)}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                    fullWidth
                  >
                    Modifier l'achat
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
            Êtes-vous sûr de vouloir supprimer l'achat de <strong>{purchase.itemName}</strong> ? 
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

export default PurchaseDetail;