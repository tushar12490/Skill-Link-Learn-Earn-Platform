import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';

/**
 * Hire a Freelancer Page
 * Features:
 * - Search bar for finding freelancers
 * - Mock freelancer cards with details
 * - Filter by skills/category
 * - Responsive grid layout
 */
export default function Hire() {
  const { mode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock freelancer data
  const freelancers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Full-Stack Developer',
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      rating: 4.9,
      reviews: 47,
      hourlyRate: 85,
      avatar: 'SJ',
      availability: 'Available',
      category: 'Development'
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'UI/UX Designer',
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
      rating: 4.8,
      reviews: 32,
      hourlyRate: 75,
      avatar: 'MC',
      availability: 'Available',
      category: 'Design'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'Data Scientist',
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
      rating: 5.0,
      reviews: 28,
      hourlyRate: 95,
      avatar: 'ER',
      availability: 'Available',
      category: 'Data Science'
    },
    {
      id: 4,
      name: 'David Kim',
      title: 'Mobile App Developer',
      skills: ['React Native', 'Flutter', 'iOS', 'Android'],
      rating: 4.7,
      reviews: 55,
      hourlyRate: 80,
      avatar: 'DK',
      availability: 'Busy',
      category: 'Development'
    },
    {
      id: 5,
      name: 'Jessica Taylor',
      title: 'Content Writer',
      skills: ['SEO Writing', 'Copywriting', 'Blog Posts', 'Technical Writing'],
      rating: 4.9,
      reviews: 63,
      hourlyRate: 60,
      avatar: 'JT',
      availability: 'Available',
      category: 'Writing'
    },
    {
      id: 6,
      name: 'Alex Martinez',
      title: 'DevOps Engineer',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      rating: 4.8,
      reviews: 41,
      hourlyRate: 90,
      avatar: 'AM',
      availability: 'Available',
      category: 'Development'
    }
  ];

  const categories = ['All', 'Development', 'Design', 'Data Science', 'Writing'];

  // Filter freelancers
  const filteredFreelancers = freelancers.filter((freelancer) => {
    const matchesSearch =
      freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || freelancer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className={`min-h-screen pt-24 pb-12 ${
        mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1
            className={`text-4xl sm:text-5xl font-bold mb-4 ${
              mode === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Hire Top{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Freelancers
            </span>
          </h1>
          <p
            className={`text-lg ${
              mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Connect with skilled professionals for your next project
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search by name, title, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-6 py-4 rounded-xl shadow-lg transition-all focus:ring-4 focus:ring-blue-500/50 outline-none ${
                mode === 'dark'
                  ? 'bg-gray-800 text-white placeholder-gray-400'
                  : 'bg-white text-gray-900 placeholder-gray-500'
              }`}
            />
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : mode === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Freelancer Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredFreelancers.map((freelancer, index) => (
            <motion.div
              key={freelancer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`rounded-xl shadow-lg overflow-hidden transition-all ${
                mode === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                      {freelancer.avatar}
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-bold ${
                          mode === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {freelancer.name}
                      </h3>
                      <p
                        className={`text-sm ${
                          mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {freelancer.title}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      freelancer.availability === 'Available'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {freelancer.availability}
                  </span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {freelancer.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        mode === 'dark'
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Rating & Rate */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span
                      className={`font-semibold ${
                        mode === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {freelancer.rating}
                    </span>
                    <span
                      className={`text-sm ${
                        mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      ({freelancer.reviews} reviews)
                    </span>
                  </div>
                  <span
                    className={`text-xl font-bold ${
                      mode === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    ${freelancer.hourlyRate}/hr
                  </span>
                </div>

                {/* Hire Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all"
                >
                  Hire Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredFreelancers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p
              className={`text-xl ${
                mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              No freelancers found matching your criteria
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
