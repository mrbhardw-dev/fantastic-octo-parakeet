'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, ChevronDown, Check, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NEIGHBOURHOODS, COOKIE_NAME, getNeighbourhood } from '@/lib/neighbourhoods'
import { setNeighbourhood } from '@/actions/neighbourhood'

function getSlugFromCookie(): string {
  if (typeof document === 'undefined') return 'kilcock'
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : 'kilcock'
}

export default function NeighbourhoodSwitcher() {
  const [slug, setSlug] = useState('kilcock')
  const [mounted, setMounted] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    setSlug(getSlugFromCookie())
    setMounted(true)
  }, [])

  const current = getNeighbourhood(slug)

  function handleSelect(newSlug: string) {
    if (newSlug === slug) return
    startTransition(async () => {
      await setNeighbourhood(newSlug)
      setSlug(newSlug)
      router.refresh()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Neighbourhood: ${current.name}. Click to change.`}
      >
        {isPending ? (
          <Loader2 size={12} className="animate-spin" aria-hidden="true" />
        ) : (
          <MapPin size={12} aria-hidden="true" />
        )}
        <span>{mounted ? current.name : 'Kilcock'}</span>
        <ChevronDown size={11} aria-hidden="true" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel>Your neighbourhood</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {NEIGHBOURHOODS.map((n) => (
          <DropdownMenuItem
            key={n.slug}
            disabled={!n.active}
            onClick={() => n.active && handleSelect(n.slug)}
            className={n.active ? 'cursor-pointer' : ''}
          >
            <div className="flex items-center justify-between w-full gap-2 py-0.5">
              <div>
                <p className="text-sm font-medium leading-none">{n.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Co. {n.county}</p>
              </div>
              {!n.active ? (
                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                  Soon
                </span>
              ) : n.slug === slug ? (
                <Check size={13} className="text-primary shrink-0" aria-hidden="true" />
              ) : null}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
