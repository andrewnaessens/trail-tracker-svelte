import { loggedInUser } from "$lib/runes.svelte";
import { trailTrackerService } from "$lib/services/trail-tracker-service";
import type { Trail } from "$lib/types/trail-tracker-types";
import type LeafletMap from "$lib/ui/LeafletMap.svelte";

export async function refreshTrailTrackerMap (map:LeafletMap) {
  if (!loggedInUser.token) trailTrackerService.restoreSession();
    
  const categoryIds = await trailTrackerService.getUserCategories(loggedInUser.token, loggedInUser.userid);
  
  if (map && categoryIds) {
    const categories = await Promise.all(
      categoryIds.map(category => trailTrackerService.getCategoryById(loggedInUser.token, category._id))
    );
    
    let lastTrail: Trail | null = null;
    const leaflet = await import("leaflet");
    const L = leaflet.default;

    categories.forEach((category) => {
      if (category && category.trails) {
        // create an array to hold markers for this category
        const categoryMarkers: any[] = [];

        category.trails.forEach((trail: Trail) => {
          const lat = Number(trail.lattitude);
          const lng = Number(trail.longitude);
          
          // ceate the marker object manually
          const marker = L.marker([lat, lng]);
          marker.bindPopup(`${trail.title} | ${trail.distance}km`);
          
          // add marker to category group
          categoryMarkers.push(marker);
          // keep track of the last trail
          lastTrail = trail;
        });

        // add the whole category as a togglable layer
        if (categoryMarkers.length > 0) {
          map.addCategoryLayer(category.title, categoryMarkers);
        }
      }
    });
    
    // move map view to last trail
    if (lastTrail) {
      map.moveTo(Number(lastTrail.lattitude), Number(lastTrail.longitude));
    }
  }
}