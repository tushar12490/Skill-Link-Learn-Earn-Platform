import PropTypes from 'prop-types';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';

const LoadingState = ({ label }) => (
  <Box sx={{ py: 6 }}>
    <Stack spacing={2} alignItems="center" justifyContent="center">
      <CircularProgress color="secondary" />
      {label && (
        <Typography color="text.secondary" textAlign="center">
          {label}
        </Typography>
      )}
    </Stack>
  </Box>
);

LoadingState.propTypes = {
  label: PropTypes.string
};

LoadingState.defaultProps = {
  label: 'Fetching the latest boost for your journey…'
};

export default LoadingState;
