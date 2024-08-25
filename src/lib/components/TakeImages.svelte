<!-- TakeImages.svelte -->

<script>
    import * as tf from '@tensorflow/tfjs'; 
    import { addImagesToClass } from './stores.js';
    import { onDestroy, onMount } from 'svelte';
    
    let tensors = [];
    let images = [];
    let videoElement; 
    let canvasElement; 
    let displayCanvas; 
    let videoStream = null; 
    let showCamera = false;
    let captureDisabled = false; 
    export let classIndex;

    // Function to initialize the camera
    onMount(() => {
        startCamera();
    });

    // Function to stop the camera when the component is destroyed
    onDestroy(() => {
        stopCamera();
    });

    // Function to start the camera
    async function startCamera() {
        try {
            videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoElement) {
                videoElement.srcObject = videoStream;
                videoElement.play();
                showCamera = true;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    }

    // Function to capture image from camera
    async function captureImage() {
        if (captureDisabled) return; // Prevent multiple captures

        if (!videoElement || !canvasElement || !displayCanvas) return;

        // Disable capturing while processing
        captureDisabled = true;

        const ctx = canvasElement.getContext('2d');
        const displayCtx = displayCanvas.getContext('2d');

        // Draw to the 224x224 canvas for tensor creation
        canvasElement.width = 224;
        canvasElement.height = 224;
        ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

        const tensor = tf.browser.fromPixels(canvasElement)
            .resizeBilinear([224, 224], true)
            .toFloat()
            .div(tf.scalar(255.0));
        tensors = [tensor];

        // Draw to the 64x64 canvas for temporary displaying
        displayCanvas.width = 64;
        displayCanvas.height = 64;
        displayCtx.drawImage(videoElement, 0, 0, displayCanvas.width, displayCanvas.height);

        const imageData = displayCanvas.toDataURL();
        images = [imageData];

        addImagesToClass(classIndex, images, tensors);
        
        // Allow capturing again
        captureDisabled = false; 
    }

    // Function to stop the camera
    function stopCamera() {
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
            showCamera = false;
        }
    }
</script>


<div class="flex justify-center mb-4">
    <div class="relative">
        <!-- Bind the video element here and style to 64x64 -->
        <video bind:this={videoElement} class="w-32 h-32 rounded" autoplay playsinline></video>
        <!-- Canvas for processing the image -->
        <canvas bind:this={canvasElement} style="display: none;"></canvas>
        <!-- Canvas for displaying the resized image -->
        <canvas bind:this={displayCanvas} style="display: none;"></canvas>
        <button class="bg-green text-white font-semibold py-2 px-4 rounded" 
                on:click={captureImage} 
                disabled={captureDisabled}>
            Capture
        </button>
    </div>
</div>
