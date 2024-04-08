import { useState } from 'react'; import axios from 'axios';
import { Container, Card, Button, InputGroup, Form } from 'react-bootstrap';

function Quiz() {
    const [responseForm, setResponseForm] = useState({ response: '' });
    const [quizForm, setQuizForm] = useState({ name: '', description: '' });
    const [questionForm, setQuestionForm] = useState({ question: '', quiz_id: '' });
    const [answerForm, setAnswerForm] = useState({ answer: '', question_id: '', is_correct: false });
    const handleQuizChange = (e) => {
        setQuizForm({ ...quizForm, [e.target.name]: e.target.value });
    };

    const handleResponseChange = (e) => {
        setResponseForm({ ...responseForm, [e.target.name]: e.target.value });
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
            // Remove the line that sets question_id in answerForm here
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
            setAnswerForm({ ...answerForm, question_id: questionId }); // Set question_id in answerForm here
        } catch (err) {
            console.error('Error inserting question:', err);
        }
    };

    const handleInsertAnswer = async () => {
        try {
            const response = await axios.post('http://localhost:3000/quiz', {
                action: 'insertAnswer',
                data: {
                    ...answerForm,
                    response: responseForm.response
                }
            });

            if (responseForm.response) {
                console.log(responseForm.response);
            }
            console.log(`Inserted answer with ID: ${response.data.quizId}`);
        } catch (err) {
            console.error('Error inserting answer:', err);
            console.log(answerForm);
        }
    };


    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <Form onSubmit={e => e.preventDefault()}>
                        <InputGroup className="mb-3">
                            <Form.Control type="text" name="name" value={quizForm.name} onChange={handleQuizChange} placeholder="Quiz Name" />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <Form.Control type="text" name="description" value={quizForm.description} onChange={handleQuizChange} placeholder="Quiz Description" />
                        </InputGroup>

                        <Button variant="primary" type="button" onClick={handleCreateQuiz}>Create Quiz</Button>
                        <ul></ul>
                    </Form>

                    <Form onSubmit={e => e.preventDefault()}>
                        <InputGroup className="mb-3">
                            <Form.Control type="text" name="question" value={questionForm.question} onChange={handleQuestionChange} placeholder="Question" />
                        </InputGroup>
                        <Button variant="primary" type="button" onClick={handleInsertQuestion}>Insert Question</Button>
                        <ul></ul>
                    </Form>

                    <Form onSubmit={e => e.preventDefault()}>
                        <InputGroup className="mb-3">
                            <Form.Control type="text" name="answer" value={answerForm.answer} onChange={handleAnswerChange} placeholder="Answer" />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <Form.Control type="text" name="response" value={responseForm.response} onChange={handleResponseChange} placeholder="Response" />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Checkbox name="is_correct" checked={answerForm.is_correct} onChange={handleAnswerChange} /> Correct Answer
                        </InputGroup>
                        <Button variant="primary" type="button" onClick={handleInsertAnswer}>Insert Answer</Button>
                        <ul></ul>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );

} export default Quiz;