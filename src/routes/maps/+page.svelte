<script lang="ts">
  import { subTitle } from "$lib/runes.svelte";
  import Card from "$lib/ui/Card.svelte";
  import LeafletMap from "$lib/ui/LeafletMap.svelte";
  import { refreshTrailTrackerMap } from "$lib/utils/map-utils";
  import { onMount } from "svelte";
  
  subTitle.text = "TrailTracker Geo Data";

  let map1: LeafletMap;
  let map2: LeafletMap;
  
  onMount(async () => {
    // call map util function
    await refreshTrailTrackerMap(map1);
    await refreshTrailTrackerMap(map2);
  });
</script>

<Card title="Trail Locations - Primary Map">
  <LeafletMap height={80} activeLayer="OpenTopoMap" bind:this={map1} />
</Card>

<Card title="Trail Locations - Secondary Map">
  <LeafletMap height={80} zoom={14} bind:this={map2} />
</Card>
