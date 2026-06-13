export interface Neighbourhood {
  slug: string
  name: string
  town: string
  county: string
  country: string
  active: boolean
}

export const NEIGHBOURHOODS: Neighbourhood[] = [
  {
    slug: 'kilcock',
    name: 'Kilcock',
    town: 'Kilcock',
    county: 'Kildare',
    country: 'Ireland',
    active: true,
  },
  {
    slug: 'maynooth',
    name: 'Maynooth',
    town: 'Maynooth',
    county: 'Kildare',
    country: 'Ireland',
    active: false,
  },
  {
    slug: 'celbridge',
    name: 'Celbridge',
    town: 'Celbridge',
    county: 'Kildare',
    country: 'Ireland',
    active: false,
  },
  {
    slug: 'naas',
    name: 'Naas',
    town: 'Naas',
    county: 'Kildare',
    country: 'Ireland',
    active: false,
  },
]

export const COOKIE_NAME = 'neighbourhood'

export function getNeighbourhood(slug: string): Neighbourhood {
  return (
    NEIGHBOURHOODS.find((n) => n.slug === slug && n.active) ??
    NEIGHBOURHOODS.find((n) => n.active)!
  )
}
