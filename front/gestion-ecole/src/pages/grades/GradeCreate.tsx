import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import { Save, Cancel, GradeOutlined } from '@mui/icons-material';
import type { GradeCreateRequest } from '../../types/grade.types';
import { gradeService } from '../../services/grade.service';
import { studentService } from '../../services/student.service';
import { subjectService } from '../../services/subject.service';
import type { Student } from '../../types/student.types';
import type { Subject } from '../../types/subject.types';

const GradeCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<GradeCreateRequest>({
    studentId: 0,
    subjectId: 0,
    score: 0,
    term: '',
    academicYear: '',
    examType: '',
    gradeDate: new Date().toISOString().split('T')[0],
    comments: ''
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      setError(null);
      try {
        const [studentResponse, subjectResponse] = await Promise.all([
          studentService.getAllStudents(),
          subjectService.getAllSubjects()
        ]);
        setStudents(studentResponse);
        setSubjects(subjectResponse);
      } catch (e: any) {
        setError(e.message || 'Erreur lors du chargement des données');
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'studentId' || name === 'subjectId' || name === 'score' 
        ? Number(value) 
        : value 
    }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'studentId' || name === 'subjectId' 
        ? Number(value) 
        : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await gradeService.createGrade(formData);
      navigate('/grades/list');
    } catch (e: any) {
      setError(e.message || "Erreur lors de l'ajout de la note");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 16) return 'success';
    if (score >= 12) return 'info';
    if (score >= 10) return 'warning';
    return 'error';
  };

  const examTypes = [
    { value: 'Devoir', label: 'Devoir', color: '#1976d2' },
    { value: 'Composition', label: 'Composition', color: '#ed6c02' },
    { value: 'Examen', label: 'Examen', color: '#d32f2f' }
  ];

  const terms = [
    'Semestre 1',
    'Semestre 2',
    'Trimestre 1',
    'Trimestre 2',
    'Trimestre 3'
  ];

  if (dataLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <GradeOutlined sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h4" component="h1" color="primary">
                Saisie de Note
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Enregistrez une nouvelle note pour un étudiant
            </Typography>
            <Divider sx={{ mt: 2 }} />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Section Étudiant et Matière */}
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Informations de base
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Élève</InputLabel>
                  <Select
                    value={formData.studentId || ''}
                    label="Élève"
                    onChange={(e) => handleSelectChange('studentId', e.target.value)}
                  >
                    {students.map(student => (
                      <MenuItem key={student.id} value={student.id}>
                        <Box>
                          <Typography variant="body1">
                            {student.firstName} {student.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {student.id}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Matière</InputLabel>
                  <Select
                    value={formData.subjectId || ''}
                    label="Matière"
                    onChange={(e) => handleSelectChange('subjectId', e.target.value)}
                  >
                    {subjects.map(subject => (
                      <MenuItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Section Note et Évaluation */}
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                  Évaluation
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  name="score"
                  label="Note"
                  value={formData.score}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 20, step: 0.01 }}
                  helperText="Note sur 20"
                  InputProps={{
                    endAdornment: formData.score > 0 && (
                      <Chip 
                        label={`${formData.score}/20`}
                        color={getScoreColor(formData.score)}
                        size="small"
                      />
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Type d'examen</InputLabel>
                  <Select
                    value={formData.examType}
                    label="Type d'examen"
                    onChange={(e) => handleSelectChange('examType', e.target.value)}
                  >
                    {examTypes.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: type.color,
                              mr: 1
                            }}
                          />
                          {type.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  name="gradeDate"
                  label="Date de l'évaluation"
                  value={formData.gradeDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Section Période scolaire */}
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                  Période scolaire
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Semestre/Trimestre</InputLabel>
                  <Select
                    value={formData.term}
                    label="Semestre/Trimestre"
                    onChange={(e) => handleSelectChange('term', e.target.value)}
                  >
                    {terms.map(term => (
                      <MenuItem key={term} value={term}>
                        {term}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  name="academicYear"
                  label="Année Scolaire"
                  value={formData.academicYear}
                  onChange={handleChange}
                  placeholder="ex: 2023-2024"
                  helperText="Format: YYYY-YYYY"
                />
              </Grid>

              {/* Section Commentaires */}
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                  Commentaires (optionnel)
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="comments"
                  label="Commentaires sur la performance"
                  value={formData.comments}
                  onChange={handleChange}
                  placeholder="Ajoutez des commentaires sur la performance de l'étudiant..."
                />
              </Grid>

              {/* Boutons d'action */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/grades/list')}
                    startIcon={<Cancel />}
                    size="large"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
                    size="large"
                  >
                    {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default GradeCreate;