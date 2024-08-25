//stores.js
import { writable, get } from 'svelte/store';

// Create writable stores for the classes, classNames, model, and statuses
export let classes = writable([]);
export let classNames = writable([]);
export let model = writable(null);
export let dataStatus = writable("This will be updated with the training status as you progress!");
export let trainStatus = writable("");
export let testStatus = writable("");


// Function to add images to a specific class by index
export function addImagesToClass(classIndex, newImages, newTensors) {
    classes.update(existingClasses => {
        const updatedClasses = [...existingClasses];
        updatedClasses[classIndex] = {
            ...updatedClasses[classIndex],
            images: [...updatedClasses[classIndex].images, ...newImages],
            tensors: [...updatedClasses[classIndex].tensors, ...newTensors]
        };
        return updatedClasses;
    });
}


