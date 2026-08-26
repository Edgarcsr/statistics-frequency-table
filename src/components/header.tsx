import { Link } from '@tanstack/react-router'
import { createAvatar } from '@bible-strong/avatar-react'
import { BookOpen, BoxIcon } from 'lucide-react'
import '@bible-strong/avatar-react/styles.css'
import definition from '../../strobi.avatar.json'
import { useEffect, useRef } from 'react'
import { Button } from '#/components/ui/button.tsx'

const Avatar = createAvatar(definition)

const MAX_EYE_OFFSET = 44

export function Header() {
  const avatarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const handleMouseMove = (event: MouseEvent) => {
      const container = avatarRef.current
      const eyes = container?.querySelector<SVGGElement>('.bs-avatar__svg g')
      if (!container || !eyes) return
      const rect = container.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      const distance = Math.hypot(dx, dy) || 1
      const strength = Math.min(distance / 120, 1)
      const offsetX = (dx / distance) * strength * MAX_EYE_OFFSET
      const offsetY = (dy / distance) * strength * MAX_EYE_OFFSET
      eyes.style.transform = `translate(${offsetX}px, ${offsetY}px)`
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur px-6 py-2">
      <Link to="/" className="flex items-center gap-3">
        <div ref={avatarRef}>
          <Avatar size={40} defaultAnimation="logo-blink" />
        </div>
        <span className="font-bold text-base">Simplex Resolver</span>
      </Link>
      <nav className="flex items-center gap-1">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <BoxIcon />
            Início
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/metodo">
            <BookOpen />
            Documentação
          </Link>
        </Button>
      </nav>
    </header>
  )
}