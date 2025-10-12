# EraCrux

## Overview

EraCrux is a modern data analytics platform designed to help users clean, organize, and visualize their data with interactive dashboards and AI-powered insights. Upload CSVs, connect to popular data sources, and chat with your data using CruxAI.

## Features

- **CSV Upload & Dashboard Generation:** Instantly upload CSV files and generate interactive dashboards.
- **AI Chat with Data:** Use CruxAI to ask questions about your data and get instant answers.
- **Integrations:** Connect with Google Sheets, Microsoft Excel, MySQL, and more (coming soon).
- **Beautiful UI:** Responsive, modern interface with customizable charts and visualizations.
- **User Authentication:** Secure login and signup with social providers (Google, GitHub).

## Installation

To install and run this project, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/EraCruxOfficial/EraCrux.git
    ```
2. Navigate to the project directory:
    ```sh
    cd EraCrux
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

## Usage

To start the development server, run:
```sh
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Folder Structure

- `app/` — Next.js app routes and pages
- `components/` — UI components and blocks
- `db/` — Database configuration and schema
- `lib/` — Utility libraries (auth, CSV parsing, etc.)
- `server/` — Server-side logic and API handlers
- `public/` — Static assets

## Integrations

- **CSV Upload:** Upload CSV files and view dashboards.
- **CruxAI:** Chat with your data using AI ([app/workspaces/cruxai/page.tsx](app/workspaces/cruxai/page.tsx)).
- **Other Integrations:** Google Sheets, Excel, MySQL, Facebook Marketplace (coming soon).

## License

MIT

---

For more details, see [app/page.tsx](app/page.tsx), [app/workspaces/page.tsx](app/workspaces/page.tsx),