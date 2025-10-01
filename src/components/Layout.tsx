// Layout.tsx
import { NavBar } from "./Navbar.js"
import { Outlet } from "react-router-dom"

/**
 * Layout component that wraps child routes with a common layout.
 * NavBar is displayed at the top, and Outlet renders the matched child route.
 */
export function Layout() {
    return (
        <>
            <NavBar />
            <main>
                <Outlet />
            </main>
        </>
    );
}