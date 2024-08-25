<!-- Uploadimages.svelte -->

<script>
    import * as tf from '@tensorflow/tfjs'; 
    import {addImagesToClass} from './stores.js'; 

    let tensors = [];
    let images = [];
    export let classIndex;
    let loadedFiles = 0;

    // Takes in the file input
    async function handleFileInput(event) {
        const files = event.target.files;

        // Loop through the files
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            // When the file is read it triggers the onload event
            reader.onload = async (e) => {
                // Get the data URL
                const imageData = e.target.result;
                const img = new Image();
                img.src = imageData;
                
                // Wait for the image to load
                await new Promise((resolve) => {
                    img.onload = resolve;
                });

                // Create a canvas element
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 224;
                canvas.height = 224;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Make a tensor from the image and preprocesses it so it will be ready to go into the model
                const tensor = tf.browser.fromPixels(canvas)
                    .resizeBilinear( [224,224], true)// resize
                    .toFloat() // Convert pixel values to floats
                    .div(tf.scalar(255.0)); // Add a batch dimension
                console.log(tensor.data());

                // Add the tensor to the images array
                tensors = [...tensors, tensor];

                // Draw the image on a resized canvas for displaying
                canvas.width = 64;
                canvas.height = 64;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Get the resized image data URL
                const resizedImageData = canvas.toDataURL();
                images = [...images, resizedImageData];

                
                loadedFiles++;
                if (loadedFiles === files.length) {
                    addImagesToClass(classIndex, images, tensors);
                    console.log(images);
                }
            };
            
            // Read the file as a data URL
            reader.readAsDataURL(file);
        }
    }
</script>

<input class=" file:bg-green file:py-1 file:px-4 file:rounded-full file:border-0 file:font-semibold file:cursor-pointer " type="file" multiple="multiple" accept="image/*" on:change={handleFileInput} />


