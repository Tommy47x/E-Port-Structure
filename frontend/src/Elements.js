import React, { useState } from 'react'; // For Functions
import { Offcanvas, Navbar, Alert, Nav } from 'react-bootstrap'; // Elements from Bootstrap

function Elements() {
    const [show, setShow] = useState(false); // Set initial state to false 
    const handleClose = () => setShow(false); // OffCanvas closing
    const handleShow = () => setShow(true);  // Offcanvas opening

    return (
        <>

            <Navbar id="Bar" bg="dark" data-bs-theme="dark">
                <Navbar.Brand onClick={handleShow}>All ports</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="/quiz">Security Quiz</Nav.Link>
                </Nav>

            </Navbar>


            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Ports and their meanings:</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Alert variant='success'>If you test a website adress, the scan will probably say 'Not secured' because we don't actually know the protection protocols of every website. An opened port could be intentionally placed, as a honeypot. We're just telling you that if you're having a website, the security risks you're exposed to.</Alert>
                    <Alert variant='info'>PORT 53: (Phone / PC): You most probably have a dynamic IP Adress, so as long you're DDoSed you should just restart the router. </Alert>
                    <Alert variant='dark'> PORT: 31337 (Server/Phone/PC and even Network) I'm sorry to say this, but your data could be already for sale on the dark-web.. Someone who actually knows how to acces and maybe even create this port, it's most probably a system / network engineer, and maybe, a dark-hat hacker. So, beware, and maybe try going to police if you see this port opened on your external / internal IP Adress. (31337 = ELITE) </Alert>
                    <Alert variant='danger'>PORTS 20 and 21(SERVERS): File Transfer Protocol (FTP). FTP is for transferring files between a client and a server.
                        <ul></ul>You are actually really vulnerable to many types of attacks by having these ports opened on a server.  Buy some protection. </Alert>
                    <Alert variant='danger'>PORT 22, 139 and 137: (SERVERS / PC): Secure Shell (SSH). SSH is a secure protocol used as the primary means of connecting to Linux servers remotely. Beware, this is really dangerous. </Alert>
                    <Alert variant='danger'>PORT 23: (SERVERS / PC): Telnet. Telnet is a protocol that allows you to connect to remote computers (called hosts) over a TCP/IP network (such as the internet).</Alert>
                    <Alert variant='danger'>PORT 25: (SERVERS / PC): Simple Mail Transfer Protocol (SMTP). SMTP is used for sending and receiving email. </Alert>
                    <Alert variant='danger'>PORT 69: (SERVERS / PC): Trivial File Transfer Protocol (TFTP). TFTP is a simpler version of FTP that doesn’t require a username/password to transfer files. This is very common in unethical hacking. </Alert>
                    <Alert variant='danger'>PORT 80: (SERVERS / PC / Phone): Hypertext Transfer Protocol (HTTP). HTTP is the protocol used to transfer data over the web. </Alert>
                    <Alert variant='danger'>PORT 443 and 8443: (SERVERS / PC / Phone): HTTP Secure (HTTPS). HTTPS is the secure version of HTTP, and is used for secure communication over a computer network, and is widely used on the internet. </Alert>
                    <Alert variant='danger'>PORT 445: (SERVERS / PC): Server Message Block (SMB). SMB is a network file sharing protocol. This script can block any 2FA / 2nd confirmation. But don't worry if it's opened on a router's internal IP, because those are normal protocols that are usually protected. </Alert>
                    <Alert variant='danger'>PORT 3389: (SERVERS / PC): Remote Desktop Protocol (RDP). RDP is a proprietary protocol developed by Microsoft for connecting to another computer with a graphical interface over a network connection. Basically, legal hacking but without you actually knowing it. </Alert>
                    <Alert variant='danger'>PORT 1433: (SERVERS / PC): Microsoft SQL Server. SQL Server is a relational database management system developed by Microsoft. The SQL can be injected with various viruses or hidden god-modes, so beware of your user data! </Alert>
                </Offcanvas.Body>
            </Offcanvas>

        </>

    );
}

export default Elements;