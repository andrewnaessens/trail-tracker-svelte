<script lang="ts">
  import { goto } from "$app/navigation";
  import { trailTrackerService } from "$lib/services/trail-tracker-service";
  import Message from "$lib/ui/Message.svelte";
  import UserCredentials from "$lib/ui/UserCredentials.svelte";

  let email = $state("");
  let password = $state("");
  let message = $state("");

  async function login() {
    console.log(`attempting to log in email: ${email} with password: ${password}`);
    let session = await trailTrackerService.login(email, password);
    if (session) {
      // loggedInUser.email = email;
      // loggedInUser.name = session.name;
      // loggedInUser.token = session.token;
      // loggedInUser.userid = session.userid;
      // localStorage.trailtracker = JSON.stringify(loggedInUser);
      // console.log(`Session: ${JSON.stringify(session)}`);
      goto("/dashboard");
    } else {
      email = "";
      password = "";
      message = "Invalid Credentials";
    }
  }
</script>

{#if message}
  <Message {message} />
{/if}
<form on:submit|preventDefault={login}>
  <UserCredentials bind:email bind:password />
  <button class="button is-success is-fullwidth">Log In</button>
</form>
