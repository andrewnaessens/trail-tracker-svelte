<!-- src/lib/ui/LeafletMap.svelte -->
<script lang="ts">
  import "leaflet/dist/leaflet.css";
  import { onMount } from "svelte";
  import type { Map as LeafletMapInstance, Control } from "leaflet";
  
  let { 
    height = 80, 
    location = { lat: 53.2734, lng: -7.7783203 }, 
    zoom = 8, 
    minZoom = 7, 
    activeLayer = "Terrain" 
  } = $props();
  
  // dynamically generate an id so map1 and map2 are unique
  let id = `map-${crypto.randomUUID()}`;
  
  let imap: LeafletMapInstance;
  let control: Control.Layers;
  let overlays: Control.LayersObject = {};
  let baseLayers: any;
  let L: any;
  
  // add a marker to the map
  export async function addMarker(lat: number, lng: number, popupText: string) {
    const leaflet = await import("leaflet");
    L = leaflet.default;
    if (!imap) return;
    const marker = L.marker([lat, lng]).addTo(imap);
    const popup = L.popup({ autoClose: false, closeOnClick: false });
    popup.setContent(popupText);
    marker.bindPopup(popup);
  }

  // move the map view to specified coordinates
  export async function moveTo(lat: number, lng: number) {
    if (!imap) return;
    imap.flyTo({ lat, lng });
  }

  // add a layer based on a category to the map
  export async function addCategoryLayer(title: string, markerArray: any[]) {
    const leaflet = await import("leaflet");
    const L = leaflet.default;
    
    // create a Layer Group from the markers
    const group = L.layerGroup(markerArray);
    
    // add to map immediately
    group.addTo(imap);

    // add to the Layer Control
    control.addOverlay(group, title);
  }

  onMount(async () => {
    const leaflet = await import("leaflet");
    L = leaflet.default;
    
    baseLayers = {
      Terrain: leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 17,
        attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      }),
      Satellite: leaflet.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
      }
      ),
      OpenTopoMap: leaflet.tileLayer(
      'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
	      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      }),
      Stadia_StamenTerrain: leaflet.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 0,
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
      }),
    };
    
    let defaultLayer = baseLayers[activeLayer];
    imap = leaflet.map(id, {
      center: [location.lat, location.lng],
      zoom: zoom,
      minZoom: minZoom,
      layers: [defaultLayer]
    });
    
    control = leaflet.control.layers(baseLayers, overlays).addTo(imap);
  });
</script>

<div {id} class="box" style="height: {height}vh"></div>


<!-- <script lang="ts">
  import "leaflet/dist/leaflet.css";
  import { onMount } from "svelte";
  import { Map as LeafletMap, map, type Control } from "leaflet";
  
  let { height = 80 } = $props();
  let id = "home-map-id";
  let location = { lat: 53.2734, lng: -7.7783203 };
  let zoom = 8;
  let minZoom = 7;
  let activeLayer = "Terrain";
  
  let imap: LeafletMap;
  let control: Control.Layers;
  let overlays: Control.LayersObject = {};
  let baseLayers: any;
  let L: any;
  
  export async function addMarker(lat: number, lng: number, popupText: string) {
    const leaflet = await import("leaflet");
    L = leaflet.default;
    const marker = L.marker([lat, lng]).addTo(imap);
    const popup = L.popup({ autoClose: false, closeOnClick: false });
    popup.setContent(popupText);
    marker.bindPopup(popup);
  }

  // move the map view to specified coordinates
  export async function moveTo(lat: number, lng: number) {
    const leaflet = await import("leaflet");
    L = leaflet.default;
    imap.flyTo({lat: lat, lng: lng });
  }

  export async function addCategoryLayer(title: string, markerArray: any[]) {
    const leaflet = await import("leaflet");
    const L = leaflet.default;
    
    // create a Layer Group from the markers
    const group = L.layerGroup(markerArray);
    
    // add to map immediately
    group.addTo(imap);
    
    // add to the Layer Control
    control.addOverlay(group, title);
  }


  onMount(async () => {
    const leaflet = await import("leaflet");
    L = leaflet.default;
    baseLayers = {
      Terrain: leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 17,
        attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      }),
      Satellite: leaflet.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
      }
      ),
      OpenTopoMap: leaflet.tileLayer(
      'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
	      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      }),
      Stadia_StamenTerrain: leaflet.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.{ext}', {
        minZoom: 0,
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: 'png'
      }),
    };
    let defaultLayer = baseLayers[activeLayer];
    imap = leaflet.map(id, {
      center: [location.lat, location.lng],
      zoom: zoom,
      minZoom: minZoom,
      layers: [defaultLayer]
    });
    
    control = leaflet.control.layers(baseLayers, overlays).addTo(imap);
  });
</script>

<div {id} class="box" style="height: {height}vh"></div> -->
