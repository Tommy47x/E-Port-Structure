import { useState } from 'react'; import axios from 'axios';

function Quiz() {
    const [quizForm, setQuizForm] = useState({ name: '', description: '' });
    const [questionForm, setQuestionForm] = useState({ question: '', quiz_id: '' });
    const [answerForm, setAnswerForm] = useState({ answer: '', question_id: '', is_correct: false });
    const handleQuizChange = (e) => {
        setQuizForm({ ...quizForm, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (e) => {
        setQuestionForm({ ...questionForm, [e.target.name]: e.target.value });
    };

    function handleAnswerChange(e) {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setAnswerForm({
            ...answerForm,
            [e.target.name]: value
        });
    }

    const handleCreateQuiz = async () => {
        try {
            const response = await axios.post('http://localhost:3000/quiz', { action: 'createQuiz', data: quizForm });
            console.log(`Created quiz with ID: ${response.data.quizId}`);
            setQuestionForm({ ...questionForm, quiz_id: response.data.quizId });
            setAnswerForm({ ...answerForm, question_id: response.data.quizId });
        } catch (err) {
            console.error('Error creating quiz:', err);
        }
    };

    const handleInsertQuestion = async () => {
        try {
            const response = await axios.post('http://localhost:3000/quiz', { action: 'insertQuestion', data: questionForm });
            console.log(response); // Log the entire response
            const questionId = response.data.questionId; // Get the questionId from the response
            console.log(`Inserted question with ID: ${questionId}`);
            console.log(questionForm);
        } catch (err) {
            console.error('Error inserting question:', err);
        }
    };

    const handleInsertAnswer = async () => {
        try {
            const response = await axios.post('http://localhost:3000/quiz', { action: 'insertAnswer', data: answerForm });
            console.log(`Inserted answer with ID: ${response.data.quizId}`);
        } catch (err) {
            console.error('Error inserting answer:', err);
            console.log(answerForm);
        }
    };
    return (
        <div>
            <form onSubmit={e => e.preventDefault()}>
                <input type="text" name="name" value={quizForm.name} onChange={handleQuizChange} placeholder="Quiz Name" />
                <input type="text" name="description" value={quizForm.description} onChange={handleQuizChange} placeholder="Quiz Description" />
                <button type="button" onClick={handleCreateQuiz}>Create Quiz</button>
            </form>

            <form onSubmit={e => e.preventDefault()}>
                <input type="text" name="question" value={questionForm.question} onChange={handleQuestionChange} placeholder="Question" />
                <button type="button" onClick={handleInsertQuestion}>Insert Question</button>
            </form>

            <form onSubmit={e => e.preventDefault()}>
                <input type="text" name="answer" value={answerForm.answer} onChange={handleAnswerChange} placeholder="Answer" />
                <input type="checkbox" name="is_correct" checked={answerForm.is_correct} onChange={handleAnswerChange} /> Correct Answer
                <button type="button" onClick={handleInsertAnswer}>Insert Answer</button>
            </form>
        </div>
    );
    // Rest of your component...
} export default Quiz;