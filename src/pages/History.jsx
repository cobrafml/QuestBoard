import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function History() {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedQuest, setSelectedQuest] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser") || "null");

      if (!loggedInUser) {
        setMessage("You must be logged in to view history.");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("Quests")
          .select("*")
          .eq("accountID", loggedInUser.id)
          .in("stateus", ["completed", "failed"]);

        if (error) throw error;

        const formatted = data.map((q) => ({
          id: q.id,
          Title: q.Title,
          Description: q.Description,
          Duration: `${q.duration} days`,
          XP: q.XP,
          Coins: q.Coins,
          Status: q.stateus,
        }));

        setQuests(formatted);
      } catch (err) {
        setMessage("Error fetching history: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleView = (quest) => setSelectedQuest(quest);
  const closeModal = () => setSelectedQuest(null);

  if (loading) return <p>Loading history...</p>;

  return (
    <>
      <h1>Completed or Failed Quests</h1>
      {message && <p style={{ color: "red" }}>{message}</p>}

      <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #444", borderRadius: "8px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", color: "#fff", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "#333" }}>
              <th style={{ ...styles.th, ...styles.sticky }}>Title</th>
              <th style={{ ...styles.th, ...styles.sticky }}>Description</th>
              <th style={{ ...styles.th, ...styles.sticky }}>Status</th>
              <th style={{ ...styles.th, ...styles.sticky }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {quests.length > 0 ? (
              quests.map((q) => (
                <tr key={q.id} style={{ borderBottom: "1px solid #555" }}>
                  <td style={styles.td}>{q.Title}</td>
                  <td style={styles.td} title={q.Description}>
                    {q.Description.length > 20 ? q.Description.slice(0, 20) + "..." : q.Description}
                  </td>
                  <td style={styles.td}>{q.Status}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleView(q)}
                      style={{
                        backgroundColor: "#4c0c77",
                        color: "#fff",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: "10px", textAlign: "center" }}>
                  No completed or failed quests available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedQuest && (
        <div style={modalStyles.overlay} onClick={closeModal}>
          <div style={modalStyles.content} onClick={(e) => e.stopPropagation()}>
            <h2>{selectedQuest.Title}</h2>
            <p><strong>Description:</strong></p>
            <p style={modalStyles.value}>{selectedQuest.Description}</p>
            <p><strong>Duration:</strong></p>
            <p style={modalStyles.value}>{selectedQuest.Duration}</p>
            <p><strong>XP:</strong></p>
            <p style={modalStyles.value}>{selectedQuest.XP}</p>
            <p><strong>Coins:</strong></p>
            <p style={modalStyles.value}>{selectedQuest.Coins}</p>
            <p><strong>Status:</strong></p>
            <p style={modalStyles.value}>{selectedQuest.Status}</p>
            <button onClick={closeModal} style={modalStyles.closeButton}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  th: {
    padding: "8px",
    textAlign: "left",
    borderBottom: "2px solid #555",
    backgroundColor: "#333",
    color: "#fff",
  },
  sticky: {
    position: "sticky",
    top: 0,
    zIndex: 2,
  },
  td: {
    padding: "6px",
    textAlign: "left",
    verticalAlign: "top",
    maxWidth: "150px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  content: {
    background: "#222",
    color: "#fff",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "400px",
    width: "90%",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "normal",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  },
  value: {
    margin: "0 0 1rem 0",
    fontSize: "1rem",
    color: "#ccc"
  },
  closeButton: {
    marginTop: "10px",
    background: "#4c0c77",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer"
  }
};