import { motion } from 'framer-motion';
import { BadgeCheck, BookOpen, Users } from 'lucide-react';
import Hero from '../components/Hero.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FeaturedSections from '../components/FeaturedSections.jsx';
import Testimonials from '../components/Testimonials.jsx';

const valueProps = [
  {
    icon: Users,
    title: 'Triad-first community',
    description: 'Clients, freelancers, and learners collaborate in a single workspace with shared milestones and transparent communication.'
  },
  {
    icon: BookOpen,
    title: 'Mentorship inside delivery',
    description: 'Freelancers convert project artifacts into mini courses, letting learners shadow live engagements and upskill faster.'
  },
  {
    icon: BadgeCheck,
    title: 'Verified outcomes',
    description: 'Our rating system blends project delivery, mentorship impact, and learner satisfaction for a holistic trust score.'
  }
];

const Home = () => (
  <div className="space-y-20">
    <Hero />
    <SearchBar />
    <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white/80 p-10 shadow-lg dark:border-slate-800 dark:bg-night/80 sm:grid-cols-3">
      {valueProps.map((value, index) => {
        const Icon = value.icon;
        return (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.08 * index, duration: 0.4 }}
            className="flex flex-col gap-3"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-500">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{value.title}</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{value.description}</p>
          </motion.div>
        );
      })}
    </section>
    <FeaturedSections />
    <Testimonials />
    <section className="rounded-3xl border border-primary-200 bg-primary-500/10 p-10 text-center shadow-lg dark:border-primary-500/30 dark:bg-primary-500/15">
      <h2 className="text-3xl font-semibold text-primary-700 dark:text-primary-200">Ready to launch your SkillLink journey?</h2>
      <p className="mt-4 text-sm text-primary-800/80 dark:text-primary-100/80">
        Build a portfolio, host a cohort, or hire a hybrid team — your workspace adapts to every ambition.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="/freelancers"
          className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-600"
        >
          Explore talent network
        </a>
        <a
          href="/courses"
          className="inline-flex items-center gap-2 rounded-full border border-primary-400 px-6 py-3 text-sm font-semibold text-primary-600 transition hover:bg-primary-500 hover:text-white"
        >
          Browse learning tracks
        </a>
      </div>
    </section>
  </div>
);

export default Home;
