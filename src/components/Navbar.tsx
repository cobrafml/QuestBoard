import { Link, useNavigate } from "react-router-dom";
import '../App.css';

export function NavBar() {
const navigate = useNavigate();

const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser");
    navigate("/login");
};

const handleClearAllData = () => {
    localStorage.removeItem("profiles");
    localStorage.removeItem("quests");
    alert("All accounts and quests have been deleted.");
    handleLogout(); //  Redirect to login after clearing
};

return (
    <>
    <nav className="navbar">
        <Link to="/"><button>Home</button></Link>
        <Link to="/create-quests"><button>Create quest</button></Link>
        <Link to="/history"><button>Past Quests</button></Link>
        <Link to="/profile"><button>Profile</button></Link>
        <Link to="/Store"><button>Store</button></Link>
        <button onClick={handleLogout}>Logout</button>
        <button
        onClick={handleClearAllData}
        style={{ backgroundColor: "#c00", color: "#fff", marginLeft: "10px" }}
        >
        Clear All Data
        </button>
    </nav>
    </>
);
}