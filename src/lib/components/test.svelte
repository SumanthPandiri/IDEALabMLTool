<!-- Test.svelte -->

<script lang="ts">
    import * as tf from '@tensorflow/tfjs';
    import { get } from 'svelte/store';
    import { classNames, model, testStatus} from './stores.js';

    let videoElement: HTMLVideoElement;
    let canvasElement: HTMLCanvasElement;
    let videoStream: MediaStream;
    let intervalId: NodeJS.Timeout;
    let showCamera = false;
    let classList: string[] = [];
    let mobilenet: tf.GraphModel | null = null;

    // Function to start the camera
    async function startCamera() {
        try {
            classList = get(classNames);
            console.log("Class List:", classList);
            showCamera = true;
            videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoElement.srcObject = videoStream;
            await videoElement.play();

            mobilenet = await tf.loadGraphModel(
                'https://www.kaggle.com/models/google/mobilenet-v3/TfJs/small-075-224-classification/1',
                { fromTFHub: true }
            );
        } catch (error) {
            console.error('Error accessing camera:', error);
            testStatus.set('Test Status: ERROR: Error accessing camera.');
        }
    }

    // Function to stop the camera
    function stopCamera() {
        showCamera = false;
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
        }
    }

    // Function to capture image from the camera and make a prediction
    async function captureAndPredict() {
        if (!videoElement || !canvasElement || !mobilenet) return;

        // Ensure video has dimensions before proceeding
        if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
            console.warn("Video element has no valid dimensions yet.");
            return;
        }

        // Draw the video frame to the canvas
        const context = canvasElement.getContext('2d');
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

        // Preprocess the image and make a prediction
        tf.tidy(() => {
            const tensor = tf.browser.fromPixels(canvasElement)
                .resizeBilinear([224, 224])
                .toFloat()
                .div(tf.scalar(255.0))
                .expandDims();

            const mobilenetPrediction = mobilenet.predict(tensor).squeeze();
            const modelInstance = get(model);

            // Check if the model is trained, and if not, send an error message
            if (!modelInstance) {
                console.error('Model is not trained yet.');
                testStatus.set('Test Status: ERROR: Model is not trained yet.');
                return;
            }

            // Make a prediction using the mobilenet prediction and then the trained model
            const finalPrediction = modelInstance.predict(mobilenetPrediction.expandDims());
            const probabilities = finalPrediction.dataSync();

            // Create a new prediction object with class names and probabilities
            const newPrediction = Array.from(probabilities).map((probability, index) => ({
                classname: classList[index],
                probability: probability
            }));

            // Update the testStatus store with the latest prediction
            const statusMessage = newPrediction.map(
                (pred) => `${pred.classname}: ${(pred.probability * 100).toFixed(2)}%`
            ).join('\n\t');

            testStatus.set(`Current Prediction:\n\t${statusMessage}`);
        });
    }

    // Function to start the live prediction
    function startLivePrediction() {
        startCamera();
        intervalId = setInterval(captureAndPredict, 1000); // Capture and predict every second
    }

    // Function to stop the live prediction
    function stopLivePrediction() {
        stopCamera();
        clearInterval(intervalId);
        testStatus.set("");
    }
</script>


<div class="flex flex-col items-center">
        <div class="flex space-x-8 mt-2 ">
            <button class="bg-green w-64 h-16 text-black font-bold rounded-full " on:click={startLivePrediction}>
                Start Live Test
            </button>
            <button class="bg-green w-64 h-16 text-black font-bold rounded-full " on:click={stopLivePrediction}>
                Stop Live Test
            </button>
        </div>

    {#if showCamera}
        <div class="relative w-96 h-64 z-0 mt-4 mb-4">
            <video bind:this={videoElement} class="rounded-xl" autoplay></video>
            <canvas bind:this={canvasElement} class="hidden"></canvas>
        </div>
    {/if}
</div>
