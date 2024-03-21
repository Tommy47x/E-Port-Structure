import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container } from 'react-bootstrap';
import '../App.css';

//add carousel for the login page
const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // new state variable for admin status
    const blob = new Blob([formData]);
    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await axios.post(`http://localhost:3000/auth/${isLogin ? 'login' : 'register'}`, formData);
            console.log(response.data); // handle the response as needed
            setIsAuthenticated(true); // set isAuthenticated to true after successful login/register
            setIsAdmin(response.data.role === 'admin'); // set isAdmin based on the response data

            // Store the role in local storage
            localStorage.setItem('role', response.data.role);
        } catch (err) {
            console.log(blob.size);
            setError(err.response ? err.response.data.error : 'Something went wrong');
        }
    };

    const handleLogout = () => {
        // Remove the token from local storage or cookie
        localStorage.removeItem('token');
        // Update the authentication status
        setIsAuthenticated(false);
        setIsAdmin(false); // reset the admin status on logout
    };

    return (
        <div className="container d-flex  justify-content-center" style={{ height: '100vh' }}>
            {isAuthenticated ? (
                <div>
                    <h1>Logout</h1>
                    <Button variant="primary" onClick={handleLogout}>Logout</Button>
                    {isAdmin && <Button variant="primary" onClick={() => window.location.href = 'http://localhost:3001/quiz'}>Go to Quiz</Button>}
                </div>
            ) : (
                <div>
                    <h1>{isLogin ? 'Login' : 'Register'}</h1>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control style={{ width: '200px' }} type="text" name="username" value={formData.username} onChange={handleInputChange} required />
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control style={{ width: '200px' }} type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                        </Form.Group>
                        <ul></ul>
                        <Button variant="primary" type="submit">{isLogin ? 'Login' : 'Register'}</Button>
                        <Button variant="link" onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Need to register?' : 'Already registered?'}</Button>
                    </Form>
                    <ul></ul>
                    <Container>
                        <Card style={{ maxWidth: '230px', margin: '0 auto', marginLeft: '-20px', backgroundColor: '#FFE4E1' }}>
                            <Card.Body>
                                <Card.Title>Welcome to E-Port!</Card.Title>
                                <Card.Text>
                                    This login is for admins only. If you are a user, please use the navigate button.
                                </Card.Text>
                                <ul></ul>
                                <Button variant='dark' onClick={() => window.location.href = 'http://localhost:3001'}>Navigate</Button>
                                <ul></ul>

                            </Card.Body>
                        </Card>
                    </Container>
                </div>
            )}
        </div>
    );
};

export default AuthForm;