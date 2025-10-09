import React, { useEffect, useState } from "react";
import DataCard from "../components/cards";

export function History() {
  const [quests, setQuests] = useState([]);
  const [originalQuests, setOriginalQuests] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("quests");
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (stored && loggedInUser) {
      const parsed = JSON.parse(stored);

      // ✅ Filter quests for the logged-in account
      const userQuests = parsed.filter((q) => q.accountId === loggedInUser.id);

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

  const handleDelete = (index) => {
    const updatedOriginal = [...originalQuests];
    const questToDelete = updatedOriginal[index];

    updatedOriginal.splice(index, 1);
    setOriginalQuests(updatedOriginal);

    // ✅ Update localStorage with only remaining quests for all users
    const allQuests = JSON.parse(localStorage.getItem("quests") || "[]");
    const filteredAll = allQuests.filter(
      (q) =>
        q.accountId !== questToDelete.accountId ||
        q.title !== questToDelete.title
    );
    localStorage.setItem("quests", JSON.stringify(filteredAll));

    const updatedFormatted = [...quests];
    updatedFormatted.splice(index, 1);
    setQuests(updatedFormatted);
  };

  const handleDeleteAllPast = () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    const filteredOriginal = originalQuests.filter(
      (q) => q.status !== "completed" && q.status !== "failed"
    );
    setOriginalQuests(filteredOriginal);

    // ✅ Update localStorage for all users
    const allQuests = JSON.parse(localStorage.getItem("quests") || "[]");
    const filteredAll = allQuests.filter(
      (q) =>
        q.accountId !== loggedInUser.id ||
        (q.status !== "completed" && q.status !== "failed")
    );
    localStorage.setItem("quests", JSON.stringify(filteredAll));

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
              cursor: "pointer",
            }}
          >
            Delete All Completed/Failed Quests
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {pastQuests.length > 0 ? (
          pastQuests.map((item, index) => (
            <DataCard key={index} item={item} onDelete={() => handleDelete(index)} />
          ))
        ) : (
          <p>No completed or failed quests available</p>
        )}
      </div>
    </>
  );
}