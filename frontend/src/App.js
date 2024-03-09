import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './Register';
import Quiz from './Quiz';
import Elements from './Elements';
import Logic from './Logic';
import TermsofUse from './TermsofUse';
import ProtectedRoute from './protectedRoute';
import { Container } from 'react-bootstrap';
import './App.css';
import NotAuthorized from './restrictions';
import QuestionForm from './QuestionForm';

function App() {
    useEffect(() => {
        const root = document.getElementById('root');
        root.style.backgroundImage = 'url(./background.jpg)';
        root.style.backgroundSize = 'cover';
        root.style.height = '100vh';
    }, []);


    return (
        <div className="App">
            <Container>
                <Router basename='/'>
                    <Routes>
                        <Route path="/auth/login" element={<AuthForm />} />
                        <Route path="/quiz" element={
                            <ProtectedRoute>
                                <Quiz />
                            </ProtectedRoute>
                        } />
                        <Route path="/questions" element={<QuestionForm />} />
                        <Route path="/not-authorized" element={<NotAuthorized />} />
                        <Route path="/questions" element={<QuestionForm />} />
                        <Route path="/" element={
                            <>
                                <Elements />
                                <Logic />
                                <TermsofUse />
                            </>
                        } />
                    </Routes>
                </Router>
            </Container>
        </div>
    );
}

export default App;