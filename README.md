# NixLabs Networks Status Page

This is a simple status page built with **Next.js** for **NixLabs Networks**. It provides real-time monitoring and reporting of the current status of NixLabs' infrastructure.

## Features

- Real-time status updates
- Simple and clean design
- Built with Next.js for performance and scalability

## Screenshot

![Status Page Screenshot](./screenshot.png)

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

2. Build the container
  ```bash
  docker build -t nixlabs.dev/statuspage:latest --build-arg DATABASE_URL="<SOME DATABASE URL HERE>" .
  ```
3. Run the container on port 3000
  ```bash
  docker run -p 3000:3000 nixlabs.dev/statuspage:latest
  ```
