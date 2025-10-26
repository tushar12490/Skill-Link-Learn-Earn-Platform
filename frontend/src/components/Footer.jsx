import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';

/**
 * Enhanced Footer Component
 * Features:
 * - Theme-aware styling
 * - Organized link sections
 * - Social media icons
 * - Professional branding
 * - Responsive layout
 */
const Footer = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Hire Freelancers', path: '/hire' },
    { label: 'Learn Skills', path: '/learn' }
  ];

  const legalLinks = [
    { label: 'Privacy Policy', path: '#' },
    { label: 'Terms of Service', path: '#' },
    { label: 'Cookie Policy', path: '#' }
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
    { name: 'GitHub', icon: '💻', url: 'https://github.com' },
    { name: 'YouTube', icon: '📺', url: 'https://youtube.com' }
  ];

  return (
    <footer
      className={`relative mt-auto border-t transition-all duration-300 ${
        theme === 'dark'
          ? 'border-gray-800 bg-gray-900/95 backdrop-blur-lg'
          : 'border-gray-200 bg-white/95 backdrop-blur-lg'
      }`}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block group">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                SkillLink
              </h3>
            </Link>
            <p
              className={`text-sm leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Empowering freelancers and learners to grow together through meaningful connections
              and quality education.
            </p>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                theme === 'dark'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Active Community
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4
              className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
              }`}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`text-sm transition-colors hover:translate-x-1 inline-block ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-blue-400'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-1">
            <h4
              className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
              }`}
            >
              Legal
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.path}
                    className={`text-sm transition-colors hover:translate-x-1 inline-block ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-blue-400'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div className="md:col-span-1">
            <h4
              className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
              }`}
            >
              Connect With Us
            </h4>
            <div className="flex gap-3 mb-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600'
                      : 'bg-gray-100 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-500 hover:text-white'
                  }`}
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            <p
              className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}
            >
              Follow us for updates and community insights
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <p
            className={`text-sm ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}
          >
            © {currentYear} SkillLink. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span
              className={`text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}
            >
              Made with ❤️ for freelancers & learners
            </span>
          </div>
        </div>
      </div>

      {/* Decorative gradient line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
    </footer>
  );
};

export default Footer;
