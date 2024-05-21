import("https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0")
    .then(module => {
        const { PoseLandmarker, FilesetResolver, DrawingUtils } = module;
        // Utiliza los objetos y funciones importados aquí
        const demosSection = document.getElementById("demos");
        let poseLandmarker = undefined;
        let runningMode = "IMAGE";
        let enableWebcamButton;
        let webcamRunning = false;
        const videoHeight = "360px";
        const videoWidth = "480px";
        // Before we can use PoseLandmarker class we must wait for it to finish
        // loading. Machine Learning models can be large and take a moment to
        // get everything needed to run.
        const createPoseLandmarker = async () => {
            const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
            poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
                    delegate: "GPU"
                },
                runningMode: runningMode,
                numPoses: 2
            });
            demosSection.classList.remove("invisible");
        };
        createPoseLandmarker();
        /********************************************************************
        // Demo 1: Grab a bunch of images from the page and detection them
        // upon click.
        ********************************************************************/
        // In this demo, we have put all our clickable images in divs with the
        // CSS class 'detectionOnClick'. Lets get all the elements that have
        // this class.
        const imageContainers = document.getElementsByClassName("detectOnClick");
        // Now let's go through all of these and add a click event listener.
        for (let i = 0; i < imageContainers.length; i++) {
            // Add event listener to the child element whichis the img element.
            imageContainers[i].children[0].addEventListener("click", handleClick);
        }
        // When an image is clicked, let's detect it and display results!
        async function handleClick(event) {
            if (!poseLandmarker) {
                console.log("Wait for poseLandmarker to load before clicking!");
                return;
            }
            if (runningMode === "VIDEO") {
                runningMode = "IMAGE";
                await poseLandmarker.setOptions({ runningMode: "IMAGE" });
            }
            // Remove all landmarks drawed before
            const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
            for (var i = allCanvas.length - 1; i >= 0; i--) {
                const n = allCanvas[i];
                n.parentNode.removeChild(n);
            }
            // We can call poseLandmarker.detect as many times as we like with
            // different image data each time. The result is returned in a callback.
            let landmarkR;
            let dranfi;
            poseLandmarker.detect(event.target, (result) => {
                landmarkR = result.landmarks;
                const canvas = document.createElement("canvas");
                canvas.setAttribute("class", "canvas");
                canvas.setAttribute("width", event.target.naturalWidth + "px");
                canvas.setAttribute("height", event.target.naturalHeight + "px");
                canvas.style =
                    "left: 0px;" +
                    "top: 0px;" +
                    "width: " +
                    event.target.width +
                    "px;" +
                    "height: " +
                    event.target.height +
                    "px;";
                event.target.parentNode.appendChild(canvas);
                const canvasCtx = canvas.getContext("2d");
                const drawingUtils = new DrawingUtils(canvasCtx);
                dranfi = drawingUtils;
                //for (const landmark of result.landmarks) {
                /*drawingUtils.drawLandmarks(landmark, {
                    radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)
                });
                drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
                  */

                //}
                //console.log(result.landmarks[1][0]);
            });
            //dranfi.drawConnectors(landmarkR[0], PoseLandmarker.POSE_CONNECTIONS);
            /*dranfi.drawLandmarks(landmarkR[0], {
                radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)
            });*/
            //console.log(landmarkR[0][32].x);
            let codo = landmarkR[0][13];
            let muñeca = landmarkR[0][15];
            let hombro = landmarkR[0][11];
            let puntcodo = new Punto(codo.x, codo.y);
            let puntMuñeca = new Punto(muñeca.x, muñeca.y);
            let puntHombr = new Punto(hombro.x, hombro.y);
            let vectorHombroCodo = new Vector(puntHombr, puntcodo);
            let vectorMuñecaCodo = new Vector(puntMuñeca, puntcodo);
            let angulomuñecaCodo = vectorHombroCodo.anguloConrespectoA(vectorMuñecaCodo);
            //console.log(angulomuñecaCodo);
            //Punto(landmarkR[])

        }
        /********************************************************************
        // Demo 2: Continuously grab image from webcam stream and detect it.
        ********************************************************************/
        const video = document.getElementById("webcam");
        const canvasElement = document.getElementById("output_canvas");
        const canvasCtx = canvasElement.getContext("2d");
        const drawingUtils = new DrawingUtils(canvasCtx);
        // Check if webcam access is supported.
        const hasGetUserMedia = () => { var _a; return !!((_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia); };
        // If webcam supported, add event listener to button for when user
        // wants to activate it.
        if (hasGetUserMedia()) {
            enableWebcamButton = document.getElementById("webcamButton");
            enableWebcamButton.addEventListener("click", enableCam);
        }
        else {
            console.warn("getUserMedia() is not supported by your browser");
        }
        // Enable the live webcam view and start detection.
        function enableCam(event) {
            if (!poseLandmarker) {
                console.log("Wait! poseLandmaker not loaded yet.");
                return;
            }
            if (webcamRunning === true) {
                webcamRunning = false;
                enableWebcamButton.innerText = "ENABLE PREDICTIONS";
            }
            else {
                webcamRunning = true;
                enableWebcamButton.innerText = "DISABLE PREDICTIONS";
            }
            // getUsermedia parameters.
            const constraints = {
                video: true
            };
            // Activate the webcam stream.
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                video.srcObject = stream;
                video.addEventListener("loadeddata", predictWebcam);
            });
        }
        let lastVideoTime = -1;
        async function predictWebcam() {
            canvasElement.style.height = videoHeight;
            video.style.height = videoHeight;
            canvasElement.style.width = videoWidth;
            video.style.width = videoWidth;
            // Now let's start detecting the stream.
            if (runningMode === "IMAGE") {
                runningMode = "VIDEO";
                await poseLandmarker.setOptions({ runningMode: "VIDEO" });
            }
            let startTimeMs = performance.now();
            if (lastVideoTime !== video.currentTime) {
                lastVideoTime = video.currentTime;
                poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
                    canvasCtx.save();
                    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
                    for (const landmark of result.landmarks) {
                        drawingUtils.drawLandmarks(landmark, {
                            radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)

                        });
                        drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
                    }
                    let landmarkR = result.landmarks;
                    
                    try{
                    let codo = landmarkR[0][13];
                    let muñeca = landmarkR[0][15];
                    let hombro = landmarkR[0][11];
                    let cadera=landmarkR[0][23];
                    let puntcodo = new Punto(codo.x*canvasElement.width, codo.y*canvasElement.height);
                    let puntMuñeca = new Punto(muñeca.x*canvasElement.width, muñeca.y*canvasElement.height);
                    let puntHombr = new Punto(hombro.x*canvasElement.width, hombro.y*canvasElement.height);
                    let puntCader=new Punto(cadera.x*canvasElement.width,cadera.y*canvasElement.height);
                    let vectorHombroCodo = new Vector(puntHombr, puntcodo);
                    let vectorMuñecaCodo = new Vector(puntMuñeca, puntcodo);
                    let vectorHomCadera=new Vector(puntHombr,puntCader);
                    let angulomuñecaCodo = vectorHombroCodo.anguloConrespectoA(vectorMuñecaCodo);
                    let angulohombroCadera=vectorHombroCodo.anguloConrespectoA(vectorHomCadera);
                    //console.log(angulomuñecaCodo);
                    //if(angulomuñecaCodo<=20){
                        //document.write(angulomuñecaCodo);
                        document.getElementById("dato").innerHTML=angulomuñecaCodo;
                    //}
                    }catch(error){
                        
                    }
                    
                    /*
                    try {
                        canvasCtx.beginPath();
                    canvasCtx.arc(landmarkR[0][13].x*canvasElement.width, landmarkR[0][13].y*canvasElement.height, 40, 0, Math.PI * 2);
                    canvasCtx.fillStyle = "red";
                    canvasCtx.fill();

                        
                    } catch (error) {

                    }*/
                    canvasCtx.restore();
                });

            }
            // Call this function again to keep predicting when the browser is ready.
            if (webcamRunning === true) {
                window.requestAnimationFrame(predictWebcam);
            }
        }

    })
    .catch(error => {
        console.error("Error al cargar el módulo:", error);
    });
