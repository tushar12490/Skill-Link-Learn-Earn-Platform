import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  GraduationCap,
  Inbox,
  Rocket,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import AppShell from '../components/AppShell.jsx';
import PageContainer from '../components/PageContainer.jsx';
import { fetchClientJobs, fetchFreelancerJobs } from '../services/jobService.js';
import { fetchFreelancerApplications, fetchJobApplications } from '../services/applicationService.js';
import { fetchCourses } from '../services/courseService.js';

dayjs.extend(relativeTime);

const statusChipStyles = {
  OPEN: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',
  IN_PROGRESS: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100'
};

const applicationStatusStyles = {
  APPLIED: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',
  ACCEPTED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100',
  REJECTED: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-100'
};

const sparkleVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.08 * i, duration: 0.4 } })
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [clientApplications, setClientApplications] = useState({});
  const [freelancerApplications, setFreelancerApplications] = useState([]);
  const [courses, setCourses] = useState([]);

  const isClient = user?.role === 'CLIENT';
  const isFreelancer = user?.role === 'FREELANCER';
  const isLearner = user?.role === 'LEARNER';

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isClient) {
          const clientJobs = await fetchClientJobs();
          let applicationsMap = {};
          if (clientJobs.length) {
            const applicationResponses = await Promise.all(
              clientJobs.map((job) =>
                fetchJobApplications(job.id).catch(() => [])
              )
            );
            applicationsMap = clientJobs.reduce((acc, job, index) => {
              acc[job.id] = applicationResponses[index];
              return acc;
            }, {});
          }
          if (!isMounted) return;
          setJobs(clientJobs);
          setClientApplications(applicationsMap);
        }

        if (isFreelancer) {
          const [assignedJobs, applications] = await Promise.all([
            fetchFreelancerJobs(),
            fetchFreelancerApplications(user.id)
          ]);
          if (!isMounted) return;
          setJobs(assignedJobs);
          setFreelancerApplications(applications);
        }

        if (isLearner || user?.isMentor || isFreelancer) {
          const catalog = await fetchCourses();
          if (!isMounted) return;
          setCourses(catalog);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [isClient, isFreelancer, isLearner, user?.id, user?.isMentor]);

  const greeting = useMemo(() => getGreeting(), []);
  const firstName = useMemo(() => user?.name?.split(' ')[0] || user?.email, [user]);

  const clientStats = useMemo(() => {
    if (!isClient) return [];
    const total = jobs.length;
    const open = jobs.filter((job) => job.status === 'OPEN').length;
    const inProgress = jobs.filter((job) => job.status === 'IN_PROGRESS').length;
    const completed = jobs.filter((job) => job.status === 'COMPLETED').length;
    const proposals = Object.values(clientApplications).reduce((acc, apps) => acc + apps.length, 0);

    return [
      {
        label: 'Briefs live',
        value: total,
        icon: BriefcaseBusiness,
        description: 'Total jobs you have posted',
        accent: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300'
      },
      {
        label: 'Open briefs',
        value: open,
        icon: Rocket,
        description: 'Awaiting freelancer matches',
        accent: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
      },
      {
        label: 'Collaborations active',
        value: inProgress,
        icon: CalendarClock,
        description: 'Currently in motion with your team',
        accent: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300'
      },
      {
        label: 'Proposals received',
        value: proposals,
        icon: Inbox,
        description: 'Applicants across all briefs',
        accent: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
      }
    ];
  }, [clientApplications, isClient, jobs]);

  const freelancerStats = useMemo(() => {
    if (!isFreelancer) return [];
    const active = jobs.filter((job) => job.status === 'IN_PROGRESS').length;
    const completed = jobs.filter((job) => job.status === 'COMPLETED').length;
    const pipeline = freelancerApplications.filter((application) => application.status === 'APPLIED').length;
    const winRate = freelancerApplications.length
      ? Math.round((freelancerApplications.filter((app) => app.status === 'ACCEPTED').length / freelancerApplications.length) * 100)
      : 0;

    return [
      {
        label: 'Active engagements',
        value: active,
        icon: CalendarClock,
        description: 'Jobs currently underway',
        accent: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300'
      },
      {
        label: 'Pipeline',
        value: pipeline,
        icon: Rocket,
        description: 'Applications waiting for a response',
        accent: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
      },
      {
        label: 'Wins',
        value: completed,
        icon: CheckCircle2,
        description: 'Completed collaborations on SkillLink',
        accent: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300'
      },
      {
        label: 'Win rate',
        value: `${winRate}%`,
        icon: TrendingUp,
        description: 'Accepted vs total applications',
        accent: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
      }
    ];
  }, [freelancerApplications, isFreelancer, jobs]);

  const learnerStats = useMemo(() => {
    if (!isLearner) return [];
    const mentors = new Set(courses.map((course) => course.mentorId)).size;
    const fresh = courses.slice(0, 3);

    return [
      {
        label: 'Tracks available',
        value: courses.length,
        icon: GraduationCap,
        description: 'Cohorts and masterclasses you can join',
        accent: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300'
      },
      {
        label: 'Mentors online',
        value: mentors,
        icon: Users,
        description: 'Experts publishing content on SkillLink',
        accent: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
      },
      {
        label: 'Fresh drops',
        value: fresh.length,
        icon: Sparkles,
        description: 'New releases this month',
        accent: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300'
      }
    ];
  }, [courses, isLearner]);

  const quickActions = useMemo(() => {
    if (isClient) {
      return [
        {
          title: 'Discover freelance talent',
          description: 'Browse vetted specialists ready to join your pods.',
          to: '/freelancers',
          icon: Users
        },
        {
          title: 'Upskill your internal team',
          description: 'Pair your employees with mentors running live courses.',
          to: '/courses',
          icon: BookOpenCheck
        }
      ];
    }

    if (isFreelancer) {
      return [
        {
          title: 'Refresh your public profile',
          description: 'Stand out to clients by updating your skills narrative.',
          to: '/freelancers',
          icon: Sparkles
        },
        {
          title: 'Launch a micro-course',
          description: 'Share your process with learners in a guided sprint.',
          to: '/courses',
          icon: GraduationCap
        }
      ];
    }

    return [
      {
        title: 'Explore curated courses',
        description: 'Find the next skill stack to level up your craft.',
        to: '/courses',
        icon: BookOpenCheck
      },
      {
        title: 'Meet the mentors',
        description: 'Learn from builders actively shipping with clients.',
        to: '/about',
        icon: Users
      }
    ];
  }, [isClient, isFreelancer]);

  const statsToRender = isClient ? clientStats : isFreelancer ? freelancerStats : learnerStats;

  const renderJobsForClient = () => (
    <div className="space-y-4">
      {jobs.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
          Post your first brief to see project momentum here. Your proposals and milestones will live in this space.
        </p>
      ) : (
        jobs.map((job, index) => {
          const Icon = job.status === 'COMPLETED' ? CheckCircle2 : job.status === 'IN_PROGRESS' ? CalendarClock : Rocket;
          const proposals = clientApplications[job.id]?.length ?? 0;

          return (
            <motion.div
              key={job.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              variants={sparkleVariants}
              initial="hidden"
              whileInView="visible"
              custom={index}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/5 text-slate-600 dark:bg-slate-100/10 dark:text-slate-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{job.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{job.description}</p>
                </div>
                <Chip
                  label={job.status.replace('_', ' ')}
                  size="small"
                  className={`${statusChipStyles[job.status] || ''} !rounded-full !text-xs !font-semibold`}
                />
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Inbox className="h-3.5 w-3.5" />
                  {proposals} {proposals === 1 ? 'proposal' : 'proposals'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <CalendarClock className="h-3.5 w-3.5" />
                  {dayjs(job.createdAt).format('MMM D, YYYY')}
                </span>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );

  const renderFreelancerPipeline = () => (
    <div className="space-y-4">
      {freelancerApplications.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
          Your proposal pipeline is clear. Pitch to open briefs to grow your queue.
        </p>
      ) : (
        freelancerApplications.map((application, index) => (
          <motion.div
            key={application.id}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            variants={sparkleVariants}
            initial="hidden"
            whileInView="visible"
            custom={index}
            viewport={{ once: true, amount: 0.15 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/5 text-slate-600 dark:bg-slate-100/10 dark:text-slate-200">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{application.jobTitle}</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Applied on {dayjs(application.appliedAt).format('MMM D, YYYY')} · Client {application.clientName}
                </p>
              </div>
              <Chip
                label={application.status}
                size="small"
                className={`${applicationStatusStyles[application.status] || ''} !rounded-full !text-xs !font-semibold`}
              />
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
              {application.status === 'ACCEPTED' ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Win secured
                </span>
              ) : application.status === 'APPLIED' ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 font-medium text-teal-700 dark:bg-teal-500/20 dark:text-teal-300">
                  <Rocket className="h-3.5 w-3.5" /> Pending review
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 font-medium text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
                  <TrendingUp className="h-3.5 w-3.5" /> Feedback incorporated
                </span>
              )}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );

  const renderAssignedJobs = () => (
    <div className="space-y-4">
      {jobs.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
          Once a client assigns you, you&rsquo;ll see shared milestones and due dates here.
        </p>
      ) : (
        jobs.map((job, index) => (
          <motion.div
            key={job.id}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            variants={sparkleVariants}
            initial="hidden"
            whileInView="visible"
            custom={index}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/5 text-slate-600 dark:bg-slate-100/10 dark:text-slate-200">
                    <CalendarClock className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{job.title}</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">Partnering with {job.clientName}</p>
              </div>
              <Chip
                label={job.status.replace('_', ' ')}
                size="small"
                className={`${statusChipStyles[job.status] || ''} !rounded-full !text-xs !font-semibold`}
              />
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <CalendarClock className="h-3.5 w-3.5" />
                Started {dayjs(job.createdAt).fromNow()}
              </span>
              {job.requiredSkills?.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-medium capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );

  const renderCourseSpotlights = () => {
    const featured = courses.slice(0, 3);

    return (
      <div className="grid gap-4 md:grid-cols-3">
        {featured.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 md:col-span-3">
            Courses curated for you will appear here once mentors publish new cohorts.
          </p>
        ) : (
          featured.map((course, index) => (
            <motion.div
              key={course.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              variants={sparkleVariants}
              initial="hidden"
              whileInView="visible"
              custom={index}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">{course.title}</h3>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Mentor {course.mentorName}</p>
                </div>
              </div>
              <p className="flex-1 text-sm text-slate-600 dark:text-slate-300">{course.description}</p>
              <div className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-300">
                <span>₹{course.price}</span>
                <span>{dayjs(course.createdAt).format('MMM D')}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    );
  };

  const renderMentorCallout = () => (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-teal-50 via-white to-white p-6 dark:border-slate-700 dark:from-teal-500/10 dark:via-neutral-900 dark:to-neutral-900">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">Mentor spotlight</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {user?.isMentor ? 'Host your next live sprint' : 'Shadow live mentor-led builds'}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-neutral-300">
            {user?.isMentor
              ? 'Convert client artifacts into a cohort-based experience. Learners join your workspace in a single click.'
              : 'Join immersive cohorts where mentors build alongside clients and narrate every decision live.'}
          </p>
        </div>
        <Link
          to="/courses"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
        >
          {user?.isMentor ? 'Create a course' : 'View mentor lineup'}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );

  return (
    <AppShell>
      <PageContainer>
        <div className="space-y-8">
          <motion.section
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 sm:p-8 dark:border-slate-800 dark:bg-slate-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-wider text-teal-600 dark:text-teal-400">
              {greeting}, {firstName}
            </p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Your SkillLink cockpit</h1>
            <p className="text-sm text-slate-600 dark:text-grey-text-light">
              Stay on top of briefs, cohorts, and collaborations in one clean, responsive hub.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.to}
                  className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/20 dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 group-hover:bg-teal-200 dark:bg-teal-500/20 dark:text-teal-300 dark:group-hover:bg-teal-500/30">
                    <ActionIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{action.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">{action.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.section>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statsToRender.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  variants={sparkleVariants}
                  initial="hidden"
                  whileInView="visible"
                  custom={index}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${stat.accent}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{stat.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </section>

          {isClient && (
            <section className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Project runway</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Track proposals, handoffs, and delivery cadence.</p>
                </div>
                <Link
                  to="/freelancers"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-teal-600 hover:text-teal-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-400"
                >
                  Invite more talent
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              {renderJobsForClient()}
            </section>
          )}

          {isFreelancer && (
            <div className="grid gap-8 lg:grid-cols-2">
              <section className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Proposal pipeline</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Monitor where each pitch sits in the review funnel.</p>
                </div>
                {renderFreelancerPipeline()}
              </section>
              <section className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Assigned collaborations</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Shared milestones update in real time.</p>
                </div>
                {renderAssignedJobs()}
              </section>
            </div>
          )}

          {isLearner && (
            <section className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Your learning stream</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Keep momentum with mentor-led cohorts and micro-learning.</p>
                </div>
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-teal-600 hover:text-teal-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-teal-400 dark:hover:text-teal-400"
                >
                  Browse catalog
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              {renderCourseSpotlights()}
            </section>
          )}

          {(user?.isMentor || isLearner || isFreelancer) && renderMentorCallout()}
        </>
      )}
        </div>
      </PageContainer>
    </AppShell>
  );
};

export default Dashboard;
