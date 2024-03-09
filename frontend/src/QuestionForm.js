import React from 'react';
import { Form, Container, Card, Button } from 'react-bootstrap';

function QuestionForm() {
    return (
        <Container className="d-flex justify-content-center">
            <Card style={{ width: '30rem' }} className="mt-5">
                <Card.Body>
                    <Card.Title>Quiz Question</Card.Title>
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
                    <Button variant="primary" className="mt-3" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>Next Question</Button>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default QuestionForm;