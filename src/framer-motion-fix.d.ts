import 'framer-motion';

declare module 'framer-motion' {
    export interface MotionProps {
        initial?: unknown;
        animate?: unknown;
        whileHover?: unknown;
        whileTap?: unknown;
        whileInView?: unknown;
        viewport?: unknown;
        transition?: unknown;
        variants?: unknown;
        exit?: unknown;
    }
}
