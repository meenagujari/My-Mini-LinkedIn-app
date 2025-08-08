# My Mini LinkedIn App

This is a mini LinkedIn application built with a React frontend and a Node.js/Express backend.

## Project Structure

- `frontend/`: Contains the React application.
- `backend/`: Contains the Node.js/Express server.

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/meenagujari/My-Mini-LinkedIn-app.git
    cd My-Mini-LinkedIn-app
    ```

2.  **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

1.  **Start the backend server:**

    ```bash
    cd backend
    npm run dev
    ```

    (If you encounter an `EADDRINUSE` error, ensure no other process is using port 3001. You can find and kill the process using `sudo lsof -i :3001` and `kill -9 <PID>`)

2.  **Start the frontend development server:**

    ```bash
    cd ../frontend
    npm run dev
    ```

    (This will typically open the application in your browser at `http://localhost:3000`)

## Technologies Used

-   **Frontend:** React, Next.js, Tailwind CSS
-   **Backend:** Node.js, Express, TypeScript

## Contributing

Feel free to contribute to this project. Please follow standard GitHub flow:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/YourFeature`).
6.  Open a Pull Request.

## License

[Specify your license here, e.g., MIT License]