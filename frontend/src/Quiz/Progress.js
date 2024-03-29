import React from 'react';
import { ProgressBar } from 'react-bootstrap';

import '../App.css';


function Progress({ progress }) {
    return (
        <div>
            <ProgressBar now={progress} label={`${progress.toFixed(2)}%`} />
        </div>
    );
}

export default Progress;