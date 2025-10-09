import React, { useEffect, useState } from "react";
import DataCard from "../components/cards";

export function Home() {
const [quests, setQuests] = useState([]);
const [originalQuests, setOriginalQuests] = useState([]);

useEffect(() => {
    const stored = localStorage.getItem("quests");
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (stored && loggedInUser) {
    const parsed = JSON.parse(stored);

    const updatedOriginal = parsed.map((q) => {
        if (q.status === "active" || q.status === "ongoing") {
        const now = new Date();
        const createdDate = new Date(q.creationDate);

        const durationMap = {
            "One Time": 1,
            "One Day": 24,
            "One week": 24 * 7,
            "One Month": 24 * 30,
        };

        const allowedHours = durationMap[q.duration] || 1;
        const diffHours = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);

        if (diffHours > allowedHours) {
            q.status = "failed";
        }
        }
        return q;
    });

    // ✅ Filter quests by logged-in user's ID
    const userQuests = updatedOriginal.filter(
        (q) => q.accountId === loggedInUser.id
    );

    localStorage.setItem("quests", JSON.stringify(updatedOriginal));
    setOriginalQuests(userQuests);

    const formatted = userQuests.map((q) => ({
        Title: q.title,
        "Quest descript": q.description,
        "Quest duration": q.duration,
        xp: q.xp.toString(),
        coins: q.coins.toString(),
        status: q.status,
        "account ID": q.accountId,
    }));

    setQuests(formatted);
    }
}, []);

const handleComplete = (index) => {
    const updatedOriginal = [...originalQuests];
    const updatedFormatted = [...quests];

    if (updatedOriginal[index] && updatedFormatted[index]) {
    updatedOriginal[index].status = "completed";
    updatedFormatted[index].status = "completed";

    setOriginalQuests(updatedOriginal);
    setQuests(updatedFormatted);
    localStorage.setItem("quests", JSON.stringify(updatedOriginal));
    }
};

const handleDelete = (index) => {
    const updatedOriginal = [...originalQuests];
    updatedOriginal.splice(index, 1);
    setOriginalQuests(updatedOriginal);
    localStorage.setItem("quests", JSON.stringify(updatedOriginal));

    const updatedFormatted = [...quests];
    updatedFormatted.splice(index, 1);
    setQuests(updatedFormatted);
};

return (
    <>
    <h1>These are your available quests</h1>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {quests
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => item.status === "active" || item.status === "ongoing")
        .map(({ item, index }) => (
            <DataCard
            key={index}
            item={item}
            onDelete={() => handleDelete(index)}
            onComplete={() => handleComplete(index)}
            />
        ))}
    </div>
    </>
);
}