import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export function Login() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");
const navigate = useNavigate();

useEffect(() => {
    sessionStorage.removeItem("loggedInUser");
}, []);

const handleLogin = async () => {
    const { data, error } = await supabase
    .from("Accounts")
    .select("*")
    .eq("Account name", username)
    .eq("Passord", password) // Matches your table column
    .single();

    if (error || !data) {
    console.error("Login error:", error);
    setMessage("Invalid username or password.");
    } else {
    sessionStorage.setItem("loggedInUser", JSON.stringify(data));
    navigate("/");
    }
};

const handleCreateAccount = async () => {
    // Check if username exists
    const { data: existing, error: checkError } = await supabase
    .from("Accounts")
    .select("*")
    .eq("Account name", username);

    if (checkError) {
    console.error("Check username error:", checkError);
    setMessage("Error checking username.");
    return;
    }

    if (existing && existing.length > 0) {
    setMessage("Username already exists.");
    return;
    }

    const newProfile = {
    "Account name": username,
    Passord: password,
    level: 1,
    XP: 0,
    Coins: 0,
    streak: 0,
    };

    const { data, error } = await supabase
    .from("Accounts")
    .insert([newProfile])
    .select()
    .single();

    if (error) {
    console.error("Insert error:", error);
    setMessage(`Error creating account: ${error.message}`);
    } else {
    sessionStorage.setItem("loggedInUser", JSON.stringify(data));
    navigate("/");
    }
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