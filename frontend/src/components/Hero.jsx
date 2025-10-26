import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

const heroContainer = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 20
    }
  }
};

const stats = [
  { label: 'Freelancers matched', value: '18K+' },
  { label: 'Cohort sessions hosted', value: '6.2K' },
  { label: 'Avg. mentor rating', value: '4.9★' }
];

const Hero = () => (
  <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/70 p-10 shadow-glass backdrop-blur dark:border-slate-800 dark:bg-night/80">
    <motion.div
      className="relative z-10 max-w-3xl"
      variants={heroContainer}
      initial="hidden"
      animate="visible"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/60 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-600 dark:border-primary-500/40 dark:bg-primary-500/10 dark:text-primary-200">
        Trusted by hybrid teams in 32 countries
      </span>
      <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
        Learn. Earn. Grow — with <span className="text-primary-500">SkillLink</span>
      </h1>
      <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
        Connect with experts, learn new skills, and find freelance opportunities — all under one collaborative workspace with tailored workflows for clients, mentors, and learners.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <a
          href="#freelancers"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:scale-[1.02] hover:bg-primary-600"
        >
          Hire a Freelancer
          <ArrowRight className="h-4 w-4" />
        </a>
        <a
          href="#courses"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:bg-night/60 dark:text-slate-200"
        >
          <Play className="h-4 w-4" /> Learn a Skill
        </a>
      </div>

      <dl className="mt-10 grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200/70 bg-white/60 px-5 py-4 text-sm font-medium text-slate-500 shadow-sm backdrop-blur dark:border-slate-800/60 dark:bg-night/70 dark:text-slate-300">
            <dt>{stat.label}</dt>
            <dd className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </motion.div>

    <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-primary-500/30 blur-3xl" />
    <div className="pointer-events-none absolute bottom-0 right-10 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl" />
  </section>
);

export default Hero;
