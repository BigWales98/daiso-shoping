'use client'

import { Button } from '@/components/ui/button'
import { useRouter, usePathname } from 'next/navigation'

export function Pagination({
  page,
  totalPages,
}: {
  page: number
  totalPages: number
}) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex justify-center gap-2 mt-4">
      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={() => router.push(`${pathname}?page=${page - 1}`)}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => router.push(`${pathname}?page=${page + 1}`)}
      >
        Next
      </Button>
    </div>
  )
} 