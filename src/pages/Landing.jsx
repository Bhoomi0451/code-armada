import { Link } from "react-router-dom";

import {
  Swords,
  Trophy,
  BrainCircuit,
  Code2,
  Zap,
  ShieldCheck,
  ArrowRight,
  Terminal,
  Users,
  ChevronRight
} from "lucide-react";

import "../App.css";

function Landing() {
  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">

        <div className="logo">
          <div className="logo-icon">
            <Swords size={25} />
          </div>

          <span>
            CODE<span className="purple">ARMADA</span>
          </span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
        </div>

        <div className="nav-buttons">

          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register" className="signup-btn">
            Get Started <ArrowRight size={16} />
          </Link>

        </div>

      </nav>


      {/* HERO SECTION */}
      <section className="hero" id="home">

        <div className="hero-content">

          <div className="badge">
            <Zap size={15} />
            AI POWERED CODING BATTLES
          </div>

          <h1>
            Don't Just Code.
            <br />

            <span className="gradient-text">
              Conquer The Arena.
            </span>
          </h1>

          <p className="hero-description">
            Challenge developers in real-time 1v1 coding battles.
            Solve DSA problems, defend your logic in AI interviews
            and prove your coding skills.
          </p>

          <div className="hero-buttons">

            <Link to="/login" className="primary-btn">
              Enter The Arena <Swords size={18} />
            </Link>

            <a href="#features" className="secondary-btn">
              Explore Features <ChevronRight size={18} />
            </a>

          </div>

          <div className="hero-stats">

            <div>
              <h3>1v1</h3>
              <p>Live Battles</p>
            </div>

            <div>
              <h3>AI</h3>
              <p>Smart Interviews</p>
            </div>

            <div>
              <h3>DSA</h3>
              <p>Problem Solving</p>
            </div>

          </div>

        </div>


        {/* BATTLE PREVIEW */}
        <div className="battle-preview">

          <div className="preview-header">

            <span className="live-dot"></span>

            LIVE BATTLE PREVIEW

            <span className="battle-id">
              #1248
            </span>

          </div>


          {/* PLAYERS */}
          <div className="players">

            <div className="player">

              <div className="avatar purple-avatar">
                K
              </div>

              <div>
                <h4>You</h4>
                <p>Rating: 1450</p>
              </div>

            </div>

            <div className="vs">
              VS
            </div>

            <div className="player">

              <div className="avatar blue-avatar">
                A
              </div>

              <div>
                <h4>Opponent</h4>
                <p>Rating: 1520</p>
              </div>

            </div>

          </div>


          {/* PROBLEM */}
          <div className="problem-box">

            <div className="problem-icon">
              <Code2 size={22} />
            </div>

            <div>

              <p className="problem-label">
                CURRENT CHALLENGE
              </p>

              <h3>Two Sum</h3>

              <span className="easy">
                Easy
              </span>

              <span className="problem-category">
                Arrays · HashMap
              </span>

            </div>

          </div>


          {/* TIMER */}
          <div className="timer-section">

            <p>TIME REMAINING</p>

            <h2>24:38</h2>

            <div className="timer-bar">
              <div></div>
            </div>

          </div>


          {/* CODE PREVIEW */}
          <div className="code-preview">

            <div className="code-top">

              <Terminal size={15} />

              <span>solution.java</span>

              <span className="coding-status">
                ● Coding
              </span>

            </div>

            <pre>
              <code>{`class Solution {
  public int[] twoSum(int[] nums) {

    HashMap<Integer,Integer> map =
        new HashMap<>();

    // Find the answer

    return result;
  }
}`}</code>
            </pre>

          </div>

        </div>

      </section>


      {/* FEATURES SECTION */}
      <section className="features" id="features">

        <div className="section-heading">

          <span>WHY CODE ARMADA?</span>

          <h2>More Than Just Coding</h2>

          <p>
            Everything you need to become a better problem solver.
          </p>

        </div>


        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-icon purple-bg">
              <Swords size={25} />
            </div>

            <h3>1v1 Coding Battles</h3>

            <p>
              Compete against another developer in real-time
              and solve the same DSA challenge.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon blue-bg">
              <BrainCircuit size={25} />
            </div>

            <h3>AI Technical Interviews</h3>

            <p>
              Answer personalized questions generated
              directly from your submitted code.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon green-bg">
              <Trophy size={25} />
            </div>

            <h3>Performance Analysis</h3>

            <p>
              Understand your strengths, weaknesses
              and coding performance.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon orange-bg">
              <ShieldCheck size={25} />
            </div>

            <h3>Smart Evaluation</h3>

            <p>
              Evaluate correctness, execution time,
              complexity and code quality.
            </p>

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="how-section" id="how-it-works">

        <div className="section-heading">

          <span>YOUR JOURNEY</span>

          <h2>How The Arena Works</h2>

        </div>


        <div className="steps">

          <div className="step">

            <div className="step-number">01</div>

            <Users size={28} />

            <h3>Find Opponent</h3>

            <p>
              Get matched with another developer.
            </p>

          </div>


          <div className="step">

            <div className="step-number">02</div>

            <Code2 size={28} />

            <h3>Battle & Code</h3>

            <p>
              Solve the same DSA problem within the time limit.
            </p>

          </div>


          <div className="step">

            <div className="step-number">03</div>

            <BrainCircuit size={28} />

            <h3>Face AI Interview</h3>

            <p>
              Explain and defend your coding approach.
            </p>

          </div>


          <div className="step">

            <div className="step-number">04</div>

            <Trophy size={28} />

            <h3>Get Your Report</h3>

            <p>
              Discover your performance and improve.
            </p>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="footer">

        <div className="logo">

          <Swords size={23} />

          <span>
            CODE<span className="purple">ARMADA</span>
          </span>

        </div>

        <p>
          Code. Compete. Defend Your Logic.
        </p>

        <p className="copyright">
          © 2026 Code Armada. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Landing;