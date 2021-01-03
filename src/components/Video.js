import React, { useEffect, useState, useRef } from 'react';
import * as faceapi from 'face-api.js';

function Video() {

    const [init, setInit] = useState(false);
    const videoRef = useRef();
    const canvasRef = useRef();

    let videoW = 480;
    let videoH = 640;

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = process.env.PUBLIC_URL + '/models';
            setInit(true);
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            ]).then(startVideo);
        }    
        loadModels();    
    }, [])

    const startVideo = () => {
        navigator.getUserMedia(
            { video : {} },
            stream => videoRef.current.srcObject = stream,
            err => console.error(err)
            
        )
    }

    return (
    <div className="App-header">
        <span>{init ? 'Initializing' : 'Ready'}</span>
        <div>
            <video ref={videoRef} autoPlay muted width={videoW} height={videoH} />
            <canvas ref={canvasRef} />
        </div>
    </div>
    )
}

export default Video
