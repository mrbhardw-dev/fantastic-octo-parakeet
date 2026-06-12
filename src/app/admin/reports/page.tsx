import { getReports } from '@/actions/admin'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Reports' }
export const dynamic = 'force-dynamic'

export default async function AdminReportsPage() {
  const reports = await getReports() as Array<{
    id: string; content_type: string; content_id: string; reason: string;
    created_at: string; reporter: { display_name: string } | null
  }>

  if (reports.length === 0) {
    return <p className="text-muted-foreground text-sm">No reports to review.</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Reports ({reports.length})</h2>
      {reports.map((report) => (
        <Card key={report.id}>
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-xs shrink-0">{report.content_type}</Badge>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">
                  Reported by {report.reporter?.display_name ?? 'Unknown'} &middot;{' '}
                  {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                </p>
                <p className="text-xs text-muted-foreground font-mono mb-2">ID: {report.content_id}</p>
                <p className="text-sm text-foreground">{report.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
