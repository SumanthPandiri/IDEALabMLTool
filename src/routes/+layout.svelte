<script>
    import "../app.css";
    import Modal from 'svelte-simple-modal';

</script>

<Modal>
    <div class="flex h-screen flex-col overflow-hidden">
        <h1 class="bg-secondary py-3 text-center text-3xl text-white">
            Teach Your Own Machine Learning Model
        </h1>
        <div class="h-full overflow-scroll">
            <slot />
        </div>
        <div class="bg-black py-2 text-center text-sm text-white">IDEA Lab Clemson, Created by Sumanth Pandiri</div>
    </div>
</Modal>