import React, { useEffect, useState } from "react";
import DataCard from "../components/cards";

interface QuestItem {
Title: string;
"Quest descript": string;
"Quest duration": string;
xp: string;
coins: string;
status: string;
"account ID": string;
}

export function Home() {
const [quests, setQuests] = useState<QuestItem[]>([]);
const [originalQuests, setOriginalQuests] = useState<any[]>([]);

// Load quests and check for expired ones
useEffect(() => {
    const stored = localStorage.getItem("quests");
    if (stored) {
    const parsed = JSON.parse(stored);

    // ✅ Check if any quest has expired
    const updatedOriginal = parsed.map((q: any) => {
        if (q.status === "active" || q.status === "ongoing") {
        const now = new Date();
        const createdDate = new Date(q.creationDate);

        // Convert duration to hours
        const durationMap: Record<string, number> = {
            "One Time": 1,
            "One Day": 24,
            "One week": 24 * 7,
            "One Month": 24 * 30
        };

        const allowedHours = durationMap[q.duration] || 1;
        const diffHours = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);

        if (diffHours > allowedHours) {
            q.status = "failed"; // Mark as failed if expired
        }
        }
        return q;
    });

    localStorage.setItem("quests", JSON.stringify(updatedOriginal));
    setOriginalQuests(updatedOriginal);

    // Convert keys for display
    const formatted = updatedOriginal.map((q: any) => ({
        Title: q.title,
        "Quest descript": q.description,
        "Quest duration": q.duration,
        xp: q.xp.toString(),
        coins: q.coins.toString(),
        status: q.status,
        "account ID": q.accountId
    }));

    setQuests(formatted);
    }
}, []);


const handleComplete = (index: number) => {
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


// Delete quest permanently
const handleDelete = (index: number) => {
    const updatedOriginal = [...originalQuests];
    updatedOriginal.splice(index, 1);
    setOriginalQuests(updatedOriginal);
    localStorage.setItem("quests", JSON.stringify(updatedOriginal));

    const updatedFormatted = [...quests];
    updatedFormatted.splice(index, 1);
    setQuests(updatedFormatted);
};

// ✅ Show only active or ongoing quests
const filteredData = quests.filter(
    (item) => item.status === "active" || item.status === "ongoing"
);

return (
    <>
    <h1>These are your available quests</h1>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {filteredData.length > 0 ? (
        filteredData.map((item, index) => (
            <DataCard
            key={index}
            item={item}
            onDelete={() => handleDelete(index)}
            onComplete={() => handleComplete(index)} // Pass complete handler
            />
        ))
        ) : (
        <p>No active or ongoing quests available</p>
        )}
    </div>
    </>
);
}