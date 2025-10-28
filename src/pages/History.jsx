import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function History() {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedQuest, setSelectedQuest] = useState(null);

  useEffect(() => {
    //Filter for completed or failed quests
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
    <>{/*Normal table to show history*/}
      <h1 style={{fontFamily: 'italiac'}} >Completed or Failed Quests</h1>
      {message && <p style={{ color: "red" }}>{message}</p>}

      <div className="game-table-container">
        <table className="game-table">
          <thead>
            <tr>
              <th style={{ ...styles.th, ...styles.sticky }}>Title</th>
              <th style={{ ...styles.th, ...styles.sticky }}>Description</th>
              <th style={{ ...styles.th, ...styles.sticky }}>Status</th>
              <th style={{ ...styles.th, ...styles.sticky }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {quests.length > 0 ? (
              quests.map((q) => (
                <tr key={q.id}>
                  <td style={styles.td}>{q.Title}</td>
                  <td style={styles.td} title={q.Description}>
                    {q.Description.length > 20 ? q.Description.slice(0, 20) + "..." : q.Description}
                  </td>
                  <td style={styles.td}>{q.Status}</td>
                  <td style={styles.td}>
                    <button
                      className="view-btn"
                      onClick={() => handleView(q)}
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

  {/*Vew mode*/}
  {selectedQuest && (
    <div style={modalStyles.overlay} onClick={closeModal}>
      <div style={modalStyles.content} onClick={(e) => e.stopPropagation()}>
        <div style={cardStyles.container}>
          <h2 style={cardStyles.title}>{selectedQuest.Title}</h2>
          <p style={cardStyles.text}><strong>Description:</strong> {selectedQuest.Description}</p>
          <p style={cardStyles.text}><strong>Duration:</strong> {selectedQuest.Duration}</p>
          <p style={cardStyles.text}><strong>XP:</strong> {selectedQuest.XP}</p>
          <p style={cardStyles.text}><strong>Coins:</strong> {selectedQuest.Coins}</p>
          <p style={cardStyles.text}><strong>Status:</strong> {selectedQuest.Status}</p>
        </div>
        <button className = 'close-btn' style={modalStyles.closeButton} onClick={closeModal}>Close</button>
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

const cardStyles = {
  container: {
    backgroundColor: "#2c2c2c",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 0 15px #6a0dad",
    color: "#f0e6ff",
    fontFamily: "initial",
    marginBottom: "1rem",
  },
  title: {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: "1.2rem",
    color: "#8a2be2",
    marginBottom: "1rem",
  },
  text: {
    marginBottom: "0.8rem",
    fontSize: "1rem",
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
    alignItems: "center",
    zIndex: 9999, 
  },
  
content: {
  wordWrap: "break-word",
  overflowWrap: "break-word",
  whiteSpace: "normal", // fixed typo from "withsetSpace"
  maxHeight: "80vh", // only one instance now
  backgroundColor: "#1a1a1a",
  padding: "2rem",
  borderRadius: "12px",
  maxWidth: "600px",
  width: "90%",
  overflowY: "auto",
  boxShadow: "0 0 20px #6a0dad",
  color: "#f0e6ff",
  fontFamily: "initial",
  textAlign: "center",
}
,
  value: {
    margin: "0 0 1rem 0",
    fontSize: "1rem",
    color: "#ccc",
  },
  closeButton: {
    marginTop: "20px",
    background: "#6a0dad",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "box-shadow 0.3s ease, background-color 0.3s ease",
  },
};