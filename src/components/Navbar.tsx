import { Link } from "react-router-dom"

import '../App.css';
export function NavBar(){
    return (
        <>
        <nav className = "navbar">
            <Link to= "/">
                <button>Home</button>
            </Link>
            <Link to= "/create-quests">
                <button>Create quest</button>
            </Link>
            <Link to= "/history">
                <button>Past Quests</button>
            </Link>
            <Link to= "/profile">
                <button>Profile</button>
            </Link>
        </nav>
        </>
    )
}