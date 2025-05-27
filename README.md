# Admin News App

A Next.js-based admin dashboard for managing news content in the News Application. Built with TypeScript, this project provides a web interface for administrators to create, update, and delete news articles and related data.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Running Locally](#running-locally)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

- **Node.js**: Version 20.14.0 (use `nvm` to manage versions: `nvm install 20.14.0`)
- **npm**: Included with Node.js
- **Git**: For cloning the repository ([git-scm.com](https://git-scm.com))
- **Vercel CLI**: For deployment (`npm install -g vercel`)

## Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/tuyenhcmute3010it/Admin_News_App.git
   cd Admin_News_App
   ```

2. Switch to Node.js Version 20.14.0:

   ```bash
   nvm use 20.14.0
   ```

3. Install Dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
4. Configure Environment Variables:

- Create a .env.local file in the project root.
  Add the backend API URL (update to the deployed NestJS backend URL after deployment):
- env
  ```bash
   NEXT_PUBLIC_API_ENDPOINT=http://localhost:8000
   NEXT_PUBLIC_URL=http://localhost:3000
  ```
5. Running Locally

- Start the development server:

   ```bash
   npm run dev
- Open http://localhost:3000 in your browser to view the admin dashboard.
