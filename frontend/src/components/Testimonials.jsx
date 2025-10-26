import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { testimonials } from '../data/mockData.js';

const Testimonials = () => (
  <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-primary-50/60 p-10 shadow-glass dark:border-slate-800 dark:from-night/80 dark:via-night/80 dark:to-primary-500/10">
    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-md">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/80 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-500 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-200">
          Community stories
        </span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
          Freelancers, mentors, and learners grow stronger together on SkillLink.
        </h2>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Each testimonial is a blend of real execution and guided learning. Cohorts transition into live client engagements with the same trusted experts.
        </p>
      </div>
      <Quote className="hidden h-20 w-20 text-primary-200 dark:text-primary-400/40 lg:block" aria-hidden />
    </div>

    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((testimonial, index) => (
        <motion.figure
          key={testimonial.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-600 shadow-lg dark:border-slate-800 dark:bg-night/80 dark:text-slate-300"
        >
          <p className="leading-relaxed">{testimonial.quote}</p>
          <figcaption className="mt-6 flex items-center gap-4">
            <img src={testimonial.avatar} alt={testimonial.author} className="h-12 w-12 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{testimonial.author}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{testimonial.role}</p>
            </div>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  </section>
);

export default Testimonials;
