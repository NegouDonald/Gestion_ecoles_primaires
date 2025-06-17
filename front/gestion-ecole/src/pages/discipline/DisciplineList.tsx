import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { disciplineService } from '../../services/discipline.service';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  TablePagination,
} from '@mui/material';
import type { DisciplineResponse } from '../../types/discipline.types';
import { DisciplineTypeDisplayNames } from '../../types/discipline.types';

const DisciplineList: React.FC = () => {
  const navigate = useNavigate();
  const [disciplines, setDisciplines] = useState<DisciplineResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalElements, setTotalElements] = useState<number>(0);

  useEffect(() => {
    const fetchDisciplines = async () => {
      setLoading(true);
      setError(null);
      try {
        const pageable = { page, size: rowsPerPage, sort: 'createdAt,desc' };
        const response = await disciplineService.getAllDisciplines(pageable);
        setDisciplines(response.content);
        setTotalElements(response.totalElements);
      } catch (e: any) {
        setError(e.message || 'Erreur lors du chargement des mesures disciplinaires.');
      } finally {
        setLoading(false);
      }
    };

    fetchDisciplines();
  }, [page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Liste des Mesures Disciplinaires</Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard/disciplines/new')}>
          Nouvelle Mesure
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="Liste des mesures disciplinaires">
          <TableHead>
            <TableRow>
              <TableCell>Étudiant</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date de l'Incident</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Résolu</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {disciplines.map((discipline) => (
              <TableRow key={discipline.id}>
                <TableCell>{discipline.studentName}</TableCell>
                <TableCell>{DisciplineTypeDisplayNames[discipline.type]}</TableCell>
                <TableCell>{formatDate(discipline.incidentDate)}</TableCell>
                <TableCell>{discipline.description}</TableCell>
                <TableCell>{discipline.resolved ? 'Oui' : 'Non'}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => navigate(`/dashboard/disciplines/${discipline.id}`)}
                    aria-label={`Voir les détails de la mesure disciplinaire ${discipline.id}`}
                  >
                    Détails
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Container>
  );
};

export default DisciplineList;