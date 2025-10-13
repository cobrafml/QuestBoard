import React from 'react';

interface QuestItem {
  Title: string;
  "Quest descript": string;
  "Quest duration": string;
  xp: string;
  coins: string;
  status: string;
}

interface DataCardProps {
  item: QuestItem;
  onDelete: () => void;
  onComplete?: () => void;
  onView?: () => void;
  onFail?: () => void;
  onEdit?: () => void;
}

const DataCard: React.FC<DataCardProps> = ({
  item,
  onDelete,
  onComplete,
  onView,
  onFail,
  onEdit
}) => {
  return (
    <div style={styles.card} onClick={onView}>
      <h3 style={styles.title}>{item.Title}</h3>

      <div style={styles.infoBlock}>
        <p style={styles.label}>Description:</p>
        <p style={styles.value}>{item["Quest descript"]}</p>
      </div>

      <div style={styles.infoBlock}>
        <p style={styles.label}>Duration:</p>
        <p style={styles.value}>{item["Quest duration"]}</p>
      </div>

      <div style={styles.infoBlock}>
        <p style={styles.label}>XP:</p>
        <p style={styles.value}>{item.xp}</p>
      </div>

      <div style={styles.infoBlock}>
        <p style={styles.label}>Coins:</p>
        <p style={styles.value}>{item.coins}</p>
      </div>

      <div style={styles.infoBlock}>
        <p style={styles.label}>Status:</p>
        <p style={styles.value}>{item.status}</p>
      </div>

      <div style={styles.buttonRow}>
        {onComplete && (
          <button
            style={styles.completeButton}
            onClick={(e) => {
              e.stopPropagation();
              onComplete();
            }}
          >
            Complete
          </button>
        )}
        <button
          style={styles.deleteButton}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          Delete
        </button>
      </div>

      {(onFail || onEdit) && (
        <div style={styles.buttonRow}>
          {onFail && (
            <button
              style={styles.failButton}
              onClick={(e) => {
                e.stopPropagation();
                onFail();
              }}
            >
              Fail Quest
            </button>
          )}
          {onEdit && (
            <button
              style={styles.editButton}
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              Edit Quest
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    border: '1px solid #000',
    borderRadius: '8px',
    padding: '1rem',
    margin: '0.5rem',
    boxShadow: '0 5px 10px rgba(151, 81, 231, 1)',
    backgroundColor: '#222',
    color: '#fff',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    overflow: 'hidden',
    boxSizing: 'border-box'
  },
  title: {
    marginBottom: '0.8rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    wordBreak: 'break-word'
  },
  infoBlock: {
    marginBottom: '0.8rem'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '0.2rem'
  },
  value: {
    margin: 0,
    color: '#ccc',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  buttonRow: {
    display: "flex",
    gap: "8px",
    marginTop: "10px"
  },
  completeButton: {
    flex: 1,
    backgroundColor: "#4c0c77",
    color: "#fff",
    padding: "8px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#04858a",
    color: "#fff",
    padding: "8px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  failButton: {
    flex: 1,
    backgroundColor: "#a00",
    color: "#fff",
    padding: "8px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  editButton: {
    flex: 1,
    backgroundColor: "#0a7",
    color: "#fff",
    padding: "8px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default DataCard;