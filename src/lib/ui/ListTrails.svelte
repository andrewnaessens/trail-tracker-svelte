<script lang="ts">
  import { currentTrails, loggedInUser } from "$lib/runes.svelte";
  import { trailTrackerService } from "$lib/services/trail-tracker-service";
  import ImageUpload from "$lib/ui/ImageUpload.svelte";

  // accepts callback prop (onTrailCreation) from parent
  let { onTrailDeletion }: { onTrailDeletion?: () => Promise<void> } = $props();

  async function deleteTrail(id: string) {
      console.log("this id")
      console.log(id)
      const success = await trailTrackerService.deleteTrailById(loggedInUser.token, id);
      if (onTrailDeletion) {
          await onTrailDeletion();
        }
      return success;
    }
</script>

<div class="columns is-multiline">
  {#each currentTrails.trails as trail}
    <div class="column is-6-desktop is-6-tablet is-12-mobile">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">{trail.title}</p>
        </header>
        
        <div class="card-content pb-0">
          <div class="content">
            <p class="subtitle"> {trail.distance}km</p>
            <p><strong>Location:</strong> {trail.location}</p>
            <p>{trail.description}</p>
            <p>
              Lat: {trail.lattitude} | Long: {trail.longitude}
            </p>
          </div>
          <hr />
          <ImageUpload {trail} categoryId={trail.categoryid} />
        </div>

        <footer class="card-footer">
          <a href="/trail/{trail._id}" class="card-footer-item has-text-link">
            <span class="icon"><i class="fas fa-edit"></i></span> Edit
          </a>
          <button onclick={() => deleteTrail(trail._id)} class="card-footer-item has-text-danger is-ghost">
            <span class="icon"><i class="fas fa-trash"></i></span> Delete
          </button>
        </footer>
      </div>
    </div>
  {/each}
</div>
