import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/student.service';
import { classService } from '../../services/class.service';
import { TextField, Button, MenuItem, Container, Typography, Box, Alert, Select, InputLabel, FormControl } from '@mui/material';

interface Class {
  id: number;
  name: string;
}

const StudentCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    section: '',
    language: '',
    academicYear: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    classId: '',
  });
  const [classes, setClasses] = useState<Class[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await classService.getAllClasses();
        setClasses(data);
      } catch (err: any) {
        setError('Erreur lors du chargement des classes');
      }
    };
    fetchClasses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const studentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        section: formData.section,
        language: formData.language,
        academicYear: formData.academicYear,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        parentEmail: formData.parentEmail,
        address: formData.address,
        classId: formData.classId ? Number(formData.classId) : null,
      };
      await studentService.createStudent(studentData);
      navigate('/dashboard/students');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de l\'étudiant');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Ajouter un étudiant
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Prénom"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Nom"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Date de naissance"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Genre</InputLabel>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            label="Genre"
          >
            <MenuItem value="MALE">Masculin</MenuItem>
            <MenuItem value="FEMALE">Féminin</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Section</InputLabel>
          <Select
            name="section"
            value={formData.section}
            onChange={handleChange}
            label="Section"
          >
            <MenuItem value="CRECHE">Crèche</MenuItem>
            <MenuItem value="MATERNELLE">Maternelle</MenuItem>
            <MenuItem value="PRIMAIRE">Primaire</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Langue</InputLabel>
          <Select
            name="language"
            value={formData.language}
            onChange={handleChange}
            label="Langue"
          >
            <MenuItem value="FRANCOPHONE">Francophone</MenuItem>
            <MenuItem value="ANGLOPHONE">Anglophone</MenuItem>
            {/* Ajoutez d'autres valeurs de l'enum Language si nécessaire */}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Année académique"
          name="academicYear"
          value={formData.academicYear}
          onChange={handleChange}
          margin="normal"
          required
          placeholder="2024-2025"
        />
        <TextField
          fullWidth
          label="Nom du parent"
          name="parentName"
          value={formData.parentName}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email du parent"
          name="parentEmail"
          type="email"
          value={formData.parentEmail}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Téléphone du parent"
          name="parentPhone"
          value={formData.parentPhone}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Adresse"
          name="address"
          value={formData.address}
          onChange={handleChange}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Classe</InputLabel>
          <Select
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            label="Classe"
          >
            <MenuItem value="">Aucune</MenuItem>
            {classes.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Créer
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/dashboard/students')}
            sx={{ ml: 2 }}
          >
            Annuler
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default StudentCreate;