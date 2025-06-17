import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gradeService } from '../../services/grade.service';
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
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import type { Grade } from '../../types/grade.types';

const GradeList: React.FC = () => {
  const navigate = useNavigate();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [gradeToDelete, setGradeToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchGrades();
  }, []);

  useEffect(() => {
    // Filtrer les notes quand le terme de recherche change
    const filtered = grades.filter(grade =>
      grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.examType.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGrades(filtered);
  }, [grades, searchTerm]);

  const fetchGrades = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await gradeService.getAllGrades();
      setGrades(response);
      setFilteredGrades(response);
    } catch (e: any) {
      setError(e.message || 'Erreur lors du chargement des notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setGradeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (gradeToDelete) {
      try {
        await gradeService.deleteGrade(gradeToDelete);
        setGrades(grades.filter(grade => grade.id !== gradeToDelete));
        setDeleteDialogOpen(false);
        setGradeToDelete(null);
      } catch (e: any) {
        setError(e.message || 'Erreur lors de la suppression');
        setDeleteDialogOpen(false);
        setGradeToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setGradeToDelete(null);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
        <Typography variant="h4">Liste des Notes</Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard/grades/entry')}>
          Ajouter Note
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher par élève, matière, semestre ou type d'examen..."
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="Liste des notes">
          <TableHead>
            <TableRow>
              <TableCell>Élève</TableCell>
              <TableCell>Matière</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Semestre</TableCell>
              <TableCell>Type d'Examen</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGrades.length > 0 ? (
              filteredGrades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>{grade.studentName}</TableCell>
                  <TableCell>{grade.subjectName}</TableCell>
                  <TableCell>
                    <Box 
                      sx={{ 
                        fontWeight: 'bold',
                        color: grade.score >= 10 ? 'success.main' : 'error.main'
                      }}
                    >
                      {grade.score}/20
                    </Box>
                  </TableCell>
                  <TableCell>{grade.term}</TableCell>
                  <TableCell>{grade.examType}</TableCell>
                  <TableCell>{formatDate(grade.gradeDate)}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/grades/edit/${grade.id}`)}
                      aria-label={`Modifier la note ${grade.id}`}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(grade.id)}
                      aria-label={`Supprimer la note ${grade.id}`}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    Aucune note trouvée
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GradeList;