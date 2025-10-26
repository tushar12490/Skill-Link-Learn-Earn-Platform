import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import AppShell from '../components/AppShell.jsx';
import PageContainer from '../components/PageContainer.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { fetchFreelancerApplications } from '../services/applicationService.js';

const statusChipMap = {
  applied: { color: 'info', label: 'Applied' },
  accepted: { color: 'success', label: 'Accepted' },
  rejected: { color: 'error', label: 'Rejected' }
};

dayjs.extend(relativeTime);

const ApplicationsPage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const normalizedRole = user?.role?.toUpperCase();

  const loadApplications = useCallback(async () => {
    if (!user) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFreelancerApplications(user.id);
      setApplications(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load applications right now.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (normalizedRole === 'FREELANCER') {
      loadApplications();
    } else {
      setLoading(false);
    }
  }, [normalizedRole, loadApplications]);

  const filteredApplications = useMemo(() => {
    if (statusFilter === 'all') {
      return applications;
    }
    return applications.filter((application) => (application.status || '').toLowerCase() === statusFilter);
  }, [applications, statusFilter]);

  const statusSummary = useMemo(() => {
    return applications.reduce(
      (acc, application) => {
        const key = (application.status || 'applied').toLowerCase();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {}
    );
  }, [applications]);

  if (!user) {
    return null;
  }

  if (normalizedRole !== 'FREELANCER') {
    return (
      <AppShell>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" gutterBottom>
            Applications are available for freelancers only
          </Typography>
          <Typography color="text.secondary">
            Switch to a freelancer account to track project proposals and decisions here.
          </Typography>
        </Box>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageContainer>
        <Stack spacing={4}>
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={700}>
              Project applications
            </Typography>
            <Typography color="text.secondary" maxWidth="md">
              Track every proposal across the SkillLink marketplace, follow up with clients, and celebrate wins.
            </Typography>
          </Stack>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(148,163,184,0.2)' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Tabs
              value={statusFilter}
              onChange={(_, value) => setStatusFilter(value)}
              textColor="secondary"
              indicatorColor="secondary"
              sx={{ minHeight: 48 }}
            >
              <Tab value="all" label={`All (${applications.length})`} />
              <Tab value="applied" label={`Applied (${statusSummary.applied || 0})`} />
              <Tab value="accepted" label={`Accepted (${statusSummary.accepted || 0})`} />
              <Tab value="rejected" label={`Rejected (${statusSummary.rejected || 0})`} />
            </Tabs>
            <Stack direction="row" spacing={1}>
              <Chip label={`${applications.length} total`} color="secondary" variant="outlined" />
              <Chip label={`${filteredApplications.length} shown`} variant="outlined" />
            </Stack>
          </Stack>
        </Paper>

        {loading ? (
          <LoadingState label="Syncing your latest proposals..." />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : filteredApplications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6">No applications yet</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Submit a proposal on an open project and it will appear here instantly.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredApplications.map((application) => {
              const normalizedStatus = (application.status || 'applied').toLowerCase();
              const chipConfig = statusChipMap[normalizedStatus] || { color: 'default', label: normalizedStatus };
              return (
                <Grid key={application.id} item xs={12}>
                  <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
                    <Stack spacing={2}>
                      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1.5} alignItems={{ md: 'center' }}>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            {application.jobTitle || 'SkillLink opportunity'}
                          </Typography>
                          <Typography color="text.secondary">
                            {application.clientName || 'Client'} • Applied {application.appliedAt ? dayjs(application.appliedAt).fromNow() : 'recently'}
                          </Typography>
                        </Box>
                        <Chip label={chipConfig.label} color={chipConfig.color} sx={{ textTransform: 'capitalize' }} />
                      </Stack>

                      <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                        {application.jobId && (
                          <Chip label={`Job #${application.jobId}`} size="small" variant="outlined" />
                        )}
                        {application.clientName && (
                          <Chip label={application.clientName} size="small" variant="outlined" />
                        )}
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
        </Stack>
      </PageContainer>
    </AppShell>
  );
};

export default ApplicationsPage;
