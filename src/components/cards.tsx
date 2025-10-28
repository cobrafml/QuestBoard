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
  //  Limit description to 200 characters
  const truncatedDescription =
    item["Quest descript"].length > 200
      ? item["Quest descript"].slice(0, 200) + "..."
      : item["Quest descript"];

  return (
    <div style={styles.card} onClick={onView}>
      <h3 style={styles.title}>{item.Title}</h3>

      <div style={styles.infoBlock}>
        <p style={styles.label}>Description:</p>
        <p style={styles.value}>{truncatedDescription}</p>
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
            className="close-btn"
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
          className="close-btn"
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
              className="close-btn"
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
              className="close-btn"
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


//  Styles
const buttonBase: React.CSSProperties = {
  flex: 1,
  padding: "10px 14px",
  border: "2px solid #fff",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontFamily: '"Cinzel", serif',
  letterSpacing: "0.5px",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
  textTransform: "uppercase",
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    background: 'url("/assets/parchment-bg.png") center/cover no-repeat',
    border: '2px solid #20ccd8ff',
    borderRadius: '12px',
    padding: '1rem',
    margin: '0.5rem',
    boxShadow: '0 0 15px rgba(0, 255, 136, 0.4)',
    color: '#3b2f2f',
    fontFamily: '"Cinzel", serif',
    width: '350px',
    minHeight: '450px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    overflow: 'hidden',
  },

  title: {
    marginBottom: '0.8rem',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#0fa14cff',
    textShadow: '1px 1px 0 #22e9f0ff',
    textAlign: 'center',
  },

  infoBlock: {
    marginBottom: '0.6rem',
    padding: '0.4rem',
    borderRadius: '6px',
  },

  label: {
    fontWeight: 'bold',
    marginBottom: '0.2rem',
    color: '#2bd8c1ff',
  },

  value: {
    margin: 0,
    color: '#42d6dbff',
    fontStyle: 'italic',
    display: '-webkit-box',
    WebkitLineClamp: 4, //  Show max 4 lines
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  buttonRow: {
    display: "flex",
    gap: "8px",
    marginTop: "10px",
    flexWrap: "wrap",
  },

  completeButton: {
    ...buttonBase,
    background: "linear-gradient(135deg, #4c0c77, #6e48aa)",
    color: "#fff",
    boxShadow:'0 0 15px rgba(0, 255, 136, 0.4)',
    border:'2px solid #20ccd8ff',
  },

  deleteButton: {
    ...buttonBase,
    background: "linear-gradient(135deg, #04858a, #06b6b2)",
    color: "#fff",
  },

  failButton: {
    ...buttonBase,
    background: "linear-gradient(135deg, #a00, #d33)",
    color: "#fff",
  },

  editButton: {
    ...buttonBase,
    background: "linear-gradient(135deg, #0a7, #3ddc97)",
    color: "#fff",
  },

  storeCard: {
    width: '250px',
    minHeight: '320px',
    background: '#fff',
    borderRadius: '12px',
    padding: '1rem',
    margin: '0.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  storeImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px',
  },

  storeTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '8px',
  },

  storePrice: {
    fontSize: '1rem',
    marginBottom: '12px',
  },

  storeButton: {
    ...buttonBase,
    background: "linear-gradient(135deg, #04858a, #06b6b2)",
    color: "#fff",
    width: '100%',
  }
};

export { DataCard};