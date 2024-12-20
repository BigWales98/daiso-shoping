import { Metadata } from 'next'
import { APP_NAME } from '@/lib/constants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BadgeDollarSign, Barcode, CreditCard, Users } from 'lucide-react'
import Charts from './charts'
import { auth } from '@/auth'
import { getOrderSummary } from '@/lib/actions/order.actions'
import { formatCurrency, formatDateTime, formatNumber } from '@/lib/utils'
import Link from 'next/link'

export const metadata: Metadata = {
    title: `Admin Dashboard - ${APP_NAME}`,
  }
  const DashboardPage = async () => {
    const session = await auth()
    if (session?.user.role !== 'admin')
      throw new Error('admin permission required')
  
    const summary = await getOrderSummary()
  
    return (
      <div className="space-y-2">
        <h1 className="h2-bold">Dashboard</h1>
  
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <BadgeDollarSign />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(summary.ordersPrice[0].sum)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(summary.ordersCount[0].count)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.usersCount[0].count}
              </div>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Barcode />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.productsCount[0].count}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Charts
                data={{
                  salesData: summary.salesData,
                }}
              />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>BUYER</TableHead>
                    <TableHead>DATE</TableHead>
                    <TableHead>TOTAL</TableHead>
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.latestOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        {order.user?.name ? order.user.name : 'Deleted user'}
                      </TableCell>
  
                      <TableCell>
                        {formatDateTime(order.createdAt).dateOnly}
                      </TableCell>
                      <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
  
                      <TableCell>
                        <Link href={`/order/${order.id}`}>
                          <span className="px-2">Details</span>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  export default DashboardPage