import React, { useEffect, useState } from "react";
import { DataCard } from "../components/cards";
import { supabase } from "../supabaseClient";

export function Home() {
const [quests, setQuests] = useState([]);
const [selectedQuest, setSelectedQuest] = useState(null);
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState("");

const [account, setAccount] = useState(null);
const [loadingAccount, setLoadingAccount] = useState(true);

const fetchAccount = async () => {
        const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser") || "null");

        if (!loggedInUser) {
        setLoadingAccount(false);
        return;
        }

        const { data, error } = await supabase
        .from("Accounts")
        .select("*")
        .eq("id", loggedInUser.id)
        .single();

        if (!error) setAccount(data);
        setLoadingAccount(false);
    };

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

    const today = new Date();

    const formatted = data
        .map((q) => {
        const createdDate = new Date(q.created_at);
        const daysPassed = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
        const remainingDuration = Math.max(q.duration - daysPassed, 0); // prevent negative

        return {
            id: q.id,
            Title: q.Title,
            "Quest descript": q.Description,
            "Quest duration": `${remainingDuration} days left`,
            xp: q.XP.toString(),
            coins: q.Coins.toString(),
            status: q.stateus,
            created_at: q.created_at,
            duration: remainingDuration,
            originalDuration: q.duration,
            doDate: q.doDate
        };
        })
        .sort((a, b) => a.duration - b.duration); // Sort by shortest remaining duration

    setQuests(formatted);
    } catch (err) {
    setMessage("Error fetching quests: " + err.message);
    } finally {
    setLoading(false);
    }
};

    fetchAccount();

fetchQuests();
}, []);

