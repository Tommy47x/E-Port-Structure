import React, { useState } from 'react'; // For Functions
import { Button, Alert, Card, Form } from 'react-bootstrap'; // Elements from Bootstrap


function Logic() {
    const [ipAddress, setIpAddress] = useState(''); // Set initial state to empty string
    const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/; // Regex pattern for IP address
    const [scanData, setScanData] = useState(null); // Set initial state to null

    const handleScan = () => {
        if (!ipPattern.test(ipAddress)) {  // If the IP address is not valid, alert the user
            alert("Please enter a valid IP address.");
        }
        fetch(`http://localhost:5000/scan?ip=${ipAddress}`) // Include the IP address in the request
            .then(response => {
                if (!response.ok) { // If the response is not OK (e.g. 404), throw an error
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // Format response to JSON
            })
            .then(data => setScanData(data))
            .catch(error => console.log('Error:', error)); // If there is an error, log the error
    };

    const handleIpChange = (event) => { // Update the IP address when the input changes
        setIpAddress(event.target.value);

    };
    // List of messages for most important ports
    const messages = {
        31337: 'PORT OF THE ELITES. You are most probably hacked right now.',
        21: 'FTP port is open. This is a security risk that can be exploited by hackers.',
        20: 'FTP port is open. This is a security risk that can be exploited by hackers',
        22: 'SSH port is open. This can be a security risk if not properly configured.',
        139: 'SMB port is open. This can be a security risk (WannaCry).',
        137: 'SMB port is open. This can be a security risk.',
        443: 'HTTPS port is open. This can be a security risk.',
        80: 'HTTP port is open. This can be a security risk.',
        8080: 'HTTP port is open. This can be a security risk.',
        8443: 'HTTPS port is open. This can be a security risk.',
        25: 'SMTP port is open. This can be a security risk.',
        69: 'TFTP port is open. This can be a security risk.',
        23: 'Telnet port is open. This can be a security risk.',
        445: 'SMB port is open. This can be a security risk.',
        3389: 'RDP port is open. This can be a security risk.',
        1433: 'SQL-Server port is open. This can be a security risk.',
        53: 'DNS port is open. You are vulnerable to DDoS attacks.'
    };

    return (
        <Card style={{ maxWidth: '300px', margin: '0 auto' }}>
            <Card.Body>
                <Card.Title>Network Scan</Card.Title>
                <Card.Text>
                    Enter an IP address and click the button below to start the network scan.
                </Card.Text>
                <Form.Control type="text" placeholder="Enter IP address" value={ipAddress} onChange={handleIpChange} />
                <ul></ul>
                <Button variant='light' onClick={handleScan}>Start Scan</Button>
                <ul></ul>
                {scanData && (
                    <div>
                        {scanData.isSecure ? // Alert Variants
                            <Alert variant="success">The network is secure.</Alert> :
                            <Alert variant="danger">The network is not secure.</Alert>
                        }
                        <Alert variant="danger">Open ports: {scanData.openPorts.join(', ')} {scanData.openPorts.map(port => messages[port] && <p key={port}>{messages[port]}</p>)}</Alert>

                    </div>
                )}
            </Card.Body>
        </Card>
    );
}

export default Logic;