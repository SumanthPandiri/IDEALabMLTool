<!-- UploadModel.svelte -->

<script>
    import * as tf from '@tensorflow/tfjs';
    import { model, classNames, trainStatus } from './stores.js';
    import { get } from 'svelte/store';


    async function uploadModel(event) {
        const files = event.target.files;

        // Check if all required files are uploaded
        if (files.length < 3) {
            console.error('Please upload model.json, model.weights.bin, and class-names.json files.');
            return;
        }

        try {
            // Create a map of the uploaded files
            const fileMap = {};
            for (const file of files) {
                fileMap[file.name] = file;
            }

            const modelJson = fileMap['trained-model.json'];
            const weightFile = fileMap['trained-model.weights.bin'];
            const classNamesJson = fileMap['class-names.json'];

            if (!modelJson || !weightFile || !classNamesJson) {
                console.error('Missing required files.');
                tf.trainStatus.set('Train Status: ERROR: Missing required files when uploading model.');
                return;
            }

            // Load the model
            const modelInstance = await tf.loadLayersModel(tf.io.browserFiles([modelJson, weightFile]));

            // Read class names
            const classNamesText = await classNamesJson.text();
            const classNamesData = JSON.parse(classNamesText);

            model.set(modelInstance); // Update the model in the store
            classNames.set(classNamesData); // Update class names in the store
            console.log('Model and class names uploaded successfully!');
            console.log(get(classNames));
            console.log(get(model));
        } catch (error) {
            console.error('Error uploading model:', error);
            trainStatus.set('Train Status: ERROR: Error uploading model.');
        }

        // Update the train status
        trainStatus.set('Train Status: Model and class names uploaded successfully!');
    }
</script>

<div class="flex flex-col items-center">
    <input type="file" accept=".json,.bin" multiple class="hidden" id="model-upload" on:change={uploadModel} />
    <label for="model-upload" class="bg-green w-64 h-16 text-black font-bold rounded-full flex items-center justify-center cursor-pointer">
        Upload Model
    </label>
</div>