import { motion, AnimatePresence } from 'framer-motion';
import { useTrainStore } from '../store/useTrainStore';
import { useT } from '../i18n';

export function StaleBanner() {
  const { stale, staleSinceMinutes } = useTrainStore();
  const t = useT();

  return (
    <AnimatePresence>
      {stale && (
        <motion.div
          className="stale-banner"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          ⚠ {t.staleWarning} {staleSinceMinutes} {t.minutesAgo}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
