<script lang="ts">
  import { subTitle } from "$lib/runes.svelte";
  import Card from "$lib/ui/Card.svelte";
  import CategoryForm from "./CategoryForm.svelte";
  import ListCategories from "../../lib/ui/ListCategories.svelte";
  import LeafletMap from "$lib/ui/LeafletMap.svelte";
  import { onMount } from "svelte";
  import { refreshTrailTrackerMap } from "$lib/utils/map-utils";
  
  subTitle.text = "Dashboard";
  // let categoryList: Category[] = $state([]);

  // onMount(async () => {
  //   categoryList = await trailTrackerService.getUserCategories(loggedInUser.token, loggedInUser.userid);
  //   // console.log(categoryList);
  // });
  let map: LeafletMap;

  onMount(async () => {
    // call map util function
    await refreshTrailTrackerMap(map);
  });
</script>

<h2 class="subtitle is- has-text-centered">Add a category to get started!</h2>


<div class="columns">
  <div class="column">
    <Card title="Create Category">
      <CategoryForm />
    </Card>
  </div>
  <div class="column">
    <Card title="Categories">
      <ListCategories />
    </Card>
  </div>
</div>
<div class="box is-centered">
  <Card title="Trail Locations">
    <LeafletMap height={80} bind:this={map} />
  </Card>
</div>



