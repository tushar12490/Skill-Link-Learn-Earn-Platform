import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { freelancers, courses } from '../data/mockData.js';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 * index,
      duration: 0.4,
      ease: 'easeOut'
    }
  })
};

const FreelancerCard = ({ freelancer, index }) => (
  <motion.article
    custom={index}
    variants={cardVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800 dark:bg-night/80"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-primary-500/0 to-primary-500/10 opacity-0 transition group-hover:opacity-100" />
    <div className="relative z-10 flex items-start gap-4">
      <img src={freelancer.avatar} alt={freelancer.name} className="h-14 w-14 rounded-2xl object-cover" />
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{freelancer.name}</h3>
        <p className="text-sm text-primary-500">{freelancer.role}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Star className="h-4 w-4 text-amber-400" />
          <span>{freelancer.rating}</span>
          <span>• {freelancer.reviews} reviews</span>
        </div>
      </div>
    </div>
    <p className="relative z-10 mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{freelancer.bio}</p>
    <div className="relative z-10 mt-6 flex flex-wrap gap-2">
      {freelancer.skills.map((skill) => (
        <span
          key={skill}
          className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 transition group-hover:border-primary-400 group-hover:text-primary-500 dark:border-slate-700 dark:text-slate-400"
        >
          {skill}
        </span>
      ))}
    </div>
    <div className="relative z-10 mt-6 text-xs font-semibold uppercase tracking-wide text-primary-500">
      {freelancer.projects} projects shipped
    </div>
    <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-primary-400 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
  </motion.article>
);

const CourseCard = ({ course, index }) => (
  <motion.article
    custom={index}
    variants={cardVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800 dark:bg-night/80"
  >
    <div className="relative h-40 overflow-hidden">
      <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      <span className="absolute left-5 top-5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-primary-500 shadow-sm">
        {course.badge}
      </span>
    </div>
    <div className="p-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{course.title}</h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Mentor: {course.mentor}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">{course.duration}</span>
        <span className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-700">{course.level}</span>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-2xl font-semibold text-primary-500">₹{course.price.toLocaleString('en-IN')}</div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-primary-400 px-4 py-2 text-xs font-semibold text-primary-500 transition hover:bg-primary-500 hover:text-white"
        >
          Enroll now
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  </motion.article>
);

const FeaturedSections = () => (
  <section className="space-y-16" id="freelancers">
    <header className="space-y-3">
      <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Top Freelancers ready to collaborate</h2>
      <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
        A curated collective of specialists coaching and shipping alongside your product teams. Each profile blends freelance execution with cohort-based mentoring.
      </p>
    </header>
    <div className="grid gap-6 md:grid-cols-2">
      {freelancers.map((freelancer, index) => (
        <FreelancerCard key={freelancer.id} freelancer={freelancer} index={index} />
      ))}
    </div>

    <header className="space-y-3" id="courses">
      <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Popular SkillLink courses</h2>
      <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
        Mentor-led cohorts with real project briefs. Learn frameworks on Monday, ship features by Friday, and showcase your growth to clients and teams.
      </p>
    </header>
    <div className="grid gap-6 lg:grid-cols-3">
      {courses.map((course, index) => (
        <CourseCard key={course.id} course={course} index={index} />
      ))}
    </div>
  </section>
);

export default FeaturedSections;
