<script lang="ts">
  import { page } from "$app/state";
  import { currentTrail, loggedInUser, subTitle} from "$lib/runes.svelte";
  import { trailTrackerService } from "$lib/services/trail-tracker-service";
  import type { Trail } from "$lib/types/trail-tracker-types";
  import Card from "$lib/ui/Card.svelte";
  import EditTrailForm from "./EditTrailForm.svelte";

  subTitle.text = "Edit Trail";

  let id: string = $state(page.params.id || "");
  
  // fetch the object and update the global rune
  // runs once when the page is loaded and if id or loggedInUser.token is updated
  // https://svelte.dev/docs/svelte/$effect
  $effect(() => {
    if (id) {
      trailTrackerService.getTrailById(loggedInUser.token , id).then((data) => {
        currentTrail.trail = data || {} as Trail;
        console.log("current trail:");
        console.log(currentTrail.trail);
      });
    }
  });

  // automatically updates the subtitle when currentTrail changes
  $effect(() => {
    if (currentTrail.trail.title) {
      subTitle.text = `Editing Trail: ${currentTrail.trail.title}`;
    } else {
      subTitle.text = "Loading Trail...";
    }
  });
  
</script>

<Card title="Edit Trail">
  <!-- only render the form when the trail data is loaded (when the trail object has an _id) -->
  {#if currentTrail.trail && currentTrail.trail._id}
    <EditTrailForm />
  {:else}
    <p>Loading trail details...</p>
  {/if}
</Card>