import React, { useEffect } from 'react'; // For Functions
import 'bootstrap/dist/css/bootstrap.min.css'; // For BootStrap-Styling
import './App.css'; // For internal styling
//import backgroundImage from 'C:/Users/crist/Downloads/e-port.jpg'; // For background image
import Elements from './Elements'; // Offcanvas
import Logic from './Logic'; // Algorithm, Request and Response
import TermsofUse from './TermsofUse'; // Modal
import Quiz from './Quiz';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthForm from './Register';

function App() {

    useEffect(() => {
        let root = document.getElementById('root'); // Get the root element
        // root.style.backgroundImage = `url(${backgroundImage})`; // Set the background image
        root.style.backgroundPosition = 'center';
        root.style.backgroundRepeat = 'no-repeat'; // Set the background to !repeat
        root.style.backgroundSize = 'cover'; // Set the background size to cover
        root.style.height = '100vh'; // Set the height to 100% of the viewport height
    }, []);

    //TO-DO: De finalizat Quiz-ul si de facut eventual un efect frumos asupra lui
    //TO-DO: Research despre web design, ca momentan esti varza
    //TO-DO: De adaugat logica din spatele quiz-ului, si oferirea unui raspuns personalizat.
    //TO-DO: VALIDATE IP LIBRARY (URGENT) 
    //TO-DO: De adaugat log-out pentru log-in actual.

    return (
        <div className="App">
            <div id="center-content">
                <Router basename='/'>
                    <Routes>
                        <Route path="/auth/login" element={<AuthForm />} />

                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/" element={
                            <>
                                <Elements />
                                <Logic />
                                <TermsofUse />
                            </>
                        } />
                    </Routes>
                </Router>
            </div>
        </div>
    );
}

export default App;