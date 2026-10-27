# ⚔️ Code Armada — AI-Powered Coding Battle Arena

<p align="center">
  <strong>Code. Compete. Explain. Improve.</strong>
</p>

<p align="center">
  A real-time 1v1 coding battle platform that evaluates not only your code, but also your understanding of it.
</p>

---

## 🚀 About the Project

**Code Armada** is an AI-powered competitive coding platform that combines real-time Data Structures and Algorithms (DSA) battles with personalized technical interviews.

Traditional coding platforms focus primarily on whether a solution passes test cases. Code Armada takes the experience further by analyzing a participant's actual submitted code and generating personalized technical questions about their algorithm, implementation choices, complexity, and edge cases.

Our goal is to bridge the gap between competitive programming and technical interview preparation.

## ✨ Key Features

- ⚔️ **Real-Time 1v1 Coding Battles** — Compete against another developer to solve the same DSA problem within a fixed time limit.
- 💻 **Interactive Code Editor** — Write and edit solutions in an integrated Monaco Editor.
- ⚡ **Secure Code Execution** — Compile and execute submissions using an isolated execution service such as Judge0.
- 🔄 **Live Multiplayer Synchronization** — Coordinate rooms, countdowns, match status, and submission events using Socket.IO.
- 🤖 **AI-Powered Technical Interview** — Generate questions based on each participant's actual submitted solution.
- 🧠 **Personalized Follow-Up Questions** — Explore algorithm choices, time and space complexity, edge cases, and optimization opportunities.
- 📊 **Performance Reports** — Combine coding correctness and interview evaluation into a performance report.
- 🔐 **Authentication and User Management** — Support secure user registration, login, and protected application features.

*Features are planned for implementation; availability will depend on the current development stage.*

## 🔄 How It Works

1. **Register or Log In** — Enter the coding arena.
2. **Find an Opponent** — Join a match or connect with another participant.
3. **Solve the Challenge** — Work on the same DSA problem within the allotted time.
4. **Execute and Submit** — Run your solution against test cases and finalize your submission.
5. **AI Code Analysis** — Analyze the submitted implementation to identify its approach and important decisions.
6. **Technical Interview** — Answer personalized questions generated from your solution.
7. **View Your Results** — Review coding performance, interview feedback, and areas for improvement.

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS |
| Code Editor | Monaco Editor |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Real-Time Communication | Socket.IO |
| Code Execution | Judge0 API |
| AI Interview | Gemini API (planned integration) |
| Authentication | JWT |
| Version Control | Git and GitHub |

## 🏗️ Project Structure

```text
code-armada/
├── client/                 # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── services/
├── server/                 # Express backend
│   └── src/
│       ├── config/
│       ├── models/
│       ├── routes/
│       ├── controllers/
│       ├── middleware/
│       ├── sockets/
│       └── services/
├── execution/              # Code execution integration
├── ai-interview/           # AI interview module
├── docs/                   # API and event documentation
├── .gitignore
└── README.md
```

*The structure above is the proposed project organization and may evolve during development.*

## 👥 Team — Prompt Pirates

 Member :-
| Bhoomi Tiwari 
| Arya Shukla 
| Kirti 
| Priya Chauhan 
| Tanya Porwal 

## 🌱 Development Workflow

We use Git and GitHub to collaborate across independent development branches.


### Contribution Steps

1. Clone the repository.
2. Switch to your assigned branch.
3. Implement and test your changes.
4. Commit and push your changes to your branch.
5. Open a Pull Request targeting `main`.
6. Review and test changes before merging.

## 🔒 Security

- Never commit `.env` files, API keys, database credentials, or JWT secrets.
- Keep AI provider keys on the backend.
- Execute untrusted code through a properly isolated execution service rather than directly on the Express server.
- Validate and authorize API requests and real-time events.

## 🎯 Project Vision

Code Armada aims to make coding practice more competitive, interactive, and interview-focused by evaluating both **solution quality and the developer's understanding**.

> Winning the battle is good. Understanding your solution is better.

---

<p align="center">
  <strong>Code Armada — Code. Compete. Explain. Improve.</strong>
</p>
