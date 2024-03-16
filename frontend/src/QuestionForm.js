import { useState, useEffect } from 'react';
import { Form, Container, Card, Button, Modal } from 'react-bootstrap';
import './App.css';

function QuestionForm() {
    const [quiz, setQuiz] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [showModal, setShowModal] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };


    useEffect(() => {
        const fetchQuizzes = async () => {
            const response = await fetch('http://localhost:3000/quiz');
            const data = await response.json();
            setQuizzes(data);
        };

        fetchQuizzes();
    }, []);

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
                            className="button-margin"  // Add this line
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
                            <Form.Group className="mb-3" controlId="formBasicCheckbox1">
                                <Form.Check type="checkbox" label="Answer 1" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCheckbox2">
                                <Form.Check type="checkbox" label="Answer 2" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCheckbox3">
                                <Form.Check type="checkbox" label="Answer 3" />
                            </Form.Group>
                        </Form>
                        <Button variant="primary" className="mt-3" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }} onClick={handleNextQuestion}>Next Question</Button>
                    </Card.Body>
                </Card>}
            </Container>
        </>
    );
}

export default QuestionForm;