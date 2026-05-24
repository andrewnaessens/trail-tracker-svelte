<script lang="ts">
  import { loggedInUser } from "$lib/runes.svelte";
  import { trailTrackerService } from "$lib/services/trail-tracker-service";
  import type { Trail } from "$lib/types/trail-tracker-types";
  import Coordinates from "$lib/ui/Coordinates.svelte";
  import { sanitiseAlphaNum, sanitiseNumNoSpaces } from "$lib/utils/sanitise";

  // form input fields held as reactive local states
  let title = $state("Trail Name");
  let description = $state("A trail description");
  let location = $state("County");
  let lat = $state(52.160858);
  let lng = $state(-7.15242);
  let distance = $state(7.25);
  let message = $state("Create Trail");

  // accepts data and callback prop (id, onTrailCreation) from parent
  let { id = "", trailEvent = null, onTrailCreation }: { id?: string; onTrailCreation?: () => Promise<void> } = $props();

  async function createTrail(categoryId: string) {
    // sanitise inputs by passing them to the sanitise util functions
    const sanitisedTitle = sanitiseAlphaNum(title);
    const sanitisedDescription = sanitiseAlphaNum(description);
    const sanitisedLocation = sanitiseAlphaNum(location)
    const sanitisedLat = sanitiseNumNoSpaces(lat);
    const sanitisedLng = sanitiseNumNoSpaces(lng);
    const sanitisedDistance = sanitiseNumNoSpaces(distance);

    // update form fields with sanitised data
    title = sanitisedTitle;
    description = sanitisedDescription;
    location = sanitisedLocation;
    lat = sanitisedLat;
    lng = sanitisedLng;
    distance = sanitisedDistance;

    // check that all required fields are filled out (check sanitised values)
    if (sanitisedTitle && sanitisedDescription && sanitisedLocation && sanitisedLat !== null && sanitisedLng !== null && sanitisedDistance && categoryId) {
      const trail: Trail = {
        title: sanitisedTitle,
        description: sanitisedDescription,
        location: sanitisedLocation,
        lattitude: sanitisedLat,
        longitude: sanitisedLng,
        distance: sanitisedDistance,
      };
      const success = await trailTrackerService.createTrail(loggedInUser.token, categoryId, trail);
      if (!success) {
        message = "Trail not created - some error occurred";
        return;
      }
      if (trailEvent) trailEvent(trail);
      message = `Thanks! Created trail: ${title}`;
      // triggers parent's function to refresh the global rune (updates trail list)
      if (onTrailCreation) {
        await onTrailCreation();
      }
      // Reset fields back to default
      title = "Trail Name";
      description = "A trail description";
      location = "County";
      lat = 52.160858;
      lng = -7.15242;
      distance = 7.25;
    } else {
      message = "Please select a title, description, location, lattitude, longitude, and distance";
    }
  }
</script>

<div>
  <div class="field">
    <label class="label" for="trail">Enter Trail Name:</label>
    <input bind:value={title} class="input" id="title" name="title" type="text" />
  </div>
  <div class="field">
    <label class="label" for="trail">Enter Description:</label>
    <input bind:value={description} class="input" id="description" name="description" type="text" />
  </div>
  <div class="field">
    <label class="label" for="trail">Enter Location:</label>
    <input bind:value={location} class="input" id="location" name="location" type="text" />
  </div>
  <div class="field">
    <label class="label" for="trail">Enter Distance:</label>
    <input bind:value={distance} class="input" id="distance" name="distance" type="number" step="0.01" />
  </div>
  <div class="field">
    <label class="label" for="trail">Enter Coordinates:</label>
    <Coordinates bind:lat bind:lng />
  </div>
  <div class="field">
    <div class="control">
      <button onclick={() => createTrail(id)} class="button is-primary" aria-label="create">Create</button>
    </div>
  </div>
</div>
<div class="box mt-4">
  <div class="notification is-info is-light p-2 has-text-centered">
    {message}
  </div>
</div>

