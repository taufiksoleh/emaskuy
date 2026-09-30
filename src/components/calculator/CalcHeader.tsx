/**
 * CalcHeader — title and intro of a calculator page (each keeps its own H1).
 */
import { motion } from 'framer-motion';

const reveal = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export function CalcHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
      className="max-w-2xl pb-6 pt-8"
    >
      <motion.h1
        variants={reveal}
        className="font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-t1 md:text-[40px]"
      >
        {title}
      </motion.h1>
      <motion.p variants={reveal} className="mt-3 text-sm leading-[1.5] text-t2">
        {subtitle}
      </motion.p>
    </motion.div>
  );
}
