// App.tsx

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/homePage.jsx";
import { QuestCreator } from "./pages/QuestCreator.jsx";
import { History } from "./pages/History.jsx";
import { Layout } from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/create-quests" element={<QuestCreator />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;