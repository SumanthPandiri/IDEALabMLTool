
<script>
    
    import UploadImages from './uploadimages.svelte';
    import { writable, get } from 'svelte/store';

    // Create a writable store to hold the classes and their respective images
    import {classes} from './stores.js';


    // functionality to open the pop up
    let isPopupOpen = false;

    function openPopup() {
        isPopupOpen = true;
    }

    function closePopup() {
        isPopupOpen = false;
        console.log("classes:");
        console.log(get(classes));
    }


    // Function to add a new class
    function addClass(className) {
        const newClass = { name: className, images: [] };
        classes.update(existingClasses => [...existingClasses, newClass]);
        console.log(get(classes));
    }

    //function to remove a class
    function removeClass(index) {
        classes.update(existingClasses => existingClasses.filter((_, i) => i !== index));
    }

  
</script>


<!-- Button to open the popup window-->
<button class="text-white font-bold py-2 px-4 " on:click={openPopup}>
    Open Data Center
</button>

{#if isPopupOpen}
    <div class="fixed inset-0 flex items-center justify-center">
        <div class="bg-white p-4 rounded max-w-lg">
            <!-- Wrap the content in a scrollable div -->
            <div class="max-h-80 overflow-y-auto">
                {#each $classes as c, index}
                    <div class="flex">
                        <!-- Input field to edit the class name -->
                        <input type="text" bind:value={$classes[index].name}/>
                        <!-- Component to upload images for the class -->
                        <UploadImages bind:images={$classes[index].images} />
                        <!-- Button to remove the class -->
                        <button on:click={() => removeClass(index)}>Remove</button>
                    </div>
                {/each}
                <!-- Button to add class-->
                <button class="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded" on:click={() => addClass('New Class')}>
                    Add Class
                </button>
            </div>
            <!-- Button to close the popup window-->
            <button class="mt-4 bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded" on:click={closePopup}>
                Close Popup
            </button>
        </div>
    </div>
{/if}

