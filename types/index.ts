import { z } from "zod"
import { cartItemSchema, shippingAddressSchema } from "@/lib/validator"
import { InferSelectModel } from "drizzle-orm"
import { carts, products } from "@/db/schema"

export type CartItem = z.infer<typeof cartItemSchema>
export type Cart = InferSelectModel<typeof carts>
export type Product = InferSelectModel<typeof products>
export type ShippingAddress = z.infer<typeof shippingAddressSchema>
export type PaymentResult = {
  id: string
  status: string
  email_address: string
  pricePaid: string
}

export interface Order {
  id: string
  userId: string
  shippingAddress: ShippingAddress
  paymentMethod: string
  paymentResult?: PaymentResult | null
  itemsPrice: string
  shippingPrice: string
  taxPrice: string
  totalPrice: string
  isPaid: boolean
  paidAt?: Date | null
  isDelivered: boolean
  deliveredAt?: Date | null
  createdAt: Date
  orderItems: OrderItem[]
}

export interface OrderItem {
  orderId: string
  productId: string
  name: string
  slug: string
  image: string
  price: string
  qty: number
}