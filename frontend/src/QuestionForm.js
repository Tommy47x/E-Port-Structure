import { useState, useEffect } from 'react';
import { Form, Container, Card, Button, Modal } from 'react-bootstrap';
import './App.css';

function QuestionForm() {
    const [quiz, setQuiz] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [showModal, setShowModal] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [questionId, setQuestionId] = useState(null); // New state variable for questionId

    useEffect(() => {
        const fetchAnswers = async () => {
            const res = await fetch(`http://localhost:3000/questions?quiz_id=${quiz.id}`);
            const data = await res.json();
            setAnswers(data);

        };

        if (questions.length > 0) {
            fetchAnswers();
        }
    }, [questions, currentQuestionIndex]);

    // Function to handle the next question
    // Function to handle the next question
    const handleNextQuestion = async () => {
        if (currentQuestionIndex < questions.length - 2) { // Change here
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (currentQuestionIndex === questions.length - 2) { // And here

            setCurrentQuestionIndex(currentQuestionIndex + 1); // Move to the next question
        } else {
            // Handle the case where there are no more questions
            alert("There are no more questions left.");
        }
    }
    // Fetch quizzes when the component mounts
    useEffect(() => {
        const fetchQuizzes = async () => {
            const response = await fetch('http://localhost:3000/quiz');
            const data = await response.json();
            setQuizzes(data);
        };

        fetchQuizzes();
    }, []);

    // Fetch questions when a quiz is selected
    useEffect(() => {
        const fetchQuestions = async () => {
            if (quiz) {
                const response = await fetch(`http://localhost:3000/questions?quiz_id=${quiz.id}`);
                const data = await response.json();
                setQuestions(data);
            }
        };

        fetchQuestions();
    }, [quiz]);

    // Function to handle the selection of a quiz
    const handleQuizSelect = (selectedQuiz) => {
        setQuiz(selectedQuiz);
        setShowModal(false);
    };

    return (
        <>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Select a Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {quizzes.map((quiz) => (
                        <Button
                            key={quiz.id}
                            onClick={() => handleQuizSelect(quiz)}
                            className="button-margin"
                        >
                            {quiz.name}
                        </Button>
                    ))}
                </Modal.Body>
            </Modal>

            <Container className="d-flex justify-content-center">
                {<Card style={{ width: '30rem' }} className="mt-5">
                    <Card.Body>
                        <Card.Title>{quiz ? `${quiz.id} | ${quiz.name}` : 'Loading...'}</Card.Title>
                        {questions.length > 0 && (
                            <Card.Text>{questions[currentQuestionIndex].question}</Card.Text>
                        )}
                        <Form>
                            {questions[currentQuestionIndex]?.answers?.map((answer) => (
                                <Form.Check
                                    key={answer.id}
                                    type="checkbox"
                                    label={answer.answer}
                                    onChange={(e) => {
                                        console.log(e.target.checked ? 'Answer selected' : 'Answer deselected');
                                        if (e.target.checked) {
                                            console.log(answer);
                                        }
                                    }}
                                />
                            ))}
                        </Form>
                        <Button variant="primary" className="mt-3" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }} onClick={handleNextQuestion}>Next Question</Button>
                    </Card.Body>
                </Card>}
            </Container>
        </>
    );
}

export default QuestionForm;