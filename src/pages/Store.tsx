import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { CSSProperties } from 'react';

interface StoreItem {
id: number;
name: string;
price: number;
imageURL: string;
}

interface ItemCardProps {
item: StoreItem;
onPurchase: () => void;
disabled: boolean;
}

const cardStyles: {
container: CSSProperties;
title: CSSProperties;
text: CSSProperties;
image: CSSProperties;
button: CSSProperties;
disabled: CSSProperties;
} = {
container: {
    backgroundColor: "#2c2c2c",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 0 15px #6a0dad",
    color: "#f0e6ff",
    fontFamily: "initial",
    textAlign: "center",
    width: "220px",
    height: "320px", // ✅ Fixed height for uniformity
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    opacity: 1,
    transition: "transform 0.2s ease",
},
title: {
    fontFamily: "'Press Start 2P', cursive",
    fontSize: "1rem",
    color: "#8a2be2",
    marginBottom: "0.5rem",
},
text: {
    fontSize: "0.9rem",
    marginBottom: "0.5rem",
},
image: {
    width: "100%",
    height: "120px", // ✅ Fixed image height
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "1rem",
},
button: {
    background: "#6a0dad",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "box-shadow 0.3s ease, background-color 0.3s ease",
},
disabled: {
    backgroundColor: "#555",
    cursor: "not-allowed",
    opacity: 0.6,
},
};

const ItemCards: React.FC<ItemCardProps> = ({ item, onPurchase, disabled }) => {
return (
    <div style={{ ...cardStyles.container, ...(disabled ? cardStyles.disabled : {}) }}>
    <img src={item.imageURL} alt={item.name} style={cardStyles.image} />
    <h2 style={cardStyles.title}>{item.name}</h2>
    <p style={cardStyles.text}><strong>Price:</strong> {item.price} coins</p>
    <button
        onClick={onPurchase}
        disabled={disabled}
        style={{
        ...cardStyles.button,
        ...(disabled ? cardStyles.disabled : {}),
        }}
    >
        {disabled ? "Owned" : "Buy"}
    </button>
    </div>
);
};

export const Store: React.FC = () => {
const [items, setItems] = useState<StoreItem[]>([]);
const [accountId, setAccountId] = useState<number | null>(null);
const [userImages, setUserImages] = useState<(string | null)[]>([]);
const [coins, setCoins] = useState<number>(0);

useEffect(() => {
    const fetchData = async () => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser') || 'null');

    if (!loggedInUser) {
        alert('You must be logged in to view the store.');
        return;
    }

    setAccountId(loggedInUser.id);

    const { data: accountData, error: accountError } = await supabase
        .from('Accounts')
        .select('Coins, image1, image2, image3, image4, image5')
        .eq('id', loggedInUser.id)
        .single();

    if (accountData) {
        setCoins(accountData.Coins);
        setUserImages([
        accountData.image1,
        accountData.image2,
        accountData.image3,
        accountData.image4,
        accountData.image5,
        ]);
    }
    if (accountError) console.error('Error fetching account:', accountError);

    const { data: storeData, error: storeError } = await supabase.from('Store').select('*');
    if (storeData) setItems(storeData);
    if (storeError) console.error('Error fetching store items:', storeError);
    };

    fetchData();
}, []);

const handlePurchase = async (item: StoreItem) => {
    if (!accountId) {
    alert('Please log in to purchase.');
    return;
    }

    if (coins < item.price) {
    alert('Not enough coins to purchase this item!');
    return;
    }

    if (userImages.includes(item.imageURL)) {
    alert('You already own this item!');
    return;
    }

    const emptyIndex = userImages.findIndex((img) => img === null);
    if (emptyIndex === -1) {
    alert('Your inventory is full!');
    return;
    }

    const columnName = `image${emptyIndex + 1}`;
    const newCoins = coins - item.price;

    const { error: updateError } = await supabase
    .from('Accounts')
    .update({
        [columnName]: item.imageURL,
        Coins: newCoins,
    })
    .eq('id', accountId);

    if (updateError) {
    console.error('Error updating account:', updateError);
    } else {
    alert(`Purchased ${item.name}!`);
    const updatedImages = [...userImages];
    updatedImages[emptyIndex] = item.imageURL;
    setUserImages(updatedImages);
    setCoins(newCoins);
    }
};

return (
    <div style={{ fontFamily: 'initial', padding: '20px' }}>
    <h2 style={{ fontFamily: 'initial' }}>Game Store</h2>
    <p style={{ fontFamily: 'initial', fontSize: '18px', marginBottom: '10px' }}>
        Your Coins: <strong>{coins}</strong>
    </p>
    <div
        className="store-grid"
        style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
        }}
    >
        {items.length > 0 ? (
        items.map((item) => (
            <ItemCards
            key={item.id}
            item={item}
            onPurchase={() => handlePurchase(item)}
            disabled={userImages.includes(item.imageURL)}
            />
        ))
        ) : (
        <p>Loading store items...</p>
        )}
    </div>
    </div>
);
};