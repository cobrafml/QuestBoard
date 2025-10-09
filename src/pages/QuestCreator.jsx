import { useState } from "react";

export function QuestCreator() {
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [duration, setDuration] = useState("One Day");

const handleCreateQuest = () => {
    console.log("Button clicked!");

    // Validate inputs
    if (!title.trim() || !description.trim()) {
    alert("Please fill in all fields!");
    return;
    }

    // Duration mapping
    const durationMap = {
    "One Time": 1,
    "One Day": 2,
    "One week": 3,
    "One Month": 12,
    };

    const durationHours = durationMap[duration];
    const baseXP = 100;
    const xpPerHour = 50;
    const xp = baseXP + durationHours * xpPerHour;
    const coins = Math.floor(xp / 2);

    const questId = `Q${Date.now()}`;
    const creationDate = new Date().toISOString().split("T")[0];

    //  Get currently logged-in user
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    if (!loggedInUser) {
    alert("You must be logged in to create a quest!");
    return;
    }

    // Use password as accountId
    const accountId = loggedInUser.id; // password stored as id

    const newQuest = {
    questId,
    title,
    description,
    duration,
    xp,
    coins,
    status: "active",
    creationDate,
    accountId,
    };

    // Get existing quests
    const stored = localStorage.getItem("quests");
    const quests = stored ? JSON.parse(stored) : [];

    quests.push(newQuest);

    // Save back to localStorage
    localStorage.setItem("quests", JSON.stringify(quests));

    // Reset form fields
    setTitle("");
    setDescription("");
    setDuration("One Day");
};

return (
    <>
    <div style={{ color: "white", background: "#222", padding: "20px", borderRadius: "8px" }}>
        <h2 style={{ marginBottom: "20px" }}>Create Quest</h2>

        {/* Quest Title */}
        <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>Quest title</label>
        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        </div>

        {/* Quest Description */}
        <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>Quest description</label>
        <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        </div>

        {/* Duration Dropdown */}
        <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>Duration</label>
        <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
            <option value="One Time">One Time</option>
            <option value="One Day">One Day</option>
            <option value="One week">One week</option>
            <option value="One Month">One Month</option>
        </select>
        </div>

        {/* Create Button */}
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
    </div>
    </>
);
}