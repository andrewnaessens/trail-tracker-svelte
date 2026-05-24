<script lang="ts">
  import { loggedInUser } from "$lib/runes.svelte";
  import { trailTrackerService } from "$lib/services/trail-tracker-service";
  import type { Category } from "$lib/types/trail-tracker-types";
  import { sanitiseAlphaNum } from "$lib/utils/sanitise";

  // import Coordinates from "$lib/ui/Coordinates.svelte";
  // import type { Category } from "$lib/types/donation-types";
  // const categoryList = [
  //   {
  //     title: "easy"
  //     // firstName: "Lisa",
  //     // lastName: "Simpson",
  //     // office: "President"
  //   },
  //   {
  //     title: "medium"
  //     // firstName: "Maggie",
  //     // lastName: "Simpson",
  //     // office: "President"
  //   },
  //   {
  //     title: "hard"
  //     // firstName: "Ned",
  //     // lastName: "Flanders",
  //     // office: "President"
  //   }
  // ];

  // let { categoryList = [] } = $props();

  let title = $state("Category Name");
  // let selectedCategory = $state("Easy");
  let message = $state("Create Category"); 
  // let difficultyLevel = ["easy", "medium", "difficult"];
  // let selectedLevel = $state("easy");
  // let lat = $state(52.160858);
  // let lng = $state(-7.15242);

  async function createCategory() {
    // console.log(categoryList);
    // console.log(`Created category: ${title}`);
    // console.log("Donate Form");
    // console.log(loggedInUser);

    // sanitise title by passing it to the sanitise util function
    const sanitisedTitle = sanitiseAlphaNum(title)
    
    // update title form field with sanitised title
    title = sanitisedTitle;
    
    // check that title field is filled out (check sanitised title)
    if (sanitisedTitle) {
      const category: Category = {
          title: sanitisedTitle,
          userid: loggedInUser.userid
      };
      const success = await trailTrackerService.createCategory(category, loggedInUser.token);
      
      if (!success) {
        message = "Category not created - some error occurred";
        return;
      }
      message = `Thanks! Created category: ${title}`;
      // Reset field back to default
      title = "Category Name";
    } else {
      message = "Please select a title";
    }
    // console.log(`Created category: ${title}, candidate: ${selectedCandidate}, difficulty: ${selectedLevel}`);
    // console.log(`lat: ${lat}, lng: ${lng}`);
  }
</script>

<div>
  <div class="field">
    <label class="label" for="category">Enter Category Name:</label>
    <input bind:value={title} class="input" id="title" name="title" type="string" />
  </div>
  <div class="field">
    <div class="control">
      <button onclick={() => createCategory()} class="button is-primary" aria-label="create">Create</button>
    </div>
  </div>
</div>
<div class="box mt-4">
  <div class="notification is-info is-light p-2 has-text-centered">
    {message}
  </div>
</div>