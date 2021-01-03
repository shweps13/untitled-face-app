import React, { useEffect, useState, useRef } from 'react';
import * as faceapi from 'face-api.js';

function Video() {

    const [init, setInit] = useState(false);
    const videoRef = useRef();
    const canvasRef = useRef();

    let videoW = 720;
    let videoH = 560;

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

    const handleVideoOnPlay = () => {
        setInterval(async() => {
            if (init) {
                setInit(false);
            }
            
            canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
            const displaySize = {
                width: videoW,
                height: videoH
            }

            faceapi.matchDimensions(canvasRef.current, displaySize)

            const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvasRef.current.getContext('2d').clearRect(0, 0, videoW, videoH);
            faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

        }, 1000)
    }

    return (
    <div className="main">
        <span>{init ? 'Initializing' : 'Ready'}</span>
        <div className="videoDiv">
            <video ref={videoRef} autoPlay muted width={videoW} height={videoH} onPlay={handleVideoOnPlay} />
            <canvas ref={canvasRef} />
        </div>
    </div>
    )
}

export default Video
