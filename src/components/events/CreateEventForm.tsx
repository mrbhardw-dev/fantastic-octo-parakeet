'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createEvent } from '@/actions/events'

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().max(2000).optional(),
  starts_at: z.string().min(1, 'Start date and time is required'),
  ends_at: z.string().optional(),
  venue_name: z.string().max(200).optional(),
  source_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})
type FormData = z.infer<typeof schema>

export default function CreateEventForm() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => { if (v) fd.append(k, v as string) })
    // Convert local datetime to ISO
    if (data.starts_at) {
      fd.set('starts_at', new Date(data.starts_at).toISOString())
    }
    if (data.ends_at) {
      fd.set('ends_at', new Date(data.ends_at).toISOString())
    }

    const result = await createEvent(fd)
    if (result?.error) { toast.error(result.error); return }
    toast.success('Event submitted for review!')
    router.push('/events')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="ev-title">Event title <span aria-hidden="true" className="text-destructive">*</span></Label>
        <Input id="ev-title" {...register('title')} placeholder="e.g. Kilcock Community Clean-Up Day" maxLength={200} className={errors.title ? 'border-destructive' : ''} />
        {errors.title && <p className="text-sm text-destructive" role="alert">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ev-starts">Starts <span aria-hidden="true" className="text-destructive">*</span></Label>
          <Input type="datetime-local" id="ev-starts" {...register('starts_at')} className={errors.starts_at ? 'border-destructive' : ''} />
          {errors.starts_at && <p className="text-sm text-destructive" role="alert">{errors.starts_at.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="ev-ends">Ends (optional)</Label>
          <Input type="datetime-local" id="ev-ends" {...register('ends_at')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ev-venue">Venue (optional)</Label>
        <Input id="ev-venue" {...register('venue_name')} placeholder="e.g. Kilcock Community Centre" maxLength={200} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ev-desc">Description (optional)</Label>
        <Textarea id="ev-desc" {...register('description')} placeholder="Tell people what to expect…" rows={4} className="resize-none" maxLength={2000} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ev-url">Website / Ticket link (optional)</Label>
        <Input id="ev-url" {...register('source_url')} placeholder="https://…" type="url" className={errors.source_url ? 'border-destructive' : ''} />
        {errors.source_url && <p className="text-sm text-destructive" role="alert">{errors.source_url.message}</p>}
      </div>

      <div className="rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
        Events are reviewed by a moderator before appearing. This usually takes less than 24 hours.
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting} className="cursor-pointer gap-2 flex-1 sm:flex-initial">
          {isSubmitting && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          Submit event
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="cursor-pointer">Cancel</Button>
      </div>
    </form>
  )
}
