import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");
const navigate = useNavigate();

useEffect(() => {
    // Clear session when visiting login page
    sessionStorage.removeItem("loggedInUser");
}, []);

const getProfiles = () => {
    const data = localStorage.getItem("profiles");
    return data ? JSON.parse(data) : [];
};

const saveProfiles = (profiles) => {
    localStorage.setItem("profiles", JSON.stringify(profiles));
};

const handleLogin = () => {
    const profiles = getProfiles();
    const match = profiles.find(
    (profile) => profile.username === username && profile.id === password
    );
    if (match) {
    sessionStorage.setItem("loggedInUser", JSON.stringify(match));
    navigate("/");
    } else {
    setMessage("Invalid username or password.");
    }
};

const handleCreateAccount = () => {
    const profiles = getProfiles();
    const usernameExists = profiles.some((profile) => profile.username === username);
    const passwordExists = profiles.some((profile) => profile.id === password);

    if (usernameExists) {
    setMessage("Username already exists.");
    return;
    }

    if (passwordExists) {
    setMessage("Password already in use.");
    return;
    }

    const newProfile = {
    avatar: 1,
    xp: 0,
    level: 1,
    id: password,
    username: username,
    };

    profiles.push(newProfile);
    saveProfiles(profiles);
    sessionStorage.setItem("loggedInUser", JSON.stringify(newProfile));
    navigate("/");
};

return (
    <div style={{ maxWidth: "300px", margin: "auto" }}>
    <h2>Login</h2>
    <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
    />
    <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
    />
    <button onClick={handleLogin} style={{ marginRight: "10px" }}>
        Login
    </button>
    <button onClick={handleCreateAccount}>Create Account</button>
    {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
);
}