class Vector {
    constructor(puntoA, puntoB = null) {
        if (puntoA instanceof Punto) {
            this.x = puntoA.x;
            this.y = puntoA.y;
        } else if (Array.isArray(puntoA) && puntoA.length === 2) {
            this.x = puntoA[0];
            this.y = puntoA[1];
        } else {
            throw new Error("puntoA debe ser un objeto Punto o una lista de dos elementos");
        }

        if (puntoB !== null) {
            if (puntoB instanceof Punto) {
                this.x -= puntoB.x;
                this.y -= puntoB.y;
            } else if (Array.isArray(puntoB) && puntoB.length === 2) {
                this.x -= puntoB[0];
                this.y -= puntoB[1];
            } else {
                throw new Error("puntoB debe ser un objeto Punto, una lista de dos elementos o null");
            }
        }

        this.datos = [this.x, this.y];
    }

    static restar(vectorA, vectorB) {
        return [vectorB.x - vectorA.x, vectorB.y - vectorA.y];
    }

    anguloConrespectoA(vector) {
        const operaciones = new OperacionesVector();
        return operaciones.angle(this.datos, vector.datos);
    }
}
class Punto {
    constructor(x, y = null) {
        if (y !== null) {
            this.x = x;
            this.y = y;
        } else {
            this.x = x[0];
            this.y = x[1];
        }
    }
}
class OperacionesVector {
    static dotproduct(v1, v2) {
        return v1.map((a, i) => a * v2[i]).reduce((acc, val) => acc + val, 0);
    }

    static length(v) {
        const dot = OperacionesVector.dotproduct(v, v);
        return Math.sqrt(dot);
    }

    angle(v1, v2) {
        const dot = OperacionesVector.dotproduct(v1, v2);
        const len1 = OperacionesVector.length(v1);
        const len2 = OperacionesVector.length(v2);
        const cosine = dot / (len1 * len2);
        return Math.acos(cosine) * (180 / Math.PI); // Convertir a grados
    }
}