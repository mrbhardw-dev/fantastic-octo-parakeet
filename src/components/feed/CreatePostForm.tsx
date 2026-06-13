'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createPost } from '@/actions/posts'
import { POST_CATEGORIES } from '@/types'

const BODY_MAX = 5000

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  body: z.string().min(10, 'Description must be at least 10 characters').max(BODY_MAX),
  category: z.string().min(1, 'Please select a category'),
})
type FormData = z.infer<typeof schema>

export default function CreatePostForm() {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const bodyLen = (watch('body') ?? '').length

  async function onSubmit(data: FormData) {
    const fd = new FormData()
    fd.append('title', data.title)
    fd.append('body', data.body)
    fd.append('category', data.category)
    if (imageUrl) fd.append('image_url', imageUrl)

    const result = await createPost(fd)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    toast.success('Post submitted for review! It will appear once approved.')
    router.push('/feed')
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB.')
      return
    }

    setUploading(true)
    try {
      const sigRes = await fetch('/api/upload')
      const { signature, timestamp, apiKey, cloudName, folder } = await sigRes.json()

      const fd = new FormData()
      fd.append('file', file)
      fd.append('api_key', apiKey)
      fd.append('timestamp', String(timestamp))
      fd.append('signature', signature)
      fd.append('folder', folder)
      fd.append('transformation', 'c_limit,w_800,f_auto,q_auto')

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: fd,
      })
      const json = await res.json()
      if (json.secure_url) {
        setImageUrl(json.secure_url)
        setPreviewUrl(json.secure_url)
        toast.success('Image uploaded.')
      } else {
        throw new Error('Upload failed')
      }
    } catch {
      toast.error('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="post-category">Category <span aria-hidden="true" className="text-destructive">*</span></Label>
        <Select onValueChange={(v) => setValue('category', v as string)}>
          <SelectTrigger id="post-category" className={errors.category ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {POST_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-destructive" role="alert">{errors.category.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="post-title">Title <span aria-hidden="true" className="text-destructive">*</span></Label>
        <Input
          id="post-title"
          {...register('title')}
          placeholder="e.g. Road closure on Main Street this weekend"
          className={errors.title ? 'border-destructive' : ''}
          maxLength={200}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && <p id="title-error" className="text-sm text-destructive" role="alert">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="post-body">Details <span aria-hidden="true" className="text-destructive">*</span></Label>
          <span className={`text-xs tabular-nums ${bodyLen > BODY_MAX * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {bodyLen}/{BODY_MAX}
          </span>
        </div>
        <Textarea
          id="post-body"
          {...register('body')}
          placeholder="Provide more information for the community…"
          rows={5}
          className={`resize-none ${errors.body ? 'border-destructive' : ''}`}
          maxLength={BODY_MAX}
          aria-describedby={errors.body ? 'body-error' : undefined}
        />
        {errors.body && <p id="body-error" className="text-sm text-destructive" role="alert">{errors.body.message}</p>}
      </div>

      {/* Image upload */}
      <div className="space-y-2">
        <Label>Image (optional)</Label>
        {previewUrl ? (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Upload preview" className="h-40 rounded-lg object-cover border border-border" />
            <button
              type="button"
              onClick={() => { setPreviewUrl(''); setImageUrl('') }}
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageUpload}
              className="sr-only"
              id="image-upload"
              aria-label="Upload an image"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="cursor-pointer gap-2"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <ImagePlus size={16} aria-hidden="true" />}
              {uploading ? 'Uploading…' : 'Add image'}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP — max 5 MB</p>
          </div>
        )}
      </div>

      <div className="rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
        Your post will be reviewed by a moderator before it appears publicly. This usually takes less than 24 hours.
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
