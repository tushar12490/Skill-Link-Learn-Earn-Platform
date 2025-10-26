import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';

/**
 * Learn a Skill Page
 * Features:
 * - Course category filter
 * - Mock course cards with details
 * - Search functionality
 * - Responsive grid layout
 */
export default function Learn() {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Mock course data
  const courses = [
    {
      id: 1,
      title: 'Complete React Development',
      instructor: 'Sarah Johnson',
      category: 'Web Development',
      level: 'Intermediate',
      duration: '12 weeks',
      students: 2547,
      rating: 4.8,
      price: 79.99,
      thumbnail: '⚛️'
    },
    {
      id: 2,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Michael Chen',
      category: 'Design',
      level: 'Beginner',
      duration: '8 weeks',
      students: 1893,
      rating: 4.9,
      price: 69.99,
      thumbnail: '🎨'
    },
    {
      id: 3,
      title: 'Python Machine Learning',
      instructor: 'Emily Rodriguez',
      category: 'Data Science',
      level: 'Advanced',
      duration: '16 weeks',
      students: 1256,
      rating: 4.7,
      price: 99.99,
      thumbnail: '🤖'
    },
    {
      id: 4,
      title: 'Mobile App Development with Flutter',
      instructor: 'David Kim',
      category: 'Mobile Development',
      level: 'Intermediate',
      duration: '10 weeks',
      students: 987,
      rating: 4.6,
      price: 84.99,
      thumbnail: '📱'
    },
    {
      id: 5,
      title: 'Digital Marketing Mastery',
      instructor: 'Jessica Taylor',
      category: 'Marketing',
      level: 'Beginner',
      duration: '6 weeks',
      students: 3421,
      rating: 4.8,
      price: 59.99,
      thumbnail: '📢'
    },
    {
      id: 6,
      title: 'Cloud Computing with AWS',
      instructor: 'Alex Martinez',
      category: 'Cloud & DevOps',
      level: 'Intermediate',
      duration: '14 weeks',
      students: 1654,
      rating: 4.9,
      price: 89.99,
      thumbnail: '☁️'
    },
    {
      id: 7,
      title: 'Full-Stack JavaScript',
      instructor: 'Sarah Johnson',
      category: 'Web Development',
      level: 'Advanced',
      duration: '20 weeks',
      students: 2103,
      rating: 4.9,
      price: 109.99,
      thumbnail: '💻'
    },
    {
      id: 8,
      title: 'Graphic Design with Adobe Suite',
      instructor: 'Michael Chen',
      category: 'Design',
      level: 'Beginner',
      duration: '8 weeks',
      students: 1432,
      rating: 4.7,
      price: 74.99,
      thumbnail: '🖼️'
    }
  ];

  const categories = [
    'All',
    'Web Development',
    'Design',
    'Data Science',
    'Mobile Development',
    'Marketing',
    'Cloud & DevOps'
  ];

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className={`min-h-screen pt-24 pb-12 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
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
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Learn New{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Skills
            </span>
          </h1>
          <p
            className={`text-lg ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Master in-demand skills with expert-led courses
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
              placeholder="Search courses by title, instructor, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-6 py-4 rounded-xl shadow-lg transition-all focus:ring-4 focus:ring-purple-500/50 outline-none ${
                theme === 'dark'
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
                  ? 'bg-purple-600 text-white shadow-lg'
                  : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Course Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`rounded-xl shadow-lg overflow-hidden transition-all ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-6xl">
                {course.thumbnail}
              </div>

              {/* Card Content */}
              <div className="p-5">
                {/* Category Badge */}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                    theme === 'dark'
                      ? 'bg-purple-900 text-purple-300'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {course.category}
                </span>

                {/* Title */}
                <h3
                  className={`text-lg font-bold mb-2 line-clamp-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {course.title}
                </h3>

                {/* Instructor */}
                <p
                  className={`text-sm mb-3 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  by {course.instructor}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span
                      className={`text-sm font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {course.rating}
                    </span>
                  </div>
                  <span
                    className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {course.students.toLocaleString()} students
                  </span>
                </div>

                {/* Level & Duration */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      course.level === 'Beginner'
                        ? 'bg-green-100 text-green-700'
                        : course.level === 'Intermediate'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {course.level}
                  </span>
                  <span
                    className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    ⏱️ {course.duration}
                  </span>
                </div>

                {/* Price & Enroll Button */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    ${course.price}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-xl transition-all"
                  >
                    Enroll
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p
              className={`text-xl ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              No courses found matching your criteria
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
