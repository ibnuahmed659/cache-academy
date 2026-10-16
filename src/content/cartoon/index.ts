import type { Cartoon } from '@/lib/cartoon/types'
import { cacheFundamentals } from './cache-fundamentals'
import { cachePoisonAttacks } from './poison-attacks'
import { cacheDeception } from './deception-attacks'
import { cacheDefenses } from './cache-defenses'
import { cacheModern } from './cache-modern'
import { cacheCaseStudies } from './cache-case-studies'
import { cacheCapstone } from './cache-capstone'

export const cartoons: Cartoon[] = [
  ...cacheFundamentals,
  ...cachePoisonAttacks,
  ...cacheDeception,
  ...cacheDefenses,
  ...cacheModern,
  ...cacheCaseStudies,
  ...cacheCapstone,
]

export type CartoonSeriesGroup = { name: string; cartoons: Cartoon[] }

export const cartoonSeries: CartoonSeriesGroup[] = (() => {
  const groups: CartoonSeriesGroup[] = []
  for (const cartoon of cartoons) {
    let group = groups.find((g) => g.name === cartoon.series)
    if (!group) {
      group = { name: cartoon.series, cartoons: [] }
      groups.push(group)
    }
    group.cartoons.push(cartoon)
  }
  return groups
})()

export function getCartoon(id: string): Cartoon | undefined {
  return cartoons.find((c) => c.id === id)
}
