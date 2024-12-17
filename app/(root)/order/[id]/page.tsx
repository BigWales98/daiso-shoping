import { auth } from "@/auth"
import OrderDetailsForm from "./order-details-form"
import { getOrderById } from "@/lib/actions/order.actions"
import { notFound, redirect } from "next/navigation"

export const metadata = {
    title: 'Order Details',
  }
  
  const OrderDetailsPage = async ({
    params: { id },
  }: {
    params: {
      id: string
    }
  }) => {
    const session = await auth()
    if (!session) redirect('/sign-in')
  
    const order = await getOrderById(id)
    if (!order) notFound()
  
    if (order.userId !== session.user.id) {
      redirect('/')
    }
  
    return <OrderDetailsForm order={order} />
  }
  
  export default OrderDetailsPage