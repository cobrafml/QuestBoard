import React, { useEffect, useState } from "react";
import { DataCard } from "../components/cards";
import { supabase } from "../supabaseClient";

export function Home() {
const [quests, setQuests] = useState([]);
const [selectedQuest, setSelectedQuest] = useState(null);
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState("");

useEffect(() => {
    const fetchQuests = async () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser") || "null");

    if (!loggedInUser) {
        setMessage("You must be logged in to view quests.");
        setLoading(false);
        return;
    }

    try {
        const { data, error } = await supabase
        .from("Quests")
        .select("*")
        .eq("accountID", loggedInUser.id)
        .eq("stateus", "active");

        if (error) throw error;

        const formatted = data.map((q) => ({
        id: q.id,
        Title: q.Title,
        "Quest descript": q.Description,
        "Quest duration": `${q.duration} days`,
        xp: q.XP.toString(),
        coins: q.Coins.toString(),
        status: q.stateus,
        created_at: q.created_at,
        duration: q.duration,
        doDate: q.doDate
        }));

        setQuests(formatted);
    } catch (err) {
        setMessage("Error fetching quests: " + err.message);
    } finally {
        setLoading(false);
    }
    };

    fetchQuests();
}, []);

const handleComplete = async (index) => {
    const quest = quests[index];
    if (!quest) return;

    const now = new Date();
    const createdDate = new Date(quest.created_at);
    const allowedMs = quest.duration * 24 * 60 * 60 * 1000;
    const isExpired = now.getTime() - createdDate.getTime() > allowedMs;

    const newStatus = isExpired ? "failed" : "completed";

    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser") || "null");
    if (!loggedInUser) {
    setMessage("User not found.");
    return;
    }

    try {
    const { error: questError } = await supabase
        .from("Quests")
        .update({ stateus: newStatus })
        .eq("id", quest.id);

    if (questError) throw questError;

    const { data: accountData, error: accountError } = await supabase
        .from("Accounts")
        .select("XP, Coins, streak")
        .eq("id", loggedInUser.id)
        .single();

    if (accountError) throw accountError;

    let updatedXP = accountData.XP;
    let updatedCoins = accountData.Coins;
    let updatedStreak = accountData.streak;

    if (newStatus === "completed") {
        updatedXP += parseInt(quest.xp);
        updatedCoins += parseInt(quest.coins);
        updatedStreak += 1;
    } else {
        updatedStreak = 0;
    }

    const { error: updateError } = await supabase
        .from("Accounts")
        .update({
        XP: updatedXP,
        Coins: updatedCoins,
        streak: updatedStreak,
        })
        .eq("id", loggedInUser.id);

    if (updateError) throw updateError;

    const updated = [...quests];
    updated[index].status = newStatus;
    setQuests(updated.filter((q) => q.status === "active"));
    } catch (err) {
    setMessage("Error updating quest: " + err.message);
    }
};

const handleFail = async (index) => {
    const quest = quests[index];
    if (!quest) return;

    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser") || "null");
    if (!loggedInUser) {
    setMessage("User not found.");
    return;
    }

    try {
    const { error: questError } = await supabase
        .from("Quests")
        .update({ stateus: "failed" })
        .eq("id", quest.id);

    if (questError) throw questError;

    const { error: updateError } = await supabase
        .from("Accounts")
        .update({ streak: 0 })
        .eq("id", loggedInUser.id);

    if (updateError) throw updateError;

    const updated = [...quests];
    updated[index].status = "failed";
    setQuests(updated.filter((q) => q.status === "active"));
    } catch (err) {
    setMessage("Error failing quest: " + err.message);
    }
};

const handleEdit = async (index) => {
    const quest = quests[index];
    if (!quest) return;

    const newTitle = prompt("Enter new title:", quest.Title);
    const newDescription = prompt("Enter new description:", quest["Quest descript"]);
    const newDuration = prompt("Enter new duration (in days):", quest.duration);

    if (!newTitle || !newDescription || isNaN(newDuration)) {
    setMessage("Invalid input.");
    return;
    }

    try {
    const { error } = await supabase
        .from("Quests")
        .update({
        Title: newTitle,
        Description: newDescription,
        duration: parseInt(newDuration),
        })
        .eq("id", quest.id);

    if (error) throw error;

    const updated = [...quests];
    updated[index].Title = newTitle;
    updated[index]["Quest descript"] = newDescription;
    updated[index].duration = parseInt(newDuration);
    updated[index]["Quest duration"] = `${newDuration} days`;

    setQuests(updated);
    } catch (err) {
    setMessage("Error editing quest: " + err.message);
    }
};

