<!-- This is the main layout file for the application -->

<script>
    // Importing the main CSS file
    import "../app.css";
    import Modal from 'svelte-simple-modal';
</script>

<Modal>
    <!-- The main container with a blue background, flex layout, full screen height, and overflow hidden -->
    <div class="bg-blue flex h-screen flex-col overflow-hidden">
        <!-- The title of the application with a purple background, padding on the y-axis, centered text, 3xl text size, and black color -->
        <h1 class="bg-purple py-3 text-center text-3xl text-black">
            Teach Your Own Machine Learning Model
        </h1>
        <!-- A container that takes up the full height and allows scrolling if the content overflows -->
        <div class="h-full overflow-scroll">
            <slot />
        </div>
        <!-- A footer with a black background, padding on the y-axis, centered text, small text size, and white color -->
        <div class="bg-black py-2 text-center text-sm text-white">IDEA Lab Clemson, Created by Sumanth Pandiri</div>
    </div>
</Modal>