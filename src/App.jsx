import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/homePage.jsx";
import { QuestCreator } from "./pages/QuestCreator.jsx";
import { History } from "./pages/History.jsx";
import { Profile } from './pages/profile.jsx';
import { Layout } from "./components/Layout.js";
import { Login } from "./components/login.jsx";
import {RequireAuth} from './components/RequireAuth'




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/create-quests" element={<QuestCreator />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;