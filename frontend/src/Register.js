import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
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
        } catch (err) {
            console.log(blob.size);
            setError(err.response ? err.response.data.error : 'Something went wrong');
        }
    };

    return (
        <div className="container">
            <h1>{isLogin ? 'Login' : 'Register'}</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" value={formData.username} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                </Form.Group>
                <Button variant="primary" type="submit">{isLogin ? 'Login' : 'Register'}</Button>
                <Button variant="link" onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Need to register?' : 'Already registered?'}</Button>
            </Form>
        </div>
    );
};

export default AuthForm;