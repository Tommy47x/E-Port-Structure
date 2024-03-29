const express = require('express'); // Express web server framework
const bcrypt = require('bcrypt'); // Password hashing library
const jwt = require('jsonwebtoken'); // JSON Web Token library
const cors = require('cors'); // CORS library
const { createUser, getUserByUsername } = require('../db/dbQueries'); // Database queries (for the user)
const dbQueries = require('../db/dbQueries'); // Database queries (for the quiz)
const app = express(); // Create the Express app
const router = express.Router(); // Create the Express router
const http = require('http'); // HTTP server
const { getQuestionsByQuizId, getAnswersByQuestionId } = require('../db/dbQueries');
const { insertUserAnswer } = require('../db/dbQueries');

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
            res.json({ token, role: user.role, id: user.id });
        } else if (user.role === 'user') {
            res.json({ token, role: user.role, id: user.id });
        } else if (user.role === "admin") {
            res.redirect('https://localhost:3001/quiz');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while logging in the user' });
    }
});
app.post('/quiz', async (req, res) => {
    console.log(req.body);
    try {
        switch (req.body.action) {
            case 'createQuiz':
                try {
                    const quizId = await dbQueries.createQuiz(req.body.data.name, req.body.data.description);
                    res.json({ quizId });
                } catch (err) {
                    res.status(500).json({ error: err.toString() });
                }
                break;
            case 'insertQuestion':
                try {
                    const questionId = await dbQueries.insertQuestion(req.body.data.quiz_id, req.body.data.question, req.body.data.questionOrder);
                    res.json({ success: true, questionId });
                } catch (err) {
                    res.status(500).json({ error: err.toString() });
                }
                break;
            case 'insertAnswer':
                try {
                    const question_id = parseInt(req.body.data.question_id);
                    if (isNaN(question_id)) {
                        res.status(400).json({ error: 'Invalid question_id' });
                        return;
                    }
                    console.log(question_id);
                    await dbQueries.insertAnswer(question_id, req.body.data.answer, req.body.data.is_correct);
                    res.json({ success: true });
                } catch (err) {
                    res.status(500).json({ error: err.toString() });
                }
                break;
            default:
                res.status(400).json({ error: 'Invalid action' });
        }
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

app.get('/quiz', async (req, res) => {
    try {
        const data = await dbQueries.getQuiz();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching the quiz data' });
    }
});

app.get('/questions', async (req, res) => {
    try {
        const quiz_id = req.query.quiz_id;
        const questions = await getQuestionsByQuizId(quiz_id);
        for (let question of questions) {
            question.answers = await getAnswersByQuestionId(question.id);
        }
        res.json(questions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching the quiz data' });
    }
});


app.post('/questions', async (req, res) => {
    const { userId, selectedAnswers, questions } = req.body;

    try {
        await Promise.all(selectedAnswers.map(async (selectedAnswer) => {
            const question = questions.find(q => q.question === selectedAnswer.question);
            if (question) {
                const questionId = question.id;
                const answer = question.answers.find(a => a.answer === selectedAnswer.selectedAnswer);
                if (answer) {
                    await dbQueries.insertUserAnswer(userId, questionId, answer.answer);
                }
            }
        }));

        res.send('Quiz submitted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error inserting user answer into database');
    }
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = router;