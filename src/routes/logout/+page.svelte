<script lang="ts">
  import { goto } from "$app/navigation";
  import { trailTrackerService } from "$lib/services/trail-tracker-service";

  trailTrackerService.clearSession();
  goto("/");
</script>


<!-- <script lang="ts">
  import { goto } from "$app/navigation";
  import { loggedInUser } from "$lib/runes.svelte";

  loggedInUser.email = "";
  loggedInUser.name = "";
  loggedInUser.token = "";
  loggedInUser.userid = "";
  localStorage.removeItem("trailtracker");
  goto("/");
</script> -->
