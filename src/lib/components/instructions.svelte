<!-- Instructions.svelte -->

<script>
    // Just a print statement for the instructions for the machine learning tool.
    export let text = "\nStep 1: Open the Data Center. Add a few classes to train the model! Click on \"Open Camera,\" and take pictures for each class. Make sure to add all of the same type of images in the same class, and be careful not to mix up images! \n\nStep 2: Once you're done, hit Train! If you'd like to tweak your training settings, use the \"Advanced Train\" button.\n\n Step 3: Use the \"Start Live Test\" button to test the accuracy of your model.";
</script>

<div class="flex justify-center m-4 ">
    <div class=" bg-purple p-4 rounded-3xl">
        <!-- Render the text within the box -->
        <p class="whitespace-pre-wrap font-bold">
            <span class="text-2xl font-bold">Instructions:</span>
            {text}
        </p>
    </div>
</div>