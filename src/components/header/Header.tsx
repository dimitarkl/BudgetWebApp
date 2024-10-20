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
                <Link to="/" >
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Home
                    </NavigationMenuLink>
                </Link>

            </NavigationMenuItem>
            <NavigationMenuList>
                {user
                    ?
                    <>
                        <NavigationMenuItem>
                            <Link to="/" >
                                <NavigationMenuLink onClick={logout} className={navigationMenuTriggerStyle()}>
                                    Logout
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </>
                    :
                    <>
                        <NavigationMenuItem>
                            <Link to="/login" >
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Login
                                </NavigationMenuLink>
                            </Link>

                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link to="/register" >
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Register
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </>
                }
            </NavigationMenuList>
        </NavigationMenu>
    )
}