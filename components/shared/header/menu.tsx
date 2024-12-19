import { auth, signOut } from '@/auth'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

export default async function Menu() {
  const session = await auth()
  return (
    <div className="flex items-center gap-4">
      <Button asChild variant="ghost">
        <Link href="/cart">
          <ShoppingCart className="h-5 w-5" />
          Cart
        </Link>
      </Button>

      {!session ? (
        <Link href="/sign-in">
          <Button>Sign In</Button>
        </Link>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              {session.user.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session.user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            {session.user.role === 'admin' && (
              <DropdownMenuItem>
                <Link href="/admin/overview" className="w-full">Admin</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Link href="/user/profile" className="w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/user/orders" className="w-full">Orders</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <form
                action={async () => {
                  'use server'
                  await signOut()
                }}
                className="w-full"
              >
                <Button variant="ghost" className="w-full">
                  Sign Out
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}