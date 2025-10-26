import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Shared container component for consistent page layout
 * Provides unified spacing, max-width, and responsive padding
 */
const PageContainer = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`mx-auto w-full max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default PageContainer;
