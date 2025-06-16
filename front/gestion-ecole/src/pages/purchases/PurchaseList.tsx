import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { purchaseService } from '../../services/purchase.service';
import { Container, Typography, Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import type { Purchase } from '../../types/purchase.types';

const PurchaseList: React.FC = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    invoiceNumber: '',
    supplier: '',
    category: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await purchaseService.getAllPurchases();
        setPurchases(data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des achats.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const applyFilter = async () => {
    setLoading(true);
    setError(null);
    try {
      let data: Purchase[] = [];
      if (filter.invoiceNumber) {
        const purchase = await purchaseService.getPurchaseByInvoiceNumber(filter.invoiceNumber);
        data = [purchase];
      } else if (filter.supplier && filter.startDate && filter.endDate) {
        data = await purchaseService.getPurchasesBySupplierAndDateRange(
          filter.supplier,
          filter.startDate,
          filter.endDate
        );
      } else if (filter.category && filter.startDate && filter.endDate) {
        data = await purchaseService.getPurchasesByCategoryAndDateRange(
          filter.category,
          filter.startDate,
          filter.endDate
        );
      } else if (filter.supplier) {
        data = await purchaseService.getPurchasesBySupplier(filter.supplier);
      } else if (filter.category) {
        data = await purchaseService.getPurchasesByCategory(filter.category);
      } else if (filter.startDate && filter.endDate) {
        data = await purchaseService.getPurchasesByDateRange(filter.startDate, filter.endDate);
      } else {
        data = await purchaseService.getAllPurchases();
      }
      setPurchases(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'application du filtre.');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: number) => {
    navigate(`/dashboard/purchases/${id}`);
  };

  const formatPrice = (price: number) => `${price.toFixed(2)} €`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR');

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Liste des Achats
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Numéro de facture"
            name="invoiceNumber"
            value={filter.invoiceNumber}
            onChange={handleFilterChange}
            fullWidth
          />
          <TextField
            label="Fournisseur"
            name="supplier"
            value={filter.supplier}
            onChange={handleFilterChange}
            fullWidth
          />
          <TextField
            label="Catégorie"
            name="category"
            value={filter.category}
            onChange={handleFilterChange}
            fullWidth
          />
          <TextField
            label="Date de début"
            name="startDate"
            type="date"
            value={filter.startDate}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Date de fin"
            name="endDate"
            type="date"
            value={filter.endDate}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <Button variant="contained" onClick={applyFilter}>
            Filtrer
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Article</strong></TableCell>
                <TableCell><strong>Quantité</strong></TableCell>
                <TableCell><strong>Prix unitaire</strong></TableCell>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases.length > 0 ? (
                purchases.map(purchase => (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.itemName}</TableCell>
                    <TableCell>{purchase.quantity}</TableCell>
                    <TableCell>{formatPrice(purchase.unitPrice)}</TableCell>
                    <TableCell>{formatPrice(purchase.totalAmount)}</TableCell>
                    <TableCell>{formatDate(purchase.purchaseDate)}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleViewDetails(purchase.id)}
                      >
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Aucun achat trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Button
        variant="contained"
        onClick={() => navigate('/dashboard/purchases/create')}
      >
        Ajouter un achat
      </Button>
    </Container>
  );
};

export default PurchaseList;