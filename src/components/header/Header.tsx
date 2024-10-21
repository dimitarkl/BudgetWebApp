import { Link } from "react-router-dom"

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "../mode-toggle/Mode-Toggle"
import { useContext } from "react"
import UserContext from "../contexts/UserContext"

type Props = {
    logout: () => Promise<void>
}

export function Header({
    logout
}: Props) {
    const user = useContext(UserContext)
    return (
        <NavigationMenu><ModeToggle />
            <NavigationMenuItem>
                <Link to="/" className={navigationMenuTriggerStyle()}>
                    Home
                </Link>

            </NavigationMenuItem>
            <NavigationMenuList>
                {user
                    ?
                    <>
                        <NavigationMenuItem>
                            <Link to="/" className={navigationMenuTriggerStyle()}>

                                Logout
                            </Link>
                        </NavigationMenuItem>
                    </>
                    :
                    <>
                        <NavigationMenuItem>
                            <Link to="/login" className={navigationMenuTriggerStyle()}>
                                Login
                            </Link>

                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link to="/register" className={navigationMenuTriggerStyle()}>
                                Register
                            </Link>
                        </NavigationMenuItem>
                    </>
                }
            </NavigationMenuList>
        </NavigationMenu>
    )
}