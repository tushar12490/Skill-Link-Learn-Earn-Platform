import PropTypes from 'prop-types';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { formatCurrencyRangeInr } from '../utils/currency';

dayjs.extend(relativeTime);

const statusColorMap = {
  open: 'success',
  in_progress: 'warning',
  completed: 'default'
};

const applicationStatusColorMap = {
  applied: 'info',
  pending: 'warning',
  interviewing: 'info',
  accepted: 'success',
  rejected: 'error'
};

const JobCard = ({
  job,
  canApply = false,
  onApply = () => {},
  applicationStatus,
  isClientView = false,
  onViewApplications = () => {},
  currentUserId
}) => {
  const theme = useTheme();
  const normalizedStatus = (job.status || 'OPEN').toLowerCase();
  const normalizedApplicationStatus = applicationStatus?.toLowerCase();
  const isAssignedToCurrentUser = job.freelancerId != null && currentUserId != null && job.freelancerId === currentUserId;
  const isAssignedToSomeone = job.freelancerId != null;
  const showActions = canApply && normalizedStatus === 'open' && !isAssignedToSomeone;
  const alreadyApplied = showActions && Boolean(applicationStatus);
  const showClientActions = Boolean(isClientView);
  const assignedFreelancer = job.freelancerName;

  const initials = job.clientName?.split(' ')
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('');

  const budgetDisplay = formatCurrencyRangeInr(job.budget);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>{initials || 'CL'}</Avatar>
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={600} color="inherit">
              {job.title}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                size="small"
                label={(job.status?.replace('_', ' ') || 'open').toLowerCase()}
                color={statusColorMap[normalizedStatus] || 'primary'}
                sx={{ textTransform: 'capitalize' }}
              />
              {applicationStatus && (
                <Chip
                  size="small"
                  label={applicationStatus.replace('_', ' ').toLowerCase()}
                  color={applicationStatusColorMap[normalizedApplicationStatus] || 'default'}
                  sx={{ textTransform: 'capitalize' }}
                />
              )}
              <Typography variant="body2" color="text.secondary">
                Budget • {budgetDisplay}
              </Typography>
              {isAssignedToCurrentUser && (
                <Chip
                  size="small"
                  label="Assigned to you"
                  color="info"
                  sx={{ textTransform: 'capitalize' }}
                />
              )}
              {assignedFreelancer && (
                <Chip
                  size="small"
                  label={`Assigned: ${assignedFreelancer}`}
                  variant="outlined"
                />
              )}
            </Stack>
          </Stack>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          {job.description}
        </Typography>

        {!!job.requiredSkills?.length && (
          <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
            {job.requiredSkills.map((skill) => (
              <Chip key={skill} size="small" label={skill} variant="outlined" />
            ))}
          </Stack>
        )}

        <Divider />

        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={job.clientName || 'Client'}>
            <Typography variant="caption" color="text.secondary">
              Posted {job.createdAt ? dayjs(job.createdAt).fromNow() : 'recently'} by {job.clientName || 'SkillLink client'}
            </Typography>
          </Tooltip>
        </Stack>
      </CardContent>

      {(showActions || showClientActions || (canApply && isAssignedToSomeone)) && (
        <CardActions sx={{ p: 2, pt: 0, gap: 1, flexWrap: 'wrap' }}>
          {showActions && (
            <Button
              fullWidth={!showClientActions}
              variant={alreadyApplied ? 'outlined' : 'contained'}
              color="secondary"
              onClick={() => !alreadyApplied && onApply(job.id)}
              sx={{ borderRadius: 2 }}
              disabled={alreadyApplied}
            >
              {alreadyApplied
                ? `Application ${applicationStatus.replace('_', ' ').toLowerCase()}`
                : 'Submit proposal'}
            </Button>
          )}
          {canApply && !showActions && isAssignedToSomeone && (
            <Button
              fullWidth={!showClientActions}
              variant="outlined"
              color={isAssignedToCurrentUser ? 'secondary' : 'inherit'}
              disabled
              sx={{ borderRadius: 2 }}
            >
              {isAssignedToCurrentUser ? 'You are assigned' : 'Applications closed'}
            </Button>
          )}
          {showClientActions && (
            <Button
              fullWidth={!showActions}
              variant="outlined"
              color="secondary"
              onClick={() => onViewApplications(job)}
              sx={{ borderRadius: 2 }}
            >
              View proposals
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    budget: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    requiredSkills: PropTypes.arrayOf(PropTypes.string),
    clientId: PropTypes.number,
    clientName: PropTypes.string,
    freelancerId: PropTypes.number,
    freelancerName: PropTypes.string
  }).isRequired,
  canApply: PropTypes.bool,
  onApply: PropTypes.func,
  applicationStatus: PropTypes.string,
  isClientView: PropTypes.bool,
  onViewApplications: PropTypes.func,
  currentUserId: PropTypes.number
};

export default JobCard;
