<script lang="ts" >
    import * as tf from '@tensorflow/tfjs'; // Import TensorFlow.js

    import { onMount } from 'svelte';
    import { get } from 'svelte/store'

    import {classes} from './stores.js'; // Replace with your Svelte store

  
    // Define the hyperparameters (can be manually tuned later)
    let TTSPLIT = 0.8;
    let BATCHSIZE = 5;
    let EPOCHS = 10;


    let model;
    let mobilenet;
    let finalTestInput;
    let yTest;
    let labels;
    let accuracy = null;


    // Function to print the classes
    function printClasses() {
        console.log(get(classes));
    }

    async function train() {
        let data = get(classes);
        let inputvector = [];
        labels = [];
        let inputmodel = [];

        // Load the pre-trained MobileNet model
        mobilenet = await tf.loadGraphModel(
            'https://www.kaggle.com/models/google/mobilenet-v3/TfJs/small-075-224-classification/1',
            { fromTFHub: true });

            tf.tidy(function () {
            let answer = mobilenet.predict(tf.zeros([1, 224, 224, 3]));
            //console.log(answer.shape);
        });

        for (let i = 0; i < data.length; i++) {
            const tensor = data[i].images;
    
            for (let j = 0; j < tensor.length; j++) {
                // Go through and put each image through the mobilenet model to get the result and add it to the input array         
                inputmodel.push(mobilenet.predict(tensor[j].expandDims()).squeeze());

                //add the label to the label array
                labels.push(data[i].name);
            }
        }
        console.log(tf.tensor(inputmodel));
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
        tf.util.shuffleCombo(inputmodel, labels);
        

        // Split the data into training and testing sets (80% training, 20% testing)
        const splitIndex = Math.floor(inputmodel.length * TTSPLIT);
        const xTrain = inputmodel.slice(0, splitIndex);
        const yTrain = labels.slice(0, splitIndex);
        const xTest = inputmodel.slice(splitIndex);
        yTest = labels.slice(splitIndex);

        // Convert the input data to tensors
        let finalInput = tf.stack(xTrain);
        finalTestInput = tf.stack(xTest);


        let uniqueLabels = Array.from(new Set(yTrain)); // Get unique labels
        let oneHotLabels = yTrain.map(yTrain => uniqueLabels.indexOf(yTrain)); // Convert labels to indices

        // Convert indices to one-hot encoded tensors
        let oneHotTensors = tf.oneHot(tf.tensor1d(oneHotLabels, 'int32'), uniqueLabels.length);

        // Ensure that the target tensor has the correct shape [6, 2]
        let finalTargetTensor = oneHotTensors.reshape([yTrain.length, uniqueLabels.length]);

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

        predict();
        
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



</script>


<button class="text-white font-bold py-2 px-4 " on:click={printClasses}>
    Print Classes
</button>

<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={train}>
    Train
</button>  

<button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" on:click={predict}>
    Predict
</button>

{#if accuracy !== null}
        <div class="py-2">
            <p class="text-white font-bold py-2 px-4 rounded">Accuracy: {accuracy.toFixed(2)}%</p>
        </div>
    {/if}