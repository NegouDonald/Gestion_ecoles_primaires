import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classService } from '../../services/class.service';
import { TextField, Button, MenuItem, Container, Typography, Box, Alert } from '@mui/material';

interface ClassFormData {
  name: string;
  level: string;
  section: string;
  language: string;
  academicYear: string;
  maxCapacity: number | null;
}

interface FormErrors {
  name?: string;
  level?: string;
  section?: string;
  language?: string;
  academicYear?: string;
  maxCapacity?: string;
}

const ClassCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    level: '',
    section: '',
    language: '',
    academicYear: '',
    maxCapacity: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.level.trim()) newErrors.level = 'Le niveau est requis';
    if (!formData.section) newErrors.section = 'La section est requise';
    if (!formData.language) newErrors.language = 'La langue est requise';
    if (!formData.academicYear.trim()) newErrors.academicYear = "L'année académique est requise";
    if (formData.maxCapacity !== null && formData.maxCapacity < 0) {
      newErrors.maxCapacity = 'La capacité doit être positive';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'maxCapacity' ? (value === '' ? null : Number(value)) : value,
    });
    setErrors({ ...errors, [name]: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setServerError(null);
    try {
      await classService.createClass(formData);
      navigate('/dashboard/classes');
    } catch (error: any) {
      setServerError(error.message || 'Erreur lors de la création de la classe');
      console.error('Erreur:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Ajouter une classe
      </Typography>
      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Nom"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          fullWidth
          label="Niveau"
          name="level"
          value={formData.level}
          onChange={handleChange}
          margin="normal"
          required
          error={!!errors.level}
          helperText={errors.level}
        />
        <TextField
          fullWidth
          select
          label="Section"
          name="section"
          value={formData.section}
          onChange={handleChange}
          margin="normal"
          required
          error={!!errors.section}
          helperText={errors.section}
        >
          <MenuItem value="CRECHE">Crèche</MenuItem>
          <MenuItem value="MATERNELLE">Maternelle</MenuItem>
          <MenuItem value="PRIMAIRE">Primaire</MenuItem>
        </TextField>
        <TextField
          fullWidth
          select
          label="Langue"
          name="language"
          value={formData.language}
          onChange={handleChange}
          margin="normal"
          required
          error={!!errors.language}
          helperText={errors.language}
        >
          <MenuItem value="FRANCOPHONE">Francophone</MenuItem>
          <MenuItem value="ANGLOPHONE">Anglophone</MenuItem>
        </TextField>
        <TextField
          fullWidth
          label="Année académique"
          name="academicYear"
          value={formData.academicYear}
          onChange={handleChange}
          margin="normal"
          required
          error={!!errors.academicYear}
          helperText={errors.academicYear}
        />
        <TextField
          fullWidth
          label="Capacité maximale"
          name="maxCapacity"
          type="number"
          value={formData.maxCapacity ?? ''}
          onChange={handleChange}
          margin="normal"
          error={!!errors.maxCapacity}
          helperText={errors.maxCapacity}
          inputProps={{ min: 0 }}
        />
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Créer
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/dashboard/classes')}
            sx={{ ml: 2 }}
          >
            Annuler
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ClassCreate;