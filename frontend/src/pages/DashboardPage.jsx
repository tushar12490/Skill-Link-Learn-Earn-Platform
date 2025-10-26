import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AppShell from '../components/AppShell.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { fetchJobs } from '../services/jobService.js';
import { fetchCourses } from '../services/courseService.js';
import { fetchFreelancerApplications } from '../services/applicationService.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { formatCurrencyInr, formatCurrencyRangeInr } from '../utils/currency.js';

dayjs.extend(relativeTime);

const CARD_BACKGROUNDS = {
  primary: 'linear-gradient(135deg, rgba(56,189,248,0.2) 0%, rgba(59,130,246,0.05) 100%)',
  secondary: 'linear-gradient(135deg, rgba(167,139,250,0.2) 0%, rgba(129,140,248,0.05) 100%)',
  tertiary: 'linear-gradient(135deg, rgba(251,191,36,0.25) 0%, rgba(251,146,60,0.08) 100%)'
};

const BUDGET_FRIENDLY_THRESHOLD_INR = 4000;
const BUDGET_FRIENDLY_LABEL = 'Under ₹4K';

const DashboardPage = () => {
  const { user } = useAuth();
  const userRole = user?.role?.toUpperCase();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const jobsPromise = fetchJobs();
        const coursesPromise = fetchCourses();
        const applicationsPromise = userRole === 'FREELANCER'
          ? fetchFreelancerApplications(user.id)
          : Promise.resolve([]);

        const [jobsData, coursesData, applicationsData] = await Promise.all([
          jobsPromise,
          coursesPromise,
          applicationsPromise
        ]);

        if (!active) {
          return;
        }

        setJobs(jobsData);
        setCourses(coursesData);
        setApplications(applicationsData);
      } catch (err) {
        if (!active) {
          return;
        }
        setError(err.response?.data?.message || 'Unable to load your workspace right now.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, [user]);

  const formatStatus = (value) => (value || 'OPEN').toLowerCase().replace(/_/g, ' ');

  const normalizedJobs = useMemo(
    () => jobs.map((job) => ({ ...job, status: (job.status || 'OPEN').toUpperCase() })),
    [jobs]
  );

  const userSkills = useMemo(() => {
    if (!user?.skills) {
      return [];
    }
    return user.skills
      .split(',')
      .map((skill) => skill.trim().toLowerCase())
      .filter(Boolean);
  }, [user]);

  const myJobs = useMemo(() => {
    if (!user || userRole !== 'CLIENT') {
      return [];
    }
    return normalizedJobs.filter((job) => job.clientId === user.id);
  }, [normalizedJobs, user, userRole]);

  const matchedJobs = useMemo(() => {
    if (!user || userRole !== 'FREELANCER') {
      return [];
    }
    const openJobs = normalizedJobs.filter((job) => job.status === 'OPEN');
    if (userSkills.length === 0) {
      return openJobs;
    }
    return openJobs
      .filter((job) => (job.requiredSkills || []).some((skill) => userSkills.includes(skill.toLowerCase())))
      .sort((a, b) => Number(b.budget ?? 0) - Number(a.budget ?? 0));
  }, [normalizedJobs, user, userRole, userSkills]);

  const activeApplications = useMemo(
    () => applications.filter((application) => (application.status || '').toUpperCase() === 'APPLIED'),
    [applications]
  );

  const wonApplications = useMemo(
    () => applications.filter((application) => ['ACCEPTED', 'HIRED'].includes((application.status || '').toUpperCase())),
    [applications]
  );

  const recentApplications = useMemo(() => (
    [...applications]
      .sort((a, b) => new Date(b.appliedAt ?? 0) - new Date(a.appliedAt ?? 0))
      .slice(0, 3)
  ), [applications]);

  const actions = useMemo(() => {
    if (!user) return [];
    switch (userRole) {
      case 'CLIENT':
        return [
          { label: 'Post a Job', path: '/jobs?create=true' },
          { label: 'Manage Jobs', path: '/jobs?tab=open' }
        ];
      case 'FREELANCER':
        return [
          { label: 'Browse Jobs', path: '/jobs?tab=open' },
          { label: 'Create Course', path: '/courses?create=true' }
        ];
      case 'LEARNER':
      default:
        return [
          { label: 'Browse Courses', path: '/courses' },
          { label: 'View Profile', path: '/profile' }
        ];
    }
  }, [user, userRole]);
  const highlightCards = useMemo(() => {
    if (!user) {
      return [];
    }

  if (userRole === 'CLIENT') {
      const openCount = myJobs.filter((job) => job.status === 'OPEN').length;
      const inProgressCount = myJobs.filter((job) => job.status === 'IN_PROGRESS').length;
      const completedCount = myJobs.filter((job) => job.status === 'COMPLETED').length;

      return [
        {
          title: 'Open roles',
          metric: `${openCount} open`,
          description: 'Active briefs awaiting proposals.',
          accent: CARD_BACKGROUNDS.primary
        },
        {
          title: 'In delivery',
          metric: `${inProgressCount} active`,
          description: 'Collaborations moving toward milestones.',
          accent: CARD_BACKGROUNDS.secondary
        },
        {
          title: 'Completed',
          metric: `${completedCount} done`,
          description: 'Projects wrapped with learning insights.',
          accent: CARD_BACKGROUNDS.tertiary
        }
      ];
    }

  if (userRole === 'FREELANCER') {
      return [
        {
          title: 'Matching gigs',
          metric: `${matchedJobs.length} matches`,
          description: 'Open roles aligned with your strengths.',
          accent: CARD_BACKGROUNDS.primary
        },
        {
          title: 'Pipeline',
          metric: `${activeApplications.length} active`,
          description: 'Proposals awaiting client response.',
          accent: CARD_BACKGROUNDS.secondary
        },
        {
          title: 'Wins',
          metric: `${wonApplications.length} secured`,
          description: 'Projects where you were selected.',
          accent: CARD_BACKGROUNDS.tertiary
        }
      ];
    }

    const totalCourses = courses.length;
    const mentorCount = new Set(courses.map((course) => course.mentorName).filter(Boolean)).size;
    const budgetFriendly = courses.filter((course) => {
      const numeric = Number(course.price);
      return !Number.isNaN(numeric) && numeric <= BUDGET_FRIENDLY_THRESHOLD_INR;
    }).length;

    return [
      {
        title: 'Courses to explore',
        metric: `${totalCourses} courses`,
        description: 'Fresh sessions ready to join.',
        accent: CARD_BACKGROUNDS.primary
      },
      {
        title: 'Mentors available',
        metric: `${mentorCount} mentors`,
        description: 'Guides ready for your next leap.',
        accent: CARD_BACKGROUNDS.secondary
      },
      {
        title: 'Budget-friendly picks',
        metric: `${budgetFriendly} picks`,
        description: 'Priced under ₹4,000 for quick wins.',
        accent: CARD_BACKGROUNDS.tertiary
      }
    ];
  }, [user, userRole, myJobs, matchedJobs, activeApplications, wonApplications, courses]);

  const momentumItems = useMemo(() => {
    if (!user) {
      return [];
    }

    if (userRole === 'CLIENT') {
      const items = [...myJobs]
        .sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))
        .slice(0, 3)
        .map((job) => ({
          title: job.title,
          subtitle: `Status • ${formatStatus(job.status)}`,
          chips: [
            `Budget ${formatCurrencyRangeInr(job.budget)}`,
            ...(job.requiredSkills || []).slice(0, 2)
          ]
        }));

      if (items.length === 0) {
        return [
          {
            title: 'No projects yet',
            subtitle: 'Post a job to start collaborating.',
            chips: ['Get started']
          }
        ];
      }

      return items;
    }
    if (userRole === 'FREELANCER') {
      const items = matchedJobs.slice(0, 3).map((job) => ({
        title: job.title,
        subtitle: `${job.clientName || 'Client'} • ${formatCurrencyRangeInr(job.budget)}`,
        chips: (job.requiredSkills || []).slice(0, 3)
      }));

      if (items.length === 0) {
        return [
          {
            title: 'No tailored matches yet',
            subtitle: 'Refresh your skills to unlock curated briefs.',
            chips: ['Update profile']
          }
        ];
      }

      return items;
    }

    const curatedCourses = courses
      .slice()
      .sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))
      .slice(0, 3)
      .map((course) => {
        const chips = [course.mentorName || 'Mentor'];
        const numeric = Number(course.price);
        if (!Number.isNaN(numeric)) {
          chips.push(numeric <= BUDGET_FRIENDLY_THRESHOLD_INR ? BUDGET_FRIENDLY_LABEL : 'Premium');
        }
        if (course.videoUrl) {
          chips.push('On-demand');
        }
        return {
          title: course.title,
          subtitle: `${course.mentorName || 'SkillLink mentor'} • ${formatCurrencyInr(course.price)}`,
          chips
        };
      });

    if (curatedCourses.length === 0) {
      return [
        {
          title: 'No courses yet',
          subtitle: 'Check back soon for new drops curated weekly.',
          chips: ['Coming soon']
        }
      ];
    }

    return curatedCourses;
  }, [user, userRole, myJobs, matchedJobs, courses]);

  const freelancerRecommendations = useMemo(() => matchedJobs.slice(0, 4), [matchedJobs]);

  const clientPortfolio = useMemo(() => myJobs.slice(0, 4), [myJobs]);

  const learnerSpotlight = useMemo(
    () => courses.slice().sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0)).slice(0, 4),
    [courses]
  );

  return (
    <AppShell>
      <Stack spacing={5}>
        <Box>
          <Typography variant="h3" fontWeight={600} gutterBottom>
            Welcome back, {user?.name?.split(' ')[0] || 'SkillLinker'}
          </Typography>
          <Typography color="text.secondary" maxWidth="sm">
            Your {user?.role?.toLowerCase()} toolkit is ready—track workstreams, nurture relationships, and grow your influence across freelancing and learning.
          </Typography>
        </Box>

        {loading ? (
          <LoadingState label="Preparing your dashboard..." />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Stack spacing={4}>
            <Grid container spacing={3}>
              {highlightCards.map((card) => (
                <Grid item xs={12} md={4} key={card.title}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      background: card.accent,
                      borderRadius: 3,
                      border: '1px solid rgba(148,163,184,0.2)'
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" letterSpacing={1}>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>
                      {card.metric}
                    </Typography>
                    <Typography color="text.secondary">{card.description}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h5" fontWeight={600} gutterBottom>
                        Take your next step
                      </Typography>
                      <Typography color="text.secondary">
                        Quick actions tailored to your current journey.
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {actions.map((action) => (
                        <Grid item xs={12} sm={6} key={action.label}>
                          <Button
                            fullWidth
                            size="large"
                            variant="outlined"
                            sx={{
                              justifyContent: 'space-between',
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600
                            }}
                            onClick={() => navigate(action.path)}
                          >
                            {action.label}
                            <Typography component="span" fontSize={12} color="text.secondary">
                              Go →
                            </Typography>
                          </Button>
                        </Grid>
                      ))}
                      {actions.length === 0 && (
                        <Grid item xs={12}>
                          <Typography color="text.secondary">No quick actions yet—complete onboarding to unlock recommendations.</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Momentum builders
                  </Typography>
                  <Stack spacing={2}>
                    {momentumItems.map((item) => (
                      <Box key={item.title} sx={{ p: 2.5, borderRadius: 2, backgroundColor: 'rgba(148,163,184,0.1)' }}>
                        <Typography fontWeight={600}>{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {item.subtitle}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" rowGap={1}>
                          {item.chips.map((chip, index) => (
                            <Chip
                              key={`${item.title}-${chip}-${index}`}
                              size="small"
                              label={chip}
                              color="secondary"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>

            {userRole === 'FREELANCER' && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Recommended gigs
                        </Typography>
                        <Typography color="text.secondary">
                          Opportunities that overlap with your skill stack.
                        </Typography>
                      </Box>
                      {freelancerRecommendations.length === 0 ? (
                        <Typography color="text.secondary">
                          No tailored matches just yet—refresh your skills or explore the marketplace.
                        </Typography>
                      ) : (
                        <Stack spacing={2.5}>
                          {freelancerRecommendations.map((job) => (
                            <Box key={job.id} sx={{ p: 2.5, borderRadius: 2, border: '1px solid rgba(148,163,184,0.15)' }}>
                              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1.5} alignItems={{ md: 'center' }}>
                                <Box>
                                  <Typography fontWeight={600}>{job.title}</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {job.clientName || 'SkillLink client'} • {formatCurrencyRangeInr(job.budget)}
                                  </Typography>
                                </Box>
                                <Button variant="outlined" size="small" onClick={() => navigate('/jobs?tab=open')}>
                                  View job
                                </Button>
                              </Stack>
                              {(job.requiredSkills || []).length > 0 && (
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" rowGap={1}>
                                  {(job.requiredSkills || []).slice(0, 4).map((skill) => (
                                    <Chip key={skill} label={skill} size="small" color="secondary" variant="outlined" />
                                  ))}
                                </Stack>
                              )}
                            </Box>
                          ))}
                        </Stack>
                      )}
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Recent proposals
                        </Typography>
                        <Typography color="text.secondary">
                          Track status across your latest applications.
                        </Typography>
                      </Box>
                      {recentApplications.length === 0 ? (
                        <Typography color="text.secondary">No proposals submitted yet—send one to start a conversation.</Typography>
                      ) : (
                        <Stack spacing={2}>
                          {recentApplications.map((application) => (
                            <Box key={application.id} sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(148,163,184,0.1)' }}>
                              <Typography fontWeight={600}>{application.jobTitle || 'SkillLink opportunity'}</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {formatStatus(application.status || 'applied')} • Applied {application.appliedAt ? dayjs(application.appliedAt).fromNow() : 'recently'}
                              </Typography>
                              {application.clientName && (
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                  Client: {application.clientName}
                                </Typography>
                              )}
                            </Box>
                          ))}
                        </Stack>
                      )}
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {userRole === 'CLIENT' && (
              <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Briefs that need attention
                    </Typography>
                    <Typography color="text.secondary">
                      Keep momentum by nudging collaborators or adding updates.
                    </Typography>
                  </Box>
                  {clientPortfolio.length === 0 ? (
                    <Typography color="text.secondary">No briefs yet—post one to attract top talent.</Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {clientPortfolio.map((job) => (
                        <Grid item xs={12} md={6} key={job.id}>
                          <Box sx={{ p: 2.5, borderRadius: 2, border: '1px solid rgba(148,163,184,0.15)' }}>
                            <Typography fontWeight={600}>{job.title}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {formatStatus(job.status)} • {formatCurrencyRangeInr(job.budget)}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" rowGap={1}>
                              {(job.requiredSkills || []).slice(0, 3).map((skill) => (
                                <Chip key={skill} label={skill} size="small" color="secondary" variant="outlined" />
                              ))}
                            </Stack>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Stack>
              </Paper>
            )}

            {userRole === 'LEARNER' && (
              <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: '1px solid rgba(148,163,184,0.18)' }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Courses to jump into next
                    </Typography>
                    <Typography color="text.secondary">
                      Curated picks that align with your growth path.
                    </Typography>
                  </Box>
                  {learnerSpotlight.length === 0 ? (
                    <Typography color="text.secondary">No courses available yet—check back soon or explore mentors.</Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {learnerSpotlight.map((course) => (
                        <Grid item xs={12} md={6} key={course.id}>
                          <Box sx={{ p: 2.5, borderRadius: 2, border: '1px solid rgba(148,163,184,0.15)' }}>
                            <Typography fontWeight={600}>{course.title}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {course.mentorName || 'SkillLink mentor'} • {formatCurrencyInr(course.price)}
                            </Typography>
                            {course.videoUrl && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                Delivery: On-demand
                              </Typography>
                            )}
                            <Button variant="outlined" size="small" sx={{ mt: 1.5 }} onClick={() => navigate('/courses')}>
                              View course
                            </Button>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Stack>
              </Paper>
            )}
          </Stack>
        )}
      </Stack>
    </AppShell>
  );
};

export default DashboardPage;
