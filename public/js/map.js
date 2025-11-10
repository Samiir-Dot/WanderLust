
// mapboxgl.accessToken = mapToken;
 
// const map = new mapboxgl.Map({
//     container: 'map', // container ID
//     style:"mapbox://styles/mapbox/streets-v12",
//     center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
//     zoom: 9 // starting zoom
// });

// // console.log(coordinates);

// const marker = new mapboxgl.Marker({color:'red'})
//     .setLngLat(listing.geometry.coordinates) //listing.geometry.coordinates
//     .setPopup(new mapboxgl.Popup({offset:25})
//     .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking.<p>`))
//     .addTo(map);


//chatgpt version
mapboxgl.accessToken = mapToken;

const coordinates = listing.geometry.coordinates;

// Safety check: ensure valid coordinates
if (!coordinates || coordinates.length !== 2) {
  console.error("Invalid coordinates:", coordinates);
} else {
  const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,
    zoom: 9
  });

  // Ensure proper rendering after page load (especially when switching pages)
  map.on('load', () => {
    map.resize(); // Prevents rendering glitches

    // Add marker
    new mapboxgl.Marker({ color: 'red' })
      .setLngLat(coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(
            `<h4>${listing.title}</h4><p>Exact location will be provided after booking.</p>`
          )
      )
      .addTo(map);

    // Smoothly move to updated location
    map.flyTo({
      center: coordinates,
      zoom: 9,
      speed: 1.2,
      essential: true
    });
  });

  // Fix stale data by forcing reload if coordinates change
  window.addEventListener("pageshow", () => {
    map.flyTo({
      center: coordinates,
      zoom: 9,
      speed: 1.2
    });
  });
}
