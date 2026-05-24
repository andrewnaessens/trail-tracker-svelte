<script lang="ts">
  let {title = "", children} = $props();
</script>

<div class="card mb-5">
  <header class="card-header">
    <p class="card-header-title">
      <span class="icon"><i class="fas fa-map-marker-alt fa-lg" style="color: rgb(99, 230, 190);"></i></span>
      <span class="icon mr-4"><i class="fas fa-hiking fa-lg" style="color: rgb(99, 230, 190);"></i></span>
      <span>{title}</span>
    </p>
  </header>
  <div class="card-content">
    <div class="content">
      {@render children()}
    </div>
  </div>
</div>
