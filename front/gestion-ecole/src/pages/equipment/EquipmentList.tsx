import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { equipmentService } from '../../services/equipment.service';
import { Container, Typography, Box, Button, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';

interface Equipment {
  id: number;
  name: string;
  serialNumber: string;
  status: string;
  category?: string;
}

const EquipmentList: React.FC = () => {
  const navigate = useNavigate();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    category: '',
    status: '',
    location: '',
    serialNumber: '',
  });

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const data = await equipmentService.getAllEquipment();
        setEquipments(data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des équipements.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipments();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const applyFilter = async () => {
    setLoading(true);
    setError(null);
    try {
      let data: Equipment[] = [];
      if (filter.serialNumber) {
        const equipment = await equipmentService.getEquipmentBySerialNumber(filter.serialNumber);
        data = [equipment];
      } else if (filter.category) {
        data = await equipmentService.getEquipmentByCategory(filter.category);
      } else if (filter.status) {
        data = await equipmentService.getEquipmentByStatus(filter.status);
      } else if (filter.location) {
        data = await equipmentService.getEquipmentByLocation(filter.location);
      } else {
        data = await equipmentService.getAllEquipment();
      }
      setEquipments(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'application du filtre.');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: number) => {
    navigate(`/dashboard/equipment/${id}`);
  };

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
        Liste des Équipements
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Numéro de série"
            name="serialNumber"
            value={filter.serialNumber}
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
            label="État"
            name="status"
            select
            value={filter.status}
            onChange={handleFilterChange}
            fullWidth
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="Bon état">Bon état</MenuItem>
            <MenuItem value="En panne">En panne</MenuItem>
            <MenuItem value="En réparation">En réparation</MenuItem>
          </TextField>
          <TextField
            label="Emplacement"
            name="location"
            value={filter.location}
            onChange={handleFilterChange}
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
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Numéro de série</strong></TableCell>
                <TableCell><strong>Catégorie</strong></TableCell>
                <TableCell><strong>État</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipments.length > 0 ? (
                equipments.map(equipment => (
                  <TableRow key={equipment.id}>
                    <TableCell>{equipment.name}</TableCell>
                    <TableCell>{equipment.serialNumber}</TableCell>
                    <TableCell>{equipment.category || 'Non spécifiée'}</TableCell>
                    <TableCell>{equipment.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleViewDetails(equipment.id)}
                      >
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Aucun équipement trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Button
        variant="contained"
        onClick={() => navigate('/dashboard/equipment/create')}
      >
        Ajouter un équipement
      </Button>
    </Container>
  );
};

export default EquipmentList;