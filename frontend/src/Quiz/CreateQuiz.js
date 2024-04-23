import { useState, useEffect } from 'react';
import { Form, Container, Card, Button, Modal, Row, Col } from 'react-bootstrap';
import '../App.css';
import Progress from './Progress';
import QuizResults from './QuizResults';
import Spinner from 'react-bootstrap/Spinner';


function CreateQuiz() {
    const [quiz, setQuiz] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [showModal, setShowModal] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [selectedAnswerId, setSelectedAnswerId] = useState(null);
    const [progress, setProgress] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [quizFinished, setQuizFinished] = useState(false);


    const handleQuizSelect = (selectedQuiz) => { // First component that renders (Quiz Selector inside Modal)
        setQuiz(selectedQuiz);
        setShowModal(false);
    };

    useEffect(() => {
        const fetchQuizzes = async () => { // Second component that renders (Modal with Quiz Selector)
            const response = await fetch('http://localhost:3000/quiz');
            const data = await response.json();
            setQuizzes(data);
        };

        fetchQuizzes();
    }, []);

    useEffect(() => {
        const fetchQuestions = async () => { // Third component that renders (Quiz Questions)
            if (quiz) {
                const response = await fetch(`http://localhost:3000/questions?quiz_id=${quiz.id}`)
                    .catch(error => console.error('Error:', error));
                const data = await response.json();
                setQuestions(data);
                setTotalQuestions(data.length);
            }
        };

        fetchQuestions();
    }, [quiz]);

    useEffect(() => { // Fourth component that renders  (Quiz Answers)
        const fetchAnswers = async () => {
            const res = await fetch(`http://localhost:3000/questions?quiz_id=${quiz.id}`);
            const data = await res.json();
            setAnswers(data);
        };

        if (questions.length > 0) {
            fetchAnswers();
        }
    }, [questions, currentQuestionIndex]);


    function getUserId() { // Helper function to get the user ID from localStorage
        const id = localStorage.getItem('id');
        if (id) {
            return id;
        }
    }

    function getUserSubmissions() { // Helper function to get the user's submissions
        const submissions = questions.map((question, index) => {
            const selectedAnswer = questions[currentQuestionIndex]?.answers?.find(answer => answer.id === selectedAnswerId);
            if (!selectedAnswer) {
                console.error(`No answer found with id ${selectedAnswerId}`);
                return;
            }
            if (!selectedAnswer) { // Debug
                console.error(`No answer found for question at index ${index} with answer id ${selectedAnswerId}`);
                console.log(`selectedAnswerId: ${selectedAnswerId}`);
                console.log(`answers: ${JSON.stringify(question.answers)}`);
                return null;
            }
            return { // Transfer to BE
                question: question.question,
                selectedAnswer: selectedAnswer.answer,
                is_correct: selectedAnswer.is_correct
            };
        }).filter(Boolean); // This will remove any null values from the array
        return submissions;
    }

    const handleSubmit = async (selectedAnswers) => { // Function to submit the answers to the backend
        const userId = getUserId();
        const userData = getUserSubmissions();
        const response = await fetch('http://localhost:3000/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                selectedAnswers: selectedAnswers,
                userData: userData,
                questions: questions,


            })
        });

        if (response.ok) { // Check if the response is OK
            console.log('Answers saved successfully');
        } else {
            console.error('An error occurred while saving the answers');
        }
    };

    const handleNextQuestion = async () => { // Function to handle the next question
        const selectedAnswer = questions[currentQuestionIndex]?.answers?.find(answer => answer.id === selectedAnswerId);
        if (!selectedAnswer) {
            console.error(`No answer found for question at index ${currentQuestionIndex} with answer id ${selectedAnswerId}`);
            return;
        }
        const selectedResponse = {
            question: questions[currentQuestionIndex].question,
            selectedAnswer: selectedAnswer.answer_text,
            is_correct: selectedAnswer.is_correct,
            response: selectedAnswer.response,
        };
        const progressPercentage = (currentQuestionIndex + 1) / totalQuestions * 100;
        setProgress(progressPercentage);
        setSelectedAnswers([...selectedAnswers, selectedResponse]);
        console.log(selectedAnswers)
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswerId(null);
        } else {
            alert("There are no more questions left.");
            setQuizFinished(true);
            handleSubmit([...selectedAnswers, selectedResponse]).catch(error => {
                console.error('An error occurred:', error);
            });
        }
    }




    return (
        <>
            <Modal bg="dark" data-bs-theme="dark" show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Select a Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        {quizzes.map((quiz) => (
                            <Col key={quiz.id}>
                                <Card style={{ className: 'mt-5' }}>
                                    <Card.Img variant="top" src="https://www.pcworld.com/wp-content/uploads/2023/04/shutterstock_555325381-secure-home-wifi-100901207-orig.jpg?quality=50&strip=all" />
                                    <Card.Body>
                                        <Card.Title>{quiz.name}</Card.Title>
                                        <Card.Text>
                                            {quiz.description}
                                        </Card.Text>
                                        <Button variant="light" onClick={() => handleQuizSelect(quiz)}>Select Quiz</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Modal.Body>
            </Modal>
            <Container className="d-flex justify-content-center">
                {quizFinished ? (
                    <QuizResults responses={selectedAnswers} />
                ) : (
                    <Card style={{ width: '30rem' }} className="mt-5" bg="dark" data-bs-theme="dark">
                        <Card.Body>
                            <Card.Title>{quiz ? `${quiz.id} | ${quiz.name}` : 'Loading...'}</Card.Title>
                            {questions.length > 0 && (
                                <Card.Text>{questions[currentQuestionIndex].question}</Card.Text>

                            )}
                            <Form onSubmit={handleSubmit}>
                                {questions[currentQuestionIndex]?.answers?.map((answer) => (
                                    <Form.Check
                                        key={answer.id}
                                        type="checkbox"
                                        label={answer.answer_text}
                                        checked={selectedAnswerId === answer.id} // Check this checkbox if it's the selected answer
                                        onChange={(e) => {
                                            console.log(`Checkbox for answer id ${answer.id} was checked.`);
                                            if (selectedAnswerId === answer.id) {
                                                // If this checkbox is already selected, deselect it
                                                setSelectedAnswerId(null);
                                            } else {
                                                // Otherwise, select this checkbox
                                                setSelectedAnswerId(answer.id);
                                            }
                                        }}
                                    />
                                ))}
                                <Button type="submit" variant="light" className="mt-3" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }} onClick={handleNextQuestion} disabled={selectedAnswerId === null}>
                                    {selectedAnswerId === null ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="grow"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                            Loading...
                                        </>
                                    ) : (
                                        'Next Question'
                                    )}
                                </Button>
                            </Form>
                            <ul></ul>
                            <Progress progress={progress} />
                        </Card.Body>
                    </Card>
                )}
            </Container>
        </>
    );
}

export default CreateQuiz;