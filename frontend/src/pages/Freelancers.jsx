import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Star, Briefcase, Users } from 'lucide-react';
import { freelancers } from '../data/mockData.js';

const Freelancers = () => {
  const [skillFilter, setSkillFilter] = useState('All');

  const skills = useMemo(() => {
    const unique = new Set();
    freelancers.forEach((freelancer) => freelancer.skills.forEach((skill) => unique.add(skill)));
    return ['All', ...Array.from(unique)];
  }, []);

  const displayed = useMemo(() => {
    if (skillFilter === 'All') {
      return freelancers;
    }
    return freelancers.filter((freelancer) => freelancer.skills.includes(skillFilter));
  }, [skillFilter]);

  return (
    <div className="space-y-14">
      <header className="space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-500 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-200">
          Hybrid talent network
        </span>
        <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">Meet freelancers who mentor while they build</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Each SkillLink freelancer pairs hands-on delivery with structured knowledge sharing. Filter by skill to find experts who uplift your team while shipping results.
        </p>
      </header>

      <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-night/80">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-night/70 dark:text-slate-200">
            <Filter className="h-4 w-4" /> Filter by skill
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => setSkillFilter(skill)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  skillFilter === skill
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'border border-slate-200 bg-white/70 text-slate-600 hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:bg-night/70 dark:text-slate-200'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {displayed.map((freelancer) => (
          <motion.article
            key={freelancer.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800 dark:bg-night/80"
          >
            <div className="flex items-center gap-4">
              <img src={freelancer.avatar} alt={freelancer.name} className="h-16 w-16 rounded-2xl object-cover" />
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{freelancer.name}</h2>
                <p className="text-sm text-primary-500">{freelancer.role}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Star className="h-4 w-4 text-amber-400" />
                  <span>{freelancer.rating} ({freelancer.reviews} reviews)</span>
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <Briefcase className="h-4 w-4" />
                    {freelancer.projects} projects
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{freelancer.bio}</p>
            <div className="flex flex-wrap gap-2">
              {freelancer.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-wide text-primary-500">
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4" /> Mentors up to 5 learners per sprint
              </span>
              <button
                type="button"
                className="rounded-full border border-primary-400 px-4 py-2 text-xs font-semibold text-primary-500 transition hover:bg-primary-500 hover:text-white"
              >
                Start briefing
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default Freelancers;
