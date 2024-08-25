<!-- Main.svelte -->

<script lang="ts">
	import Datacenter from "$lib/components/Datacenter.svelte";
    import Instructions from "$lib/components/Instructions.svelte";
    import Train from "$lib/components/Train.svelte";
    import Test from "$lib/components/Test.svelte";
    import Status from "$lib/components/Status.svelte";
</script>


<div class="grid grid-cols-2">
    <div>
        <!-- Display the Instructions component -->
        <Instructions />
        <Status />
    </div>
    <div >
        <!-- Display the Datacenter component -->
        <Datacenter />
        <!-- Display the Train component -->
        <Train />
        <!-- Display the Test component -->
        <Test />
    </div>
</div>

 