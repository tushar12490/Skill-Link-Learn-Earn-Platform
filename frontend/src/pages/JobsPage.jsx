import { useCallback, useMemo, useEffect, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { applyToJob, createJob, fetchJobs, fetchClientJobs, fetchFreelancerJobs, fetchJobDetails } from '../services/jobService.js';
import { fetchFreelancerApplications, updateApplicationStatus } from '../services/applicationService.js';
import JobCard from '../components/JobCard.jsx';
import AppShell from '../components/AppShell.jsx';
import PageContainer from '../components/PageContainer.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { formatCurrencyRangeInr } from '../utils/currency.js';

dayjs.extend(relativeTime);

const initialJobForm = {
  title: '',
  description: '',
  budget: '',
  skills: ''
};

const proposalStatusChipMap = {
  applied: { color: 'info', label: 'Applied' },
  accepted: { color: 'success', label: 'Accepted' },
  rejected: { color: 'error', label: 'Rejected' }
};

const JobsPage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const userRole = user?.role?.toUpperCase();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialJobForm);
  const [search, setSearch] = useState('');
  const [skillQuery, setSkillQuery] = useState('');
  const [tab, setTab] = useState('all');
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [applications, setApplications] = useState([]);
  const [proposalDialog, setProposalDialog] = useState({
    open: false,
    job: null,
    loading: false,
    error: null,
    items: [],
    actionLoadingId: null
  });
  const [viewMode, setViewMode] = useState('all');
  const [postedJobs, setPostedJobs] = useState([]);
  const [postedLoading, setPostedLoading] = useState(false);
  const [postedError, setPostedError] = useState(null);
  const [postedLoaded, setPostedLoaded] = useState(false);
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [assignedLoading, setAssignedLoading] = useState(false);
  const [assignedError, setAssignedError] = useState(null);
  const [assignedLoaded, setAssignedLoaded] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const createRequested = searchParams.get('create');

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJobs();
      setJobs(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load jobs right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadApplications = useCallback(async () => {
    if (!user || userRole !== 'FREELANCER') {
      setApplications([]);
      return;
    }

    try {
      const data = await fetchFreelancerApplications(user.id);
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications', err);
    }
  }, [user, userRole]);

  const loadPostedJobs = useCallback(async () => {
    if (!user || userRole !== 'CLIENT') {
      setPostedJobs([]);
      setPostedLoaded(false);
      return [];
    }

    setPostedLoading(true);
    setPostedError(null);
    try {
      const data = await fetchClientJobs();
      setPostedJobs(data);
      setPostedLoaded(true);
      return data;
    } catch (err) {
      setPostedError(err.response?.data?.message || 'Unable to load your posted jobs right now.');
      throw err;
    } finally {
      setPostedLoading(false);
    }
  }, [user, userRole]);

  const loadAssignedJobs = useCallback(async () => {
    if (!user || userRole !== 'FREELANCER') {
      setAssignedJobs([]);
      setAssignedLoaded(false);
      return [];
    }

    setAssignedLoading(true);
    setAssignedError(null);
    try {
      const data = await fetchFreelancerJobs();
      setAssignedJobs(data);
      setAssignedLoaded(true);
      return data;
    } catch (err) {
      setAssignedError(err.response?.data?.message || 'Unable to load your assigned jobs right now.');
      throw err;
    } finally {
      setAssignedLoading(false);
    }
  }, [user, userRole]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    if (userRole === 'FREELANCER') {
      loadApplications();
    }
  }, [userRole, loadApplications]);

  useEffect(() => {
    setViewMode('all');
    setPostedJobs([]);
    setPostedLoaded(false);
    setPostedError(null);
    setAssignedJobs([]);
    setAssignedLoaded(false);
    setAssignedError(null);
  }, [user?.id, userRole]);

  useEffect(() => {
    if (createRequested && userRole === 'CLIENT') {
      setOpen(true);
      setSearchParams((prev) => {
        prev.delete('create');
        return prev;
      });
    }
  }, [createRequested, userRole, setSearchParams]);

  const canCreateJob = useMemo(() => userRole === 'CLIENT', [userRole]);
  const canApplyToJobs = useMemo(() => userRole === 'FREELANCER', [userRole]);

  useEffect(() => {
    if (viewMode === 'posted' && canCreateJob && !postedLoaded && !postedLoading) {
      loadPostedJobs().catch(() => {});
    }
    if (viewMode === 'assigned' && canApplyToJobs && !assignedLoaded && !assignedLoading) {
      loadAssignedJobs().catch(() => {});
    }
  }, [viewMode, canCreateJob, canApplyToJobs, postedLoaded, postedLoading, assignedLoaded, assignedLoading, loadPostedJobs, loadAssignedJobs]);

  const isPostedView = viewMode === 'posted';
  const isAssignedView = viewMode === 'assigned';
  const currentJobs = isPostedView ? postedJobs : isAssignedView ? assignedJobs : jobs;
  const currentLoading = isPostedView ? postedLoading : isAssignedView ? assignedLoading : loading;
  const currentError = isPostedView ? postedError : isAssignedView ? assignedError : error;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        title: form.title,
        description: form.description,
        budget: Number(form.budget),
        skills: form.skills
          ? form.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
          : []
      };
      await createJob(payload);
      await loadJobs();
      if (canCreateJob) {
        try {
          await loadPostedJobs();
        } catch (ignored) {
          // already handled via state
        }
      }
      setForm(initialJobForm);
      setOpen(false);
      setSnackbar({ open: true, message: 'Job posted successfully.', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to create job.', severity: 'error' });
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleApply = async (jobId) => {
    try {
      await applyToJob(jobId);
      await loadJobs();
      await loadApplications();
      setSnackbar({ open: true, message: 'Proposal submitted.', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to submit proposal.', severity: 'error' });
    }
  };

  const handleViewApplications = useCallback(async (job) => {
    setProposalDialog({ open: true, job, loading: true, error: null, items: [], actionLoadingId: null });
    try {
      const detail = await fetchJobDetails(job.id);
      setProposalDialog({
        open: true,
        job: detail?.job || job,
        loading: false,
        error: null,
        items: detail?.applications || [],
        actionLoadingId: null
      });
    } catch (err) {
      setProposalDialog({ open: true, job, loading: false, error: err.response?.data?.message || 'Unable to load proposals right now.', items: [], actionLoadingId: null });
    }
  }, [fetchJobDetails]);

  const closeProposalDialog = () => {
    setProposalDialog({ open: false, job: null, loading: false, error: null, items: [], actionLoadingId: null });
  };

  const handleApplicationAction = useCallback(async (applicationId, status) => {
    setProposalDialog((prev) => ({ ...prev, actionLoadingId: applicationId, error: null }));
    try {
      await updateApplicationStatus(applicationId, status);
      const jobId = proposalDialog.job?.id;
      if (jobId) {
        const detail = await fetchJobDetails(jobId);
        setProposalDialog((prev) => ({
          ...prev,
          job: detail?.job || prev.job,
          items: detail?.applications || [],
          actionLoadingId: null
        }));
      } else {
        setProposalDialog((prev) => ({ ...prev, actionLoadingId: null }));
      }
      await loadJobs();
      if (canCreateJob) {
        try {
          await loadPostedJobs();
        } catch (ignored) {
          // already surfaced via state
        }
      }
      if (canApplyToJobs) {
        try {
          await loadAssignedJobs();
        } catch (ignored) {
          // already surfaced via state
        }
      }
      setSnackbar({ open: true, message: `Proposal ${status.toLowerCase()} successfully.`, severity: 'success' });
    } catch (err) {
      setProposalDialog((prev) => ({
        ...prev,
        actionLoadingId: null,
        error: err.response?.data?.message || 'Failed to update proposal status.'
      }));
    }
  }, [proposalDialog.job, loadJobs, canCreateJob, canApplyToJobs, loadPostedJobs, loadAssignedJobs, fetchJobDetails]);

  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const filteredJobs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const normalizedSkillQuery = skillQuery.trim().toLowerCase();

    return currentJobs.filter((job) => {
      const matchesSearch = normalizedSearch
        ? job.title.toLowerCase().includes(normalizedSearch) || job.description.toLowerCase().includes(normalizedSearch)
        : true;
      const matchesSkill = normalizedSkillQuery
        ? (job.requiredSkills || []).some((skill) => skill.toLowerCase().includes(normalizedSkillQuery))
        : true;
      const matchesStatus = tab === 'all' || job.status.toLowerCase() === tab;
      return matchesSearch && matchesSkill && matchesStatus;
    });
  }, [currentJobs, search, skillQuery, tab]);

  const applicationsByJobId = useMemo(() => {
    return applications.reduce((acc, application) => {
      if (application.jobId != null) {
        acc[application.jobId] = application.status;
      }
      return acc;
    }, {});
  }, [applications]);

  const proposalStats = useMemo(() => {
    const items = proposalDialog.items || [];
    if (!items.length) {
      return { total: 0, counts: {} };
    }
    const counts = items.reduce((acc, application) => {
      const status = (application.status || 'APPLIED').toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    return { total: items.length, counts };
  }, [proposalDialog.items]);

  const jobBudgetDisplay = proposalDialog.job?.budget != null
    ? formatCurrencyRangeInr(proposalDialog.job.budget)
    : null;

  const jobStatusLabel = proposalDialog.job?.status
    ? proposalDialog.job.status.replace('_', ' ').toLowerCase()
    : 'open';

  const skillOptions = useMemo(() => {
    const source = viewMode === 'posted' ? postedJobs : viewMode === 'assigned' ? assignedJobs : jobs;
    const allSkills = source.flatMap((job) => job.requiredSkills || []);
    return Array.from(new Set(allSkills.map((skill) => skill.trim()))).filter(Boolean).sort((a, b) => a.localeCompare(b));
  }, [jobs, postedJobs, assignedJobs, viewMode]);

  return (
    <AppShell>
      <PageContainer>
        <Stack spacing={4}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Project marketplace
              </Typography>
              <Typography color="text.secondary">
                Discover opportunities curated for SkillLink talent and teams.
              </Typography>
            </Box>
          {canCreateJob && (
            <Button variant="contained" size="large" onClick={() => setOpen(true)}>
              Post a job
            </Button>
          )}
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
          <TextField
            value={search}
            onChange={handleSearch}
            placeholder="Search by project, skill, or client"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              )
            }}
          />
          <Autocomplete
            freeSolo
            options={skillOptions}
            value={skillQuery}
            onChange={(_, value) => setSkillQuery(value || '')}
            inputValue={skillQuery}
            onInputChange={(_, value) => setSkillQuery(value)}
            sx={{ width: { xs: '100%', md: 240 } }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter by skill"
                placeholder={skillOptions.length ? 'Try React, Spring, UI/UX…' : 'Type a skill'}
              />
            )}
          />
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            textColor="secondary"
            indicatorColor="secondary"
            sx={{ minHeight: 48 }}
          >
            <Tab value="all" label="All" />
            <Tab value="open" label="Open" />
            <Tab value="in_progress" label="In progress" />
            <Tab value="completed" label="Completed" />
          </Tabs>
          {(canCreateJob || canApplyToJobs) && (
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, value) => {
                if (value) {
                  setViewMode(value);
                }
              }}
              size="small"
              color="secondary"
            >
              <ToggleButton value="all">All jobs</ToggleButton>
              {canCreateJob && <ToggleButton value="posted">My postings</ToggleButton>}
              {canApplyToJobs && <ToggleButton value="assigned">Assigned to me</ToggleButton>}
            </ToggleButtonGroup>
          )}
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label={`${currentJobs.length} total`} color="secondary" variant="outlined" />
          <Chip label={`${filteredJobs.length} shown`} variant="outlined" />
          {search && <Chip label={`Search: ${search}`} onDelete={() => setSearch('')} />}
          {skillQuery && <Chip label={`Skill: ${skillQuery}`} onDelete={() => setSkillQuery('')} />}
          {tab !== 'all' && <Chip label={`Status: ${tab.replace('_', ' ')}`} onDelete={() => setTab('all')} />}
        </Stack>

        {currentLoading ? (
          <LoadingState label="Loading opportunities..." />
        ) : currentError ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Alert severity="error" sx={{ display: 'inline-flex' }}>
              {currentError}
            </Alert>
          </Box>
        ) : filteredJobs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6">No matching projects yet</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Adjust your filters or check back soon—new roles land daily.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredJobs.map((job) => (
              <Grid key={job.id} item xs={12} md={6}>
                <JobCard
                  job={job}
                  canApply={canApplyToJobs}
                  onApply={handleApply}
                  applicationStatus={applicationsByJobId[job.id]}
                  isClientView={canCreateJob && job.clientId === user?.id}
                  onViewApplications={handleViewApplications}
                  currentUserId={user?.id}
                />
              </Grid>
            ))}
          </Grid>
        )}
        </Stack>

        <Dialog open={proposalDialog.open} onClose={closeProposalDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {proposalDialog.job ? `Proposals for ${proposalDialog.job.title}` : 'Proposals'}
        </DialogTitle>
        <DialogContent dividers>
          {proposalDialog.loading ? (
            <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
              <CircularProgress color="secondary" />
              <Typography color="text.secondary">Loading proposals...</Typography>
            </Stack>
          ) : proposalDialog.error ? (
            <Alert severity="error">{proposalDialog.error}</Alert>
          ) : proposalDialog.items.length === 0 ? (
            <Typography color="text.secondary">No proposals submitted yet.</Typography>
          ) : (
            <Stack spacing={3}>
              {proposalDialog.job && (
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Project insights
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                    <Chip label={`Status: ${jobStatusLabel}`} color="secondary" sx={{ textTransform: 'capitalize' }} />
                    {jobBudgetDisplay && (
                      <Chip label={`Budget: ${jobBudgetDisplay}`} variant="outlined" />
                    )}
                    <Chip label={`Total proposals: ${proposalStats.total}`} variant="outlined" color="secondary" />
                    <Chip label={`Pending: ${proposalStats.counts.applied || 0}`} variant="outlined" />
                    <Chip label={`Accepted: ${proposalStats.counts.accepted || 0}`} variant="outlined" />
                    <Chip label={`Rejected: ${proposalStats.counts.rejected || 0}`} variant="outlined" />
                  </Stack>
                </Stack>
              )}

              {proposalDialog.items.map((application) => {
                const normalizedStatus = (application.status || 'applied').toLowerCase();
                const chipConfig = proposalStatusChipMap[normalizedStatus] || { color: 'default', label: normalizedStatus };
                const isPending = normalizedStatus === 'applied';
                const isLoading = proposalDialog.actionLoadingId === application.id;
                return (
                  <Stack
                    key={application.id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                    flexWrap="wrap"
                    rowGap={1.5}
                  >
                    <Stack spacing={0.5} minWidth={180} flexGrow={1}>
                      <Typography fontWeight={600}>{application.freelancerName || 'Freelancer'}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Applied {application.appliedAt ? dayjs(application.appliedAt).fromNow() : 'recently'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label={chipConfig.label} color={chipConfig.color} sx={{ textTransform: 'capitalize' }} />
                      {isPending && (
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="contained"
                            color="secondary"
                            disabled={isLoading}
                            onClick={() => handleApplicationAction(application.id, 'ACCEPTED')}
                          >
                            {isLoading ? 'Accepting…' : 'Accept'}
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="inherit"
                            disabled={isLoading}
                            onClick={() => handleApplicationAction(application.id, 'REJECTED')}
                          >
                            {isLoading ? 'Rejecting…' : 'Reject'}
                          </Button>
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeProposalDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Post a job</DialogTitle>
        <Box component="form" onSubmit={handleCreate} noValidate>
          <DialogContent>
            <Stack spacing={2}>
              <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth required />
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                required
                multiline
                minRows={3}
              />
              <TextField
                label="Budget"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                type="number"
                fullWidth
                required
              />
              <TextField
                label="Required skills (comma separated)"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </PageContainer>
    </AppShell>
  );
};

export default JobsPage;
