import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Shared NavbarLogo component for consistent branding across all pages
 * Automatically adapts to light/dark themes with proper contrast
 */
const NavbarLogo = ({ className = '' }) => {
  return (
    <Link to="/" className={`flex items-center group ${className}`}>
      <motion.span
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        className="text-2xl font-bold text-teal-600 dark:text-teal-400 tracking-tight"
      >
        SkillLink
      </motion.span>
    </Link>
  );
};

export default NavbarLogo;
