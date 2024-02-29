<script>
    import { writable } from 'svelte/store';
  
    const images = writable([]);
  
    function handleFileInput(event) {
      const files = event.target.files;
      let selectedImages = [];
  
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
  
        reader.onload = (e) => {
          selectedImages = [...selectedImages, { src: e.target.result, id: i }];
          images.set(selectedImages);
        };
  
        reader.readAsDataURL(file);
      }
    }
  
    function removeImage(id) {
      const updatedImages = $images.filter(image => image.id !== id);
      images.set(updatedImages);
    }
  </script>
  
  <input type="file" multiple accept="image/*" on:change={handleFileInput} />
  
  {#each $images as { src, id }, index}
    <div>
      <img src={src} alt={`Image ${index}`} />
      <button on:click={() => removeImage(id)}>Remove</button>
    </div>
  {/each}
  