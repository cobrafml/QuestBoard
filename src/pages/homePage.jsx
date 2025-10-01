import { useEffect, useState } from "react";
import Papa from "papaparse";
import DataCard from "../components/cards"; // Make sure folder name is correct

export function Home() {
const [data, setData] = useState([]);

useEffect(() => {
    Papa.parse("/questInfo.csv", {
    download: true,
    header: true,
    complete: (results) => {
        console.log("CSV loaded:", results.data); // ✅ Add this line
        setData(results.data);
    },
    error: (err) => {
        console.error("Error loading CSV:", err);
    }
    });
}, []);

return (
    <>
    <div>Home Page</div>
    <h1>This is the home page</h1>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {data.map((item, index) => (
        <DataCard key={index} item={item} />
        ))}
    </div>
    </>
);
}