import React, { useEffect, useState } from 'react';
import { ItemCards } from '../components/cards';
import { supabase } from '../supabaseClient';

interface StoreItem {
id: number;
name: string;
price: number;
imageURL: string;
}

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

    // ✅ Fetch user's account info
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

    // ✅ Fetch store items
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

    // ✅ Check if user has enough coins
    if (coins < item.price) {
    alert('Not enough coins to purchase this item!');
    return;
    }

    // ✅ Check if user already owns this image
    if (userImages.includes(item.imageURL)) {
    alert('You already own this item!');
    return;
    }

    // ✅ Find first empty slot
    const emptyIndex = userImages.findIndex((img) => img === null);
    if (emptyIndex === -1) {
    alert('Your inventory is full!');
    return;
    }

    // ✅ Update image slot and deduct coins
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
    setCoins(newCoins); // ✅ Update coin balance in UI
    }
};

return (
    <div>
    <h2>Game Store</h2>
    <p style={{ fontSize: '18px', marginBottom: '10px' }}>
        Your Coins: <strong>{coins}</strong>
    </p>
    <div className="store-grid">
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