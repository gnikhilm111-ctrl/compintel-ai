# CompIntel AI

## AI-Powered Competitive Intelligence Platform

CompIntel AI is a web-based competitive intelligence platform that helps users monitor competitors, analyze market activities, track important events, and generate AI-powered strategic insights.

The system combines a React-based dashboard with a Node.js backend, Large Language Model (LLM) services, and long-term memory to provide an interactive competitive analysis experience.

---

## Features

### 1. Competitive Intelligence Dashboard

* View an overview of monitored competitors.
* Track competitor threat levels and market information.
* View important competitive events and activities.
* Access competitor profiles from a central dashboard.

### 2. Competitor Profiles

Each competitor has a dedicated profile containing:

* Company information
* Market category
* Headquarters
* Employee information
* Funding information
* Technology stack
* Strategic focus areas
* Key executives
* Growth and market metrics

### 3. Competitive Timeline

The timeline displays historical competitor activities in chronological order.

Events can include:

* Pricing changes
* Product launches
* New features
* Hiring activities
* Partnerships
* Marketing activities
* Messaging changes
* Strategic movements

### 4. AI Analyst

The AI Analyst allows users to ask questions about competitors using a conversational interface.

Users can ask questions such as:

* What are the major recent moves of a competitor?
* What products has the competitor launched?
* What strategic patterns can be observed?
* What competitive risks should be monitored?

The AI uses available competitor information and stored historical events to generate analysis.

### 5. AI Strategy Analysis

The Strategy Agent analyzes competitive information and provides structured strategic insights based on:

* Historical competitor events
* Competitor information
* Market movements
* Technology changes
* Pricing activities
* Hiring patterns
* Partnerships

### 6. Live Competitor Research

The application includes a live research workflow that:

1. Selects a competitor.
2. Collects public competitor signals.
3. Processes the collected information using an LLM.
4. Extracts structured competitor events.
5. Validates the extracted information.
6. Checks for duplicate events.
7. Stores useful new events in long-term memory.

### 7. Long-Term Memory

CompIntel AI uses Hindsight memory to store and retrieve relevant competitor events.

This allows the AI Analyst to use historical information when answering new questions instead of relying only on the current request.

### 8. Event Management

Competitor events contain information such as:

* Event title
* Date
* Category
* Description
* Source
* Severity
* Impact score
* Tags

---

## Technology Stack

### Frontend

* React.js
* Vite
* React Router
* Tailwind CSS
* Lucide React

### Backend

* Node.js
* Express.js
* REST APIs
* CORS
* dotenv

### Artificial Intelligence

* Groq LLM
* AI Analyst
* Intelligence Agent
* Strategy Agent
* Competitive Intelligence Agent

### Memory

* Hindsight Memory

### Development Tools

* npm
* Git
* GitHub

---

## Project Structure

```text
CompIntel AI/
│
├── client/
│   ├── public/
│   │   └── favicon.svg
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── CompetitorCard.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── NewEventModal.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AIAnalyst.jsx
│   │   │   ├── CompetitorProfile.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Timeline.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── agents/
│   │   │   ├── competitiveIntelligenceAgent.ts
│   │   │   ├── intelligenceAgent.js
│   │   │   └── strategyAgent.js
│   │   │
│   │   ├── data/
│   │   │   └── competitorsData.js
│   │   │
│   │   ├── routes/
│   │   │   ├── analysis.js
│   │   │   ├── chat.js
│   │   │   ├── competitors.js
│   │   │   └── events.js
│   │   │
│   │   ├── services/
│   │   │   ├── competitorService.js
│   │   │   ├── eventService.js
│   │   │   ├── hindsightMemoryService.js
│   │   │   ├── liveResearchService.js
│   │   │   └── llmService.js
│   │   │
│   │   ├── tools/
│   │   │   └── agentTools.ts
│   │   │
│   │   ├── utils/
│   │   │   └── logger.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env.example
│   └── package.json
│
├── package.json
└── package-lock.json
```

