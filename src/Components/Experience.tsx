import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type HTMLMotionProps,
} from "framer-motion";
import { useEffect, useRef, type PropsWithChildren, type ReactNode } from "react";
import { useSecurityExperience, type SceneChapter } from "../experience/SecurityExperience";

export function ExperienceSection({ chapter, children, className = "", ...props }: PropsWithChildren<{
  chapter: SceneChapter;
  className?: string;
}> & Omit<HTMLMotionProps<"section">, "children">) {
  const ref = useRef<HTMLElement>(null);
  const lastProgress = useRef(-1);
  const inView = useInView(ref, { amount: 0.12, margin: "-18% 0px -18% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const { updateScene } = useSecurityExperience();

  useEffect(() => {
    if (inView) updateScene({ chapter });
  }, [chapter, inView, updateScene]);

  useMotionValueEvent(scrollYProgress, "change", (progress: number) => {
    if (!inView || Math.abs(progress - lastProgress.current) < 0.018) return;
    lastProgress.current = progress;
    updateScene({ chapter, progress });
  });

  return (
    <motion.section
      ref={ref}
      className={`experience-section ${className}`}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function Reveal({ children, className = "", delay = 0 }: PropsWithChildren<{ className?: string; delay?: number }>) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduced ? 0 : 0.72, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function MaskedHeading({ children, as = "h2", className = "" }: { children: ReactNode; as?: "h1" | "h2"; className?: string }) {
  const reduced = useReducedMotion() ?? false;
  const Component = motion[as];
  return (
    <Component className={`masked-heading ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }}>
      <motion.span
        variants={{ hidden: { y: reduced ? 0 : "108%" }, visible: { y: 0 } }}
        transition={{ duration: reduced ? 0 : 0.78, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </Component>
  );
}

export function TechnicalLabel({ children, live = false }: { children: ReactNode; live?: boolean }) {
  return <span className={`technical-label${live ? " technical-label--live" : ""}`}>{live && <i />}{children}</span>;
}
