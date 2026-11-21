import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import Matchmaking from "./pages/Matchmaking";
import Battle from "./pages/Battle";
import Interview from "./pages/Interview";
import InterviewResult from "./pages/InterviewResult";
import Profile from "./pages/Profile";
import HistoryPage from "./pages/History";
import Leaderboard from "./pages/Leaderboard";
import SettingsPage from "./pages/Settings";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/problems" element={<Problems />} />

        <Route path="/matchmaking" element={<Matchmaking />} />

        <Route path="/battle" element={<Battle />} />

        <Route path="/interview" element={<Interview />} />

        <Route path="/interview-result" element={<InterviewResult />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/history" element={<HistoryPage />} />

        <Route path="/leaderboard" element={<Leaderboard />} />

        <Route path="/settings" element={<SettingsPage />} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;