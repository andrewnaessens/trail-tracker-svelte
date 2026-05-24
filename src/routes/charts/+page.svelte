<script lang="ts">
  import { subTitle, currentTrails, currentCategories, loggedInUser } from "$lib/runes.svelte";
  import { trailTrackerService } from "$lib/services/trail-tracker-service";
  import Card from "$lib/ui/Card.svelte";
  import { onMount } from "svelte";
  // @ts-ignore
  import Chart from "svelte-frappe-charts";

  subTitle.text = "Trail Analytics";

  // chart data for distances (sum of km)
  let totalDistance = $state({
    labels: ["Easy", "Medium", "Difficult"],
    datasets: [{ values: [0, 0, 0] }]
  });

  // chart data for counts (number of trails)
  let trailCounts = $state({
    labels: ["Easy", "Medium", "Difficult"],
    datasets: [{ values: [0, 0, 0] }]
  });

  onMount(async () => {
    // update global runes with latest trails and categories
    await trailTrackerService.getUserCategories(loggedInUser.token, loggedInUser.userid);
    await trailTrackerService.getTrails(loggedInUser.token);

    // variables for calculation
    let dists = [0, 0, 0];
    let counts = [0, 0, 0];

    currentTrails.trails.forEach((trail) => {
      // for each trail find the category for that trail
      const category = currentCategories.categories.find(c => c._id === trail.categoryid);
      // convert category title tolowerCase for comparison
      const title = category?.title.toLowerCase();

      // do calculations based on which category the category title matches
      if (title === "easy") {
        dists[0] += trail.distance;
        counts[0]++;
      } else if (title === "medium") {
        dists[1] += trail.distance;
        counts[1]++;
      } else if (title === "difficult") {
        dists[2] += trail.distance;
        counts[2]++;
      }
    });

    // update both local states to draw charts with values
    totalDistance = { ...totalDistance, datasets: [{ values: dists }] };
    trailCounts = { ...trailCounts, datasets: [{ values: counts }] };
  });
</script>

<div class="columns is-multiline">
  <div class="column is-6">
    <Card title="Total Trail Distance By Category (km)">
      <div class="has-text-centered">
          <Chart data={totalDistance} type="pie" />
      </div>
    </Card>
  </div>

  <div class="column is-6">
    <Card title="Trail Count By Category">
      <div class="has-text-centered">
          <Chart data={trailCounts} type="bar" />
      </div>
    </Card>
  </div>
</div>
