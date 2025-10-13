    // pages/Profile.jsx

import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function Profile() {

const [account, setAccount] = useState(null);
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState("");

useEffect(() => {
    const fetchAccount = async () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser") || "null");

    if (!loggedInUser) {
        setMessage("You must be logged in to view your profile.");
        setLoading(false);
        return;
    }

    try {
        const { data, error } = await supabase
        .from("Accounts")
        .select("*")
        .eq("id", loggedInUser.id)
        .single();

        if (error) throw error;

        setAccount(data);
    } catch (err) {
        setMessage("Error fetching account: " + err.message);
    } finally {
        setLoading(false);
    }
    };

    fetchAccount();
}, []);

if (loading) return <p>Loading profile...</p>;

    return (
    <>
    <div style={styles.container}>
        <img src="/imiges/fluffy-dog-9846034_960_720.webp" alt="Fluffy Dog" width="200" />

        <div style={styles.info}>
            <p><strong>Username:</strong> {account.username}</p>
            <p><strong>Account ID:</strong> {account.id}</p>
            <p><strong>XP:</strong> {account.XP}</p>
            <p><strong>Coins:</strong> {account.Coins}</p>
            <p><strong>Streak:</strong> {account.streak}</p>
        </div>
    </div>

    </>
    );
    }

const styles = {
container: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    padding: "1rem",
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: "8px"
},
image: {
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.5)"
},
info: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    fontSize: "1rem"
}
};
