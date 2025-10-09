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

export function History() {
  const [quests, setQuests] = useState<QuestItem[]>([]);
  const [originalQuests, setOriginalQuests] = useState<any[]>([]);

  // Load quests from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("quests");
    if (stored) {
      const parsed = JSON.parse(stored);
      setOriginalQuests(parsed);

      const formatted = parsed.map((q: any) => ({
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

  // Delete a single quest
  const handleDelete = (index: number) => {
    const updatedOriginal = [...originalQuests];
    updatedOriginal.splice(index, 1);
    setOriginalQuests(updatedOriginal);
    localStorage.setItem("quests", JSON.stringify(updatedOriginal));

    const updatedFormatted = [...quests];
    updatedFormatted.splice(index, 1);
    setQuests(updatedFormatted);
  };

  // Delete all completed or failed quests
  const handleDeleteAllPast = () => {
    const filteredOriginal = originalQuests.filter(
      (q) => q.status !== "completed" && q.status !== "failed"
    );
    setOriginalQuests(filteredOriginal);
    localStorage.setItem("quests", JSON.stringify(filteredOriginal));

    const filteredFormatted = quests.filter(
      (q) => q.status !== "completed" && q.status !== "failed"
    );
    setQuests(filteredFormatted);
  };

  
  const pastQuests = quests.filter(
    (item) => item.status === "completed" || item.status === "failed"
  );

  return (
    <>
      <h1>Completed or Failed Quests</h1>

      {/* Delete all past quests button */}
      {pastQuests.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={handleDeleteAllPast}
            style={{
              padding: "10px 15px",
              backgroundColor: "#5a055aff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Delete All Completed/Failed Quests
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {pastQuests.length > 0 ? (
          pastQuests.map((item, index) => (
            <DataCard
              key={index}
              item={item}
              onDelete={() => handleDelete(index)} // Only delete button
            />
          ))
        ) : (
          <p>No completed or failed quests available</p>
        )}
      </div>
    </>
  );
}