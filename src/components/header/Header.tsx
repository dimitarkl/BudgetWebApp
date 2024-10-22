import { Link } from "react-router-dom"

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "../mode-toggle/Mode-Toggle"
import { useContext } from "react"
import UserContext from "../contexts/UserContext"

type Props = {
    logout: () => Promise<void>
}

export default function Header({
    logout
}: Props) {
    const user = useContext(UserContext)
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <ModeToggle />
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link to="/" className={navigationMenuTriggerStyle()}>
                        Home
                    </Link>
                </NavigationMenuItem>
                {user
                    ?
                    <>
                        <NavigationMenuItem>
                            <Link to="/" onClick={logout} className={navigationMenuTriggerStyle()}>
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