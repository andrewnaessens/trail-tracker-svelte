<script lang="ts">
  import { subTitle} from "$lib/runes.svelte";
  subTitle.text = "About"
</script>

<section class="section">
  <div class="box columns is-centered mt-4">
    <div class="column is-half has-text-centered">
      <h1 class="title is-4"> Hello from Trail Tracker </h1>
      <span class="icon mr-3"><i class="fas fa-map-marker-alt fa-lg" style="color: rgb(99, 230, 190);"></i></span>
      <span class="icon mr-3"><i class="fas fa-hiking fa-lg" style="color: rgb(99, 230, 190);"></i></span>
      <span class="icon mr-2"><i class="fas fa-tree fa-lg" style="color: rgb(99, 230, 190);"></i></span>
      <hr >
      <p>Trail Tracker is a hiking trail web app for listing trail information. </p>
      <hr >
    </div>
    <div class="column is-half has-text-centered">
      <img alt="Trail Tracker" src="/trail.png" width="300" />
    </div>
  </div>
</section>
<section class="section box has-text-centered">
  <h2>Image References:</h2>
  <p>Trail logo</p>
  <a href="https://www.flaticon.com/free-icons/hiking" title="hiking icons">Hiking icons created by Freepik - Flaticon</a>
</section>
