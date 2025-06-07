import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import Tasks from '@/features/tasks/pages/tasks-page'

export const Route = createFileRoute('/_authenticated/tasks/')({
  component: () => (
    <Suspense fallback={
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <Tasks />
    </Suspense>
  ),
})
