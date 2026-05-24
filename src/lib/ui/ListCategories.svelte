<script lang="ts">
  // import { Category } from "$lib/types/donation-types";

  // let { categories = [
  //   {
  //     title: "easy",
  //     level: "easy",
  //     donor: "bart@simpson.com",
  //     candidate: { lastName: "Simpson", firstName: "Lisa" },
  //     lat: "52.161290",
  //     lng: "-7.51540"
  //   },
  //   {
  //     title: "medium",
  //     level: "medium",
  //     donor: "marge@simpson.com",
  //     candidate: { lastName: "Simpson", firstName: "maggie" },
  //     lat: "52.261290",
  //     lng: "-7.231540"
  //   },
  //   {
  //     title: "difficult",
  //     level: "difficult",
  //     donor: "homer@simpson.com",
  //     candidate: { lastName: "Flanders", firstName: "Ned" },
  //     lat: "52.361290",
  //     lng: "-7.241540"
  //   }
  // ] } = $props();

  // let { categoryList = [] } = $props();
  import { currentCategories, loggedInUser } from "$lib/runes.svelte";
  import { trailTrackerService } from "$lib/services/trail-tracker-service";


    async function deleteCategory(id: string) {
      console.log("this id")
      console.log(id)
      const success = await trailTrackerService.deleteCategoryById(loggedInUser.token, id);
      return success;
    }
</script>


{#each currentCategories.categories as category}
  <div class="box box-link-hover-shadow">
    <h2 class="title">
      {category.title}
    </h2>
    <hr >
    
    <!-- <p>
      Category ID: {category._id} <br /> 
      User ID: {category.userid}
    </p> -->
    <a href="/category/{category._id}" class="button is-primary" aria-label="open">
      Open
      <span></span>
      <span class="icon is-small">
        <i class="fas fa-folder-open"></i>
      </span>
    </a>
    <button onclick={() => deleteCategory(category._id)} class="button is-danger has-text-white" aria-label="delete">
      Delete 
      <span></span>
      <span class="icon is-small">
        <i class="fas fa-trash"></i>
      </span>
    </button>
    <!-- <a href="/api/categories/{category._id}" class="button" aria-label="delete" >
      <i class="fas fa-trash"></i>
    </a> -->
  </div>        
{/each}
