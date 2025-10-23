import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function Profile() {
const [account, setAccount] = useState(null);
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState("");
const [updating, setUpdating] = useState(false);

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

// ✅ Update profile picture
const handleSetProfileImage = async (imageUrl) => {
    if (!imageUrl || imageUrl === account.inuse) return;
    setUpdating(true);

    try {
    const { error } = await supabase
        .from("Accounts")
        .update({ inuse: imageUrl })
        .eq("id", account.id);

    if (error) throw error;

    setAccount((prev) => ({ ...prev, inuse: imageUrl }));
    } catch (err) {
    alert("Error updating profile picture: " + err.message);
    } finally {
    setUpdating(false);
    }
};

if (loading) return <p>Loading profile...</p>;
if (message) return <p>{message}</p>;
if (!account) return <p>No account data found.</p>;

// ✅ Collect purchased images
const purchasedImages = [
    account.image1,
    account.image2,
    account.image3,
    account.image4,
    account.image5
];

return (
    <>
    <div style={styles.container}>
        {/* Profile picture */}
        <img
        src={account.inuse || "/images/default-profile.png"}
        alt="Profile"
        width="200"
        style={styles.image}
        />

        {/* Account info */}
        <div style={styles.info}>
        <p><strong>Account Name:</strong> {account["Account name"]}</p>
        <p><strong>Account ID:</strong> {account.id}</p>
        <p><strong>XP:</strong> {account.XP}</p>
        <p><strong>Coins:</strong> {account.Coins}</p>
        <p><strong>Streak:</strong> {account.streak}</p>
        <p><strong>Level:</strong> {account.level}</p>
        </div>
    </div>

    {/* ✅ Profile Image Selection */}
    <div style={styles.badgesContainer}>
        <h3>Choose Your Profile Picture</h3>
        <div style={styles.badgesGrid}>
        {purchasedImages.map((img, index) => (
            <div
            key={index}
            style={{
                ...styles.badgeItem,
                border: img === account.inuse ? "3px solid gold" : "1px solid #444"
            }}
            onClick={() => img && handleSetProfileImage(img)}
            >
            {img ? (
                <img src={img} alt={`Image ${index + 1}`} style={styles.badgeImage} />
            ) : (
                <span style={styles.notOwned}>Not Owned</span>
            )}
            </div>
        ))}
        </div>
        {updating && <p style={{ color: "yellow" }}>Updating profile picture...</p>}
    </div>

    {/* ✅ Your existing badge section stays here */}
    <div style={styles.badgesContainer}>
        <h3>Your Badges</h3>
        <div style={styles.badgesGrid}>
        {account.fiveQuest ? (
            <img src={account.fiveQuest} alt="Five Quests" width="200" style={styles.image} />
        ) : (
            <span style={styles.notOwned}>Badge not owned</span>
        )}
        {/* Repeat your other badge checks here as you already have */}
        </div>
    </div>
    </>
);
}

// ✅ Styles
const styles = {
container: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    padding: "1rem",
    backgroundColor: "#333",
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
},
badgesContainer: {
    marginTop: "2rem",
    padding: "1rem",
    backgroundColor: "#333",
    borderRadius: "8px",
    color: "#fff"
},
badgesGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    marginTop: "1rem"
},
badgeItem: {
    width: "100px",
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#444",
    borderRadius: "8px",
    cursor: "pointer"
},
badgeImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "8px"
},
notOwned: {
    fontSize: "0.8rem",
    color: "#aaa",
    textAlign: "center"
}
};