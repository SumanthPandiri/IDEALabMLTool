<script lang="ts">
	import Datacenter from "$lib/components/datacenter.svelte";
    import Instructions from "$lib/components/instructions.svelte";
    import Train from "$lib/components/train.svelte";
    

</script>

<div class="grid grid-cols-2">
    <div class="col-span-1">
        <!-- Display the Instructions component -->
        <Instructions />
    </div>
    <div class="col-span-2">
        <!-- Display the Datacenter component -->
        <Datacenter />
        <!-- Display the Train component -->
        <Train />
    </div>
</div>

