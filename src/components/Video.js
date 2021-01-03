import React, { useEffect, useState, useRef } from 'react';
import * as faceapi from 'face-api.js';

function Video() {

    const [init, setInit] = useState(false);
    const videoRef = useRef();
    const canvasRef = useRef();

    let videoW = 480;
    let videoH = 640;


    return (
    <div className="App-header">
        <span>{init ? 'Initializing' : 'Ready'}</span>
        <video ref={videoRef} autoPlay muted width={videoW} height={videoH} />
        <canvas ref={canvasRef} />
    </div>
    )
}

export default Video
