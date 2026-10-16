import { CartoonLibrary } from '@/components/cartoon/CartoonLibrary'
import { cartoonSeries, cartoons } from '@/content/cartoon'

export default function Cartoons() {
  return (
    <div className="container-page py-10">
      <CartoonLibrary
        kicker={`${cartoonSeries.length} series · ${cartoons.length} episodes`}
        heading="Cache cartoons"
        description="The complete animated cache track: what web caching really is, the cache key, unkeyed inputs, cache poisoning, cache deception, the defenses (Vary, private/no-store, cache-deception armour), how those defenses get bypassed, real-world cases, and a full capstone engagement. Faceless characters, plain language, and a quiz per episode."
        series={cartoonSeries}
      />
    </div>
  )
}
