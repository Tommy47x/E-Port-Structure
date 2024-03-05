const express = require('express'); // Express web server framework
const bcrypt = require('bcrypt'); // Password hashing library
const jwt = require('jsonwebtoken'); // JSON Web Token library
const cors = require('cors'); // CORS library
const { createUser, getUserByUsername } = require('../db/dbQueries'); // Database queries (for the user)
const dbQueries = require('../db/dbQueries'); // Database queries (for the quiz)
const app = express(); // Create the Express app
const router = express.Router(); // Create the Express router
const http = require('http'); // HTTP server
const server = http.createServer({ maxHeaderSize: 8192 }, app); // Create the server
server.listen(3000); // Listen on port 3000

router.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3002']
}));

app.use(cors()); // Enable CORS for the app
app.use(express.json()); // Enable JSON parsing for the app
app.use('/auth', router); // Use the router for the /auth path



router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await createUser(req.body.username, hashedPassword, req.body.role || 'user');
        res.json(user);
    } catch (err) {
        console.error("Error occurred", err);
        res.status(500).json({ error: err.message, password: req.body.password });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        if (user.role === 'admin') {
            res.json({ token, role: user.role });
        } else if (user.role === 'user') {
            res.json({ token, role: user.role });
        } else if (user.role === "admin") {
            res.redirect('https://localhost:3001/quiz');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while logging in the user' });
    }
});

// function restrictToUserType(req, res, next) {
//     // ... (rest of your restrictToUserType function code)
// }

app.post('/', async (req, res) => {
    const { question, answer } = req.body;
    console.log(question, answer);
    try {
        const result = await dbQueries.insertQuestion(question, answer);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while adding the question.' });
    }
});

// app.get('/quiz', restrictToUserType, (req, res) => {
//     // ... (rest of your GET /quiz route code)
// });

// app.listen(5000, function () {
//     console.log('App listening on port 5000!');
// });

module.exports = router;