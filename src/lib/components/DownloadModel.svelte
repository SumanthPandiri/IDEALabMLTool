<!-- DownloadModel.svelte -->


<script>
    import * as tf from '@tensorflow/tfjs';
    import { model, classNames, trainStatus } from './stores.js';
    import { get } from 'svelte/store';

    async function downloadModel() {
        const currentModel = get(model);
        const currentClassNames = get(classNames);

        if (!currentModel) {
            console.error('No model available to download');
            trainStatus.set('Train Status: ERROR: No model available to download.');
            return;
        }

        try {
            // Save the model to files
            await currentModel.save('downloads://trained-model');
            
            // Save classNames to a separate file
            const blob = new Blob([JSON.stringify(currentClassNames)], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'class-names.json';
            link.click();
            console.log('Model and class names saved successfully!');
        } catch (error) {
            console.error('Error saving model:', error);
        }

        trainStatus.set('Train Status: Model and class names saved successfully!');
    }
</script>

<div class="flex flex-col">
    <button class="bg-green w-64 h-16 text-black font-bold rounded-full" on:click={downloadModel}>
        Download Model
    </button>
</div>
