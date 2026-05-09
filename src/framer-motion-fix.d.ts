import 'framer-motion';

declare module 'framer-motion' {
    export interface MotionProps {
        initial?: any;
        animate?: any;
        whileHover?: any;
        whileTap?: any;
        whileInView?: any;
        viewport?: any;
        transition?: any;
        variants?: any;
        exit?: any;
    }
}
