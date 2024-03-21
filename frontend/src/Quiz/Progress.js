import React from 'react';
import { ProgressBar } from 'react-bootstrap';

function Progress({ progress }) {
    return (
        <ProgressBar now={progress} label={`${progress.toFixed(2)}%`} />
    );
}

export default Progress;