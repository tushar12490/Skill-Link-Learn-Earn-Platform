import { motion } from 'framer-motion';

const transitionVariants = {
  hidden: { opacity: 0, y: 24 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 }
};

const PageTransition = ({ children }) => (
  <motion.div
    initial="hidden"
    animate="enter"
    exit="exit"
    variants={transitionVariants}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className="flex flex-1 flex-col gap-16"
  >
    {children}
  </motion.div>
);

export default PageTransition;
