import { useEffect } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'

interface AnimatedNumberProps {
  value: number
  format?: (n: number) => string
}

export function AnimatedNumber({
  value,
  format = (n) => n.toFixed(2),
}: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion()
  const motionValue = useMotionValue(0)
  const text = useTransform(motionValue, (v) => format(v))

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: reduceMotion ? 0 : 0.5,
      ease: [0.16, 1, 0.3, 1],
    })
    return () => controls.stop()
  }, [value, motionValue, reduceMotion])

  return <motion.span className="tabular-nums tracking-tight">{text}</motion.span>
}