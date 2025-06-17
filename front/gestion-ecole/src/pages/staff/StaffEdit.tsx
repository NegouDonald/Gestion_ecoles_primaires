import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { staffService } from '../../services/staff.service';
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
import type { Staff, UserRole, User } from '../../types/staff.types';
import { UserRoles, Genders } from '../../types/staff.types';

type FormData = Partial<Omit<Staff, 'user'>> & {
  user?: Partial<User> & { username: string; role: UserRole };
};

const convertFormDataToStaff = (formData: FormData): Partial<Staff> => ({
  ...formData,
  user: formData.user
    ? {
        username: formData.user.username,
        role: formData.user.role,
        firstName: formData.user.firstName || formData.firstName || '',
        lastName: formData.user.lastName || formData.lastName || '',
        email: formData.user.email || formData.email || '',
        phone: formData.user.phone,
        id: formData.user.id,
        active: formData.user.active,
      }
    : undefined,
});

const StaffEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    gender: undefined,
    role: UserRoles.ADMIN_STAFF,
    birthDate: '',
    hireDate: '',
    position: '',
    department: '',
    salary: 0,
  });

  useEffect(() => {
    if (!id) return;

    const fetchStaff = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await staffService.getStaffById(Number(id));
        if (!data) throw new Error('Personnel non trouvé');

        setStaff(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          gender: data.gender || undefined,
          role: data.role || UserRoles.ADMIN_STAFF,
          birthDate: data.birthDate || '',
          hireDate: data.hireDate || '',
          position: data.position || '',
          department: data.department || '',
          salary: data.salary || 0,
          user: data.user
            ? {
                username: data.user.username || '',
                role: data.user.role || UserRoles.ADMIN_STAFF,
                firstName: data.user.firstName || data.firstName || '',
                lastName: data.user.lastName || data.lastName || '',
                email: data.user.email || data.email || '',
                phone: data.user.phone || data.phone || '',
                id: data.user.id,
                active: data.user.active,
              }
            : undefined,
        });
      } catch (e: any) {
        setError(e.message || 'Erreur lors du chargement des détails du personnel.');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('user.')) {
      const userField = name.split('.')[1];
      setFormData((prev) => {
        const newUser = prev.user
          ? { ...prev.user }
          : { username: '', role: UserRoles.ADMIN_STAFF, firstName: '', lastName: '', email: '' };

        if (['username', 'role', 'firstName', 'lastName', 'email', 'phone'].includes(userField)) {
          (newUser as any)[userField] = userField === 'role' ? (value as UserRole) : value;
        }

        const newFormData: FormData = {
          ...prev,
          user: newUser,
        };

        if (['firstName', 'lastName', 'email'].includes(userField)) {
          (newFormData as any)[userField] = value;
        }

        return newFormData;
      });
    } else {
      setFormData((prev) => {
        const newFormData: FormData = {
          ...prev,
          [name]: name === 'salary' ? parseFloat(value) || 0 : value,
        };

        if (['firstName', 'lastName', 'email', 'role'].includes(name) && prev.user) {
          newFormData.user = {
            ...prev.user,
            [name]: name === 'role' ? (value as UserRole) : value,
          };
        }

        return newFormData;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      if (!id) throw new Error('ID du personnel manquant');

      if (!formData.firstName || !formData.lastName || !formData.email) {
        throw new Error('Merci de remplir tous les champs obligatoires.');
      }

      if (formData.user && !formData.user.username) {
        throw new Error('Le nom d’utilisateur est requis pour les utilisateurs.');
      }

      const staffData = convertFormDataToStaff(formData);
      await staffService.updateStaff(Number(id), staffData);
      navigate('/dashboard/staff');
    } catch (e: any) {
      setSubmitError(e.message || 'Erreur lors de la mise à jour du personnel.');
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

  if (error || !staff) {
    return (
      <Container>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Personnel non trouvé.'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/dashboard/staff')}>
          Retour à la liste
        </Button>
      </Container>
    );
  }

  const isUser = !!formData.user;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Modifier le Personnel
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Prénom"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Nom"
                name="lastName"
                value={formData.lastName}
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
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Téléphone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Adresse"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Genre"
                name="gender"
                value={formData.gender || ''}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="">Non spécifié</MenuItem>
                {Object.values(Genders).map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Rôle"
                name="role"
                value={formData.role || ''}
                onChange={handleChange}
                required
                fullWidth
              >
                {Object.values(UserRoles).map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Date de naissance"
                name="birthDate"
                type="date"
                value={formData.birthDate}
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
                value={formData.hireDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Poste"
                name="position"
                value={formData.position}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Département"
                name="department"
                value={formData.department}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Salaire (€)"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                inputProps={{ step: '0.01', min: 0 }}
                fullWidth
              />
            </Grid>

            {isUser && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nom d'utilisateur"
                  name="user.username"
                  value={formData.user?.username || ''}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
            )}

            {isUser && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Téléphone (Utilisateur)"
                  name="user.phone"
                  value={formData.user?.phone || ''}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            )}
          </Grid>

          {submitError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {submitError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="contained" type="submit" disabled={submitting}>
              {submitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            <Button
              variant="contained"
              color="inherit"
              onClick={() => navigate('/dashboard/staff')}
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

export default StaffEdit;