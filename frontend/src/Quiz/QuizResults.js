import React from 'react';
import { ListGroup, Alert } from 'react-bootstrap';

const QuizResults = ({ responses }) => {
    return (
        <ListGroup>
            {responses.map((response, index) => (
                <ListGroup.Item key={index}>
                    <strong>Question {index + 1}:</strong> {response.question}
                    <br />
                    <strong>Your Answer:</strong> {response.selectedAnswer}
                    <br />
                    {response.is_correct ? (
                        <Alert variant="success">Your answer is correct!</Alert>
                    ) : (
                        <Alert variant="danger">Your answer is incorrect.</Alert>
                    )}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default QuizResults;