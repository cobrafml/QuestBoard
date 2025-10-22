import { Link, useNavigate } from "react-router-dom";
import '../App.css';

export function NavBar() {
const navigate = useNavigate();

const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser");
    navigate("/login");
};



return (
    <>
    <nav style = {{fontFamily: 'initial'}} className="navbar">
        <Link to="/"><button>Home</button></Link>
        <Link to="/create-quests"><button>Create quest</button></Link>
        <Link to="/history"><button>Past Quests</button></Link>
        <Link to="/profile"><button>Profile</button></Link>
        <Link to="/Store"><button>Store</button></Link>
        <button onClick={handleLogout}>Logout</button>
    </nav>
    </>
);
}