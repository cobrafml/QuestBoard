import React from 'react';

interface QuestItem {
  Title: string;
  "Quest descript": string;
  "Quest duration": string;
  xp: string;
  coins: string;
  status: string;
  "account ID": string;
}

interface DataCardProps {
  item: QuestItem;
  onDelete: () => void;
  onComplete?: () => void; // ✅ Optional for History page
}

const DataCard: React.FC<DataCardProps> = ({ item, onDelete, onComplete }) => {
  return (
    <> 
    <div style={styles.card}>
      <h3>{item.Title}</h3>
      <div>
        <strong>Description:</strong>
        <p style={{ marginTop: '0.5rem' }}>{item["Quest descript"]}</p>
      </div>

      <p><strong>Duration:</strong> {item["Quest duration"]}</p>
      <p><strong>XP:</strong> {item.xp}</p>
      <p><strong>Coins:</strong> {item.coins}</p>
      <p><strong>Status:</strong> {item.status}</p>
      <p><strong>Account ID:</strong> {item["account ID"]}</p>

      {/*  Buttons */}
      <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
        {onComplete && (
          <button
            style={{
              flex: 1,
              backgroundColor: "#4c0c77ff",
              color: "#fff",
              padding: "8px 12px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
            onClick={onComplete}
          >
            Complete
          </button>
        )}
        <button
          style={{
            flex: 1,
            backgroundColor: "#04858aff",
            color: "#fff",
            padding: "8px 12px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
    </>
  );
};

const styles: { card: React.CSSProperties } = {
  card: {
    border: '1px solid #000000ff',
    borderRadius: '8px',
    padding: '1rem',
    margin: '1rem',
    boxShadow: '0 5px 10px rgba(151, 81, 231, 1)',
    maxWidth: '300px',
    backgroundColor: '#222',
    color: '#fff'
  }
};

export default DataCard;