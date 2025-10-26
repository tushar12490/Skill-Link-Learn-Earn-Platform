import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

/**
 * Enhanced Home Page - Landing Page
 * Features:
 * - Professional hero section with dual CTAs
 * - Feature cards showcasing platform benefits
 * - Smooth animations and transitions
 * - Fully responsive design
 * - Theme-aware styling
 */
export default function NewHome() {
  const { theme } = useTheme();

  // Animation variants for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  // Feature cards data
  const features = [
    {
      icon: '🎯',
      title: 'Hire Expert Freelancers',
      description:
        'Find top professionals for your next project. Connect with vetted talent across design, development, marketing, and more.',
      gradient: 'from-blue-500 to-cyan-500',
      link: '/hire'
    },
    {
      icon: '📚',
      title: 'Learn Industry Skills',
      description:
        'Gain practical skills from experienced freelancers. Access courses designed by professionals who work in the field daily.',
      gradient: 'from-purple-500 to-pink-500',
      link: '/learn'
    },
    {
      icon: '🤝',
      title: 'Grow Your Network',
      description:
        'Collaborate, learn, and earn together. Join a thriving community of freelancers, clients, and continuous learners.',
      gradient: 'from-orange-500 to-red-500',
      link: '/about'
    }
  ];

  return (
    <div
      className={`min-h-screen pt-16 transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
      }`}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute top-1/4 -left-48 w-96 h-96 rounded-full blur-3xl opacity-20 ${
              theme === 'dark' ? 'bg-blue-500' : 'bg-blue-400'
            }`}
          ></div>
          <div
            className={`absolute bottom-1/4 -right-48 w-96 h-96 rounded-full blur-3xl opacity-20 ${
              theme === 'dark' ? 'bg-purple-500' : 'bg-purple-400'
            }`}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20"
            >
              <span className="text-2xl">🚀</span>
              <span
                className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                }`}
              >
                Welcome to the Future of Work & Learning
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Empowering{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Freelancers
              </span>
              <br />
              and Learners to Grow Together
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className={`text-lg sm:text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              SkillLink bridges the gap between talented professionals and those eager to learn.
              Whether you're hiring expert freelancers or mastering new skills, your success story
              begins here.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/auth?mode=register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2"
                >
                  <span>Get Started Free</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.button>
              </Link>
              <Link to="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 text-lg font-semibold rounded-xl border-2 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600'
                      : 'border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 shadow-lg'
                  }`}
                >
                  Explore Skills
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats or trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12"
            >
              {[
                { label: 'Active Freelancers', value: '10,000+' },
                { label: 'Courses Available', value: '500+' },
                { label: 'Success Stories', value: '50,000+' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1`}
                  >
                    {stat.value}
                  </div>
                  <div
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Why Choose{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SkillLink?
              </span>
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Everything you need to succeed in the modern gig economy and continuous learning
              landscape.
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Link to={feature.link}>
                  <div
                    className={`h-full p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300 group ${
                      theme === 'dark'
                        ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:shadow-2xl hover:shadow-purple-500/10'
                        : 'bg-white/80 border-gray-200 hover:border-gray-300 hover:shadow-2xl'
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 mb-6 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {feature.icon}
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-2xl font-bold mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:${feature.gradient} group-hover:bg-clip-text transition-all duration-300 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`text-base leading-relaxed mb-4 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {feature.description}
                    </p>

                    {/* Arrow */}
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all duration-300">
                      <span className="text-sm font-semibold">Learn more</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`relative py-20 ${
          theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
        } backdrop-blur-sm`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className={`text-3xl sm:text-4xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Ready to Transform Your Career?
            </h2>
            <p
              className={`text-lg mb-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Join thousands of freelancers and learners who are already growing with SkillLink.
            </p>
            <Link to="/auth?mode=register">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
              >
                Start Your Journey Today
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
