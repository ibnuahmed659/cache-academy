import type { ComponentType } from 'react'
import {
  Beaker,
  BookOpen,
  Clapperboard,
  Cloud,
  Film,
  Home,
  ShieldCheck,
  Terminal,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Instagram, TikTok, XIcon, YoutubeIcon } from '@/components/layout/SocialIcons'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  description?: string
  match?: (pathname: string) => boolean
}

export const NAV: NavItem[] = [
  {
    to: '/',
    label: 'Home',
    icon: Home,
    description: 'Start here',
    match: (p) => p === '/',
  },
  {
    to: '/learn',
    label: 'Chapters',
    icon: BookOpen,
    description: 'Cache poisoning & deception, in depth',
    match: (p) => p.startsWith('/learn'),
  },
  {
    to: '/tutorials',
    label: 'Video Tutorials',
    icon: Clapperboard,
    description: 'Animated, step-by-step',
    match: (p) => p.startsWith('/tutorials'),
  },
  {
    to: '/cartoons',
    label: 'Cartoons',
    icon: Film,
    description: 'The cache story, episode by episode',
    match: (p) => p.startsWith('/cartoons'),
  },
  {
    to: '/labs',
    label: 'Attack Labs',
    icon: Beaker,
    description: 'Poison the cache. Read the secret.',
    match: (p) => p.startsWith('/labs'),
  },
  {
    to: '/playground',
    label: 'Cache Playground',
    icon: Terminal,
    description: 'Build & poison a cache',
    match: (p) => p.startsWith('/playground'),
  },
  {
    to: '/certificate',
    label: 'Certificate',
    icon: ShieldCheck,
    description: 'Your achievements',
    match: (p) => p.startsWith('/certificate'),
  },
]

export type Social = {
  label: string
  handle: string
  href: string
  Icon: ComponentType<{ className?: string }>
}

const HANDLE = '@arkan659'

export const SOCIALS: Social[] = [
  { label: 'YouTube', handle: HANDLE, href: 'https://www.youtube.com/@arkan659', Icon: YoutubeIcon },
  { label: 'TikTok', handle: HANDLE, href: 'https://www.tiktok.com/@arkan659', Icon: TikTok },
  {
    label: 'Instagram',
    handle: HANDLE,
    href: 'https://www.instagram.com/arkan659',
    Icon: Instagram,
  },
  { label: 'X', handle: HANDLE, href: 'https://x.com/arkan659', Icon: XIcon },
]

export const SITE = {
  name: 'Cache Forge',
  tagline: 'Poison the cache. Read the secret.',
  description:
    'Cache Forge is a hands-on academy for Web Cache Poisoning and Web Cache Deception: animated video tutorials, live attack labs, and a defensive playground. Understand the two parsers, then break them.',
  Icon: Cloud,
} as const
