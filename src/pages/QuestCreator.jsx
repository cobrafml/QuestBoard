import { useState } from "react";
import { supabase } from "../supabaseClient";

export function QuestCreator() {
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [duration, setDuration] = useState(1); // Default: One Day
const [message, setMessage] = useState("");

const handleCreateQuest = async () => {
    if (!title.trim() || !description.trim()) {
    setMessage("Please fill in all fields!");
    return;
    }

    // XP and Coins calculation
    const baseXP = 100;
    const xpPerDay = 50;
    const xp = baseXP + duration * xpPerDay;
    const coins = Math.floor(xp / 2);

    // Get logged-in user
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser") || "null");
    if (!loggedInUser) {
    setMessage("You must be logged in to create a quest!");
    return;
    }

    const accountId = loggedInUser.id;

    // Prepare quest object
    const newQuest = {
    Title: title,
    Description: description,
    duration: duration, // matches column name
    accountID: accountId,
    XP: xp,
    Coins: coins,
    stateus: "active", // ✅ set status to active
    };

    const { error } = await supabase.from("Quests").insert([newQuest]);

    if (error) {
    setMessage("Error creating quest: " + error.message);
    } else {
    setTitle("");
    setDescription("");
    setDuration(1);
    setMessage("Quest created successfully!");
    }
};

return (
    <div style={{ color: "white", background: "#222", padding: "20px", borderRadius: "8px" }}>
    <h2 style={{ marginBottom: "20px" }}>Create Quest</h2>

    {/* Title */}
    <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>Quest title</label>
        <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
    </div>

    {/* Description */}
    <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>Quest description</label>
        <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
    </div>

    {/* Duration */}
    <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>Duration (days)</label>
        <select
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
        <option value={0}>One Time (0 days)</option>
        <option value={1}>One Day</option>
        <option value={7}>One Week</option>
        <option value={30}>One Month</option>
        </select>
    </div>

    {/* Button */}
    <button
        style={{
        width: "100%",
        backgroundColor: "#4c0c77",
        color: "#fff",
        padding: "10px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        }}
        type="button"
        onClick={handleCreateQuest}
    >
        Create Quest
    </button>

    {message && <p style={{ marginTop: "10px", color: "#ccc" }}>{message}</p>}
    </div>
);
}