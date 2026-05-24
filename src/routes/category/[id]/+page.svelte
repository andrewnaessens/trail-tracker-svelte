<script lang="ts">
  import { page } from "$app/state";
  import { currentTrails, loggedInUser, subTitle} from "$lib/runes.svelte";
  import { trailTrackerService } from "$lib/services/trail-tracker-service";
  import type { Category, Trail } from "$lib/types/trail-tracker-types";
  import Card from "$lib/ui/Card.svelte";
  import TrailForm from "./TrailForm.svelte";
  import ListTrails from "$lib/ui/ListTrails.svelte";
  import { onMount } from "svelte";
  import LeafletMap from "$lib/ui/LeafletMap.svelte";
  import { refreshTrailTrackerMap } from "$lib/utils/map-utils";
  
  let id: string = $state(page.params.id || "");
  
  let category: Category | null;
  
  // loadTrails function to load trails - passed to child (TrailForm)
  async function loadTrails() {
    if (!id || !loggedInUser.token) return false;
    
    category = await trailTrackerService.getCategoryById(loggedInUser.token, id);
    
    if (category) {
      subTitle.text = `${category.title}`;
      // populate the global rune array
      currentTrails.trails = category.trails || [];
    } else {
      subTitle.text = "Loading Category...";
    }
  }
  
  // automatically runs again if id or loggedInUser.token changes
  // https://svelte.dev/docs/svelte/$effect
  $effect(() => {
    loadTrails();
  });
  
  let map1: LeafletMap;
  let map2: LeafletMap;
  
  onMount(async () => {
    // call map util function
    await refreshTrailTrackerMap(map1);
    await refreshTrailTrackerMap(map2);
  });
  
  function trailCreated(trail:Trail) {
    map1.addMarker(trail.lattitude, trail.longitude, "");
    map1.moveTo(trail.lattitude, trail.longitude);
    map2.addMarker(trail.lattitude, trail.longitude, "");
    map2.moveTo(trail.lattitude, trail.longitude);
  }
  
</script>

<div class="columns">
  <div class="column is-4">
    <Card title="Create Trail">
      <TrailForm {id} trailEvent={trailCreated} onTrailCreation={loadTrails}/>
    </Card>
  </div>
  <div class="column is-8">
    <Card title="Trails">
      <ListTrails trails={currentTrails.trails} onTrailDeletion={loadTrails}/>
    </Card>
  </div>
</div>
<div class="columns">
  <div class="column is-6">
    <Card title="Trail Locations - Primary Map">
      <LeafletMap height={60} activeLayer="OpenTopoMap" bind:this={map1} />
    </Card>
  </div>
  <div class="column is-6">
    <Card title="Trail Locations - Secondary Map">
      <LeafletMap height={60} zoom={14} bind:this={map2} />
    </Card>
  </div>
</div>


