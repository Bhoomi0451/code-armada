import { useState, useEffect } from "react";

import {
  Swords,
  Search,
  X,
  Trophy,
  Zap,
  Shield,
  Clock,
  Code2,
  Users,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import "../App.css";


function Matchmaking() {

  const navigate = useNavigate();

  const [status, setStatus] = useState("idle");

  const [countdown, setCountdown] = useState(5);

  const [searchTime, setSearchTime] = useState(0);


  // GET SELECTED PROBLEM

  const selectedProblem = JSON.parse(
    sessionStorage.getItem("selectedProblem") || "null"
  );


  // SEARCH TIMER

  useEffect(() => {

    if (status !== "searching") return;

    const searchInterval = setInterval(() => {

      setSearchTime((prev) => prev + 1);

    }, 1000);


    const matchTimeout = setTimeout(() => {

      setStatus("found");

    }, 5000);


    return () => {

      clearInterval(searchInterval);

      clearTimeout(matchTimeout);

    };

  }, [status]);


  // COUNTDOWN

  useEffect(() => {

    if (status !== "found") return;

    setCountdown(5);

    const interval = setInterval(() => {

      setCountdown((prev) => {

        if (prev <= 1) {

          clearInterval(interval);

          setStatus("ready");

          return 0;

        }

        return prev - 1;

      });

    }, 1000);


    return () => clearInterval(interval);

  }, [status]);


  // START MATCHMAKING

  const startMatchmaking = () => {

    setSearchTime(0);

    setStatus("searching");

  };


  // CANCEL MATCHMAKING

  const cancelMatchmaking = () => {

    setStatus("idle");

    setSearchTime(0);

    setCountdown(5);

  };


  // ENTER BATTLE

  const enterBattle = () => {

    navigate("/battle");

  };


  return (

    <div className="matchmaking-page">


      {/* NAVBAR */}

      <nav className="match-navbar">

        <Link to="/dashboard" className="match-logo">

          <Swords size={28}/>

          <span>
            CODE<span className="purple">ARMADA</span>
          </span>

        </Link>


        <Link to="/dashboard" className="exit-match">

          <X size={18}/>

          Exit Lobby

        </Link>

      </nav>



      {/* MAIN CONTENT */}

      <main className="match-main">


        {/* HEADING */}

        <div className="match-heading">

          <div className="match-badge">

            <Zap size={15}/>

            COMPETITIVE ARENA

          </div>


          <h1>

            {status === "idle" && (
              <>
                Ready To <span>Battle?</span>
              </>
            )}

            {status === "searching" && (
              <>
                Finding Your <span>Opponent...</span>
              </>
            )}

            {status === "found" && (
              <>
                Opponent <span>Found!</span>
              </>
            )}

            {status === "ready" && (
              <>
                Battle Is <span>Ready!</span>
              </>
            )}

          </h1>


          <p>

            {status === "idle" &&
              "Enter the arena and challenge developers from around the world."
            }

            {status === "searching" &&
              "Searching for a worthy opponent. Stay ready!"
            }

            {status === "found" &&
              "We found your opponent. Prepare yourself!"
            }

            {status === "ready" &&
              "Your opponent is ready. The battle is about to begin!"
            }

          </p>

        </div>



        {/* BATTLE CARD */}

        <div className="match-card">


          {/* PLAYER SECTION */}

          <div className="match-players">


            {/* YOUR PROFILE */}

            <div className="match-player">

              <div className="match-avatar my-avatar">
                K
              </div>

              <h3>Kirti</h3>

              <p className="player-rating">
                <Trophy size={14}/>
                1450 Rating
              </p>

              <span className="player-label">
                YOU
              </span>

            </div>



            {/* VS */}

            <div className="match-vs">

              {status === "searching" ? (

                <div className="search-animation">

                  <div className="search-ring"></div>

                  <Swords size={30}/>

                </div>

              ) : (

                <div className="vs-circle">
                  VS
                </div>

              )}

              <p>
                {status === "searching"
                  ? "SEARCHING"
                  : status === "idle"
                  ? "READY"
                  : "MATCH FOUND"
                }
              </p>

            </div>



            {/* OPPONENT */}

            <div className="match-player">

              <div className={`match-avatar opponent-avatar ${
                status === "found" || status === "ready"
                  ? "opponent-found"
                  : ""
              }`}>

                {status === "found" || status === "ready"
                  ? "A"
                  : <Users size={30}/>
                }

              </div>


              <h3>

                {status === "found" || status === "ready"
                  ? "Alex Morgan"
                  : "Waiting..."
                }

              </h3>


              <p className="player-rating">

                <Trophy size={14}/>

                {status === "found" || status === "ready"
                  ? "1520 Rating"
                  : "Opponent Rating"
                }

              </p>


              <span className="player-label opponent-label">

                {status === "found" || status === "ready"
                  ? "OPPONENT FOUND"
                  : "OPPONENT"
                }

              </span>

            </div>


          </div>



          {/* SEARCHING STATUS */}

          {status === "searching" && (

            <div className="searching-status">

              <div className="searching-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <h3>Searching for opponents</h3>

              <p>
                Looking for players with a similar coding rating...
              </p>

              <div className="search-time">

                <Clock size={16}/>

                Search Time: 00:
                {String(searchTime).padStart(2, "0")}

              </div>

            </div>

          )}



          {/* MATCH FOUND */}

          {(status === "found" || status === "ready") && (

            <div className="opponent-success">

              <CheckCircle size={24}/>

              <div>

                <h3>
                  Opponent Successfully Matched!
                </h3>

                <p>
                  Both players are ready for the challenge.
                </p>

              </div>

            </div>

          )}



          {/* COUNTDOWN */}

          {status === "found" && (

            <div className="battle-countdown">

              <p>BATTLE STARTING IN</p>

              <div className="countdown-number">

                {countdown}

              </div>

              <span>Get Ready!</span>

            </div>

          )}



          {/* BATTLE READY */}

          {status === "ready" && (

            <button
              className="enter-battle-btn"
              onClick={enterBattle}
            >

              Enter Coding Arena

              <ArrowRight size={19}/>

            </button>

          )}



          {/* SELECTED PROBLEM */}

          <div className="selected-problem">

            <div className="selected-problem-icon">

              <Code2 size={24}/>

            </div>


            <div className="selected-problem-info">

              <span>SELECTED CHALLENGE</span>


              <h3>

                {selectedProblem?.title || "Two Sum"}

              </h3>


              <p>

                {selectedProblem?.category || "Arrays"}

              </p>

            </div>


            <span className={`difficulty ${
              (selectedProblem?.difficulty || "Easy").toLowerCase()
            }`}>

              {selectedProblem?.difficulty || "Easy"}

            </span>

          </div>



          {/* BATTLE INFORMATION */}

          <div className="battle-information">

            <div>

              <Clock size={18}/>

              <span>30 Minutes</span>

            </div>


            <div>

              <Target size={18}/>

              <span>Same Problem</span>

            </div>


            <div>

              <Shield size={18}/>

              <span>Fair Competition</span>

            </div>

          </div>



          {/* ACTION BUTTON */}

          {status === "idle" && (

            <button
              className="find-opponent-btn"
              onClick={startMatchmaking}
            >

              <Search size={20}/>

              Find Opponent

              <ArrowRight size={19}/>

            </button>

          )}



          {status === "searching" && (

            <button
              className="cancel-match-btn"
              onClick={cancelMatchmaking}
            >

              <X size={18}/>

              Cancel Search

            </button>

          )}



          {status === "found" && (

            <p className="match-waiting-text">

              Please wait while we prepare your battle...

            </p>

          )}


        </div>



        {/* INFORMATION CARDS */}

        <div className="match-info-grid">


          <div className="match-info-card">

            <div className="match-info-icon purple-info">
              <Users size={22}/>
            </div>

            <h3>Fair Matchmaking</h3>

            <p>
              Find opponents with similar coding ratings.
            </p>

          </div>



          <div className="match-info-card">

            <div className="match-info-icon green-info">
              <Shield size={22}/>
            </div>

            <h3>Equal Challenge</h3>

            <p>
              Both players receive the same DSA problem.
            </p>

          </div>



          <div className="match-info-card">

            <div className="match-info-icon blue-info">
              <Sparkles size={22}/>
            </div>

            <h3>AI Evaluation</h3>

            <p>
              Your performance will be analyzed after the battle.
            </p>

          </div>


        </div>



        {/* FOOTER */}

        <footer className="match-footer">

          © 2026 Code Armada. Code. Compete. Conquer.

        </footer>


      </main>

    </div>

  );

}

export default Matchmaking;