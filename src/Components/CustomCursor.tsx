import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 520, damping: 42, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 520, damping: 42, mass: 0.4 });
  const [enabled] = useState(() => window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("precision-cursor-ready");
    const move = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = (event.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor]");
      setLabel(target?.dataset.cursor ?? (target ? "Open" : ""));
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      document.body.classList.remove("precision-cursor-ready");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y } as never} />
      <motion.div className={`cursor-ring${label ? " is-active" : ""}`} style={{ x: ringX, y: ringY } as never}>
        {label && <span>{label}</span>}
      </motion.div>
    </>
  );
}
