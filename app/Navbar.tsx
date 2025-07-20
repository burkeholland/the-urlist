import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white dark:bg-black">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Site Name */}
        <div className="font-bold text-xl text-primary">
          <Link href="/">The Urlist</Link>
        </div>
        {/* Menu Items */}
        <NavigationMenu>
          <NavigationMenuList className="flex gap-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild className="text-base font-medium">
                <Link href="/new">New</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className="text-base font-medium">
                <Link href="/about">About</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className="text-base font-medium">
                <Link href="/terms">Terms</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {/* Login Button */}
        <div className="ml-auto">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
