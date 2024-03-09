import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';

const NotAuthorized = () => {
    return (
        <Container className="mt-5">
            <Alert variant="danger">
                <Alert.Heading>You're not authorized to view this page</Alert.Heading>
                <p>
                    User type accounts or unlogged users are not allowed to view this page.
                    Click here to be redirected to the login page.

                </p>
                <Button variant="danger" href="/auth/login">Redirect to Login</Button>
            </Alert>
        </Container>
    );
};

export default NotAuthorized;