const handleDelete = async (index) => {
    const quest = quests[index];
    if (!quest) return;

    try {
    const { error } = await supabase.from("Quests").delete().eq("id", quest.id);
    if (error) throw error;

    const updated = [...quests];
    updated.splice(index, 1);
    setQuests(updated);
    } catch (err) {
    setMessage("Error deleting quest: " + err.message);
    }
};

const handleView = (quest) => setSelectedQuest(quest);
const closeModal = () => setSelectedQuest(null);

if (loading) return <p>Loading quests...</p>;

return (
    <>
    <h1 style={{ fontFamily: "initial" }}>These are your active quests</h1>
    {message && <p style={{ color: "red" }}>{message}</p>}

    {/*  Responsive flex layout */}
    <div
        style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        justifyContent: "center",
        padding: "20px",
        }}
    >
        {quests.length > 0 ? (
        quests.map((item, index) => (
            <DataCard
            key={item.id}
            item={item}
            onDelete={() => handleDelete(index)}
            onComplete={() => handleComplete(index)}
            onView={() => handleView(item)}
            onFail={() => handleFail(index)}
            onEdit={() => handleEdit(index)}
            />
        ))
        ) : (
        <p>No active quests found.</p>
        )}
    </div>

    {/*  Modal styled like History page cards */}
{selectedQuest && (
    <div style={modalStyles.overlay} onClick={closeModal}>
    <div style={modalStyles.content} onClick={(e) => e.stopPropagation()}>
        <div style={cardStyles.container}>
        <h2 style={cardStyles.title}>{selectedQuest.Title}</h2>
        <p style={cardStyles.text}><strong>Description:</strong> {selectedQuest["Quest descript"]}</p>
        <p style={cardStyles.text}><strong>Duration:</strong> {selectedQuest["Quest duration"]}</p>
        <p style={cardStyles.text}><strong>XP:</strong> {selectedQuest.xp}</p>
        <p style={cardStyles.text}><strong>Coins:</strong> {selectedQuest.coins}</p>
        <p style={cardStyles.text}><strong>Status:</strong> {selectedQuest.status}</p>
        <p style={cardStyles.text}><strong>Due Date:</strong> {selectedQuest.doDate}</p> {/* ✅ Added */}
        </div>
        <button onClick={closeModal} style={modalStyles.closeButton}>Close</button>
    </div>
    </div>
)}
    </>
);
}

//  Card styles used inside the modal (same as History page)
const cardStyles = {
container: {
    backgroundColor: "#2c2c2c", // Dark background
    borderRadius: "12px",       // Rounded corners
    padding: "1.5rem",          // Inner spacing
    boxShadow: "0 0 15px #6a0dad", // Glowing purple border
    color: "#f0e6ff",           // Light text color
    fontFamily: "initial",      // Default font
    marginBottom: "1rem",       // Space below card
},
title: {
    fontFamily: "'Press Start 2P', cursive", // Pixel-style font
    fontSize: "1.2rem",
    color: "#8a2be2",         // Purple title
    marginBottom: "1rem",
    
},
text: {
    marginBottom: "0.8rem",
    fontSize: "1rem",
},
};

// ✅ Modal wrapper and content styles
const modalStyles = {
overlay: {
    position: "fixed",             // Covers entire screen
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.7)", // Semi-transparent dark background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,                  // Ensures it's above everything
},
content: {
    backgroundColor: "#1a1a1a",    // Dark modal box
    padding: "2rem",
    borderRadius: "12px",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "80vh",            
    boxShadow: "0 0 20px #6a0dad", // Glowing purple box
    color: "#f0e6ff",
    fontFamily: "initial",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflowY: "auto", // ✅ Scroll if content is too long
    wordWrap: "break-word", // ✅ Wrap long words
    overflowWrap: "break-word",

},
closeButton: {
    marginTop: "20px",
    background: "#6a0dad",         // Purple background
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "box-shadow 0.3s ease, background-color 0.3s ease",
},
};