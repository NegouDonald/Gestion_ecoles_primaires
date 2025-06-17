import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { disciplineService } from '../../services/discipline.service';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import type { DisciplineResponse, DisciplineCreateRequest, DisciplineType } from '../../types/discipline.types';
import { DisciplineTypeDisplayNames } from '../../types/discipline.types';

type FormData = {
  studentId: number | '';
  type: DisciplineType | '';
  incidentDate: string;
  description: string;
  action: string;
  reportedBy: string;
  resolved: boolean;
};

const DisciplineEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    studentId: '',
    type: '',
    incidentDate: '',
    description: '',
    action: '',
    reportedBy: '',
    resolved: false,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      setError("Aucun ID fourni. Impossible de modifier une mesure disciplinaire sans identifiant.");
      setLoading(false);
      return;
    }

    const fetchDiscipline = async () => {
      try {
        const data = await disciplineService.getDisciplineById(Number(id));
        if (!data) throw new Error('Mesure disciplinaire non trouvée');

        setFormData({
          studentId: data.studentId || '',
          type: data.type || '',
          incidentDate: data.incidentDate || '',
          description: data.description || '',
          action: data.action || '',
          reportedBy: data.reportedBy || '',
          resolved: data.resolved || false,
        });
      } catch (e: any) {
        setError(e.message || 'Erreur lors du chargement de la mesure disciplinaire.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscipline();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'studentId' ? (value ? Number(value) : '') : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      if (!formData.studentId || !formData.type || !formData.incidentDate || !formData.description) {
        throw new Error('Merci de remplir tous les champs obligatoires.');
      }

      const disciplineData: DisciplineCreateRequest = {
        studentId: Number(formData.studentId),
        type: formData.type as DisciplineType,
        incidentDate: formData.incidentDate,
        description: formData.description,
        action: formData.action || undefined,
        reportedBy: formData.reportedBy || undefined,
        resolved: formData.resolved,
      };

      await disciplineService.updateDiscipline(Number(id), disciplineData);
      navigate('/dashboard/disciplines');
    } catch (e: any) {
      setSubmitError(e.message || 'Erreur lors de la mise à jour de la mesure disciplinaire.');
    } finally {
      setSubmitting(false);
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
        <Button variant="contained" onClick={() => navigate('/dashboard/disciplines')}>
          Retour à la liste
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Modifier la Mesure Disciplinaire
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="ID de l'Étudiant"
                name="studentId"
                type="number"
                value={formData.studentId}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Type de Mesure"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                fullWidth
              >
                <MenuItem value="">Sélectionner un type</MenuItem>
                {Object.entries(DisciplineTypeDisplayNames).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Date de l'Incident"
                name="incidentDate"
                type="date"
                value={formData.incidentDate}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={4}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Action Prise"
                name="action"
                value={formData.action}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Signalé par"
                name="reportedBy"
                value={formData.reportedBy}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Résolu"
                name="resolved"
                value={formData.resolved.toString()}
                onChange={(e) => setFormData((prev) => ({ ...prev, resolved: e.target.value === 'true' }))}
                fullWidth
              >
                <MenuItem value="true">Oui</MenuItem>
                <MenuItem value="false">Non</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {submitError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {submitError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="contained" type="submit" disabled={submitting}>
              {submitting ? 'Mise à jour...' : 'Enregistrer'}
            </Button>
            <Button
              variant="contained"
              color="inherit"
              onClick={() => navigate('/dashboard/disciplines')}
              disabled={submitting}
            >
              Annuler
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default DisciplineEdit;
