import { Link } from '@tanstack/react-router'
import { createAvatar } from '@bible-strong/avatar-react'
import { BookOpen, BoxIcon } from 'lucide-react'
import '@bible-strong/avatar-react/styles.css'
import definition from '../../strobi.avatar.json'
import { Button } from '#/components/ui/button.tsx'

const Avatar = createAvatar(definition)

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur px-6 py-2">
      <Link to="/" className="flex items-center gap-3">
        <Avatar size={40} defaultAnimation="excited" />
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