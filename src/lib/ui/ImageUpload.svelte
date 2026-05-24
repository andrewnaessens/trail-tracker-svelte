<script lang="ts">
  import { currentTrails, loggedInUser } from "$lib/runes.svelte";
  import { trailTrackerService } from "$lib/services/trail-tracker-service";
  
  // get trail and categoryId from parent
  let { trail, categoryId } = $props();
  // fileInput is bound to the HTML tag with bind:this to allow direct DOM access
  // https://svelte.dev/docs/svelte/bind#bind:this
  let fileInput: HTMLInputElement;
  // binds the file directly to the input's FileList and stores it as a local state
  // https://svelte.dev/docs/svelte/bind#input-bind:files
  // https://developer.mozilla.org/en-US/docs/Web/API/FileList
  let fileList: FileList | null = $state(null);

  // automatically get the first file and its name
  let selectedFile = $derived(fileList ? fileList[0] : null) as File | null;
  let fileName = $derived(selectedFile?.name || "No file selected");
  // message to user for ui
  let message = $state("");

  // modal state
  // stores the URL for the full-screen view
  let previewImage = $state(""); 
  let isModalActive = $state(false);

  async function upload(event: Event) {
    // stop the browser from reloading the page (looking for URL in form action attribute)
    event.preventDefault();

    if (!selectedFile) {
      message = "Please select a file first";
      return;
    }
    // pass image to hapi backend via the API
    message = "Uploading...";
    const result = await trailTrackerService.uploadImage(categoryId, trail._id, selectedFile);
    
    if (result && result.img) {
      // updates the global rune with image
      updateGlobalRune(result.img);
      message = "Upload successful!";
      // reset the file picker ui
      fileList = null;
      // if fileInput exists, clear its value to reset the picker 
      // allows the user to select the same file (filename) again if they want
      if (fileInput) fileInput.value = ""; 
      // clear "Upload successful!" message after 3 seconds
      setTimeout(() => { message = "" }, 3000);
    }
  }

  async function deleteImage(imgUrl: string) {
    if (!confirm("Delete this image?")) return;

    // variable to filter through image gallery (array) to filter out the image to be deleted
    const updatedGallery = trail.img.filter((url: string) => url !== imgUrl);

    // build the updated trail object (including the new filtered gallery without the image to be deleted)
    // excluding the _id: and __V: properties
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-redeclare
    const { _id: _, __v: __, ...trailData } = trail;
    // spread operator ...trail copies existing trail object to a new one, 
    // img: is overwritten with the updated gallery 
    const updatedTrail = { ...trailData, img: updatedGallery };

    console.log("trail to update:");
    console.log(updatedTrail);

    // update the images in the trail image gallery for this trail
    const success = await trailTrackerService.updateTrailById(loggedInUser.token, trail._id, updatedTrail, false);
    // if sucess updates the global rune with the updated gallery
    if (success) {
    updateGlobalRune(updatedGallery);
    message = "Image removed";
    setTimeout(() => message = "", 3000);
    }
  }

  function updateGlobalRune(newGallery: string[]) {
    // find the index of the trail the image is being uploaded to in the global currentTrails rune 
    // findIndex returns -1 if can't find a match
    const index = currentTrails.trails.findIndex(t => t._id === trail._id);
    // only proceed to update the trail if there is a match (the trail exists)
    // if the index is not equal to -1 update img property for this trail with 
    // result.img (the image being uploaded), ui updates reactively
    if (index !== -1) {
      currentTrails.trails[index].img = newGallery;
    }
  }

  function openPreview(url: string) {
    previewImage = url;
    isModalActive = true;
  }


    
</script>


<!-- gallery -->
<div class="columns is-multiline is-mobile mb-6" style="height: 100px">
  {#each trail.img || [] as image}
    <div class="column is-3">
      <div class="image-container" style="position: relative;">
        <figure class="image is-square" onclick={() => openPreview(image)} style="cursor: pointer;">
          <img src={image} alt="trail" style="object-fit: cover; height: 100%;">
        </figure>
      
        <!-- delete button -->
        <button 
          onclick={(e) => { e.stopPropagation(); deleteImage(image); }} 
          class="button is-danger is-small" 
          style="position: absolute; top: 0; right: 0; padding: 0 5px; height: 20px; font-size: 10px;">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  {/each}
</div>

<!-- modal (full screen preview) -->
<!-- https://bulma.io/documentation/components/modal/ -->
<div class="modal {isModalActive ? 'is-active' : ''}">
  <div class="modal-background" onclick={() => isModalActive = false}></div>
  <div class="modal-content">
    <p class="image">
      <img src={previewImage} alt="Full preview">
    </p>
  </div>
  <button class="modal-close is-large" aria-label="close" onclick={() => isModalActive = false}></button>
</div>

<!-- upload image form -->
<form onsubmit={upload}>
  <div class="file has-name is-fullwidth is-small">
    <label class="file-label">
      <input bind:this={fileInput} bind:files={fileList} class="file-input" type="file">
      <span class="file-cta">
        <span class="file-icon"><i class="fas fa-upload"></i></span>
        <span class="file-label">Add...</span>
      </span>
      <span class="file-name">{fileName}</span>
    </label>
    <button type="submit" class="button is-info is-small ml-2">Upload</button>
  </div>
</form>

<!-- message -->
<div class="message-container" style="min-height: 64px;"> 
  {#if message}
    <div class="notification is-info is-light p-2 has-text-centered">
      {message}
    </div>
  {/if}
</div>