const handleComplete = async (index) => {
const quest = quests[index];
if (!quest) return;

const now = new Date();
const createdDate = new Date(quest.created_at);
const allowedMs = quest.originalDuration * 24 * 60 * 60 * 1000; // ✅ use original duration
const isExpired = now.getTime() - createdDate.getTime() > allowedMs;

const newStatus = isExpired ? "failed" : "completed";

const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser") || "null");
if (!loggedInUser) {
    setMessage("User not found.");
    return;
}

try {
    // ✅ Update quest status
    const { error: questError } = await supabase
    .from("Quests")
    .update({ stateus: newStatus })
    .eq("id", quest.id);

    if (questError) throw questError;

    // ✅ Fetch account data
    const { data: accountData, error: accountError } = await supabase
    .from("Accounts")
    .select("XP, Coins, streak, weekstreak, monthstreek, level, fiveQuest, tenQuest, twentyQuest, fiveWeek, tenWeek, treeMonth, sixMonth, twelvMonth")
    .eq("id", loggedInUser.id)
    .single();

    if (accountError) throw accountError;

    let updatedXP = accountData.XP;
    let updatedCoins = accountData.Coins;
    let updatedStreak = accountData.streak;
    let updatedWeekStreak = accountData.weekstreak;
    let updateMonthStreek = accountData.monthstreek;
    let updateLevel = accountData.level;

    const badgeUpdates = {};

    if (newStatus === "completed") {
    updatedXP += parseInt(quest.xp);
    updatedCoins += parseInt(quest.coins);
    updatedStreak += 1;

    if (quest.originalDuration === 7) updatedWeekStreak += 1;
    if (quest.originalDuration === 30) updateMonthStreek += 1;

    // Fetch badge data
    const { data: badgeData, error: badgeError } = await supabase
        .from("badges")
        .select("*")
        .single();
    if (badgeError) throw badgeError;

    // Quest streak badges
    if (updatedStreak >= 5 && !accountData["fiveQuest"]) badgeUpdates["fiveQuest"] = badgeData["5quests"];
    if (updatedStreak >= 10 && !accountData["tenQuest"]) badgeUpdates["tenQuest"] = badgeData["10quests"];
    if (updatedStreak >= 20 && !accountData["twentyQuest"]) badgeUpdates["twentyQuest"] = badgeData["20quests"];

    // Weekly streak badges
    if (updatedWeekStreak >= 5 && !accountData["fiveWeek"]) badgeUpdates["fiveWeek"] = badgeData["5weekly"];
    if (updatedWeekStreak >= 10 && !accountData["tenWeek"]) badgeUpdates["tenWeek"] = badgeData["10weekly"];

    // Monthly streak badges
    if (updateMonthStreek >= 3 && !accountData["treeMonth"]) badgeUpdates["treeMonth"] = badgeData["3month"];
    if (updateMonthStreek >= 6 && !accountData["sixMonth"]) badgeUpdates["sixMonth"] = badgeData["6month"];
    if (updateMonthStreek >= 12 && !accountData["twelvMonth"]) badgeUpdates["twelvMonth"] = badgeData["12month"];
    } else {
    updatedStreak = 0;
    }

    // Level calculation
    const { data: levelData, error: levelError } = await supabase
    .from("levels")
    .select("levelNr,xpRequierd")
    .order("levelNr", { ascending: true });

    if (levelError) throw levelError;

    for (let i = 0; i < levelData.length; i++) {
    const levelInfo = levelData[i];
    if (updatedXP >= levelInfo.xpRequierd && levelInfo.levelNr > updateLevel) {
        updateLevel = levelInfo.levelNr;
    }
    }

    // Update account
    const { error: updateError } = await supabase
    .from("Accounts")
    .update({
        XP: updatedXP,
        Coins: updatedCoins,
        streak: updatedStreak,
        weekstreak: updatedWeekStreak,
        monthstreek: updateMonthStreek,
        level: updateLevel,
        ...badgeUpdates
    })
    .eq("id", loggedInUser.id);

    if (updateError) throw updateError;

    // Update UI
    const updated = [...quests];
    updated[index].status = newStatus;
    setQuests(updated.filter((q) => q.status === "active"));
} catch (err) {
    setMessage("Error updating quest: " + err.message);
}
await fetchAccount();
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
    await fetchAccount();
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
    
{/* Account Info Section */}
    {account && (
    <div style={styles.infoBox}>
        <h2 style={{ fontFamily: "initial" }}>Your Stats</h2>
        <p><strong>Level:</strong> {account.level}</p>
        <p><strong>XP:</strong> {account.XP}</p>
        <p><strong>Coins:</strong> {account.Coins}</p>
        <p><strong>Streak:</strong> {account.streak} quests</p>
        <p><strong>Today:</strong> {new Date().toLocaleDateString("en-SE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
        })}</p>

        {/* Badges */}
        <div style={styles.badgesContainer}>
        <h3>Your Badges</h3>
        <div style={styles.badgesGrid}>
            {[
            "fiveQuest", "tenQuest", "twentyQuest",
            "fiveWeek", "tenWeek", "treeMonth",
            "sixMonth", "twelvMonth"
            ].map((key) =>
            account[key] ? (
                <img
                key={key}
                src={account[key]}
                alt={key}
                style={styles.badgeImage}
                />
            ) : (
                <span key={key} style={styles.notOwned}>Badge not owned</span>
            )
            )}
        </div>
        </div>
    </div>
    )}


    {/* Active Quests Section */}
    <h1 style={{ fontFamily: "initial" }}>These are your active quests</h1>
    {message && <p style={{ color: "red" }}>{message}</p>}

    <div
    style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
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

    {/* Modal for Selected Quest */}
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
            <p style={cardStyles.text}><strong>Due Date:</strong> {selectedQuest.doDate}</p>
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

// Modal wrapper and content styles
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
const styles = {
infoBox: {
    padding: "1rem",
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: "8px",
    marginBottom: "2rem",
    fontFamily: "initial",
    textAlign: "center"
},
badgesContainer: {
    marginTop: "1rem",
    padding: "1rem",
    backgroundColor: "#333",
    borderRadius: "8px",
    color: "#fff"
},
badgesGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    justifyContent: "center",
    marginTop: "1rem"
},
badgeImage: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.5)"
},
notOwned: {
    fontSize: "0.8rem",
    color: "#aaa",
    textAlign: "center",
    width: "80px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#444",
    borderRadius: "8px"
}
};
