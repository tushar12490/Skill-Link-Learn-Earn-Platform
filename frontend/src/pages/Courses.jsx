import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Hourglass, Layers, Star } from 'lucide-react';
import { courses } from '../data/mockData.js';

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const Courses = () => {
  const [level, setLevel] = useState('All');

  const visibleCourses = useMemo(() => {
    if (level === 'All') {
      return courses;
    }
    return courses.filter((course) => course.level === level);
  }, [level]);

  return (
    <div className="space-y-14">
      <header className="space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-500 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-200">
          Mentor-led cohorts
        </span>
        <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">Upskill alongside real client briefs</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Browse learning tracks co-created by active freelancers. Each module includes a hands-on challenge and access to office hours with the mentor who led the original project.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {levels.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLevel(item)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              level === item
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'border border-slate-200 bg-white/70 text-slate-600 hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:bg-night/70 dark:text-slate-200'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {visibleCourses.map((course, index) => (
          <motion.article
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800 dark:bg-night/80"
          >
            <div className="relative h-48">
              <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
              <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-500 shadow-sm">
                <GraduationCap className="h-4 w-4" /> Cohort course
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-5 p-6">
              <header>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{course.title}</h2>
                <p className="mt-2 text-sm text-primary-500">Mentor: {course.mentor}</p>
              </header>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Unlock frameworks, templates, and peer reviews while co-building features inspired by real SkillLink engagements.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">
                  <Layers className="h-4 w-4" /> {course.level}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">
                  <Hourglass className="h-4 w-4" /> {course.duration}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">
                  <Star className="h-4 w-4 text-amber-400" /> Mentor rated 4.8+
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <p className="text-2xl font-semibold text-primary-500">₹{course.price.toLocaleString('en-IN')}</p>
                <button
                  type="button"
                  className="rounded-full border border-primary-400 px-4 py-2 text-xs font-semibold text-primary-500 transition hover:bg-primary-500 hover:text-white"
                >
                  Reserve a seat
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default Courses;
