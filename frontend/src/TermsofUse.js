import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

function TermsofUse() {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const hasAgreedToTerms = localStorage.getItem('hasAgreedToTerms');
        if (!hasAgreedToTerms) {
            setShowModal(true);
        }
    }, []);

    const handleCloseModal = () => {
        localStorage.setItem('hasAgreedToTerms', 'true');
        setShowModal(false);
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Terms of Use</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Welcome to E-Port!! We are the first step for a safer internet!
                <ul></ul>
                With out app, you can scan your network and check if it is secure or not.
                <ul></ul>
                What do we exactly do? We use nMap to scan your network, and check for the open ports of your internal / external IP Adress.
                <ul></ul>
                We can't provide exact information about the security of your network, but we can give you a general idea of how secure it is, and if you should worry or not about a specific port and it's meanings.
                <ul></ul>
                Click the 'General port info' button to get more information about the most important ports.
                <ul></ul>
                Now remember, this is just a prototype. We are not responsible for any illegal use of this app.
                Please, use it only for educational purposes. By closing this modal, you agree with our terms of use.
                <ul></ul>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Agree to terms
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TermsofUse;