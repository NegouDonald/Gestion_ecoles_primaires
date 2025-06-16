import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { equipmentService } from '../../services/equipment.service';
import { Container, Typography, Box, Button, Grid, TextField, MenuItem, CircularProgress, Alert, Paper } from '@mui/material';

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

const statusOptions = [
  { value: 'Bon état', label: 'Bon état' },
  { value: 'En panne', label: 'En panne' },
  { value: 'En réparation', label: 'En réparation' },
];

const EquipmentEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Equipment>>({
    name: '',
    serialNumber: '',
    status: 'Bon état',
  });

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        if (id) {
          const data = await equipmentService.getEquipmentById(Number(id));
          console.log('Équipement reçu:', data);
          setEquipment(data);
          setFormData({
            name: data.name,
            description: data.description || '',
            serialNumber: data.serialNumber,
            category: data.category || '',
            brand: data.brand || '',
            model: data.model || '',
            purchasePrice: data.purchasePrice,
            purchaseDate: data.purchaseDate || '',
            warrantyExpiryDate: data.warrantyExpiryDate || '',
            maintenanceDate: data.maintenanceDate || '',
            status: data.status,
            location: data.location || '',
            assignedTo: data.assignedTo || '',
          });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await equipmentService.updateEquipment(Number(id), formData);
        console.log('Équipement mis à jour, redirection vers: /dashboard/equipment');
        navigate('/dashboard/equipment');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour de l\'équipement.');
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

  if (error || !equipment) {
    return (
      <Container>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Équipement non trouvé.'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/dashboard/equipment')}>
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Modifier l'Équipement
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nom"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Numéro de série"
                name="serialNumber"
                value={formData.serialNumber || ''}
                onChange={handleChange}
                required
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
                label="Marque"
                name="brand"
                value={formData.brand || ''}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Modèle"
                name="model"
                value={formData.model || ''}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Prix d'achat (€)"
                name="purchasePrice"
                type="number"
                value={formData.purchasePrice || ''}
                onChange={handleChange}
                inputProps={{ step: '0.01' }}
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
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Expiration de la garantie"
                name="warrantyExpiryDate"
                type="date"
                value={formData.warrantyExpiryDate || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date de maintenance"
                name="maintenanceDate"
                type="date"
                value={formData.maintenanceDate || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="État"
                name="status"
                value={formData.status || 'Bon état'}
                onChange={handleChange}
                required
                fullWidth
              >
                {statusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Emplacement"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Assigné à"
                name="assignedTo"
                value={formData.assignedTo || ''}
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
            <Button variant="contained" color="inherit" onClick={() => navigate('/dashboard/equipment')}>
              Annuler
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EquipmentEdit;