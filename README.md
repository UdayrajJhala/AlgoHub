# AlgoHub

AlgoHub is a platform for practicing Data Structures and Algorithms (DSA). It allows users to solve problems, execute code in C++ and Java, and visualize algorithms like sorting, DFS, BFS, and Dijkstra’s. The platform provides real-time code execution through a self-hosted Judge0 instance on AWS EC2 and tracks user progress.

## Live at
https://alg0hub.vercel.app

## Features

- **Problem Solving:** Solve 20 curated DSA problems with real-time execution. (planning to add more problems)
- **Code Execution:** Supports C++ and Java with submission validation against multiple test cases.
- **Algorithm Visualization:** Interactive visualization for sorting and graph algorithms.
- **Progress Tracking:** Monitor solved problems and track improvement.

## Tech Stack

- **Frontend:** React (Hosted on Vercel)
- **Backend:** Node.js, Express (Hosted on Render)
- **Database:** PostgreSQL (Hosted on Render)
- **Code Execution Engine:** Self-hosted Judge0 on AWS EC2 using Docker

## Installation

### Prerequisites
- Node.js
- PostgreSQL
- Judge0 instance (either self hosted or publicly available like RapidAPI)

### Backend Setup
```sh
# Clone the repository
git clone https://github.com/your-username/algohub.git
cd algohub/backend

# Install dependencies
npm install

## Environment Variables

Create a `.env` file and configure the following environment variables:
```sh
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_CALLBACK_URL=<your_google_callback_url>
JWT_SECRET=<your_jwt_secret>
JWT_REFRESH_SECRET=<your_jwt_refresh_secret>
POSTGRES_PORT=5432
POSTGRES_DATABASE=<your_database_name>
POSTGRES_HOST=<your_postgres_host>
POSTGRES_USER=<your_postgres_user>
POSTGRES_PASSWORD=<your_postgres_password>
CLIENT_URL=https://alg0hub.vercel.app
JUDGE0_URL=<your_judge0_instance_url>
BACKEND_URL=<your_backend_url>

# Start the server
npm start
```

### Frontend Setup
```sh
cd ../frontend

# Install dependencies
npm install

Create a `.env` file and configure the following environment variables:
```sh
VITE_BACKEND_URL=<your_backend_url>

# Start the development server
npm run dev
```

## Future Plans

- Migrate Judge0 to a more powerful cloud for parallel execution.
- Add more problems and improve algorithm visualization.
- Optimize performance and scale for better user experience.
