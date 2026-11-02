import { motion } from 'framer-motion';

export default function PageHero({ title, subtitle }) {
  return (
    <div className="page-hero">
      <div className="container">
        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="section-subtitle page-hero__subtitle"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
