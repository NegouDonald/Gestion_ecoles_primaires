import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  TextField,
  CircularProgress,
  Alert,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { disciplineService } from '../../services/discipline.service';
import { studentService } from '../../services/student.service';
import type { DisciplineCreateRequest, DisciplineType } from '../../types/discipline.types';
import { DisciplineTypeDisplayNames } from '../../types/discipline.types'; // Importer comme valeur

// Interface minimale pour les étudiants (basée sur Student.java)
interface Student {
  id: number;
  firstName: string;
  lastName: string;
}

const DisciplineCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DisciplineCreateRequest>({
    studentId: 0,
    type: 'BLAME',
    incidentDate: new Date().toISOString().split('T')[0], // Date du jour
    description: '',
    action: '',
    reportedBy: '',
    resolved: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  // Charger les étudiants au montage du composant
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await studentService.getAllStudents();
        setStudents(response);
      } catch (error: any) {
        setSubmitError(error.message || 'Erreur lors du chargement des étudiants.');
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | number>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof DisciplineCreateRequest]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Validation des champs requis
      if (!formData.studentId || formData.studentId === 0) {
        throw new Error('Veuillez sélectionner un étudiant.');
      }
      if (!formData.type) {
        throw new Error('Veuillez sélectionner un type de mesure disciplinaire.');
      }
      if (!formData.incidentDate) {
        throw new Error('Veuillez spécifier la date de l’incident.');
      }
      if (!formData.description.trim()) {
        throw new Error('Veuillez fournir une description.');
      }

      await disciplineService.createDiscipline(formData);
      navigate('/dashboard/disciplines');
    } catch (e: any) {
      setSubmitError(e.message || 'Erreur lors de la création de la mesure disciplinaire.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Créer une Mesure Disciplinaire
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        {loadingStudents ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required disabled={submitting || students.length === 0}>
                  <InputLabel id="student-label">Étudiant</InputLabel>
                  <Select
                    labelId="student-label"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    label="Étudiant"
                  >
                    <MenuItem value={0} disabled>
                      Sélectionner un étudiant
                    </MenuItem>
                    {students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required disabled={submitting}>
                  <InputLabel id="type-label">Type de mesure</InputLabel>
                  <Select
                    labelId="type-label"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Type de mesure"
                  >
                    {Object.entries(DisciplineTypeDisplayNames).map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date de l'incident"
                  name="incidentDate"
                  type="date"
                  value={formData.incidentDate}
                  onChange={handleChange}
                  required
                  fullWidth
                  disabled={submitting}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Signalé par"
                  name="reportedBy"
                  value={formData.reportedBy}
                  onChange={handleChange}
                  fullWidth
                  disabled={submitting}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                  fullWidth
                  disabled={submitting}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Action prise"
                  name="’action"
                  value={formData.action}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  fullWidth
                  disabled={submitting}
                />
              </Grid>
            </Grid>

            {submitError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {submitError}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button variant="contained" type="submit" disabled={submitting || loadingStudents}>
                {submitting ? <CircularProgress size={24} /> : 'Créer'}
              </Button>
              <Button
                variant="contained"
                color="inherit"
                onClick={() => navigate('/dashboard/disciplines')}
                disabled={submitting || loadingStudents}
              >
                Annuler
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default DisciplineCreate;