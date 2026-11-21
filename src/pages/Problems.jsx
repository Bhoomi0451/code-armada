import { useState } from "react";

import {
  Swords,
  Search,
  Code2,
  Filter,
  ChevronDown,
  ArrowUpRight,
  Target,
  Clock,
  Trophy,
  LayoutDashboard,
  History,
  BrainCircuit,
  Settings,
  User,
  LogOut,
  Bell,
  X
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import "../App.css";

function Problems() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [category, setCategory] = useState("All");

  const [selectedProblem, setSelectedProblem] = useState(null);

  const problems = [

    {
      id: 1,
      title: "Two Sum",
      description: "Find two numbers in an array that add up to the target.",
      category: "Arrays",
      difficulty: "Easy",
      acceptance: "78%",
      time: "15 mins",
      solved: "2.4k"
    },

    {
      id: 2,
      title: "Valid Parentheses",
      description: "Determine whether the given parentheses sequence is valid.",
      category: "Stack",
      difficulty: "Easy",
      acceptance: "72%",
      time: "20 mins",
      solved: "1.8k"
    },

    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      description: "Find the longest substring without duplicate characters.",
      category: "Strings",
      difficulty: "Medium",
      acceptance: "42%",
      time: "30 mins",
      solved: "1.5k"
    },

    {
      id: 4,
      title: "Binary Tree Level Order Traversal",
      description: "Return the level order traversal of a binary tree.",
      category: "Trees",
      difficulty: "Medium",
      acceptance: "65%",
      time: "30 mins",
      solved: "1.2k"
    },

    {
      id: 5,
      title: "Number of Islands",
      description: "Count the number of islands in a 2D grid.",
      category: "Graphs",
      difficulty: "Medium",
      acceptance: "58%",
      time: "35 mins",
      solved: "980"
    },

    {
      id: 6,
      title: "Coin Change",
      description: "Find the minimum number of coins required to make the amount.",
      category: "Dynamic Programming",
      difficulty: "Medium",
      acceptance: "47%",
      time: "40 mins",
      solved: "870"
    },

    {
      id: 7,
      title: "N-Queens",
      description: "Place N queens on an N x N chessboard without conflicts.",
      category: "Backtracking",
      difficulty: "Hard",
      acceptance: "36%",
      time: "45 mins",
      solved: "650"
    },

    {
      id: 8,
      title: "Median of Two Sorted Arrays",
      description: "Find the median of two sorted arrays efficiently.",
      category: "Binary Search",
      difficulty: "Hard",
      acceptance: "35%",
      time: "45 mins",
      solved: "540"
    },

    {
      id: 9,
      title: "Merge Intervals",
      description: "Merge all overlapping intervals in the given array.",
      category: "Arrays",
      difficulty: "Medium",
      acceptance: "48%",
      time: "30 mins",
      solved: "1.1k"
    }

  ];


  // FILTER PROBLEMS

  const filteredProblems = problems.filter((problem) => {

    const matchesSearch =
      problem.title.toLowerCase().includes(search.toLowerCase());

    const matchesDifficulty =
      difficulty === "All" || problem.difficulty === difficulty;

    const matchesCategory =
      category === "All" || problem.category === category;

    return matchesSearch && matchesDifficulty && matchesCategory;

  });


  // SELECT PROBLEM FOR BATTLE

  const handleBattle = (problem) => {

    setSelectedProblem(problem);

  };


  // CONFIRM SELECTION

  const confirmBattle = () => {

    if (!selectedProblem) return;

    sessionStorage.setItem(
      "selectedProblem",
      JSON.stringify(selectedProblem)
    );

    navigate("/matchmaking");

  };


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


        <p className="sidebar-heading">MAIN MENU</p>


        <nav className="sidebar-nav">

          <Link to="/dashboard" className="sidebar-link">
            <LayoutDashboard size={19}/>
            Dashboard
          </Link>

          <Link to="/problems" className="sidebar-link active">
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


        <p className="sidebar-heading account-heading">ACCOUNT</p>


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

            <div className="user-avatar">K</div>

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
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>


          <div className="topbar-right">

            <button className="notification-btn">
              <Bell size={20}/>
              <span></span>
            </button>

            <div className="topbar-profile">

              <div className="user-avatar">K</div>

              <div>
                <h4>Kirti</h4>
                <p>Rating: 1450</p>
              </div>

            </div>

          </div>

        </header>


        {/* PAGE HEADING */}

        <section className="problems-heading">

          <div>

            <p className="welcome-date">
              EXPLORE & PRACTICE
            </p>

            <h1>DSA Problems</h1>

            <p>
              Sharpen your problem-solving skills and prepare
              for your next coding battle.
            </p>

          </div>

          <div className="problem-total">
            <Code2 size={24}/>
            <div>
              <h3>{problems.length}</h3>
              <p>Available Problems</p>
            </div>
          </div>

        </section>


        {/* PROBLEM STATISTICS */}

        <section className="problem-stats">

          <div>
            <span className="easy-dot"></span>
            <h3>Easy</h3>
            <p>2 Problems</p>
          </div>

          <div>
            <span className="medium-dot"></span>
            <h3>Medium</h3>
            <p>5 Problems</p>
          </div>

          <div>
            <span className="hard-dot"></span>
            <h3>Hard</h3>
            <p>2 Problems</p>
          </div>

        </section>


        {/* FILTER SECTION */}

        <section className="problem-filters">

          <div className="filter-title">
            <Filter size={19}/>
            Filters
          </div>


          <div className="filter-controls">

            <div className="filter-select">

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >

                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>

              </select>

              <ChevronDown size={15}/>

            </div>


            <div className="filter-select">

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >

                <option value="All">All Topics</option>
                <option value="Arrays">Arrays</option>
                <option value="Strings">Strings</option>
                <option value="Stack">Stack</option>
                <option value="Trees">Trees</option>
                <option value="Graphs">Graphs</option>
                <option value="Dynamic Programming">Dynamic Programming</option>
                <option value="Backtracking">Backtracking</option>
                <option value="Binary Search">Binary Search</option>

              </select>

              <ChevronDown size={15}/>

            </div>


            <button
              className="clear-filters"
              onClick={() => {
                setDifficulty("All");
                setCategory("All");
                setSearch("");
              }}
            >
              Clear Filters
            </button>

          </div>

        </section>


        {/* PROBLEM LIST */}

        <section className="problems-list">

          <div className="problems-list-heading">

            <div>
              <h2>Available Challenges</h2>
              <p>
                Showing {filteredProblems.length} problems
              </p>
            </div>

          </div>


          {filteredProblems.length === 0 ? (

            <div className="no-problems">

              <Search size={35}/>

              <h3>No problems found</h3>

              <p>
                Try changing your search or filters.
              </p>

            </div>

          ) : (

            <div className="problem-cards">

              {filteredProblems.map((problem) => (

                <div className="problem-card" key={problem.id}>

                  <div className="problem-card-top">

                    <div className="problem-number">
                      #{String(problem.id).padStart(3, "0")}
                    </div>

                    <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                      {problem.difficulty}
                    </span>

                  </div>


                  <h3>{problem.title}</h3>

                  <p className="problem-description">
                    {problem.description}
                  </p>


                  <div className="problem-category-tag">
                    {problem.category}
                  </div>


                  <div className="problem-card-info">

                    <span>
                      <Target size={14}/>
                      {problem.acceptance}
                    </span>

                    <span>
                      <Clock size={14}/>
                      {problem.time}
                    </span>

                    <span>
                      {problem.solved} solved
                    </span>

                  </div>


                  <button
                    className="problem-battle-btn"
                    onClick={() => handleBattle(problem)}
                  >

                    <Swords size={17}/>
                    Select for Battle
                    <ArrowUpRight size={16}/>

                  </button>

                </div>

              ))}

            </div>

          )}

        </section>


        <footer className="dashboard-footer">

          <p>
            © 2026 Code Armada. Code. Compete. Conquer.
          </p>

          <p>
            Built for developers, by developers.
          </p>

        </footer>


      </main>


      {/* SELECT PROBLEM MODAL */}

      {selectedProblem && (

        <div className="problem-modal-overlay">

          <div className="problem-modal">

            <button
              className="modal-close"
              onClick={() => setSelectedProblem(null)}
            >
              <X size={20}/>
            </button>

            <div className="modal-icon">
              <Swords size={30}/>
            </div>

            <p className="welcome-date">
              BATTLE CHALLENGE
            </p>

            <h2>{selectedProblem.title}</h2>

            <p className="modal-description">
              {selectedProblem.description}
            </p>

            <div className="modal-problem-info">

              <span className={`difficulty ${selectedProblem.difficulty.toLowerCase()}`}>
                {selectedProblem.difficulty}
              </span>

              <span>{selectedProblem.category}</span>

              <span>{selectedProblem.time}</span>

            </div>

            <p className="modal-note">
              You will be matched with another developer
              to solve this challenge.
            </p>

            <button
              className="confirm-battle-btn"
              onClick={confirmBattle}
            >
              Continue to Matchmaking
              <ArrowUpRight size={18}/>
            </button>

            <button
              className="cancel-battle-btn"
              onClick={() => setSelectedProblem(null)}
            >
              Cancel
            </button>

          </div>

        </div>

      )}

    </div>

  );

}

export default Problems;