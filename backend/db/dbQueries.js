const pool = require('./pool');

async function createUser(username, hashedPassword, role) {
    try {
        console.log("Inserting user into database");
        const newUser = await pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *', [username, hashedPassword, role]);
        console.log("User inserted", newUser.rows[0]);
        return newUser.rows[0];
    } catch (err) {
        console.error("Error occurred in createUser", err);
        throw err;
    }
};

async function getUserByUsername(username) {
    try {
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return user.rows[0];
    } catch (err) {
        throw err;
    }
};

async function createQuiz(name, description) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start transaction for consistency

        const insertQuizQuery = await client.query('INSERT INTO Quizes (name, description) VALUES ($1, $2) RETURNING id', [name, description]);
        const quizId = insertQuizQuery.rows[0].id;
        console.log(quizId);

        await client.query('COMMIT'); // Commit the transaction if successful

        return quizId; // Return the generated ID

    } catch (err) {
        await client.query('ROLLBACK'); // Rollback if errors occur
        throw err;
    } finally {
        client.release();
    }
}

async function insertQuestion(quizId, question) {
    const client = await pool.connect();
    try {
        // Fetch the maximum question_order for the given quizId
        const res = await client.query('SELECT MAX(question_order) FROM QuizQuestions WHERE quiz_id = $1', [quizId]);
        const maxOrder = res.rows[0].max;

        // If maxOrder is null, this is the first question for the quiz, so we start at 1.
        // Otherwise, we increment maxOrder by 1.
        const questionOrder = maxOrder === null ? 1 : maxOrder + 1;

        const insertQuestionQuery = await client.query('INSERT INTO QuizQuestions (question, quiz_id, question_order) VALUES ($1, $2, $3) RETURNING id', [question, quizId, questionOrder]);
        const questionId = insertQuestionQuery.rows[0].id;
        return questionId;
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
}

async function getResponse(questionId) {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT response FROM QuizAnswers WHERE question_id = $1', [questionId]);
        return res.rows;
    }
    catch (err) {
        throw err;
    }
    finally {
        client.release();
    }
}



async function insertAnswer(questionId, answer, isCorrect, response) {
    const client = await pool.connect();
    try {
        const insertAnswerQuery = await client.query('INSERT INTO QuizAnswers (question_id, answer_text, is_correct, response) VALUES ($1, $2, $3, $4) RETURNING id', [questionId, answer, isCorrect, response]);
        const answerId = insertAnswerQuery.rows[0].id;
        return answerId;
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
}

const getQuiz = async () => { // Front-end display Quiz-Selector
    const res = await pool.query('SELECT * FROM quizes');
    return res.rows;
};

const getQuestionsByQuizId = async (quiz_id) => {
    const res = await pool.query('SELECT * FROM QuizQuestions WHERE quiz_id = $1 ORDER BY question_order', [quiz_id]);
    return res.rows;
};

async function getAnswersByQuestionId(question_id) {
    const res = await pool.query('SELECT * FROM QuizAnswers WHERE question_id = $1 ORDER BY question_id', [question_id]);
    return res.rows;
}

async function insertUserAnswer(userId, questionId, answer_text, answer_id) {
    const query = `
        INSERT INTO user_answers (user_id, question_id, answer_text, answer_id)
        VALUES ($1, $2, $3, $4)
    `;
    const values = [userId, questionId, answer_id, answer_text];
    console.log(values);
    try {
        await pool.query(query, values);
    } catch (err) {
        console.error(err);
    }
}


module.exports = {
    getResponse,
    insertUserAnswer,
    getAnswersByQuestionId,
    createUser,
    getUserByUsername,
    createQuiz,
    getQuiz,
    getQuestionsByQuizId,
    insertQuestion,
    insertAnswer
};