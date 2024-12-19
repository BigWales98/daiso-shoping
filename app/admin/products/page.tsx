import { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: `Admin Products - ${APP_NAME}`,
}

export default async function AdminProductsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Products</h2>
      {/* Products table will be added here */}
    </div>
  )
} 