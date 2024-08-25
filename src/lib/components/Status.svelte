<!-- Instructions.svelte -->

<script>
    // Imports the status stores that hold the status of the data and the training
    import { dataStatus, trainStatus, testStatus } from './stores';
</script>

<div class="flex justify-center m-4 ">
    <div class=" bg-blue p-4 rounded-3xl">
        <!-- Render the text within the box -->
        <p class="whitespace-pre-wrap font-bold">
            <span class="text-xl font-bold">Status:</span>
            {'\n'}{$dataStatus}
            {'\n'}{$trainStatus}
            {'\n'}{$testStatus}
        </p>
    </div>
</div>