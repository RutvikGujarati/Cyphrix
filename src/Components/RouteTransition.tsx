import { motion, useReducedMotion } from "framer-motion";

export default function RouteTransition({ routeKey }: { routeKey: string }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      key={routeKey}
      className="route-signal"
      aria-hidden="true"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={reduced ? { opacity: 0 } : { scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
      transition={{ duration: reduced ? 0 : 0.64, times: [0, 0.48, 1], ease: [0.76, 0, 0.24, 1] }}
    />
  );
}
