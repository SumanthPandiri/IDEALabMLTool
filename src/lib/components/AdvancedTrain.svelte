<!-- AdvancedTrain.svelte -->

<script>
    import { createEventDispatcher } from 'svelte';
  
    let showModal = false;
    let BATCHSIZE = 5;
    let EPOCHS = 5;
  
    const dispatch = createEventDispatcher();
  
    function toggleModal() {
      showModal = !showModal;
    }
  
    function updateSettings() {
      dispatch('updateSettings', { BATCHSIZE, EPOCHS });
      toggleModal();
    }
  </script>
  
  <div>
    <!-- Button to open the modal -->
    <button 
      on:click={toggleModal}
      class="bg-green w-64 h-16 text-black font-bold rounded-full ml-4">
      Advanced Settings
    </button>
  </div>
  
  {#if showModal}
    <!-- Overlay background -->
    <div class="fixed inset-0 backdrop-blur-sm bg-gray-900 bg-opacity-50 z-10" >
  
        <!-- Modal content -->
        <div class="z-10 fixed inset-0 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 class="text-xl font-semibold mb-4">Advanced Training Settings</h2>
    
            <!-- Batch Size Slider -->
            <label class="block mb-2">Batch Size: {BATCHSIZE}</label>
            <input
            type="range"
            min="1"
            max="64"
            step="1"
            bind:value={BATCHSIZE}
            class="mb-4 w-full" />
    
            <!-- Epochs Slider -->
            <label class="block mb-2">Epochs: {EPOCHS}</label>
            <input
            type="range"
            min="1"
            max="100"
            step="1"
            bind:value={EPOCHS}
            class="mb-4 w-full" />
    
            
            <div class="flex flex-row justify-center space-x-4">
                <!-- Save Button -->
                <div class="flex ">
                    <button
                        on:click={updateSettings}
                        class="bg-green rounded-full font-semibold text-black py-1 px-4">
                        Save
                    </button>
                </div>

                <div class="flex">
                    <button
                        on:click={toggleModal}
                        class="bg-green rounded-full font-semibold text-black py-1 px-4">
                        Close
                    </button>
                </div>
            </div>
        </div>
        </div>
    </div>
  {/if}
  