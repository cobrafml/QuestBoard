// App.tsx

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import  {Home}  from "./pages/homePage";
import  {QuestCreator}  from "./pages/QuestCreator.jsx";
import  {History}  from "./pages/History";
import {Profile} from './pages/profile.jsx'
import { Layout } from "./components/Layout";
import { useCsv } from "./components/CsvPrevider.jsx";
import { useEffect } from "react";
import Papa from "papaparse";


interface QuestItem {
  Title: string;
  "Quest descript": string;
  "Quest duration": string;
  xp: string;
  coins: string;
  status: string;
  "account ID": string;
};

function App() {
  const{setCsvData} = useCsv();
  
  useEffect(()=>{
    Papa.parse("/questInfo.csv",{
      download: true,
      header: true,
      complete: (results: any) =>{
        console.log('CSV loaded:', results.data);
        setCsvData(results.data as QuestItem[]);
      },
    });
  },[]);

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/create-quests" element={<QuestCreator />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;