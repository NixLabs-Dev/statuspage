# NixLabs Networks Status Page

This is a simple status page built with **Next.js** for **NixLabs Networks**. It provides real-time monitoring and reporting of the current status of NixLabs' infrastructure.

## Features

Current
- Real-time status updates
- Simple and clean design
- Built with Next.js for performance and scalability
- Make email subscriptions work

Working on
- Tie into NixLabs internal queueing API for sending messages via discord

## Screenshots

<details>
    <summary>Status Page</summary>
    <img src="./screenshot.png" alt="Status Page Screenshot" />
</details>

## Setup

To get started with the NixLabs Networks Status Page, follow these steps:

### Prerequisites

- Node.js (v18 or later)
- npm (v7 or later)

### Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/NixLabsNetworks/status-page.git
  cd status-page
  ```

2. Build the container:
  ```bash
  docker build -t nixlabs.dev/statuspage:latest --build-arg DATABASE_URL="<SOME DATABASE URL HERE>" .
  ```
> [!NOTE]
> During local testing, you might find using `postgresql://<USERNAME>@host.docker.internal/<DATABASE>?schema=public` for `DATABASE_URL` to be useful.

3. Run the container on port 3000:
  ```bash
  docker run -p 3000:3000 nixlabs.dev/statuspage:latest
  ```

### Development

1. Install dependencies:
  ```bash
  npm install
  ```

2. Copy [`.env.example`](./.env.example) into `.env`, and modify.

3. Generate database types:
  ```bash
  npm run generate
  ```

4. Push schema to database:
  ```bash
  npm run dbpush
  ```

5. Run the development environment:
  ```bash
  npm run dev
  ```
