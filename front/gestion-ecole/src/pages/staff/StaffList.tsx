import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { staffService } from '../../services/staff.service';
import { Container, Typography, Box, Button, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, TablePagination } from '@mui/material';
import type { Staff, Gender } from '../../types/staff.types';
import { UserRoles } from '../../types/staff.types';

const StaffList: React.FC = () => {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    search: '',
    department: '',
    position: '',
    role: '',
    email: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await staffService.getStaffBySearch(filter.search, { page, size: rowsPerPage });
        setStaffList(response.content);
        setTotalElements(response.totalElements);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement du personnel.');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [page, rowsPerPage, filter.search]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
    setPage(0); // Réinitialiser la page lors d'un changement de filtre
  };

  const applyFilter = async () => {
    setLoading(true);
    setError(null);
    try {
      let data: Staff[] = [];
      if (filter.email) {
        const staff = await staffService.getStaffByEmail(filter.email);
        data = [staff];
        setTotalElements(1);
      } else if (filter.department) {
        data = await staffService.getStaffByDepartment(filter.department);
        setTotalElements(data.length);
      } else if (filter.position) {
        data = await staffService.getStaffByPosition(filter.position);
        setTotalElements(data.length);
      } else if (filter.role) {
        data = await staffService.getStaffByRole(filter.role);
        setTotalElements(data.length);
      } else {
        const response = await staffService.getStaffBySearch(filter.search, { page, size: rowsPerPage });
        data = response.content;
        setTotalElements(response.totalElements);
      }
      setStaffList(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'application du filtre.');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (id: number) => {
    navigate(`/dashboard/staff/${id}`);
  };

  const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString('fr-FR') : 'Non spécifiée';

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
        Liste du Personnel
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Recherche (nom, prénom)"
            name="search"
            value={filter.search}
            onChange={handleFilterChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={filter.email}
            onChange={handleFilterChange}
            fullWidth
          />
          <TextField
            label="Département"
            name="department"
            value={filter.department}
            onChange={handleFilterChange}
            fullWidth
          />
          <TextField
            label="Poste"
            name="position"
            value={filter.position}
            onChange={handleFilterChange}
            fullWidth
          />
          <TextField
            select
            label="Rôle"
            name="role"
            value={filter.role}
            onChange={handleFilterChange}
            fullWidth
          >
            <MenuItem value="">Tous</MenuItem>
            {Object.values(UserRoles).map(role => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </TextField>
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
                <TableCell><strong>Prénom</strong></TableCell>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Département</strong></TableCell>
                <TableCell><strong>Poste</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staffList.length > 0 ? (
                staffList.map(staff => (
                  <TableRow key={staff.id}>
                    <TableCell>{staff.firstName}</TableCell>
                    <TableCell>{staff.lastName}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.department || 'Non spécifié'}</TableCell>
                    <TableCell>{staff.position || 'Non spécifié'}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleViewDetails(staff.id)}
                      >
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Aucun personnel trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page :"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`}
        />
      </Paper>
      <Button
        variant="contained"
        onClick={() => navigate('/dashboard/staff/create')}
      >
        Ajouter un membre du personnel
      </Button>
    </Container>
  );
};

export default StaffList;