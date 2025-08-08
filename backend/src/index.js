// ... existing code ...

const app = express();

// ... existing code ...

// Use process.env.PORT provided by Render, fallback to 3001 for local development
const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

// ... existing code ...