import { useState, useEffect } from 'react';
import { Form, Container, Card, Button, Modal } from 'react-bootstrap';
import '../App.css';
import Progress from './Progress';
import { jwtDecode } from 'jwt-decode';
import QuizResults from './QuizResults';

function QuestionForm() {
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

    function getUserId() {
        // Get the token from local storage
        const token = localStorage.getItem('token');

        // Decode the token and return the user ID
        if (token) {
            const decodedToken = jwtDecode(token);
            return decodedToken.id;
        }

        // Return null if there's no token
        return null;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(selectedAnswers);
        // This is where you get the user's ID
        // Replace this with the actual code that gets the user's ID
        const userId = getUserId();

        // Make a POST request to the /save-answers endpoint
        const response = await fetch('http://localhost:3000/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                selectedAnswers: selectedAnswers
            })
        });

        // Check if the request was successful
        if (response.ok) {
            console.log('Answers saved successfully');
        } else {
            console.error('An error occurred while saving the answers');
        }
    };


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
    const handleNextQuestion = async () => {
        const selectedAnswer = questions[currentQuestionIndex]?.answers?.find(answer => answer.id === selectedAnswerId);
        //console.log(selectedAnswer);
        // console.log(totalQuestions);
        const selectedResponse = {
            question: questions[currentQuestionIndex].question,
            selectedAnswer: selectedAnswer.answer,
            is_correct: selectedAnswer.is_correct
        };
        const progressPercentage = (currentQuestionIndex + 1) / totalQuestions * 100;
        setProgress(progressPercentage);
        setSelectedAnswers([...selectedAnswers, selectedResponse]);
        if (currentQuestionIndex < questions.length - 2) { // Change here
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (currentQuestionIndex === questions.length - 2) { // And here

            setCurrentQuestionIndex(currentQuestionIndex + 1); // Move to the next question
        } else {
            if (currentQuestionIndex === questions.length - 1) {
                // Handle the case where there are no more questions
                alert("There are no more questions left.");
                setQuizFinished(true);
                // Display the selected answers
                selectedAnswers.forEach((answer, index) => {
                    //       console.log(`Question ${index + 1}: ${answer.answer} ${answer.is_correct ? '(correct)' : '(incorrect)'}`);
                });
            }
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
                setTotalQuestions(data.length); // Here is where totalQuestions is updated
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
                {quizFinished ? (
                    <QuizResults responses={selectedAnswers} />
                ) : (
                    <Card style={{ width: '30rem' }} className="mt-5">
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
                                        label={answer.answer}
                                        checked={selectedAnswerId === answer.id} // Check this checkbox if it's the selected answer
                                        onChange={(e) => {
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
                                <Button type="submit" variant="primary" className="mt-3" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }} onClick={handleNextQuestion} disabled={selectedAnswerId === null}>Next Question</Button>
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

export default QuestionForm;