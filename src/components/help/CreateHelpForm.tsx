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
import { createHelpPost } from '@/actions/help'

const schema = z.object({
  type: z.enum(['need', 'offer'], { message: 'Please select need or offer' }),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  body: z.string().min(10, 'Please add more detail (at least 10 characters)').max(2000),
})
type FormData = z.infer<typeof schema>

export default function CreateHelpForm() {
  const router = useRouter()
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    const fd = new FormData()
    fd.append('type', data.type)
    fd.append('title', data.title)
    fd.append('body', data.body)
    const result = await createHelpPost(fd)
    if (result?.error) { toast.error(result.error); return }
    toast.success('Post submitted for review!')
    router.push('/help')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="help-type">I want to… <span aria-hidden="true" className="text-destructive">*</span></Label>
        <Select onValueChange={(v) => setValue('type', v as 'need' | 'offer')}>
          <SelectTrigger id="help-type" className={errors.type ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="need">Ask for help (I need something)</SelectItem>
            <SelectItem value="offer">Offer help (I can help)</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-sm text-destructive" role="alert">{errors.type.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="help-title">Title <span aria-hidden="true" className="text-destructive">*</span></Label>
        <Input id="help-title" {...register('title')} placeholder="e.g. Looking for someone to walk my dog on Tuesdays" maxLength={200} className={errors.title ? 'border-destructive' : ''} />
        {errors.title && <p className="text-sm text-destructive" role="alert">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="help-body">Details <span aria-hidden="true" className="text-destructive">*</span></Label>
        <Textarea id="help-body" {...register('body')} placeholder="Add more detail. Do not share your exact home address." rows={5} className={`resize-none ${errors.body ? 'border-destructive' : ''}`} maxLength={2000} />
        {errors.body && <p className="text-sm text-destructive" role="alert">{errors.body.message}</p>}
      </div>

      <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
        <strong>Safety reminder:</strong> Never share your exact home address or personal details publicly.
        If you&rsquo;d like to arrange help, you can exchange contact details privately once connected.
      </div>

      <div className="rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
        Your post will be reviewed by a moderator before it appears.
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting} className="cursor-pointer gap-2 flex-1 sm:flex-initial">
          {isSubmitting && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          Submit post
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="cursor-pointer">Cancel</Button>
      </div>
    </form>
  )
}
