<!-- Datacenter.svelte -->

<script>
    import * as tf from '@tensorflow/tfjs'; 
    import UploadImages from './UploadImages.svelte';
    import {get} from 'svelte/store';

    // Imports the writable store to hold the classes and their respective images
    import {classes, classNames, dataStatus} from './stores.js';
	import TakeImages from './TakeImages.svelte';

    // functionality to open the pop up
    let isPopupOpen = false;
    let camera = false;

    // Function to open the popup
    function openPopup() {
        isPopupOpen = true;
    }

    // Function to close the popup
    function closePopup() {
        isPopupOpen = false;
        dataStatus.set("Uploaded classes: " + get(classNames).join(', '));

    }

    // Function to add a new class
    function addClass(className) {
        const newClass = { images: [], tensors: []};
        classes.update(existingClasses => [...existingClasses, newClass]);
        classNames.update(existingClassNames => [...existingClassNames, className]);
    }

    //function to remove a class
    function removeClass(index) {
        classes.update(existingClasses => existingClasses.filter((_, i) => i !== index));
        classNames.update(existingClassNames => existingClassNames.filter((_, i) => i !== index));
    }

    // Function to remove an image from a class
    function removeImageFromClass(classIndex, imageIndex) {
        classes.update(existingClasses => {
            // Create a shallow copy of the array
            const updatedClasses = [...existingClasses]; 
            updatedClasses[classIndex] = {
                ...updatedClasses[classIndex], // Create a shallow copy of the class object
                images: updatedClasses[classIndex].images.filter((_, index) => index !== imageIndex), // Filter out the image
                tensors: updatedClasses[classIndex].tensors.filter((_, index) => index !== imageIndex) // Filter out the tensor
            };
            return updatedClasses; 
        });
    }

    // Function to start the camera
    function startCamera() {
        if (camera) {
            camera = false;
        }
        else {
            camera = true;
        }
    }
</script>


<!-- Button to open the popup window-->
<div class=" mt-4 flex justify-center">
    <button class="bg-green w-64 h-16 text-black font-bold rounded-full " on:click={openPopup}>
        Open Data Center
    </button>
</div>

<!-- Popup window to manage classes and images -->
{#if isPopupOpen}
    <div class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-gray-900 bg-opacity-50 z-10">
        <div class="bg-white p-6 rounded-xl max-w-full overflow-auto">
            <div class=" max-h-80 overflow-y-auto ">
                {#each $classes as currClass, classIndex}
                    <div class="flex items-center p-2 border-b">
                        <!-- Input field to edit the class name -->
                        <input class="grow p-2 border-2 border-blue rounded-md" type="text" bind:value={$classNames[classIndex]}/>
                        
                        <!-- Component to upload or take images for the class -->
                        <div class="container mx-auto  max-w-3xl px-4">
                            <div class="flex items-center justify-between">
                                <UploadImages classIndex={classIndex}/>
                                <button class=" bg-green rounded-full font-semibold text-black py-1 px-4 " on:click={startCamera}>Open Camera</button>
                                {#if camera}
                                    <TakeImages classIndex={classIndex}/>
                                {/if}
                            </div>
                        
                            {#if currClass.images.length > 0}
                                <div class="flex overflow-x-auto py-4 scroll-snap-x-mandatory scroll-padding-10">
                                    {#each currClass.images as image, imageIndex} 
                                        <div class="flex-none w-50 h-50 scroll-snap-start mr-2">
                                            <img src={image} alt="Uploaded Image" />
                                            <button class="bg-red text-black rounded-full py-0.5 px-1 font-semibold text-sm" on:click={() => removeImageFromClass(classIndex, imageIndex)}>Delete</button>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                        
                        <!-- Button to remove the class -->
                        <button class=" bg-green font-semibold py-1 px-4 text-black rounded-full" on:click={() => removeClass(classIndex)}>Remove</button>
                    </div>
                {/each}

                <!-- Button to add class-->
                <button class="mt-4 bg-green text-black font-semibold py-1 px-4 rounded-full" on:click={() => addClass('New Class')}>
                    Add Class
                </button>
            </div>

            <!-- Button to close the popup window-->
            <button class="mt-4 bg-green text-black font-semibold py-1 px-4 rounded-full" on:click={closePopup}>
                Close Popup
            </button>
        </div>
    </div>
{/if}

