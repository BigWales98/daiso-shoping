'use server'

import { auth } from "@/auth"
import db from '@/db/drizzle'
import { orders, orderItems, carts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getUserById } from "./user.actions"
import { redirect } from "next/navigation"
import { getMyCart } from "./cart.actions"
import { insertOrderSchema } from '../validator'
import { CustomError, formatError } from "../utils"
import { isRedirectError } from "next/dist/client/components/redirect"

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