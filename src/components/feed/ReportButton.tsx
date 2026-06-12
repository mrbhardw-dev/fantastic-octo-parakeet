'use client'

import { useState } from 'react'
import { Flag } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { reportPost } from '@/actions/posts'
import { reportEvent } from '@/actions/events'
import { reportListing } from '@/actions/directory'
import { reportHelpPost } from '@/actions/help'
import type { ContentType } from '@/types'

interface ReportButtonProps {
  contentId: string
  contentType: ContentType
}

const reportActions: Record<ContentType, (id: string, reason: string) => Promise<{ error?: string; success?: boolean }>> = {
  post: reportPost,
  event: reportEvent,
  directory: reportListing,
  help_post: reportHelpPost,
}

export default function ReportButton({ contentId, contentType }: ReportButtonProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!reason.trim() || reason.trim().length < 5) {
      toast.error('Please provide a reason (at least 5 characters).')
      return
    }
    setLoading(true)
    const action = reportActions[contentType]
    const result = await action(contentId, reason.trim())
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Report submitted. Our moderators will review it.')
      setOpen(false)
      setReason('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        aria-label="Report this content"
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded p-1 min-h-[44px] min-w-[44px] justify-center"
      >
        <Flag size={13} aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Report</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report content</DialogTitle>
          <DialogDescription>
            Help us keep baile.fyi safe. Describe why this content is inappropriate.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-reason">Reason</Label>
            <Textarea
              id="report-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. This post contains misinformation about local services."
              rows={4}
              maxLength={1000}
              className="resize-none"
              required
            />
            <p className="text-xs text-muted-foreground text-right">{reason.length}/1000</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={loading} className="cursor-pointer">
              {loading ? 'Submitting…' : 'Submit report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
