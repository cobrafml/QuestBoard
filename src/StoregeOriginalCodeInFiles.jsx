/**
 * from app.jsx
 */
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const [count, setCount] = useState(0)

    return (
    <>
        <div>
        <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
        </button>
        <p>
            Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        </div>
        <p className="read-the-docs">
        Click on the Vite and React logos to learn more
        </p>
    </>
    )
}

export default App
import { useEffect, useState } from "react";
import Papa from "papaparse";
import DataCard from "../componets/cards"; // adjust path if needed

export function HomePage() {
const [data, setData] = useState([]);

useEffect(() => {
    Papa.parse("/questInfo.csv", {
    download: true,// creates temorary coppy in browser
    header: true,
    complete: (results) => {
        setData(results.data);
    },
    error: (err) => {
        console.error("Error loading CSV:", err);
    }
    });
}, []);

return (
    <>
    <h1>This is the home page</h1>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {data.map((item, index) => (
        <DataCard key={index} item={item} />
        ))}
    </div>
    </>
);
}