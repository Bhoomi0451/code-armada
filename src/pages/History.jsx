import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  Trophy,
  Settings,
  User,
  LogOut,
  Swords,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";

const battleHistory = [
  {
    id: 1,
    opponent: "Alex Morgan",
    problem: "Two Sum",
    difficulty: "Easy",
    result: "Won",
    rating: "+25",
    date: "20 Nov 2026",
  },
  {
    id: 2,
    opponent: "John Smith",
    problem: "Longest Substring",
    difficulty: "Medium",
    result: "Lost",
    rating: "-15",
    date: "19 Nov 2026",
  },
  {
    id: 3,
    opponent: "Emma Wilson",
    problem: "Binary Search",
    difficulty: "Easy",
    result: "Won",
    rating: "+25",
    date: "18 Nov 2026",
  },
  {
    id: 4,
    opponent: "David Lee",
    problem: "Merge Intervals",
    difficulty: "Medium",
    result: "Won",
    rating: "+25",
    date: "17 Nov 2026",
  },
  {
    id: 5,
    opponent: "Sophia Brown",
    problem: "N-Queens",
    difficulty: "Hard",
    result: "Lost",
    rating: "-15",
    date: "16 Nov 2026",
  },
];

function HistoryPage() {
  const totalBattles = battleHistory.length;
  const wins = battleHistory.filter(
    (battle) => battle.result === "Won"
  ).length;
  const losses = totalBattles - wins;
  const winRate = Math.round((wins / totalBattles) * 100);

  return (
    <div className="history-page">
      <aside className="history-sidebar">
        <h2 className="history-logo">⚔ Code Armada</h2>

        <nav>
          <Link to="/dashboard">
            <LayoutDashboard size={19} /> Dashboard
          </Link>

          <Link to="/problems">
            <Swords size={19} /> Practice Problems
          </Link>

          <Link to="/matchmaking">
            <Swords size={19} /> 1v1 Battles
          </Link>

          <Link to="/history" className="active">
            <History size={19} /> Battle History
          </Link>

          <Link to="/leaderboard">
            <Trophy size={19} /> Leaderboard
          </Link>

          <Link to="/profile">
            <User size={19} /> My Profile
          </Link>

          <Link to="/settings">
            <Settings size={19} /> Settings
          </Link>

          <Link to="/">
            <LogOut size={19} /> Logout
          </Link>
        </nav>
      </aside>

      <main className="history-main">
        <Link to="/dashboard" className="history-back">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>

        <div className="history-heading">
          <div>
            <h1>Battle History</h1>
            <p>Track your previous battles and performance.</p>
          </div>
        </div>

        <div className="history-stats">
          <div className="history-stat-card">
            <span>Total Battles</span>
            <h2>{totalBattles}</h2>
          </div>

          <div className="history-stat-card">
            <span>Victories</span>
            <h2 className="history-green">{wins}</h2>
          </div>

          <div className="history-stat-card">
            <span>Defeats</span>
            <h2 className="history-red">{losses}</h2>
          </div>

          <div className="history-stat-card">
            <span>Win Rate</span>
            <h2>{winRate}%</h2>
          </div>
        </div>

        <section className="history-table-card">
          <h2>Recent Battles</h2>

          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Opponent</th>
                  <th>Problem</th>
                  <th>Difficulty</th>
                  <th>Result</th>
                  <th>Rating</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {battleHistory.map((battle) => (
                  <tr key={battle.id}>
                    <td>{battle.opponent}</td>
                    <td>{battle.problem}</td>

                    <td>
                      <span
                        className={`difficulty-badge ${battle.difficulty.toLowerCase()}`}
                      >
                        {battle.difficulty}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`result-badge ${battle.result.toLowerCase()}`}
                      >
                        {battle.result === "Won" ? (
                          <CheckCircle size={15} />
                        ) : (
                          <XCircle size={15} />
                        )}
                        {battle.result}
                      </span>
                    </td>

                    <td className={
                      battle.rating.startsWith("+")
                        ? "history-green"
                        : "history-red"
                    }>
                      {battle.rating}
                    </td>

                    <td>{battle.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HistoryPage;