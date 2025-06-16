import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { purchaseService } from '../../services/purchase.service';
import { Container, Typography, Box, Button, Grid, TextField, CircularProgress, Alert, Paper } from '@mui/material';
import type { Purchase } from '../../types/purchase.types';

const PurchaseEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Purchase>>({
    itemName: '',
    quantity: 1,
    unitPrice: 0,
    purchaseDate: '',
  });

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        if (id) {
          const data = await purchaseService.getPurchaseById(Number(id));
          console.log('Achat reçu:', data);
          setPurchase(data);
          setFormData({
            itemName: data.itemName,
            description: data.description || '',
            quantity: data.quantity,
            unitPrice: data.unitPrice,
            purchaseDate: data.purchaseDate,
            supplier: data.supplier || '',
            category: data.category || '',
            invoiceNumber: data.invoiceNumber || '',
          });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : name === 'unitPrice' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await purchaseService.updatePurchase(Number(id), formData);
        console.log('Achat mis à jour, redirection vers: /dashboard/purchases');
        navigate('/dashboard/purchases');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour de l\'achat.');
      console.error('Erreur:', err);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !purchase) {
    return (
      <Container>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Achat non trouvé.'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/dashboard/purchases')}>
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Modifier l'Achat
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nom de l'article"
                name="itemName"
                value={formData.itemName || ''}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantité"
                name="quantity"
                type="number"
                value={formData.quantity || 1}
                onChange={handleChange}
                required
                inputProps={{ min: 1 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Prix unitaire (€)"
                name="unitPrice"
                type="number"
                value={formData.unitPrice || 0}
                onChange={handleChange}
                required
                inputProps={{ step: '0.01', min: 0 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date d'achat"
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate || ''}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fournisseur"
                name="supplier"
                value={formData.supplier || ''}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Catégorie"
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Numéro de facture"
                name="invoiceNumber"
                value={formData.invoiceNumber || ''}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="contained" type="submit">
              Enregistrer
            </Button>
            <Button variant="contained" color="inherit" onClick={() => navigate('/dashboard/purchases')}>
              Annuler
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default PurchaseEdit;