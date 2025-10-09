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
/*{
"name": "my-app",
"private": true,
"version": "0.0.0",
"type": "module",
"scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
},
"dependencies": {
    "cors": "^2.8.5",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.9.1"
},
"devDependencies": {
    "@eslint/js": "^9.35.0",
    "@types/react": "^19.1.16",
    "@types/react-dom": "^19.1.9",
    "@vitejs/plugin-react": "^5.0.2",
    "concurrently": "^9.2.1",
    "eslint": "^9.35.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "express": "^5.1.0",
    "globals": "^16.4.0",
    "typescript": "^5.9.2",
    "vite": "^7.1.6"
}
}*/
const [newItem,setNewItem] = useState("")
    const [todos, setQuest] = useState([])
    
    function submissionHandler(e){
        e.preventDefault()

        setQuest(currentQuest => {
            return [ ...currentQuest,
                //uses randomUUID to generate a unique ID
                {id: crypto.randomUUID(), title:newItem, remove: false},

            ]
        })
        setNewItem("") //resetts input field
    }

    function toggleQuest(id, remove){
        //uppdated teh remove status of an item
        setQuest(currentQuest=>{
            //finds item by id and keeps the other unchanged
            return currentQuest.map(todo =>{
                if(todo.id===id)
                {
                    return{...todo, remove}
                }
                return todo
            })
        })
    }

    function deleteQuest(id){
        setQuest(currentQuest =>{
            //fileter to keep all items but the one maching the id
            return currentQuest.filter(todo => todo.id !== id)
        })
    }
    return(
        <>
            <h1> Crate your quests here</h1>
            <form onSubmit={submissionHandler}>
                <div>
                    <label htmlFor="title">Quest title</label>
                    {/*e stand for event object and traget is in this case the 
                    textbox and value acceces the text in the box */} 
                    <input value={newItem} onChange={e => setNewItem(e.target.value)} type="text" maxLength="50" id = "title"/>
                    <p></p>
                </div>
                <div>
                    <lable htmlFor ="descript">Quest description</lable>
                    <input type="text" maxLength="200" id = "descript"/>
                    <p></p>
                </div>
            
                <div>
                    <select id = 'tiemSelect'>
                        <option value={'0'}>One Time</option>
                        <option value={'1'}>One day</option>
                        <option value={'7'}>One week</option>
                        <option value={'30'}>One Month</option>
                    </select>
                    <p></p>
                </div>
                
                    <button className="create_btn">Create Quest</button>
                
            </form>
            <h1 className="header">Created quests:</h1>
            <ul className="list">

                {todos.map(todo =>{
                    return( <li key ={todo.id}>
                        <label >
                            <input type="checkbox" checked={todo.remove} 
                            onChange={e => toggleQuest(todo.id, e.target.checked)} />
                            {todo.title}
                        </label>
                        <button className="btn-delete-btn" onClick={()=>deleteQuest(todo.id)}> Delete </button>
                    </li>)
                
                })}
                
            </ul>

        </>
    )
    import { useState } from "react";

function CreateQuestPage() {
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [duration, setDuration] = useState("One Time");

const handleCreateQuest = () => {
    // Calculate extra info
    const questId = `Q${Date.now()}`; // unique ID based on timestamp
    const xp = duration === "One Time" ? 100 : 200; // example logic
    const coins = xp / 2; // example logic
    const creationDate = new Date().toISOString().split("T")[0];
    const accountId = "A123"; // could come from user session

    // Build quest object
    const newQuest = {
    questId,
    title,
    description,
    duration,
    xp,
    coins,
    status: "active",
    creationDate,
    accountId
    };

    // Get existing quests from localStorage
    const stored = localStorage.getItem("quests");
    const quests = stored ? JSON.parse(stored) : [];

    // Add new quest
    quests.push(newQuest);

    // Save back to localStorage
    localStorage.setItem("quests", JSON.stringify(quests));

    // Clear form
    setTitle("");
    setDescription("");
    setDuration("One Time");

    alert("Quest created successfully!");
};

return (
    <div style={{ color: "white", background: "#222", padding: "20px" }}>
    <h2>Create Quest</h2>
    <div>
        <label>Quest title</label>
        <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        />
    </div>
    <div>
        <label>Quest description</label>
        <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        />
    </div>
    <div>
        <select value={duration} onChange={(e) => setDuration(e.target.value)}>
        <option value="One Time">One Time</option>
        <option value="Daily">Daily</option>
        <option value="Weekly">Weekly</option>
        </select>
    </div>
    <button onClick={handleCreateQuest}>Create Quest</button>
    </div>
);
}


