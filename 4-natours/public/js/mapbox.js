const locations = JSON.parse(document.getElementById('map').dataset.locations);

const map = new mapboxgl.Map({
  accessToken:
    '<key>',
  container: 'map',
  style: 'mapbox://styles/mohamedashrafece/cmway32li007601qt50id5963',
  scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((location) => {
  const el = document.createElement('div');
  el.className = 'marker';

  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(location.coordinates)
    .addTo(map);

  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(location.coordinates)
    .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
    .addTo(map);

  bounds.extend(location.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