---

## How the System Works

```text
User
  │
  ▼
React Frontend
  │
  ▼
Node.js / Express Backend
  │
  ├── Competitor Data
  │
  ├── Event Data
  │
  ├── AI Analyst
  │
  ├── Strategy Agent
  │
  ├── Competitive Intelligence Agent
  │
  ├── Groq LLM
  │
  └── Hindsight Memory
  │
  ▼
AI-Powered Competitive Insights
```

---

## AI Analyst Workflow

```text
User Question
     │
     ▼
AI Analyst
     │
     ▼
Search Relevant Memory
     │
     ▼
Retrieve Competitor Events
     │
     ▼
Send Context to LLM
     │
     ▼
Generate Analysis
     │
     ▼
Display Result to User
```

---

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git

You can verify the installations using:

```bash
node -v
npm -v
git --version
```

---

## Installation

### 1. Clone the Repository

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
```

Move into the project directory:

```bash
cd ms-project
```

---

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

### 3. Install Backend Dependencies

Open another terminal and run:

```bash
cd server
npm install
```

---

## Environment Variables

Create a `.env` file inside the `server` folder.

Example:

```env
PORT=5000
GROQ_API_KEY=your_groq_api_key
HINDSIGHT_API_KEY=your_hindsight_api_key
```

Do not upload your actual API keys to GitHub.

The project includes a `.env.example` file that can be used as a reference.

---

## Running the Application

### Start the Backend

Inside the `server` folder:

```bash
npm start
```

The backend will run on the configured port.

### Start the Frontend

Inside the `client` folder:

```bash
npm run dev
```

Vite will provide a local development URL, normally similar to:

```text
http://localhost:5173
```

Open this URL in your browser.

---

## API Modules

The backend provides REST API routes for different parts of the application.

### Competitors

```text
/api/competitors
```

Used to retrieve competitor information.

### Events

```text
/api/events
```

Used to retrieve and manage competitor events.

### AI Chat

```text
/api/chat
```

Used by the AI Analyst for conversational competitive intelligence.

### Analysis

```text
/api/analysis
```

Used for competitive and strategic analysis.

---

## Sample Competitors

The project currently contains a synthetic dataset with three competitors:

### NovaStack

Enterprise data infrastructure platform focused on high-throughput systems, security, and enterprise deployments.

### CloudForge

Developer-focused cloud orchestration platform with an emphasis on open-source technologies and developer adoption.

### DataPilot

AI analytics platform focused on telemetry, LLM monitoring, and autonomous AI agent technologies.

> The competitor information included in the project is a synthetic dataset intended for demonstration and development purposes.

---

## AI Agents

### Intelligence Agent

The Intelligence Agent processes user questions and retrieves relevant information from long-term memory before generating an AI response.

### Strategy Agent

The Strategy Agent performs higher-level competitive analysis using competitor information, historical events, and stored memory.

### Competitive Intelligence Agent

The Competitive Intelligence Agent combines competitor research, event information, memory, and AI analysis to produce competitive intelligence.

---

## Future Enhancements

Possible future improvements include:

* Integration with additional real-time news sources
* Automated competitor monitoring
* More external data sources
* Advanced market trend visualization
* Email and notification alerts
* More AI-powered reports
* Export reports as PDF
* User authentication and role management
* Additional competitor categories
* Improved source verification
* Advanced analytics dashboards

---

## Project Objective

The main objective of CompIntel AI is to demonstrate how Artificial Intelligence, historical data, and automated competitor research can be combined into a single platform for competitive intelligence.

The project provides users with an interactive way to monitor competitor activities, explore historical events, and obtain AI-assisted analysis.

---

## Author

**Nikhil**

B.Tech Computer Science and Engineering

---

## License

This project is developed for educational and project demonstration purposes.
