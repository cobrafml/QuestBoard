import React from 'react';

// Define the shape of the item prop
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
}

const DataCard: React.FC<DataCardProps> = ({ item }) => {
  return (
    <div style={styles.card}>
      <h3>{item.Title}</h3>
      <p><strong>Description:</strong> {item["Quest descript"]}</p>
      <p><strong>Duration:</strong> {item["Quest duration"]}</p>
      <p><strong>XP:</strong> {item.xp}</p>
      <p><strong>Coins:</strong> {item.coins}</p>
      <p><strong>Status:</strong> {item.status}</p>
      <p><strong>Account ID:</strong> {item["account ID"]}</p>
      <button>Compleated</button>
    </div>
  );
};

const styles: { card: React.CSSProperties } = {
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
    margin: '1rem',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    maxWidth: '300px',
  }
};

export default DataCard;