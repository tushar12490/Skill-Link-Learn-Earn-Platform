import { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { updateProfile } from '../services/userService.js';
import { useAuth } from '../context/AuthContext.jsx';
import AppShell from '../components/AppShell.jsx';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ name: '', bio: '', skills: '', isMentor: false });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? '',
        bio: user.bio ?? '',
        skills: user.skills ?? '',
        isMentor: user.isMentor ?? false
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess(false);
    setError(null);
    try {
      await updateProfile(user.id, form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const initials = user?.name
    ?.split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  return (
    <AppShell>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Profile & identity
          </Typography>
          <Typography color="text.secondary">
            Curate your presence. Align your narrative with the opportunities you want.
          </Typography>
        </Box>

        {success && <Alert severity="success">Profile updated successfully.</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid rgba(148,163,184,0.2)' }}>
              <Stack spacing={2} alignItems="center" textAlign="center">
                <Avatar sx={{ width: 96, height: 96, bgcolor: 'secondary.main', color: 'secondary.contrastText', fontSize: 32 }}>
                  {initials || 'SL'}
                </Avatar>
                <Typography variant="h6">{user?.name}</Typography>
                <Typography color="text.secondary">{user?.email}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Role • {user?.role?.toUpperCase()}
                </Typography>
                <Button variant="outlined" color="error" onClick={logout} sx={{ borderRadius: 2 }}>
                  Logout
                </Button>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: '1px solid rgba(148,163,184,0.2)' }}>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={3}>
                  <TextField label="Full name" name="name" value={form.name} onChange={handleChange} fullWidth required />
                  <TextField
                    label="Bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    minRows={4}
                    placeholder="Share your impact, collaborations, and current focus."
                  />
                  <TextField
                    label="Skills"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    helperText="Comma separated e.g. product strategy, react, mentoring"
                    fullWidth
                  />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button type="submit" variant="contained" size="large" sx={{ borderRadius: 2 }}>
                      Save changes
                    </Button>
                    <Button variant="outlined" size="large" sx={{ borderRadius: 2 }} onClick={() => setForm({
                      name: user?.name ?? '',
                      bio: user?.bio ?? '',
                      skills: user?.skills ?? '',
                      isMentor: user?.isMentor ?? false
                    })}>
                      Reset edits
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </AppShell>
  );
};

export default ProfilePage;
