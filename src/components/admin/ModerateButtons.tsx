'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { ContentType } from '@/types'

interface ModerateButtonsProps {
  contentId: string
  contentType: ContentType
  onApprove: (id: string) => Promise<{ success: boolean; error?: string }>
  onReject: (id: string, reason: string) => Promise<{ success: boolean; error?: string }>
}

export default function ModerateButtons({ contentId, contentType, onApprove, onReject }: ModerateButtonsProps) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState('')

  async function handleApprove() {
    setLoading('approve')
    const result = await onApprove(contentId)
    setLoading(null)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`${contentType} approved.`)
    }
  }

  async function handleReject() {
    if (!reason.trim()) { toast.error('Please provide a reason.'); return }
    setLoading('reject')
    const result = await onReject(contentId, reason.trim())
    setLoading(null)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`${contentType} rejected.`)
      setRejectOpen(false)
      setReason('')
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleApprove}
          disabled={loading !== null}
          className="cursor-pointer gap-1.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
        >
          {loading === 'approve' ? <Loader2 size={13} className="animate-spin" aria-hidden="true" /> : <CheckCircle size={13} aria-hidden="true" />}
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setRejectOpen(true)}
          disabled={loading !== null}
          className="cursor-pointer gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5"
        >
          <XCircle size={13} aria-hidden="true" />
          Reject
        </Button>
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject content</DialogTitle>
            <DialogDescription>
              Provide a reason for rejection. This will be emailed to the submitter.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason</Label>
            <Textarea
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. This content doesn't meet our community guidelines because…"
              rows={4}
              className="resize-none"
              maxLength={500}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)} className="cursor-pointer">Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={loading === 'reject'} className="cursor-pointer gap-1.5">
              {loading === 'reject' && <Loader2 size={13} className="animate-spin" aria-hidden="true" />}
              Confirm rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
