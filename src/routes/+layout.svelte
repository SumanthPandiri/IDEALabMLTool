<!-- +layout.svelte -->
<!-- This is the main layout file for the application -->

<script>
    // Importing the main CSS file
    import "../app.css";
    import Modal from 'svelte-simple-modal';
</script>

<Modal>
    <!-- The main container with a red background -->
    <div class="bg-red flex h-screen flex-col overflow-hidden">
        <!-- The title of the application with a blue background -->
        <header class="relative">
            <h1 class="bg-blue py-5 text-center text-3xl text-black">
                Teach Your Own Machine Learning Model
            </h1>
            <!-- Logo positioned in the top right corner -->
            <div class="absolute top-2 right-2 bg-black p-1 rounded">
                <img src="/logo.png" alt="Logo" class="w-12 h-12" />
            </div>
        </header>
        <!-- The slot container that takes up the full height and allows scrolling if the content overflows -->
        <div class="h-full overflow-scroll">
            <slot />
        </div>
        <!-- A footer with a black background for the tag -->
        <div class="bg-black py-2 text-center text-sm text-white">IDEA Lab, Created by Sumanth Pandiri</div>
    </div>
</Modal>

  
