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
  Medal,
  TrendingUp,
} from "lucide-react";

const players = [
  { id: 1, name: "Alex Morgan", rating: 2450, wins: 98, winRate: "92%", league: "Diamond" },
  { id: 2, name: "Emma Wilson", rating: 2320, wins: 89, winRate: "88%", league: "Diamond" },
  { id: 3, name: "Kirti", rating: 2180, wins: 76, winRate: "85%", league: "Platinum" },
  { id: 4, name: "John Smith", rating: 2050, wins: 71, winRate: "81%", league: "Platinum" },
  { id: 5, name: "Sophia Brown", rating: 1980, wins: 65, winRate: "79%", league: "Gold" },
  { id: 6, name: "David Lee", rating: 1890, wins: 59, winRate: "75%", league: "Gold" },
  { id: 7, name: "Olivia Martin", rating: 1750, wins: 52, winRate: "72%", league: "Silver" },
  { id: 8, name: "Ryan Taylor", rating: 1680, wins: 48, winRate: "70%", league: "Silver" },
];

function Leaderboard() {
  return (
    <div className="leaderboard-page">
      <aside className="leaderboard-sidebar">
        <h2 className="leaderboard-logo">⚔ Code Armada</h2>

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

          <Link to="/history">
            <History size={19} /> Battle History
          </Link>

          <Link to="/leaderboard" className="active">
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

      <main className="leaderboard-main">
        <div className="leaderboard-heading">
          <div>
            <h1>Leaderboard</h1>
            <p>Compete with developers and track your ranking.</p>
          </div>

          <Trophy size={42} className="leaderboard-heading-icon" />
        </div>

        <div className="leaderboard-highlight">
          <div>
            <span>Your Current Rank</span>
            <h2>#3</h2>
            <p>Keep practicing to reach the top!</p>
          </div>

          <Medal size={55} className="leaderboard-medal" />
        </div>

        <div className="leaderboard-summary">
          <div className="leaderboard-summary-card">
            <Trophy size={23} />
            <span>Top Rating</span>
            <h2>2450</h2>
          </div>

          <div className="leaderboard-summary-card">
            <TrendingUp size={23} />
            <span>Total Players</span>
            <h2>1,250</h2>
          </div>

          <div className="leaderboard-summary-card">
            <Medal size={23} />
            <span>Your Position</span>
            <h2>#3</h2>
          </div>
        </div>

        <section className="leaderboard-table-card">
          <div className="leaderboard-table-heading">
            <h2>Top Players</h2>
            <span>Season Rankings</span>
          </div>

          <div className="leaderboard-table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Rating</th>
                  <th>Wins</th>
                  <th>Win Rate</th>
                  <th>League</th>
                </tr>
              </thead>

              <tbody>
                {players.map((player) => (
                  <tr
                    key={player.id}
                    className={player.name === "Kirti" ? "current-player" : ""}
                  >
                    <td>
                      {player.id <= 3 ? "🏅" : `#${player.id}`}
                    </td>

                    <td>
                      <strong>{player.name}</strong>

                      {player.name === "Kirti" && (
                        <span className="you-badge">You</span>
                      )}
                    </td>

                    <td>{player.rating}</td>
                    <td>{player.wins}</td>
                    <td className="leaderboard-win-rate">
                      {player.winRate}
                    </td>

                    <td>
                      <span
                        className={`league-badge ${player.league.toLowerCase()}`}
                      >
                        {player.league}
                      </span>
                    </td>
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

export default Leaderboard;