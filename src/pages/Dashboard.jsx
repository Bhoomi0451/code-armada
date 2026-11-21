import {
  Swords,
  LayoutDashboard,
  Code2,
  Trophy,
  BrainCircuit,
  History,
  Settings,
  User,
  LogOut,
  Bell,
  Search,
  Flame,
  Target,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Menu
} from "lucide-react";

import { Link } from "react-router-dom";

import "../App.css";

function Dashboard() {

const interviewData = JSON.parse(
    sessionStorage.getItem("interviewData") || "null"
);

const interviewHistory = interviewData
    ? [
        {
            title: "Technical AI Interview",
            date: new Date(interviewData.submittedAt).toLocaleDateString(),
            answered: Object.values(interviewData.answers).filter(
                answer => answer.trim() !== ""
            ).length,
            total: interviewData.questions.length
        }
    ]
    : [];


    const totalAnswered = interviewHistory.reduce(
    (sum, interview) => sum + interview.answered,
    0
);

const totalQuestions = interviewHistory.reduce(
    (sum, interview) => sum + interview.total,
    0
);

const completionRate = totalQuestions > 0
    ? Math.round((totalAnswered / totalQuestions) * 100)
    : 0;

const unansweredQuestions = totalQuestions - totalAnswered;



  const stats = [
    {
      title: "Total Battles",
      value: "48",
      change: "+12%",
      icon: Swords,
      color: "purple"
    },
    {
      title: "Battles Won",
      value: "32",
      change: "+8%",
      icon: Trophy,
      color: "green"
    },
    {
      title: "Battles Lost",
      value: "16",
      change: "-4%",
      icon: Target,
      color: "red"
    },
    {
      title: "Win Rate",
      value: "66.7%",
      change: "+5%",
      icon: TrendingUp,
      color: "blue"
    }
  ];

  const battles = [
    {
      opponent: "Alex Morgan",
      problem: "Two Sum",
      difficulty: "Easy",
      result: "Won",
      date: "Today",
      rating: "+25"
    },
    {
      opponent: "Sarah Wilson",
      problem: "Binary Tree Paths",
      difficulty: "Medium",
      result: "Lost",
      date: "Yesterday",
      rating: "-15"
    },
    {
      opponent: "John Smith",
      problem: "Longest Substring",
      difficulty: "Medium",
      result: "Won",
      date: "2 days ago",
      rating: "+30"
    }
  ];

  const problems = [
    {
      title: "Two Sum",
      category: "Arrays & Hashing",
      difficulty: "Easy",
      acceptance: "78%"
    },
    {
      title: "Longest Substring Without Repeating Characters",
      category: "Sliding Window",
      difficulty: "Medium",
      acceptance: "42%"
    },
    {
      title: "Binary Tree Level Order Traversal",
      category: "Trees",
      difficulty: "Medium",
      acceptance: "65%"
    }
  ];

  return (

    <div className="dashboard-layout">

      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">

          <Swords size={28}/>

          <span>
            CODE<span className="purple">ARMADA</span>
          </span>

        </div>


        <p className="sidebar-heading">
          MAIN MENU
        </p>


        <nav className="sidebar-nav">

          <Link to="/dashboard" className="sidebar-link active">
            <LayoutDashboard size={19}/>
            Dashboard
          </Link>

          <Link to="/problems" className="sidebar-link">
            <Code2 size={19}/>
            Practice Problems
          </Link>

          <Link to="/matchmaking" className="sidebar-link">
            <Swords size={19}/>
            1v1 Battles
          </Link>

          <Link to="/history" className="sidebar-link">
            <History size={19}/>
            Battle History
          </Link>

          <Link to="/interview" className="sidebar-link">
            <BrainCircuit size={19}/>
            AI Interview
          </Link>

          <Link to="/leaderboard" className="sidebar-link">
            <Trophy size={19}/>
            Leaderboard
          </Link>

        </nav>


        <p className="sidebar-heading account-heading">
          ACCOUNT
        </p>


        <nav className="sidebar-nav">

          <Link to="/profile" className="sidebar-link">
            <User size={19}/>
            My Profile
          </Link>

          <Link to="/settings" className="sidebar-link">
            <Settings size={19}/>
            Settings
          </Link>

        </nav>


        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="user-avatar">
              K
            </div>

            <div>
              <h4>Kirti</h4>
              <p>Pro Coder</p>
            </div>

          </div>

          <Link to="/" className="logout-link">
            <LogOut size={17}/>
            Logout
          </Link>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="dashboard-main">


        {/* TOPBAR */}

        <header className="dashboard-topbar">

          <div className="dashboard-search">

            <Search size={18}/>

            <input
              type="text"
              placeholder="Search problems, battles..."
            />

          </div>


          <div className="topbar-right">

            <button className="notification-btn">
              <Bell size={20}/>
              <span></span>
            </button>

            <div className="topbar-profile">

              <div className="user-avatar">
                K
              </div>

              <div>
                <h4>Kirti</h4>
                <p>Rating: 1450</p>
              </div>

            </div>

          </div>

        </header>


        {/* WELCOME SECTION */}

        <section className="dashboard-welcome">

          <div>

            <p className="welcome-date">
              YOUR CODING ARENA
            </p>

            <h1>
              Welcome back, <span>Kirti!</span>
            </h1>

            <p>
              Ready to challenge yourself and conquer new problems?
            </p>

          </div>


          <Link to="/matchmaking" className="start-battle-btn">

            <Swords size={20}/>

            Start New Battle

            <ArrowRight size={18}/>

          </Link>

        </section>


        {/* STATS CARDS */}

        <section className="stats-grid">

          {stats.map((stat, index) => {

            const Icon = stat.icon;

            return (

              <div className="stat-card" key={index}>

                <div className="stat-top">

                  <div className={`stat-icon ${stat.color}`}>
                    <Icon size={22}/>
                  </div>

                  <span className="stat-change">
                    {stat.change}
                  </span>

                </div>

                <p>{stat.title}</p>

                <h2>{stat.value}</h2>

              </div>

            );

          })}

        </section>


        {/* RATING AND BATTLE CARD */}

        <section className="dashboard-middle">

          <div className="rating-card">

            <div className="rating-heading">

              <div>
                <p>YOUR CURRENT RATING</p>
                <h2>1450</h2>
              </div>

              <div className="rating-icon">
                <Trophy size={28}/>
              </div>

            </div>


            <div className="rating-rank">
              <span>Gold League</span>
              <span>Top 15%</span>
            </div>


            <div className="rating-progress">
              <div></div>
            </div>


            <p className="rating-description">
              Keep winning battles to reach Platinum League!
            </p>


            <div className="rating-footer">

              <div>
                <Flame size={18}/>
                5 Day Streak
              </div>

              <div>
                <Zap size={18}/>
                +120 This Month
              </div>

            </div>

          </div>


          <div className="challenge-card">

            <div className="challenge-content">

              <span className="challenge-label">
                READY FOR A CHALLENGE?
              </span>

              <h2>
                Prove Your Coding Skills.
              </h2>

              <p>
                Enter the arena and compete against developers
                in real-time coding battles.
              </p>

              <Link to="/matchmaking">
                Find Opponent <ArrowRight size={17}/>
              </Link>

            </div>

            <div className="challenge-icon">
              <Swords size={75}/>
            </div>

          </div>

        </section>


        {/* RECENT BATTLES */}

        <section className="dashboard-section">

          <div className="section-title">

            <div>
              <h2>Recent Battles</h2>
              <p>Your latest coding competitions</p>
            </div>

            <Link to="/history">
              View All <ArrowUpRight size={16}/>
            </Link>

          </div>


          <div className="battle-table">

            <div className="table-header">
              <span>OPPONENT</span>
              <span>PROBLEM</span>
              <span>DIFFICULTY</span>
              <span>RESULT</span>
              <span>RATING</span>
            </div>


            {battles.map((battle, index) => (

              <div className="battle-row" key={index}>

                <div className="opponent-cell">

                  <div className="opponent-avatar">
                    {battle.opponent.charAt(0)}
                  </div>

                  <div>
                    <h4>{battle.opponent}</h4>
                    <p>{battle.date}</p>
                  </div>

                </div>


                <span className="battle-problem">
                  {battle.problem}
                </span>


                <span className={`difficulty ${battle.difficulty.toLowerCase()}`}>
                  {battle.difficulty}
                </span>


                <span className={`battle-result ${battle.result.toLowerCase()}`}>

                  {battle.result === "Won"
                    ? <CheckCircle size={15}/>
                    : <XCircle size={15}/>
                  }

                  {battle.result}

                </span>


                <span className={
                  battle.rating.startsWith("+")
                    ? "positive-rating"
                    : "negative-rating"
                }>
                  {battle.rating}
                </span>

              </div>

            ))}

          </div>

        </section>


        {/* RECOMMENDED PROBLEMS */}

        <section className="dashboard-section">

          <div className="section-title">

            <div>
              <h2>Recommended Problems</h2>
              <p>Improve your DSA skills with these challenges</p>
            </div>

            <Link to="/problems">
              Explore All <ArrowUpRight size={16}/>
            </Link>

          </div>


          <div className="recommended-grid">

            {problems.map((problem, index) => (

              <div className="recommended-card" key={index}>

                <div className="recommended-top">

                  <div className="problem-small-icon">
                    <Code2 size={20}/>
                  </div>

                  <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                  </span>

                </div>


                <h3>{problem.title}</h3>

                <p>{problem.category}</p>


                <div className="recommended-footer">

                  <span>
                    <Target size={14}/>
                    {problem.acceptance} Acceptance
                  </span>

                  <ArrowUpRight size={18}/>

                </div>

              </div>

            ))}

          </div>

        </section>

{/* INTERVIEW HISTORY */}

<section className="dashboard-section">

    <div className="section-title">

        <div>
            <h2>AI Interview History</h2>
            <p>Your recently completed technical interviews</p>
        </div>

        <Link to="/interview">
            Start Interview <ArrowUpRight size={16}/>
        </Link>

    </div>

    <div className="interview-history-grid">

        {interviewHistory.length > 0 ? (

            interviewHistory.map((interview, index) => (

                <div className="interview-history-card" key={index}>

                    <div className="interview-history-icon">
                        <BrainCircuit size={24}/>
                    </div>

                    <div className="interview-history-info">

                        <h3>{interview.title}</h3>

                        <p>{interview.date}</p>

                        <span>
                            {interview.answered}/{interview.total} Questions Answered
                        </span>

                    </div>

                    <CheckCircle size={20} className="history-success"/>

                </div>

            ))

        ) : (

            <div className="empty-interview-history">
                <BrainCircuit size={30}/>
                <h3>No interviews yet</h3>
                <p>Complete your first AI interview to see your history here.</p>

                <Link to="/interview">
                    Start AI Interview
                </Link>
            </div>

        )}

    </div>

</section>

{/* INTERVIEW PERFORMANCE */}

<section className="dashboard-section">

    <div className="section-title">
        <div>
            <h2>Interview Performance</h2>
            <p>Your latest AI interview performance summary</p>
        </div>
    </div>

    <div className="interview-stats-grid">

        <div className="interview-stat-card">
            <BrainCircuit size={25}/>
            <p>Questions Answered</p>
            <h2>{totalAnswered}</h2>
        </div>

        <div className="interview-stat-card">
            <Target size={25}/>
            <p>Questions Remaining</p>
            <h2>{unansweredQuestions}</h2>
        </div>

        <div className="interview-stat-card">
            <TrendingUp size={25}/>
            <p>Completion Rate</p>
            <h2>{completionRate}%</h2>
        </div>

    </div>

    <div className="performance-progress">

        <div className="performance-progress-heading">
            <span>Interview Completion</span>
            <strong>{completionRate}%</strong>
        </div>

        <div className="performance-progress-bar">
            <div style={{ width: `${completionRate}%` }}></div>
        </div>

    </div>

</section>



        {/* FOOTER */}

        <footer className="dashboard-footer">

          <p>
            © 2026 Code Armada. Code. Compete. Conquer.
          </p>

          <p>
            Built for developers, by developers.
          </p>

        </footer>


      </main>

    </div>

  );

}

export default Dashboard;