import { motion } from 'framer-motion';
import { Globe, HeartHandshake, Lightbulb } from 'lucide-react';

const milestones = [
  {
    year: '2023',
    title: 'SkillLink is born',
    description:
      'Inspired by the gap between freelance marketplaces and curated learning platforms, we launched SkillLink to blend the two worlds.'
  },
  {
    year: '2024',
    title: 'Mentor-led cohorts scale',
    description:
      'Introduced hybrid engagements where freelancers transform deliverables into cohort-based lessons for emerging talent.'
  },
  {
    year: '2025',
    title: 'Enterprise partnerships',
    description:
      'SkillLink teams now power upskilling programs for distributed product squads in APAC, MEA, and Europe.'
  }
];

// Animation variants for smooth fade-in on scroll
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const About = () => (
  <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
    {/* Main Container with max width */}
    <div className="max-w-6xl mx-auto space-y-20">
      
      {/* Header Section */}
      <motion.header 
        className="text-center space-y-6"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 dark:border-teal-500/30 bg-teal-50 dark:bg-teal-500/10 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300 shadow-sm">
          Our Story
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-neutral-50 leading-tight max-w-4xl mx-auto">
          SkillLink is where learning powers every freelance win
        </h1>
        <p className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
          We believe the future of work revolves around project-based education. SkillLink pairs teams with active mentors who teach in the flow of delivery, keeping skills relevant and opportunities equitable.
        </p>
      </motion.header>

      {/* Core Values Section */}
      <motion.section 
        className="grid gap-8 md:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        {[
          {
            Icon: Globe,
            title: 'Global by design',
            description: 'Talent pools and learners from 32 countries collaborate asynchronously with localized support.'
          },
          {
            Icon: HeartHandshake,
            title: 'Powered by trust',
            description: 'Verified reviews cover delivery, mentorship, and learner success metrics for holistic credibility.'
          },
          {
            Icon: Lightbulb,
            title: 'Learning obsessed',
            description: 'Every project becomes a case study, a lesson, and a stepping stone for the next generation.'
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            className="flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-lg transition-all duration-300 group"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 mb-5 group-hover:scale-110 transition-transform duration-300">
              <item.Icon className="h-8 w-8" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-3">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {item.description}
            </p>
          </motion.div>
        ))}
      </motion.section>

      {/* Milestones Section */}
      <motion.section 
        className="rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-8 md:p-12 shadow-sm"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-3">
            Our Journey
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Key milestones that shaped SkillLink into the platform it is today
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-10 border-l-2 border-teal-200 dark:border-teal-700 pl-8 md:pl-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[41px] md:-left-[57px] top-1 h-5 w-5 rounded-full border-4 border-white dark:border-neutral-800 bg-teal-500 shadow-md group-hover:scale-125 transition-transform duration-300" />
                
                {/* Content */}
                <div className="space-y-2">
                  <span className="inline-block text-sm font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full">
                    {milestone.year}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                    {milestone.title}
                  </h3>
                  <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-300 max-w-2xl">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
          Ready to join the SkillLink community?
        </h3>
        <p className="text-neutral-600 dark:text-neutral-300 mb-8 max-w-2xl mx-auto">
          Whether you're a freelancer, client, or learner, we have the perfect space for you to grow.
        </p>
        <motion.a
          href="/auth?mode=signup"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-teal-600 dark:bg-teal-500 text-white font-semibold text-lg hover:bg-teal-700 dark:hover:bg-teal-600 shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started Today
        </motion.a>
      </motion.div>

    </div>
  </div>
);

export default About;
