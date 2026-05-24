<script lang="ts">
  import { loggedInUser } from "$lib/runes.svelte";
  import { trailTrackerService } from "$lib/services/trail-tracker-service";
  import Heading from "$lib/ui/Heading.svelte";
  import Menu from "$lib/ui/Menu.svelte";
  import { onMount } from "svelte";

  onMount(async () => {
    await trailTrackerService.restoreSession();
  });

  // if (browser) {
  //   const savedLoggedInUser = localStorage.trailtracker;
  //   if (savedLoggedInUser) {
  //     const session = JSON.parse(savedLoggedInUser);
  //     loggedInUser.email = session.email;
  //     loggedInUser.name = session.name;
  //     loggedInUser.token = session.token;
  //     loggedInUser.userid = session.userid;
  //   }
  // }
</script>

<div class="container">
  {#if loggedInUser.email}
    <Menu />
    <Heading />
  {/if}
  <slot />
</div>
