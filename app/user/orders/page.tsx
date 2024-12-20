import { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'
import { getMyOrders } from '@/lib/actions/order.actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils'
import Link from 'next/link'
import { Pagination } from '@/components/shared/pagination'

export const metadata: Metadata = {
    title: `My Orders - ${APP_NAME}`,
  }
  export default async function OrdersPage({
    searchParams,
  }: {
    searchParams: { page: string }
  }) {
    const page = Number(searchParams.page) || 1
    const orders = await getMyOrders({
      page,
      limit: 6,
    })
    return (
      <div className="space-y-2">
        <h2 className="h2-bold">Orders</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>PAID</TableHead>
                <TableHead>DELIVERED</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.data.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{formatId(order.id)}</TableCell>
                  <TableCell>
                    {formatDateTime(order.createdAt).dateTime}
                  </TableCell>
                  <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                  <TableCell>
                    {order.isPaid && order.paidAt
                      ? formatDateTime(order.paidAt).dateTime
                      : 'not paid'}
                  </TableCell>
                  <TableCell>
                    {order.isDelivered && order.deliveredAt
                      ? formatDateTime(order.deliveredAt).dateTime
                      : 'not delivered'}
                  </TableCell>
                  <TableCell>
                    <Link href={`/order/${order.id}`}>Details</Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {orders.totalPages > 1 && (
            <Pagination page={page} totalPages={orders?.totalPages!} />
          )}
        </div>
      </div>
    )
  }