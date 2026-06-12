'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { TriangleAlertIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { postQuickAlert } from '@/actions/admin'

export function QuickAlertButton() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await postQuickAlert(title.trim(), body.trim())
      if (result.success) {
        toast.success('Alert posted to the feed.')
        setTitle('')
        setBody('')
        setOpen(false)
      } else {
        toast.error(result.error ?? 'Something went wrong.')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="destructive" size="sm" className="gap-1.5" />
        }
      >
        <TriangleAlertIcon />
        Quick Alert
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post a Quick Alert</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="alert-title">Title</Label>
            <Input
              id="alert-title"
              placeholder="e.g. Road closed on Church St"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              minLength={3}
              maxLength={200}
              required
              disabled={isPending}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="alert-body">Message</Label>
            <Textarea
              id="alert-body"
              placeholder="Provide details for the community…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              minLength={10}
              maxLength={5000}
              required
              disabled={isPending}
              rows={4}
            />
          </div>
          <DialogFooter showCloseButton>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? 'Posting…' : 'Post alert'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
