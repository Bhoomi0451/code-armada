import { useState, useEffect } from "react";

import {
  Swords,
  Trophy,
  Clock,
  Code2,
  Play,
  Send,
  Terminal,
  ChevronDown,
  CheckCircle,
  XCircle,
  FileCode,
  Maximize2,
  ArrowLeft,
  Users,
  Zap,
  MessageSquare,
  Bot
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import "../App.css";

function Battle() {

  const navigate = useNavigate();

  // SELECTED PROBLEM

  const selectedProblem = JSON.parse(
    sessionStorage.getItem("selectedProblem") || "null"
  );

  const problem = selectedProblem || {
    title: "Two Sum",
    category: "Arrays",
    difficulty: "Easy"
  };


  // STATES

  const [language, setLanguage] = useState("Java");

  const [activeTab, setActiveTab] = useState("description");

  const [output, setOutput] = useState(
    "Run your code to see the output here."
  );

  const [isRunning, setIsRunning] = useState(false);

  const [code, setCode] = useState(
`class Solution {
    public int[] twoSum(int[] nums, int target) {

        // Write your solution here

        return new int[]{};
    }
}`
  );

  const [timeLeft, setTimeLeft] = useState(1800);

  const [opponentStatus, setOpponentStatus] = useState("Coding");


  // TIMER

  useEffect(() => {

    if (timeLeft <= 0) return;

    const timer = setInterval(() => {

      setTimeLeft((prev) => Math.max(0, prev - 1));

    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft]);


  // FORMAT TIMER

  const formatTime = (seconds) => {

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;

  };


  // LANGUAGE CHANGE

  const handleLanguageChange = (e) => {

    const selectedLanguage = e.target.value;

    setLanguage(selectedLanguage);

    const templates = {

      Java:
`class Solution {
    public int[] twoSum(int[] nums, int target) {

        // Write your solution here

        return new int[]{};
    }
}`,

      Python:
`class Solution:
    def twoSum(self, nums, target):

        # Write your solution here

        return []`,

      "C++":
`class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {

        // Write your solution here

        return {};
    }
};`,

      JavaScript:
`var twoSum = function(nums, target) {

    // Write your solution here

    return [];
};`

    };

    setCode(templates[selectedLanguage]);

  };


  // RUN CODE - FRONTEND DEMONSTRATION

  const handleRun = () => {

    setIsRunning(true);

    setOutput("Preparing test cases...");

    setTimeout(() => {

      setIsRunning(false);

      setOutput(
        "Code execution is not connected yet.\n\n" +
        "Your editor is ready. Connect the code execution API " +
        "to run actual test cases."
      );

    }, 1000);

  };


  // SUBMIT CODE

  const handleSubmit = () => {

    setOutput(
      "Submission received by the frontend.\n\n" +
      "Actual code evaluation and winner determination " +
      "will be connected through the backend."
    );

    setActiveTab("testcases");

  };


  return (

    <div className="battle-page">


      {/* HEADER */}

      <header className="battle-header">

        <div className="battle-brand">

          <Link to="/dashboard" className="battle-back">
            <ArrowLeft size={19}/>
          </Link>

          <div className="battle-logo">
            <Swords size={25}/>

            <span>
              CODE<span className="purple">ARMADA</span>
            </span>
          </div>

          <span className="live-battle-badge">
            <span></span>
            LIVE BATTLE
          </span>

        </div>


        <div className="battle-header-center">

          <div className="battle-timer">

            <Clock size={18}/>

            <span>{formatTime(timeLeft)}</span>

          </div>

          <p>TIME REMAINING</p>

        </div>


        <div className="battle-header-right">

          <div className="header-rating">
            <Trophy size={17}/>
            1450
          </div>

          <button
            className="leave-battle-btn"
            onClick={() => navigate("/dashboard")}
          >
            Leave Battle
          </button>

        </div>

      </header>



      {/* PLAYERS BAR */}

      <section className="battle-players-bar">


        <div className="battle-player-info">

          <div className="battle-player-avatar">
            K
          </div>

          <div>
            <h4>Kirti <span>(You)</span></h4>
            <p>Rating: 1450</p>
          </div>

          <span className="coding-indicator">
            ● Coding
          </span>

        </div>


        <div className="battle-vs">
          VS
        </div>


        <div className="battle-player-info opponent-info">

          <div className="battle-player-avatar opponent-player-avatar">
            A
          </div>

          <div>
            <h4>Alex Morgan</h4>
            <p>Rating: 1520</p>
          </div>

          <span className="coding-indicator opponent-coding">
            ● {opponentStatus}
          </span>

        </div>


      </section>



      {/* MAIN WORKSPACE */}

      <main className="battle-workspace">


        {/* LEFT PANEL */}

        <section className="problem-panel">


          {/* TABS */}

          <div className="problem-tabs">

            <button
              className={activeTab === "description" ? "selected-tab" : ""}
              onClick={() => setActiveTab("description")}
            >
              <FileCode size={17}/>
              Description
            </button>

            <button
              className={activeTab === "testcases" ? "selected-tab" : ""}
              onClick={() => setActiveTab("testcases")}
            >
              <Terminal size={17}/>
              Test Cases
            </button>

          </div>



          {/* DESCRIPTION */}

          {activeTab === "description" && (

            <div className="problem-content">

              <div className="problem-heading">

                <span className="problem-id">
                  PROBLEM #001
                </span>

                <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                  {problem.difficulty}
                </span>

              </div>


              <h1>{problem.title}</h1>


              <div className="problem-topic">
                {problem.category}
              </div>


              <h3>Problem Statement</h3>

              <p>
                You are given an array of integers and a target value.
                Find two distinct elements whose sum equals the target.
                Return the indices of those two elements.
              </p>


              <h3>Example 1</h3>

              <div className="example-box">

                <p><strong>Input:</strong></p>

                <code>
                  nums = [2,7,11,15], target = 9
                </code>

                <p><strong>Output:</strong></p>

                <code>[0,1]</code>

                <p><strong>Explanation:</strong></p>

                <code>nums[0] + nums[1] = 2 + 7 = 9</code>

              </div>


              <h3>Example 2</h3>

              <div className="example-box">

                <p><strong>Input:</strong></p>

                <code>
                  nums = [3,2,4], target = 6
                </code>

                <p><strong>Output:</strong></p>

                <code>[1,2]</code>

              </div>


              <h3>Constraints</h3>

              <ul className="constraints-list">

                <li>2 ≤ nums.length ≤ 10⁴</li>

                <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>

                <li>-10⁹ ≤ target ≤ 10⁹</li>

                <li>Exactly one valid answer exists.</li>

              </ul>


              <div className="problem-hint">

                <Zap size={18}/>

                <div>
                  <strong>Hint</strong>

                  <p>
                    Think about using a HashMap to improve
                    your searching efficiency.
                  </p>
                </div>

              </div>

            </div>

          )}



          {/* TEST CASES */}

          {activeTab === "testcases" && (

            <div className="problem-content">

              <h2>Test Cases</h2>

              <p className="testcase-description">
                Sample test cases for the selected problem.
              </p>


              <div className="testcase-card">

                <div>
                  <CheckCircle size={17}/>
                  Test Case 1
                </div>

                <p>Input: nums = [2,7,11,15], target = 9</p>

                <p>Expected Output: [0,1]</p>

              </div>


              <div className="testcase-card">

                <div>
                  <CheckCircle size={17}/>
                  Test Case 2
                </div>

                <p>Input: nums = [3,2,4], target = 6</p>

                <p>Expected Output: [1,2]</p>

              </div>


              <div className="testcase-card">

                <div>
                  <CheckCircle size={17}/>
                  Test Case 3
                </div>

                <p>Input: nums = [3,3], target = 6</p>

                <p>Expected Output: [0,1]</p>

              </div>


              <div className="output-box">

                <h3>
                  <Terminal size={17}/>
                  Execution Output
                </h3>

                <pre>{output}</pre>

              </div>

            </div>

          )}


        </section>



        {/* RIGHT PANEL */}

        <section className="editor-panel">


          {/* EDITOR TOOLBAR */}

          <div className="editor-toolbar">

            <div className="editor-file">

              <Code2 size={17}/>

              solution

              <span>.{language === "Python" ? "py" :
                language === "Java" ? "java" :
                language === "C++" ? "cpp" : "js"}</span>

            </div>


            <div className="editor-controls">

              <div className="language-select">

                <select
                  value={language}
                  onChange={handleLanguageChange}
                >

                  <option value="Java">Java</option>

                  <option value="Python">Python</option>

                  <option value="C++">C++</option>

                  <option value="JavaScript">JavaScript</option>

                </select>

                <ChevronDown size={14}/>

              </div>

              <button className="editor-expand-btn" title="Editor layout">
                <Maximize2 size={17}/>
              </button>

            </div>

          </div>



          {/* CODE EDITOR PLACEHOLDER */}

          <div className="code-editor-area">

            <div className="editor-line-numbers">

              {code.split("\n").map((_, index) => (

                <div key={index}>
                  {index + 1}
                </div>

              ))}

            </div>


            <textarea
              className="code-textarea"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              placeholder="Write your code here..."
            />

          </div>



          {/* EDITOR FOOTER */}

          <div className="editor-footer">

            <div>
              <span className="editor-status-dot"></span>
              Ready
            </div>

            <span>{language}</span>

          </div>



          {/* EDITOR ACTIONS */}

          <div className="editor-actions">

            <button
              className="run-code-btn"
              onClick={handleRun}
              disabled={isRunning}
            >

              <Play size={17}/>

              {isRunning ? "Running..." : "Run Code"}

            </button>


            <button
              className="submit-code-btn"
              onClick={handleSubmit}
            >

              <Send size={17}/>

              Submit Solution

            </button>

          </div>



          {/* OUTPUT CONSOLE */}

          <div className="editor-console">

            <div className="console-heading">

              <Terminal size={16}/>

              Output Console

            </div>

            <pre>{output}</pre>

          </div>


        </section>


      </main>



      {/* BATTLE FOOTER */}

      <footer className="battle-bottom-bar">

        <div>
          <Users size={16}/>
          2 Players Connected
        </div>

        <div>
          <Zap size={16}/>
          Competitive Mode
        </div>

        <div>
          <Bot size={16}/>
          AI Interview After Battle
        </div>

      </footer>


    </div>

  );

}

export default Battle;