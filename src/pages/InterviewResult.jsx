import {
  Trophy,
  BrainCircuit,
  CheckCircle,
  ArrowLeft,
  Target,
  TrendingUp,
  Lightbulb
} from "lucide-react";

import { Link } from "react-router-dom";

import "../App.css";

function InterviewResult() {

  const interviewData = JSON.parse(
    sessionStorage.getItem("interviewData") || "{}"
  );

  const questions = interviewData.questions || [];

  const answers = interviewData.answers || {};

  const answeredCount = questions.filter(
    (_, index) => answers[index]?.trim()
  ).length;

  return (

    <div className="interview-result-page">

      <div className="result-container">

        <div className="result-icon">
          <Trophy size={38}/>
        </div>

        <span className="result-badge">
          INTERVIEW COMPLETED
        </span>

        <h1>Great Job, Kirti!</h1>

        <p className="result-subtitle">
          You have completed your technical interview.
        </p>


        <div className="result-score-card">

          <BrainCircuit size={35}/>

          <h2>{answeredCount}/{questions.length}</h2>

          <p>Questions Answered</p>

          <div className="result-progress">
            <div
              style={{
                width: questions.length
                  ? `${(answeredCount / questions.length) * 100}%`
                  : "0%"
              }}
            ></div>
          </div>

        </div>


        <div className="result-summary-grid">

          <div>
            <CheckCircle size={23}/>
            <h3>{answeredCount}</h3>
            <p>Answered</p>
          </div>

          <div>
            <Target size={23}/>
            <h3>{questions.length - answeredCount}</h3>
            <p>Unanswered</p>
          </div>

          <div>
            <TrendingUp size={23}/>
            <h3>--</h3>
            <p>AI Score</p>
          </div>

        </div>


        <div className="result-feedback">

          <Lightbulb size={22}/>

          <div>
            <h3>What's Next?</h3>

            <p>
              Your answers have been saved for this session.
              Actual AI evaluation and personalized feedback
              will be available after backend integration.
            </p>
          </div>

        </div>


        <div className="result-actions">

          <Link to="/dashboard" className="result-dashboard-btn">
            <ArrowLeft size={17}/>
            Back to Dashboard
          </Link>

        </div>


        <footer>
          © 2026 Code Armada. Code. Compete. Conquer.
        </footer>

      </div>

    </div>

  );

}

export default InterviewResult;