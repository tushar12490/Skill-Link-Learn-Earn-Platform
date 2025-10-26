import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { formatCurrencyInr } from '../utils/currency';

const CourseCard = ({ course, canEnroll, onEnroll }) => {
  const theme = useTheme();
  const priceDisplay = formatCurrencyInr(course.price, { maximumFractionDigits: 0 });

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
        <Stack direction="row" spacing={1.5} alignItems="center">
          <SchoolIcon color="secondary" />
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={600}>
              {course.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              by {course.mentorName || 'SkillLink mentor'}
            </Typography>
          </Stack>
        </Stack>
        <Typography color="text.secondary" sx={{ flexGrow: 1 }}>
          {course.description}
        </Typography>
        {course.videoUrl && (
          <Typography variant="caption" color="text.secondary">
            Stream: {course.videoUrl}
          </Typography>
        )}
        <Typography variant="h6" color="secondary.main">
          {priceDisplay}
        </Typography>
      </CardContent>
      {canEnroll && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button fullWidth variant="contained" onClick={() => onEnroll(course.id)} sx={{ borderRadius: 2 }}>
            Enroll now
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    videoUrl: PropTypes.string,
    mentorName: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
  }).isRequired,
  canEnroll: PropTypes.bool,
  onEnroll: PropTypes.func
};

CourseCard.defaultProps = {
  canEnroll: false,
  onEnroll: () => {}
};

export default CourseCard;
