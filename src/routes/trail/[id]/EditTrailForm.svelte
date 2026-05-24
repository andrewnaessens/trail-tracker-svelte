<script lang="ts">
  import { currentTrail, loggedInUser } from "$lib/runes.svelte";
  import { trailTrackerService } from "$lib/services/trail-tracker-service";
  import type { Trail } from "$lib/types/trail-tracker-types";
  import { sanitiseAlphaNum, sanitiseNumNoSpaces } from "$lib/utils/sanitise";

  
  let message = $state("Update Trail");
  
  async function updateTrail() {
    // get the modified data from the global rune
    const thisTrail = currentTrail.trail;
    // sanitise inputs by passing them to the sanitise util functions
    const sanitisedTitle = sanitiseAlphaNum(thisTrail.title);
    const sanitisedDescription = sanitiseAlphaNum(thisTrail.description);
    const sanitisedLocation = sanitiseAlphaNum(thisTrail.location)
    const sanitisedLat = sanitiseNumNoSpaces(thisTrail.lattitude);
    const sanitisedLng = sanitiseNumNoSpaces(thisTrail.longitude);
    const sanitisedDistance = sanitiseNumNoSpaces(thisTrail.distance);
    
    // update form fields with sanitised data
    thisTrail.title = sanitisedTitle;
    thisTrail.description = sanitisedDescription;
    thisTrail.location = sanitisedLocation;
    thisTrail.lattitude = sanitisedLat;
    thisTrail.longitude = sanitisedLng;
    thisTrail.distance = sanitisedDistance;
    
    // check that all required fields are filled out (check sanitised values)
    if (sanitisedTitle && sanitisedDescription && sanitisedLocation && sanitisedLat !== null && sanitisedLng !== null && sanitisedDistance) {
      // build payload using the current values within the global rune
      const updatedTrail: Trail = {
        title: sanitisedTitle,
        description: sanitisedDescription,
        location: sanitisedLocation,
        lattitude: sanitisedLat,
        longitude: sanitisedLng,
        distance: sanitisedDistance,
        categoryid: currentTrail.trail.categoryid || "",
        img: currentTrail.trail.img
      };
      
      // send the updated payload to the hapi backend via the API
      const success = await trailTrackerService.updateTrailById(loggedInUser.token, currentTrail.trail._id, updatedTrail);
      
      if (!success) {
        message = "Trail not updated - some error occurred";
        return;
      }
      
      message = `Thanks! Updated trail: ${thisTrail.title}`;
    } else {
      message = "Please select a title, description, location, lattitude, longitude, and distance";
    }
  }

  function cancelEditTrail() {
    const categoryId = currentTrail.trail.categoryid;
  
    if (categoryId) {
      // reset the global trail rune
      currentTrail.trail = {} as Trail;

      // pass categoryId to trailTrackerService.cancelUpdateTrail
      trailTrackerService.cancelUpdateTrail(categoryId);
    }
  }

</script>

<p>Currently editing: {currentTrail.trail.title || "Loading..."}</p>
<div>
  <div class="field">
    <label class="label" for="trail">Enter Trail Name:</label>
    <input bind:value={currentTrail.trail.title} class="input" id="title" name="title" type="text" />
  </div>
  <div class="field">
    <label class="label" for="trail">Enter Description:</label>
    <input bind:value={currentTrail.trail.description} class="input" id="description" name="description" type="text" />
  </div>
  <div class="field">
    <label class="label" for="trail">Enter Location:</label>
    <input bind:value={currentTrail.trail.location} class="input" id="location" name="location" type="text" />
  </div>
  <div class="field">
    <label class="label" for="trail">Enter Lattitude:</label>
    <input bind:value={currentTrail.trail.lattitude} class="input" id="lattitude" name="lattitude" type="number" step="0.01" />
  </div>
  <div class="field">
    <label class="label" for="trail">Enter Longitude:</label>
    <input bind:value={currentTrail.trail.longitude} class="input" id="longitude" name="longitude" type="number" step="0.01" />
  </div>
  <div class="field">
    <label class="label" for="trail">Enter Distance:</label>
    <input bind:value={currentTrail.trail.distance} class="input" id="distance" name="distance" type="number" step="0.01" />
  </div>
  <div class="field">
    <div class="control">
      <button onclick={() => updateTrail()} class="button is-primary" aria-label="create">Update</button>
    </div>
  </div>
  <div class="control">
    <button onclick={() => cancelEditTrail()} class="button is-danger has-text-white" aria-label="cancel">
      Cancel
    </button>
  </div>
</div>
<div class="box mt-4">
  <div class="notification is-info is-light p-2 has-text-centered">
    {message}
  </div>
</div>
