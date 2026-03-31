'use client'
import { useEffect, useRef } from 'react'

export default function StarBg() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1.1 + 0.2, speed: 0.003 + Math.random() * 0.004, o: Math.random(),
    }))
    let frame = 0, raf: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.o = 0.12 + 0.7 * Math.abs(Math.sin(frame * s.speed))
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(196,181,247,${s.o})`; ctx.fill()
      })
      frame++; raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf) }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
}
