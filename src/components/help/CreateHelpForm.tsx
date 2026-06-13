'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, LifeBuoy, HandHeart, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createHelpPost } from '@/actions/help'

const BODY_MAX = 2000

const schema = z.object({
  type: z.enum(['need', 'offer'], { message: 'Please choose whether you need or can offer help' }),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  body: z.string().min(10, 'Please add more detail (at least 10 characters)').max(BODY_MAX),
})
type FormData = z.infer<typeof schema>

const typeOptions = [
  {
    value: 'need' as const,
    icon: LifeBuoy,
    label: 'I need help',
    description: 'Ask the community for support',
    activeClass: 'border-red-400 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300',
    hoverClass: 'hover:border-red-200 dark:hover:border-red-800',
  },
  {
    value: 'offer' as const,
    icon: HandHeart,
    label: 'I can help',
    description: 'Offer your skills or time',
    activeClass: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300',
    hoverClass: 'hover:border-emerald-200 dark:hover:border-emerald-800',
  },
]

export default function CreateHelpForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const selectedType = watch('type')
  const bodyLen = (watch('body') ?? '').length

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
      {/* Visual type toggle */}
      <div className="space-y-2">
        <Label>I want to… <span aria-hidden="true" className="text-destructive">*</span></Label>
        <div className="grid grid-cols-2 gap-3" role="group" aria-label="Choose help type">
          {typeOptions.map(({ value, icon: Icon, label, description, activeClass, hoverClass }) => {
            const isSelected = selectedType === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setValue('type', value, { shouldValidate: true })}
                aria-pressed={isSelected}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-center ${
                  isSelected
                    ? activeClass
                    : `border-border text-muted-foreground ${hoverClass}`
                }`}
              >
                <Icon size={26} aria-hidden="true" />
                <span className="font-semibold text-sm">{label}</span>
                <span className="text-xs opacity-75 leading-snug">{description}</span>
              </button>
            )
          })}
        </div>
        {errors.type && (
          <p className="text-sm text-destructive" role="alert">{errors.type.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="help-title">
          Title <span aria-hidden="true" className="text-destructive">*</span>
        </Label>
        <Input
          id="help-title"
          {...register('title')}
          placeholder="e.g. Looking for someone to walk my dog on Tuesdays"
          maxLength={200}
          className={errors.title ? 'border-destructive' : ''}
        />
        {errors.title && (
          <p className="text-sm text-destructive" role="alert">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="help-body">
            Details <span aria-hidden="true" className="text-destructive">*</span>
          </Label>
          <span className={`text-xs tabular-nums ${bodyLen > BODY_MAX * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {bodyLen}/{BODY_MAX}
          </span>
        </div>
        <Textarea
          id="help-body"
          {...register('body')}
          placeholder="Add more detail. Do not share your exact home address."
          rows={5}
          className={`resize-none ${errors.body ? 'border-destructive' : ''}`}
          maxLength={BODY_MAX}
        />
        {errors.body && (
          <p className="text-sm text-destructive" role="alert">{errors.body.message}</p>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800/50 px-4 py-3 text-sm">
        <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-amber-900 dark:text-amber-200">
          <strong>Safety:</strong> Never share your home address publicly. Exchange
          contact details privately once you&rsquo;ve connected.
        </p>
      </div>

      <div className="rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
        Your post will be reviewed by a moderator before it appears publicly.
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting} className="cursor-pointer gap-2 flex-1 sm:flex-initial">
          {isSubmitting && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          Submit post
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="cursor-pointer">
          Cancel
        </Button>
      </div>
    </form>
  )
}
