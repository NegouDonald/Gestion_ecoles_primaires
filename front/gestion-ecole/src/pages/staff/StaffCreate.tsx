import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { staffService } from '../../services/staff.service';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import type { Staff, UserRole, Gender, User } from '../../types/staff.types';
import { UserRoles, Genders } from '../../types/staff.types'; // Import constants

const StaffCreate: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [openUserModal, setOpenUserModal] = useState(false);

  const [formData, setFormData] = useState<Partial<Staff>>({
    firstName: '',
    lastName: '',
    email: '',
    gender: Genders.MALE,
    role: UserRoles.ADMIN_STAFF,
    phone: '',
    address: '',
    birthDate: '',
    hireDate: '',
    position: '',
    department: '',
    salary: 0,
  });

  const [userData, setUserData] = useState<Partial<User>>({
    username: '',
    password: '',
    role: UserRoles.ADMIN_STAFF,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Gère les changements sur le formulaire du personnel
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? parseFloat(value) : value,
    }));
  };

  // Gère les changements sur le formulaire utilisateur (modal)
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value,
      // Synchronisation automatique des champs firstName, lastName, email si modifiés
      ...(name === 'firstName' ? { firstName: value } : {}),
      ...(name === 'lastName' ? { lastName: value } : {}),
      ...(name === 'email' ? { email: value } : {}),
    }));
  };

  // Ouvre le modal utilisateur en pré-remplissant les infos synchronisées
  const handleOpenUserModal = () => {
    setUserData({
      ...userData,
      firstName: formData.firstName ?? '',
      lastName: formData.lastName ?? '',
      email: formData.email ?? '',
      role: formData.role ?? UserRoles.ADMIN_STAFF,
      phone: formData.phone ?? '',
      username: userData.username ?? '',
      password: userData.password ?? '',
    });
    setOpenUserModal(true);
  };

  const handleCloseUserModal = () => {
    setOpenUserModal(false);
  };

  const handleSaveUser = () => {
    setFormData(prev => ({
      ...prev,
      user: userData as User,
    }));
    setOpenUserModal(false);
  };

  // Soumission du formulaire complet
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await staffService.createStaff(formData);
      navigate('/dashboard/staff');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du personnel.');
      console.error('Erreur:', err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Ajouter un Membre du Personnel
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Prénom"
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Nom"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Téléphone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Adresse"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Genre"
                name="gender"
                value={formData.gender || Genders.MALE}
                onChange={handleChange}
                fullWidth
              >
                {Object.values(Genders).map(gender => (
                  <MenuItem key={gender} value={gender}>
                    {gender === Genders.MALE ? 'Masculin' : 'Féminin'}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Rôle"
                name="role"
                value={formData.role || UserRoles.ADMIN_STAFF}
                onChange={handleChange}
                required
                fullWidth
              >
                {Object.values(UserRoles).map(role => (
                  <MenuItem key={role} value={role}>
                    {role
                      .split('_')
                      .map(w => w[0] + w.slice(1).toLowerCase())
                      .join(' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Date de naissance"
                name="birthDate"
                type="date"
                value={formData.birthDate || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Date d'embauche"
                name="hireDate"
                type="date"
                value={formData.hireDate || ''}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Poste"
                name="position"
                value={formData.position || ''}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Département"
                name="department"
                value={formData.department || ''}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Salaire (€)"
                name="salary"
                type="number"
                value={formData.salary ?? ''}
                onChange={handleChange}
                inputProps={{ step: '0.01', min: 0 }}
                fullWidth
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="contained" type="submit">
              Créer
            </Button>
            <Button
              variant="contained"
              color="inherit"
              onClick={() => navigate('/dashboard/staff')}
            >
              Annuler
            </Button>
            <Button variant="contained" color="secondary" onClick={handleOpenUserModal}>
              Ajouter un compte utilisateur
            </Button>
          </Box>
        </form>
      </Paper>

      <Dialog open={openUserModal} onClose={handleCloseUserModal}>
        <DialogTitle>Ajouter un compte utilisateur</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Nom d'utilisateur"
                name="username"
                value={userData.username || ''}
                onChange={handleUserChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mot de passe"
                name="password"
                type="password"
                value={userData.password || ''}
                onChange={handleUserChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Téléphone"
                name="phone"
                value={userData.phone || ''}
                onChange={handleUserChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserModal}>Annuler</Button>
          <Button onClick={handleSaveUser} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StaffCreate;