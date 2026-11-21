import { useState, useEffect } from "react";

import {
  Swords,
  BrainCircuit,
  Bot,
  User,
  Send,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  MessageSquare,
  Trophy,
  Code2,
  Sparkles,
  ArrowLeft,
  Lightbulb,
  ShieldCheck
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import "../App.css";

function Interview() {

  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState({});

  const [timeLeft, setTimeLeft] = useState(600);

  const [submitted, setSubmitted] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [showReview, setShowReview] = useState(false);


  // INTERVIEW QUESTIONS

  const questions = [

    {
      question: "Explain your approach to solving this problem.",
      category: "Problem Understanding",
      description:
        "Describe the logic you used to solve the coding problem and why you selected this approach.",
      hint:
        "Think about the main algorithm and how you reached your solution."
    },

    {
      question: "What is the time complexity of your solution?",
      category: "Time Complexity",
      description:
        "Explain the time complexity of your solution. Discuss how the algorithm performs as the input size increases.",
      hint:
        "Consider how many times your loops or operations execute."
    },

    {
      question: "What is the space complexity of your solution?",
      category: "Space Complexity",
      description:
        "Explain the additional memory used by your algorithm and any extra data structures.",
      hint:
        "Think about auxiliary arrays, HashMaps or other data structures."
    },

    {
      question: "Can you optimize your current solution?",
      category: "Optimization",
      description:
        "Discuss whether your solution can be improved in terms of time or space complexity.",
      hint:
        "Consider alternative algorithms and data structures."
    },

    {
      question: "What edge cases did you consider?",
      category: "Edge Cases",
      description:
        "Explain the boundary conditions and special inputs that your solution should handle correctly.",
      hint:
        "Think about empty inputs, minimum sizes, duplicates and extreme values."
    }

  ];


  // TIMER

  useEffect(() => {

    if (timeLeft <= 0) {
        return;
    }

    const timer = setInterval(() => {

        setTimeLeft((prev) => {
            if (prev <= 1) {
                return 0;
            }

            return prev - 1;
        });

    }, 1000);

    return () => clearInterval(timer);

}, [timeLeft]);


useEffect(() => {

    if (timeLeft === 0 && !submitted) {
        submitInterview();
    }

}, [timeLeft, submitted]);


  // FORMAT TIMER

  const formatTime = (seconds) => {

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;

  };


  // HANDLE ANSWERS

  const handleAnswer = (value) => {

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: value
    }));

  };


  // NAVIGATION

  const nextQuestion = () => {

    if (currentQuestion < questions.length - 1) {

      setCurrentQuestion((prev) => prev + 1);

    }

  };


  const previousQuestion = () => {

    if (currentQuestion > 0) {

      setCurrentQuestion((prev) => prev - 1);

    }

  };


  // SUBMIT INTERVIEW

  const submitInterview = () => {

    const interviewData = {
      answers,
      questions,
      submittedAt: new Date().toISOString()
    };

    sessionStorage.setItem(
      "interviewData",
      JSON.stringify(interviewData)
    );

    setSubmitted(true);

    navigate("/interview-result");

  };


  const question = questions[currentQuestion];

  const answeredCount = Object.values(answers).filter(
    (answer) => answer.trim() !== ""
  ).length;


  return (

    <div className="interview-page">


      {/* NAVBAR */}

      <header className="interview-navbar">

        <Link to="/dashboard" className="interview-logo">

          <Swords size={26}/>

          <span>
            CODE<span className="purple">ARMADA</span>
          </span>

        </Link>


        <div className="interview-live">

          <span></span>

          AI INTERVIEW SESSION

        </div>


        <div className="interview-timer">

          <Clock size={17}/>

          {formatTime(timeLeft)}

        </div>

      </header>



      {/* MAIN */}

      <main className="interview-main">


        {/* HEADING */}

        <section className="interview-heading">

          <div className="interview-badge">

            <Sparkles size={15}/>

            AI POWERED EVALUATION

          </div>

          <h1>
            Technical <span>Interview</span>
          </h1>

          <p>
            Explain your logic, defend your approach and demonstrate
            your problem-solving skills.
          </p>

        </section>



        {/* INTERVIEW LAYOUT */}

        <section className="interview-layout">


          {/* LEFT PANEL */}

          <div className="interview-sidebar">


            <div className="interview-profile">

              <div className="ai-avatar">

                <Bot size={35}/>

              </div>

              <h3>AI Interviewer</h3>

              <p>Technical Assessment Assistant</p>

              <span className="ai-online">
                ● Online
              </span>

            </div>



            {/* PROGRESS */}

            <div className="interview-progress">

              <div className="progress-heading">

                <span>Interview Progress</span>

                <strong>
                  {answeredCount}/{questions.length}
                </strong>

              </div>


              <div className="interview-progress-bar">

                <div
                  style={{
                    width: `${(answeredCount / questions.length) * 100}%`
                  }}
                ></div>

              </div>


              <p>
                Questions answered
              </p>

            </div>



            {/* QUESTION NAVIGATION */}

            <div className="question-navigation">

              <h4>QUESTIONS</h4>


              {questions.map((q, index) => {

    const isAnswered = Boolean(answers[index]?.trim());
    const isActive = currentQuestion === index;

    return (
        <button
            key={index}
            className={`question-nav
                ${isActive ? "active-question" : ""}
                ${isAnswered ? "answered-question" : "unanswered-question"}
            `}
            onClick={() => setCurrentQuestion(index)}
        >

            <span className="question-number">

                {isAnswered
                    ? <CheckCircle size={16}/>
                    : index + 1
                }

            </span>

            <span>{q.category}</span>

            <span className="question-status">
                {isAnswered ? "Answered" : "Pending"}
            </span>

        </button>
    );
})}

            </div>



            {/* TIPS */}

            <div className="interview-tip">

              <Lightbulb size={20}/>

              <h4>Interview Tip</h4>

              <p>
                Explain your reasoning clearly. Focus on why you
                selected a particular algorithm.
              </p>

            </div>


          </div>



          {/* RIGHT PANEL */}

          <div className="interview-chat">


            {/* CHAT HEADER */}

            <div className="interview-chat-header">

              <div className="chat-ai-icon">

                <BrainCircuit size={22}/>

              </div>

              <div>

                <h3>AI Technical Interviewer</h3>

                <p>Evaluating your problem-solving skills</p>

              </div>

            </div>



            {/* QUESTION AREA */}

            <div className="interview-conversation">


              <div className="ai-message">

                <div className="message-avatar">
                  <Bot size={18}/>
                </div>


                <div className="message-content">

                  <span>AI INTERVIEWER</span>

                  <p>
                    Welcome to your technical interview!
                    I'll ask you questions about your recent
                    coding challenge.
                  </p>

                </div>

              </div>



              <div className="ai-message">

                <div className="message-avatar">
                  <Bot size={18}/>
                </div>


                <div className="message-content">

                  <span>QUESTION {currentQuestion + 1}</span>

                  <div className="question-category">
                    {question.category}
                  </div>

                  <h2>
                    {question.question}
                  </h2>

                  <p>
                    {question.description}
                  </p>

                  <div className="question-hint">

                    <Lightbulb size={16}/>

                    {question.hint}

                  </div>

                </div>

              </div>



              {/* USER ANSWER */}

              {answers[currentQuestion]?.trim() && (

                <div className="user-message">

                  <div className="message-content">

                    <span>YOUR ANSWER</span>

                    <p>
                      {answers[currentQuestion]}
                    </p>

                  </div>

                  <div className="message-avatar user-message-avatar">

                    <User size={18}/>

                  </div>

                </div>

              )}


            </div>



            {/* ANSWER INPUT */}

            <div className="answer-section">

              <div className="answer-heading">

                <MessageSquare size={17}/>

                Your Answer

              </div>


              <textarea

                value={answers[currentQuestion] || ""}

                onChange={(e) => handleAnswer(e.target.value)}

                placeholder="Explain your approach here..."

              />


              <div className="answer-footer">

                <span>
                  {answers[currentQuestion]?.length || 0} characters
                </span>


                <button
    className="send-answer-btn"
    onClick={() => {
        if (currentQuestion === questions.length - 1) {
            setShowReview(true);
        } else {
            nextQuestion();
        }
    }}
>
    {currentQuestion === questions.length - 1
        ? "Review Answers"
        : "Next Question"
    }

    <ChevronRight size={17}/>
</button>

              </div>

            </div>



            {/* BOTTOM NAVIGATION */}

            <div className="interview-navigation">

    <button
        className="previous-question-btn"
        onClick={previousQuestion}
        disabled={currentQuestion === 0}
    >
        <ChevronLeft size={17}/>
        Previous
    </button>

    <div className="navigation-center">
        <span>
            Question {currentQuestion + 1} of {questions.length}
        </span>

        <div className="navigation-dots">
            {questions.map((q, index) => (
                <button
                    key={index}
                    className={`
                        navigation-dot
                        ${currentQuestion === index ? "active-dot" : ""}
                        ${answers[index]?.trim() ? "completed-dot" : ""}
                    `}
                    onClick={() => setCurrentQuestion(index)}
                    title={`Question ${index + 1}`}
                />
            ))}
        </div>
    </div>

    {currentQuestion < questions.length - 1 ? (

        <button
            className="send-answer-btn"
            onClick={nextQuestion}
        >
            Next Question
            <ChevronRight size={17}/>
        </button>

    ) : (

        <button
            className="finish-interview-btn"
            onClick={() => setShowReview(true)}
        >
            Review Answers
            <Send size={16}/>
        </button>

    )}

</div>

          </div>


        </section>



        {/* FOOTER */}

        <footer className="interview-footer">

          <div>

            <ShieldCheck size={16}/>

            Your interview progress is saved in this session.

          </div>

          <p>
            © 2026 Code Armada
          </p>

        </footer>


      </main>



{/* REVIEW ANSWERS MODAL */}

{showReview && (
    <div className="interview-modal-overlay">

        <div className="interview-confirm-modal review-modal">

            <h2>Review Your Answers</h2>

            <p>
                You have answered {answeredCount} out of {questions.length} questions.
            </p>

            <div className="review-question-list">

                {questions.map((q, index) => (

                    <div className="review-question-card" key={index}>

                        <div>
                            <strong>
                                Question {index + 1}: {q.category}
                            </strong>

                            <p>
                                {answers[index]?.trim()
                                    ? "Answered ✓"
                                    : "Not Answered"}
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setCurrentQuestion(index);
                                setShowReview(false);
                            }}
                        >
                            Edit Answer
                        </button>

                    </div>

                ))}

            </div>

            <div className="confirm-actions">

                <button
                    className="cancel-confirm-btn"
                    onClick={() => setShowReview(false)}
                >
                    Continue Interview
                </button>

                <button
                    className="confirm-submit-btn"
                    onClick={() => {
                        setShowReview(false);
                        setShowConfirm(true);
                    }}
                >
                    Submit Interview
                </button>

            </div>

        </div>

    </div>
)}


      {/* CONFIRMATION MODAL */}

      {showConfirm && (

        <div className="interview-modal-overlay">

          <div className="interview-confirm-modal">

            <div className="confirm-icon">
              <Send size={25}/>
            </div>

            <h2>Submit Interview?</h2>

            <p>
              You have answered {answeredCount} out of {questions.length}
              questions. Are you sure you want to submit?
            </p>


            <div className="confirm-actions">

              <button
                className="cancel-confirm-btn"
                onClick={() => setShowConfirm(false)}
              >
                Continue Interview
              </button>


              <button
                className="confirm-submit-btn"
                onClick={submitInterview}
              >
                Submit Now
              </button>

            </div>

          </div>

        </div>

      )}


    </div>

  );

}




export default Interview;