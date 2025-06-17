import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Download,
  School,
  Person,
  CalendarToday,
  Assessment,
  TrendingUp,
  TrendingDown,
  Remove
} from '@mui/icons-material';
import type { Grade } from '../../types/grade.types';
import { gradeService } from '../../services/grade.service';
import { studentService } from '../../services/student.service';
import type { Student } from '../../types/student.types';
import { pdfUtils } from '../../utils/pdf.utils';

const ReportCard: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (studentId) {
      fetchData();
    }
  }, [studentId]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [gradesResponse, studentResponse] = await Promise.all([
        gradeService.getGradesByStudent(Number(studentId)),
        studentService.getStudentById(Number(studentId))
      ]);
      setGrades(gradesResponse);
      setStudent(studentResponse);
    } catch (e: any) {
      setError(e.message || 'Erreur lors du chargement du bulletin');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAverage = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + grade.score, 0);
    return total / grades.length;
  };

  const getAverageColor = (average: number) => {
    if (average >= 16) return 'success';
    if (average >= 12) return 'info';
    if (average >= 10) return 'warning';
    return 'error';
  };

  const getScoreColor = (score: number) => {
    if (score >= 16) return '#4caf50';
    if (score >= 12) return '#2196f3';
    if (score >= 10) return '#ff9800';
    return '#f44336';
  };

  const getTrendIcon = (score: number) => {
    if (score >= 12) return <TrendingUp sx={{ color: 'success.main', fontSize: 20 }} />;
    if (score >= 10) return <Remove sx={{ color: 'warning.main', fontSize: 20 }} />;
    return <TrendingDown sx={{ color: 'error.main', fontSize: 20 }} />;
  };

  const getGradesBySubject = () => {
    const subjectMap = new Map();
    grades.forEach(grade => {
      const key = grade.subjectName;
      if (!subjectMap.has(key)) {
        subjectMap.set(key, []);
      }
      subjectMap.get(key).push(grade);
    });
    return subjectMap;
  };

  const calculateSubjectAverage = (subjectGrades: Grade[]) => {
    const total = subjectGrades.reduce((sum, grade) => sum + grade.score, 0);
    return total / subjectGrades.length;
  };

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      await pdfUtils.generateReportCard({
        studentName: student ? `${student.firstName} ${student.lastName}` : '',
        grades,
        average: calculateAverage().toFixed(2),
        academicYear: grades[0]?.academicYear || '',
        term: grades[0]?.term || ''
      });
    } catch (e: any) {
      setError(e.message || 'Erreur lors de la génération du PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
    }
  };

  if (isLoading) {
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

  if (!student) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Étudiant non trouvé
        </Alert>
      </Container>
    );
  }

  const average = calculateAverage();
  const subjectGrades = getGradesBySubject();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête du bulletin */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 56, height: 56 }}>
                <Person sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" color="primary">
                  Bulletin de Notes
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {student.firstName} {student.lastName}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={pdfLoading ? <CircularProgress size={20} /> : <Download />}
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              size="large"
            >
              {pdfLoading ? 'Génération...' : 'Télécharger PDF'}
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Année Scolaire
                </Typography>
              </Box>
              <Typography variant="h6">
                {grades[0]?.academicYear || 'Non spécifiée'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <School sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Période
                </Typography>
              </Box>
              <Typography variant="h6">
                {grades[0]?.term || 'Non spécifiée'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Assessment sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Nombre d'évaluations
                </Typography>
              </Box>
              <Typography variant="h6">
                {grades.length}
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Moyenne Générale
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  label={`${average.toFixed(2)}/20`}
                  color={getAverageColor(average)}
                  size="medium"
                  sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                />
                <Box sx={{ ml: 1 }}>
                  {getTrendIcon(average)}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Moyennes par matière */}
      {subjectGrades.size > 0 && (
        <Card elevation={2} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Moyennes par Matière
            </Typography>
            <Grid container spacing={2}>
              {Array.from(subjectGrades.entries()).map(([subject, subjectGradeList]) => {
                const subjectAvg = calculateSubjectAverage(subjectGradeList);
                return (
                  <Grid item xs={12} sm={6} md={4} key={subject}>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {subject}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <LinearProgress
                          variant="determinate"
                          value={(subjectAvg / 20) * 100}
                          sx={{
                            flexGrow: 1,
                            mr: 2,
                            height: 8,
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getScoreColor(subjectAvg)
                            }
                          }}
                        />
                        <Typography variant="body2" fontWeight="bold">
                          {subjectAvg.toFixed(2)}/20
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {subjectGradeList.length} évaluation(s)
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tableau détaillé des notes */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Détail des Évaluations
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Matière</strong></TableCell>
                  <TableCell><strong>Note</strong></TableCell>
                  <TableCell><strong>Type</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Commentaires</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grades.length > 0 ? (
                  grades.map((grade) => (
                    <TableRow key={grade.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {grade.subjectName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${grade.score}/20`}
                          size="small"
                          sx={{
                            bgcolor: getScoreColor(grade.score),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={grade.examType}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(grade.gradeDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {grade.comments || 'Aucun commentaire'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Aucune note disponible pour cet étudiant
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ReportCard;