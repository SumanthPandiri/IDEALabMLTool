<!-- Train.svelte -->


<script lang="ts" >
    import * as tf from '@tensorflow/tfjs';
    import { get } from 'svelte/store';
    import {trainStatus, classes, classNames, model as modelStore} from './stores.js';
	import DownloadModel from './DownloadModel.svelte';
	import UploadModel from './UploadModel.svelte';
    import AdvancedTrain from './AdvancedTrain.svelte';

  
    // Define the hyperparameters (can be manually tuned later)
    let TTSPLIT = 0.8;
    let BATCHSIZE = 5;
    let EPOCHS = 5;
    let mobilenet;
    let finalInput;
    let finalTestInput;
    let yTest;
    let labels;
    let accuracy = null;
    let model;
    let predictMode = false;
    let xTrain, yTrain, xTest;

   
    async function train() {
        trainStatus.set("Train Status: Preparing for training...");

        let data = get(classes);
        let names = get(classNames);
        labels = [];
        let inputs = [];

        // Load the pre-trained MobileNet model
        mobilenet = await tf.loadGraphModel(
            'https://www.kaggle.com/models/google/mobilenet-v3/TfJs/small-075-224-classification/1',
            { fromTFHub: true });

        tf.tidy(function () {
            let answer = mobilenet.predict(tf.zeros([1, 224, 224, 3]));
            console.log(answer.shape);
        });

        for (let i = 0; i < data.length; i++) {
            const tensor = data[i].tensors;
    
            for (let j = 0; j < tensor.length; j++) {
                // Go through and put each image through the mobilenet model to get the result and add it to the input array         
                inputs.push(mobilenet.predict(tensor[j].expandDims()).squeeze());

                //add the label to the label array
                labels.push(names[i]);
            }
            
        }
        console.log(tf.tensor(inputs));
        console.log("labels:");
        console.log(labels);

        // Define the remaining model layers (1001 because that's what mobilenet outputs)
        model = tf.sequential();
        model.add(tf.layers.dense({inputShape: [1001], units: 128, activation: 'relu'}));
        model.add(tf.layers.dense({units: data.length, activation: 'softmax'}));

        // Compile the model with the defined optimizer and specify a loss function to use.
        model.compile({
        // Adam changes the learning rate over time which is useful.
            optimizer: 'adam',
            // Use the correct loss function. If 2 classes of data, must use binaryCrossentropy.
            // Else categoricalCrossentropy is used if more than 2 classes.
            loss: (length === 2) ? 'binaryCrossentropy': 'categoricalCrossentropy', 
            // As this is a classification problem you can record accuracy in the logs too!
            metrics: ['accuracy']  
        });

        //shuffle around the inputs and labels
        tf.util.shuffleCombo(inputs, labels);
        
        // Split the data into training and testing sets if desired (80% training, 20% testing)
        if (predictMode) {
            const splitIndex = Math.floor(inputs.length * TTSPLIT);
            xTrain = inputs.slice(0, splitIndex);
            yTrain = labels.slice(0, splitIndex);
            xTest = inputs.slice(splitIndex);
            yTest = labels.slice(splitIndex);
            finalInput = tf.stack(xTrain);
            finalTestInput = tf.stack(xTest);
        }
        else {
            const splitIndex = Math.floor(inputs.length * TTSPLIT);
            xTrain = inputs;
            yTrain = labels;
            finalInput = tf.stack(xTrain);
        }
        
        // Convert the labels to one-hot tensors
        let oneHotLabels = yTrain.map(yTrain => names.indexOf(yTrain)); // Convert labels to indices
        const finalTargetTensor = tf.oneHot(tf.tensor1d(oneHotLabels, 'int32'), names.length);

        // Update the training status
        trainStatus.set("Train Status: Training...");

        // train the model
        const history = await model.fit(finalInput, finalTargetTensor, {
            shuffle: true,
            batchSize: BATCHSIZE,
            epochs: EPOCHS,
            callbacks: {
                onEpochEnd: async (epoch, logs) => {
                    console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
                }
            }
        });

        // Update the model store
        modelStore.set(model);

        // Update the training status
        trainStatus.set("Train Status: Training complete!");
        
        // If predict mode is enabled, run the prediction
        if (predictMode) {
            predict();
        }

        console.log("Model "); 
        console.log(get(modelStore));
    }

    //predicts using the test split
    async function predict() {
        const predictions = model.predict(finalTestInput);
        console.log(predictions.array());

        // Get the index of the maximum value along the last dimension (axis = -1)
        const predictedIndices = tf.argMax(predictions, -1);

        // Convert the tensor to a plain JavaScript array
        const predictedIndicesArray = await predictedIndices.array();

        // Map the indices to the corresponding labels
        const predictedLabels = predictedIndicesArray.map(index => labels[index]);
        
        // Calculate the accuracy
        let correctPredictions = 0;
        let total = 0;
        for (let i = 0; i < yTest.length; i++) {
            if (predictedLabels[i] === yTest[i]) {
                correctPredictions++;
            } 
            total++;
        }
        accuracy = correctPredictions / total * 100;
    }

    // Handles the update settings event
    function handleUpdateSettings(event) {
        BATCHSIZE = event.detail.BATCHSIZE;
        EPOCHS = event.detail.EPOCHS;
        console.log('Updated Settings:', BATCHSIZE, EPOCHS);
    }
</script>

<div class="mt-2 flex flex-col items-center ">
    <div class="flex  ">
        <button class="bg-green w-64 h-16 text-black font-bold rounded-full  mr-4" on:click={train}>
            Train
        </button>
        <AdvancedTrain on:updateSettings={handleUpdateSettings} />
        {#if accuracy !== null}
            <div class="px-2">
                <p class="text-white font-bold py-2 px-4 rounded">Accuracy: {accuracy.toFixed(2)}%</p>
            </div>
        {/if}
    </div>
</div>

{#if predictMode}
    <div class="m-1 flex justify-right">
        <button class="bg-green w-64 h-16  text-black font-bold rounded-full" on:click={predict}>
            Predict
        </button>
    </div>
{/if}

<div class="mt-2 flex flex-col items-center ">
    <div class="flex space-x-8">
        <UploadModel />
        <DownloadModel />
    </div>
</div>