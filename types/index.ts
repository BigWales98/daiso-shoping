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
}