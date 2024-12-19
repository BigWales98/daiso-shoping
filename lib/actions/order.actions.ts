'use server'

import { auth } from "@/auth"
import db from '@/db/drizzle'
import { orders, orderItems, carts } from '@/db/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { getUserById } from "./user.actions"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getMyCart } from "./cart.actions"
import { insertOrderSchema } from '../validator'
import { CustomError, formatError } from "../utils"
import { isRedirectError } from "next/dist/client/components/redirect"
import { paypal } from "../paypal"
import { Order, PaymentResult } from '@/types'

// CREATE
export const createOrder = async () => {
    try {
      const session = await auth()
      if (!session) throw new Error('User is not authenticated')
      
      let cart
      try {
        cart = await getMyCart()
      } catch (error) {
        console.error('Failed to get cart:', error)
        throw new Error('Failed to get cart')
      }
      
      const user = await getUserById(session?.user.id!)
      
      console.log('Creating order:', { cart, user })
      
      if (!cart || cart.items.length === 0) redirect('/cart')
      if (!user.address) redirect('/shipping-address')
      if (!user.paymentMethod) redirect('/payment-method')
  
      const order = insertOrderSchema.parse({
        userId: user.id,
        shippingAddress: user.address,
        paymentMethod: user.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
      const insertedOrderId = await db.transaction(async (tx) => {
        const insertedOrder = await tx.insert(orders).values(order).returning()
        for (const item of cart.items) {
          await tx.insert(orderItems).values({
            ...item,
            price: item.price.toFixed(2),
            orderId: insertedOrder[0].id,
          })
        }
        await db
          .update(carts)
          .set({
            items: [],
            totalPrice: '0',
            shippingPrice: '0',
            taxPrice: '0',
            itemsPrice: '0',
          })
          .where(eq(carts.id, cart.id))
        return insertedOrder[0].id
      })
      if (!insertedOrderId) throw new Error('Order not created')
      redirect(`/order/${insertedOrderId}`)
    } catch (error) {
      console.error('Create order error:', error)
      if (isRedirectError(error)) {
        throw error
      }
      return { success: false, message: formatError(error as CustomError) }
    }
  }

// GET
export async function getOrderById(orderId: string) {
    return await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        orderItems: true,
        user: { columns: { name: true, email: true } },
      },
    })
  }

// UPDATE
export async function createPayPalOrder(orderId: string) {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    })
    if (order) {
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice))
      await db
        .update(orders)
        .set({
          paymentResult: {
            id: paypalOrder.id,
            email_address: '',
            status: '',
            pricePaid: '0',
          },
        })
        .where(eq(orders.id, orderId))
      return {
        success: true,
        message: 'PayPal order created successfully',
        data: paypalOrder.id,
      }
    } else {
      throw new Error('Order not found')
    }
  } catch (err) {
    return { success: false, message: formatError(err as CustomError) }
  }
}

export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    })
    if (!order) throw new Error('Order not found')

    const captureData = await paypal.capturePayment(data.orderID)
    if (
      !captureData ||
      captureData.id !== order.paymentResult?.id ||
      captureData.status !== 'COMPLETED'
    )
      throw new Error('Error in paypal payment')
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount
            ?.value,
      },
    })
    revalidatePath(`/order/${orderId}`)
    return {
      success: true,
      message: 'Your order has been successfully paid by PayPal',
    }
  } catch (err) {
    return { success: false, message: formatError(err as CustomError) }
  }
}

async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string
  paymentResult: PaymentResult
}) {
  await db
    .update(orders)
    .set({
      isPaid: true,
      paidAt: new Date(),
      paymentResult,
    })
    .where(eq(orders.id, orderId))
}

export async function getMyOrders({ page, limit }: { page: number; limit: number }) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  
  const offset = (page - 1) * limit
  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, session.user.id),
    limit,
    offset,
    orderBy: desc(orders.createdAt),
  }) as Order[]
  
  const totalOrders = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.userId, session.user.id))
  
  return {
    data: userOrders,
    totalPages: Math.ceil(totalOrders[0].count / limit),
  }
}