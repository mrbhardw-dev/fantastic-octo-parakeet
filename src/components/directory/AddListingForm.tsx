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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createDirectoryListing } from '@/actions/directory'
import { DIRECTORY_CATEGORIES } from '@/types'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().max(2000).optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  phone: z.string().max(30).optional(),
  email: z.string().email('Must be a valid email').optional().or(z.literal('')),
})
type FormData = z.infer<typeof schema>

export default function AddListingForm() {
  const router = useRouter()
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => { if (v) fd.append(k, v as string) })
    const result = await createDirectoryListing(fd)
    if (result?.error) { toast.error(result.error); return }
    toast.success('Listing submitted for review!')
    router.push('/directory')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="dir-category">Category <span aria-hidden="true" className="text-destructive">*</span></Label>
        <Select onValueChange={(v) => setValue('category', v as string)}>
          <SelectTrigger id="dir-category" className={errors.category ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {DIRECTORY_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-destructive" role="alert">{errors.category.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dir-name">Business / Organisation name <span aria-hidden="true" className="text-destructive">*</span></Label>
        <Input id="dir-name" {...register('name')} placeholder="e.g. Kilcock GAA Club" maxLength={200} className={errors.name ? 'border-destructive' : ''} />
        {errors.name && <p className="text-sm text-destructive" role="alert">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dir-desc">Description (optional)</Label>
        <Textarea id="dir-desc" {...register('description')} placeholder="Briefly describe what you offer…" rows={4} className="resize-none" maxLength={2000} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dir-website">Website (optional)</Label>
          <Input id="dir-website" {...register('website')} placeholder="https://…" type="url" className={errors.website ? 'border-destructive' : ''} />
          {errors.website && <p className="text-sm text-destructive" role="alert">{errors.website.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dir-phone">Phone (optional)</Label>
          <Input id="dir-phone" {...register('phone')} placeholder="+353 45 …" type="tel" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dir-email">Contact email (optional)</Label>
        <Input id="dir-email" {...register('email')} placeholder="info@example.ie" type="email" className={errors.email ? 'border-destructive' : ''} />
        {errors.email && <p className="text-sm text-destructive" role="alert">{errors.email.message}</p>}
        <p className="text-xs text-muted-foreground">This email will be publicly visible in the directory.</p>
      </div>

      <div className="rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
        Listings are reviewed by a moderator before appearing. Please ensure information is accurate.
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting} className="cursor-pointer gap-2 flex-1 sm:flex-initial">
          {isSubmitting && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          Submit listing
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="cursor-pointer">Cancel</Button>
      </div>
    </form>
  )
}
