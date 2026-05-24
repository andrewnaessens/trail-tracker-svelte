<script lang="ts">
  import UserCredentials from "$lib/ui/UserCredentials.svelte";
  import UserDetails from "$lib/ui/UserDetails.svelte";
  import Message from "$lib/ui/Message.svelte";
  import { trailTrackerService } from "$lib/services/trail-tracker-service";
  import { sanitiseAlphaNumNoSpaces, sanitiseEmail, sanitisePassword } from "$lib/utils/sanitise";

  let firstName = $state("");
  let lastName = $state("");
  let email = $state("");
  let password = $state("");
  let message = $state("");

  async function signup() {
    // sanitise inputs by passing them to the sanitise util functions
    const sanitisedFirstName = sanitiseAlphaNumNoSpaces(firstName);
    const sanitisedLastName = sanitiseAlphaNumNoSpaces(lastName);
    const sanitisedEmail = sanitiseEmail(email);
    const sanitisedPassword = sanitisePassword(password);

    // update form fields with sanitised data
    firstName = sanitisedFirstName;
    lastName = sanitisedLastName;
    email = sanitisedEmail;

    // check that all required fields are filled out (check sanitised values)
    if (!sanitisedFirstName || !sanitisedLastName || !sanitisedEmail || !sanitisedPassword) {
      message = "Please fill in all details to sign up";
      return;
    } 
    // build newUser object with sanitised data
    const newUser = {
      firstName: sanitisedFirstName,
      lastName: sanitisedLastName,
      email: sanitisedEmail,
      password: sanitisedPassword
    };
    
    // pass the payload to trailTrackerService
    const success = await trailTrackerService.signup(newUser);

    if (success) {
      message = "Signed up successfully"

    } else {
      message = "Error Trying to sign up";
    }
  }
</script>

<div class="box">
  {#if message}
    <Message {message} />
  {/if}
  <UserDetails bind:firstName bind:lastName />
  <UserCredentials bind:email bind:password />
  <button onclick={() => signup()} class="button">Sign Up</button>
  <p class="has-text-centered">
    Already have an account? <a href="/login" data-cy="login-redirect">Login Here</a>
  </p>
</div>