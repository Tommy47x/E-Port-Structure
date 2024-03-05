const pool = require('./pool');

exports.createUser = async (username, hashedPassword, role) => {
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

exports.getUserByUsername = async (username) => {
    try {
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return user.rows[0];
    } catch (err) {
        throw err;
    }
};

exports.insertQuestion = async (question, answer) => {
    try {
        const result = await pool.query('INSERT INTO "Quizz" (question, answer) VALUES ($1, $2) RETURNING *', [question, answer]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        throw new Error('An error occurred while adding the question.');
    }
};