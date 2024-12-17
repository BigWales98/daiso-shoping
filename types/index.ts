import { z } from "zod"
import { cartItemSchema } from "@/lib/validator"
import { InferSelectModel } from "drizzle-orm"
import { carts, products } from "@/db/schema"

export type CartItem = z.infer<typeof cartItemSchema>
export type Cart = InferSelectModel<typeof carts>
export type Product = InferSelectModel<typeof products>