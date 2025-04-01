import { motion } from "framer-motion";
type Attribute = {
  color?: string;
  size?: string;
  top?: string;
  left?: string;
  delay?: number;
};
function FloatingShape({ color, size, top, left, delay }: Attribute) {
  return (
    <motion.div
      className={`absolute rounded-full ${color} ${size} opacity-20 blur-xl`}
      animate={{
        x: ["0%", "100%", "0%"],
        y: ["0%", "100%", "0%"],
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        delay,
      }}
      aria-hidden="true"
      style={{ top, left }}
    ></motion.div>
  );
}

export default FloatingShape;
