/* global L Papa */

/*
 * Script to display two tables from Google Sheets as point and geometry layers using Leaflet
 * The Sheets are then imported using PapaParse and overwrite the initially laded layers
 */

// the first is the geometry layer and the second the points
let geomURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8_4O-l9fGClAHY2cuI3_mmtI9Kd6TRfSBephRcnRLnBW31j61WdDpfJRb2-6E_LUfroPyuHFzyqOS/pub?output=csv";

window.addEventListener("DOMContentLoaded", init);

let map;

/*
 * init() is called when the page has loaded
 */

function init() {

  // Create Map, Center on Santa Cruz
  var mapOptions = {
    center: [37.06961402113251, -121.85643431204376],
    zoom: 11,
    zoomControl: false
  }
 map = L.map('map', mapOptions);

  // add Zoom Control
  L.control.zoom({
    position: 'bottomright'
  }).addTo(map);

  // add Basemap (Carto Positron)
  var geographyBasemap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  var labelsBasemap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 16
}).addTo(map);

  map.on("click", function () {
    map.closePopup();
  });

  Papa.parse(geomURL, {
    download: true,
    header: true,
    complete: addGeoms,
  });

}


/*
 * Load Geometry Column
 */

function addGeoms(data) {
  data = data.data;

  let fc = {
    type: "FeatureCollection",
    features: [],
  };

  let promises = [];

  for (let row in data) {
    if (data[row].include == "y") {
      let geojsonUrl = data[row].geometry;
      let promise = fetch(geojsonUrl)
        .then(response => response.json())
        .then(geojsonData => {
          if (geojsonData.features && Array.isArray(geojsonData.features)) {
            geojsonData.features.forEach((feature) => {
              let properties = {

                // General Info
                id: data[row].id,

                // Displacement Risk
                dr: data[row].dr,
                drcolor: data[row].drcolor,

                // Population Vulnerability (PV)
                PV: data[row].pv,
                PVcolor: data[row].pvcolor,
                PV1rent: data[row].pv1rent,
                PV1color: data[row].pv1color,
                PV2poc: data[row].pv2poc,
                PV2color: data[row].pv2color,
                PV3highed: data[row].pv3highed,
                PV3color: data[row].pv3color,
                PV4income: data[row].pv4income,
                PV4color: data[row].pv4color,
                PV5burden: data[row].pv5burden,
                PV5color: data[row].pv5color,
                PV6snap: data[row].pv6snap,
                PV6color: data[row].pv6color,
                PV7language: data[row].pv7language,
                PV7color: data[row].pv7color,
                PV8single: data[row].pv8single,
                PV8color: data[row].pv8color,

                // Demographic Change (DC)
                DC: data[row].dc,
                DCcolor: data[row].dccolor,
                DC1white: data[row].dc1white,
                DC1color: data[row].dc1color,
                DC2income: data[row].dc2income,
                DC2color: data[row].dc2color,
                DC3highed: data[row].dc3highed,
                DC3color: data[row].dc3color,
                DC4own: data[row].dc4own,
                DC4color: data[row].dc4color,

                // Housing Market Status (HM)
                HM: data[row].hm,
                HMcolor: data[row].hmcolor,
                HM1hvt: data[row].hm1hvt,
                HM1color: data[row].hm1color,
                HM2at: data[row].hm2at,
                HM2color: data[row].hm2color,

              };

              let newFeature = {
                type: "Feature",
                geometry: feature.geometry,
                properties: properties,
              };
              fc.features.push(newFeature);
            });
          } else {
            console.error("Features array is missing or invalid in GeoJSON data fetched from the external URL.");
          }
        });

      promises.push(promise);
    }
  }

  Promise.all(promises).then(() => {
    console.log(fc);

    
    
/*
* Styling
*/

function geomStyleDR(feature) {
  let fillColor = feature.properties.drcolor || "#bdbdbd";
  return {
    fillColor: fillColor,
    weight: 0,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStylePV(feature) {
  let fillColor = feature.properties.PVcolor || "#bdbdbd";
  return {
    fillColor: fillColor,
    weight: 0,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStylePV1(feature) {
  let fillColor = feature.properties.PV1color || "#bdbdbd";
  return {
    fillColor: fillColor,
    weight: 0,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStylePV2(feature) {
  let fillColor = feature.properties.PV2color || "#bdbdbd";
  return {
    fillColor: fillColor,
    weight: 0,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStylePV3(feature) {
  let fillColor = feature.properties.PV3color || "#bdbdbd";
  return {
    fillColor: fillColor,
    weight: 0,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStylePV4(feature) {
  let fillColor = feature.properties.PV4color || "#bdbdbd";
  return {
    fillColor: fillColor,
    weight: 0,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStylePV5(feature) {
  let fillColor = feature.properties.PV5color || "#bdbdbd";
  return {
    fillColor: fillColor,
    weight: 0,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStylePV6(feature) {
  let fillColor = feature.properties.PV6color || "#bdbdbd";
  return {
    fillColor: fillColor,
    weight: 0,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStylePV7(feature) {
  let fillColor = feature.properties.PV7color || "#bdbdbd";
  return {
    fillColor: fillColor,
    weight: 0,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStylePV8(feature) {
  let fillColor = feature.properties.PV8color || "#bdbdbd";
  return {
    fillColor: fillColor,
    weight: 0,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStyleDC(feature) {
  let fillColor = feature.properties.DCcolor || "#bdbdbd";
  return {
    fillColor: fillColor,
    weight: 0,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStyleHM(feature) {
  let fillColor = feature.properties.HMcolor || "#bdbdbd";
  return {
    fillColor: fillColor,
    weight: 0,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8
  };
}

  let geomHoverStyle = { color: "black", weight: 0 };



/*
* Layers
*/

  // Displacement Risk
  let drGeojsonLayer = L.geoJSON(fc, {
    onEachFeature: function (feature, layer) {
      layer.on({
        mouseout: function (e) {
             e.target.setStyle(geomStyleDR);
        },
        click: function (e) {
          // Create the popup content with table formatting
          var popupContent = `
              <table class="popup-table">
                  <tr>
                      <td><strong>ID:</strong></td>
                      <td>${e.target.feature.properties.id}</td>
                  </tr>
                  <tr>
                      <td><strong>Displacement Risk:</strong></td>
                      <td>${e.target.feature.properties.dr}</td>
                  </tr>
              </table>
          `;
      
          // Bind the formatted popup content to the target feature and open the popup
          e.target.bindPopup(popupContent).openPopup();
      
          // Prevent propagation of the click event
          L.DomEvent.stopPropagation(e);
      },
      });
    },
    style: geomStyleDR,
  });drGeojsonLayer.addTo(map);

    // Population Vulnerability
    let pvGeojsonLayer = L.geoJSON(fc, {
      onEachFeature: function (feature, layer) {
        layer.on({
          mouseout: function (e) {
               e.target.setStyle(geomStylePV);
          },
          click: function (e) {
            var popupContent = `
                <table class="popup-table">
                    <tr>
                        <td><strong>ID:</strong></td>
                        <td>${e.target.feature.properties.id}</td>
                    </tr>
                    <tr>
                        <td><strong>Population Vulnerability:</strong></td>
                        <td>${e.target.feature.properties.PV}</td>
                    </tr>
                </table>
            `;
        
            // Bind the formatted popup content to the target feature and open the popup
            e.target.bindPopup(popupContent).openPopup();
        
            // Prevent propagation of the click event
            L.DomEvent.stopPropagation(e);
        },
        });
      },
      style: geomStylePV,
    });

// Population Vulnerability - Indicator 1 - Renters
let pv1GeojsonLayer = L.geoJSON(fc, {
  onEachFeature: function (feature, layer) {
    layer.on({
      mouseout: function (e) {
           e.target.setStyle(geomStylePV1);
      },
      click: function (e) {
        var popupContent = `
            <table class="popup-table">
                <tr>
                    <td><strong>ID:</strong></td>
                    <td>${e.target.feature.properties.id}</td>
                </tr>
                <tr>
                    <td><strong>Percent Renters:</strong></td>
                    <td>${e.target.feature.properties.PV1rent}</td>
                </tr>
            </table>
        `;
    
        // Bind the formatted popup content to the target feature and open the popup
        e.target.bindPopup(popupContent).openPopup();
    
        // Prevent propagation of the click event
        L.DomEvent.stopPropagation(e);
    },
    });
  },
  style: geomStylePV1,
});

// Population Vulnerability - Indicator 2 - PoC
let pv2GeojsonLayer = L.geoJSON(fc, {
  onEachFeature: function (feature, layer) {
    layer.on({
      mouseout: function (e) {
           e.target.setStyle(geomStylePV2);
      },
      click: function (e) {
        var popupContent = `
            <table class="popup-table">
                <tr>
                    <td><strong>ID:</strong></td>
                    <td>${e.target.feature.properties.id}</td>
                </tr>
                <tr>
                    <td><strong>Percent People of Color:</strong></td>
                    <td>${e.target.feature.properties.PV2poc}</td>
                </tr>
            </table>
        `;
    
        // Bind the formatted popup content to the target feature and open the popup
        e.target.bindPopup(popupContent).openPopup();
    
        // Prevent propagation of the click event
        L.DomEvent.stopPropagation(e);
    },
    });
  },
  style: geomStylePV2,
});

// Population Vulnerability - Indicator 3 - Higher Education
let pv3GeojsonLayer = L.geoJSON(fc, {
  onEachFeature: function (feature, layer) {
    layer.on({
      mouseout: function (e) {
           e.target.setStyle(geomStylePV3);
      },
      click: function (e) {
        var popupContent = `
            <table class="popup-table">
                <tr>
                    <td><strong>ID:</strong></td>
                    <td>${e.target.feature.properties.id}</td>
                </tr>
                <tr>
                    <td><strong>Percent without BA:</strong></td>
                    <td>${e.target.feature.properties.PV3highed}</td>
                </tr>
            </table>
        `;
    
        // Bind the formatted popup content to the target feature and open the popup
        e.target.bindPopup(popupContent).openPopup();
    
        // Prevent propagation of the click event
        L.DomEvent.stopPropagation(e);
    },
    });
  },
  style: geomStylePV3,
});

// Population Vulnerability - Indicator 4 - Income
let pv4GeojsonLayer = L.geoJSON(fc, {
  onEachFeature: function (feature, layer) {
    layer.on({
      mouseout: function (e) {
           e.target.setStyle(geomStylePV4);
      },
      click: function (e) {
        var popupContent = `
            <table class="popup-table">
                <tr>
                    <td><strong>ID:</strong></td>
                    <td>${e.target.feature.properties.id}</td>
                </tr>
                <tr>
                    <td><strong>Income:</strong></td>
                    <td>${e.target.feature.properties.PV4income}</td>
                </tr>
            </table>
        `;
    
        // Bind the formatted popup content to the target feature and open the popup
        e.target.bindPopup(popupContent).openPopup();
    
        // Prevent propagation of the click event
        L.DomEvent.stopPropagation(e);
    },
    });
  },
  style: geomStylePV4,
});

// Population Vulnerability - Indicator 5 - Rent Burden
let pv5GeojsonLayer = L.geoJSON(fc, {
  onEachFeature: function (feature, layer) {
    layer.on({
      mouseout: function (e) {
           e.target.setStyle(geomStylePV5);
      },
      click: function (e) {
        var popupContent = `
            <table class="popup-table">
                <tr>
                    <td><strong>ID:</strong></td>
                    <td>${e.target.feature.properties.id}</td>
                </tr>
                <tr>
                    <td><strong>Rent Burden:</strong></td>
                    <td>${e.target.feature.properties.PV5burden}</td>
                </tr>
            </table>
        `;
    
        // Bind the formatted popup content to the target feature and open the popup
        e.target.bindPopup(popupContent).openPopup();
    
        // Prevent propagation of the click event
        L.DomEvent.stopPropagation(e);
    },
    });
  },
  style: geomStylePV5,
});

// Population Vulnerability - Indicator 6 - SNAP
let pv6GeojsonLayer = L.geoJSON(fc, {
  onEachFeature: function (feature, layer) {
    layer.on({
      mouseout: function (e) {
           e.target.setStyle(geomStylePV6);
      },
      click: function (e) {
        var popupContent = `
            <table class="popup-table">
                <tr>
                    <td><strong>ID:</strong></td>
                    <td>${e.target.feature.properties.id}</td>
                </tr>
                <tr>
                    <td><strong>Percent SNAP:</strong></td>
                    <td>${e.target.feature.properties.PV6snap}</td>
                </tr>
            </table>
        `;
    
        // Bind the formatted popup content to the target feature and open the popup
        e.target.bindPopup(popupContent).openPopup();
    
        // Prevent propagation of the click event
        L.DomEvent.stopPropagation(e);
    },
    });
  },
  style: geomStylePV6,
});

// Population Vulnerability - Indicator 7 - Limited English
let pv7GeojsonLayer = L.geoJSON(fc, {
  onEachFeature: function (feature, layer) {
    layer.on({
      mouseout: function (e) {
           e.target.setStyle(geomStylePV7);
      },
      click: function (e) {
        var popupContent = `
            <table class="popup-table">
                <tr>
                    <td><strong>ID:</strong></td>
                    <td>${e.target.feature.properties.id}</td>
                </tr>
                <tr>
                    <td><strong>Percent Limited English:</strong></td>
                    <td>${e.target.feature.properties.PV7language}</td>
                </tr>
            </table>
        `;
    
        // Bind the formatted popup content to the target feature and open the popup
        e.target.bindPopup(popupContent).openPopup();
    
        // Prevent propagation of the click event
        L.DomEvent.stopPropagation(e);
    },
    });
  },
  style: geomStylePV7,
});

// Population Vulnerability - Indicator 8 - Single Parents
let pv8GeojsonLayer = L.geoJSON(fc, {
  onEachFeature: function (feature, layer) {
    layer.on({
      mouseout: function (e) {
           e.target.setStyle(geomStylePV8);
      },
      click: function (e) {
        var popupContent = `
            <table class="popup-table">
                <tr>
                    <td><strong>ID:</strong></td>
                    <td>${e.target.feature.properties.id}</td>
                </tr>
                <tr>
                    <td><strong>Percent Single Parent Households:</strong></td>
                    <td>${e.target.feature.properties.PV8single}</td>
                </tr>
            </table>
        `;
    
        // Bind the formatted popup content to the target feature and open the popup
        e.target.bindPopup(popupContent).openPopup();
    
        // Prevent propagation of the click event
        L.DomEvent.stopPropagation(e);
    },
    });
  },
  style: geomStylePV8,
});





var baseMaps = {
    "Displacement Risk": drGeojsonLayer,
    "1 Population Vulnerability": pvGeojsonLayer,
    "1.1 Percent Renters": pv1GeojsonLayer,
    "1.2 Percent PoC": pv2GeojsonLayer,
    "1.3 Percent No Higher Ed": pv3GeojsonLayer,
    "1.4 Income": pv4GeojsonLayer,
    "1.5 Rent Burden": pv5GeojsonLayer,
    "1.6 Percent SNAP": pv6GeojsonLayer,
    "1.7 Percent Limited English": pv7GeojsonLayer,
    "1.8 Percent Single Parent": pv8GeojsonLayer

  };


// Create the control and add it to the map;
var control = L.control.layers(baseMaps, null, { collapsed: false, position: 'topleft' });
control.addTo(map);

// Call the getContainer routine.
var htmlObject = control.getContainer();
 
// Get the desired parent node.
var sidebar = document.getElementById('sidebar');

// Finally append the control container to the sidebar.
sidebar.appendChild(htmlObject);

})
}


/*
 * addPoints is a bit simpler, as no GeoJSON is needed for the points
 */
function addPoints(data) {
  data = data.data;
  let pointGroupLayer = L.layerGroup().addTo(map);

  // Choose marker type. Options are:
  // (these are case-sensitive, defaults to marker!)
  // marker: standard point with an icon
  // circleMarker: a circle with a radius set in pixels
  // circle: a circle with a radius set in meters
  let markerType = "marker";

  // Marker radius
  // Wil be in pixels for circleMarker, metres for circle
  // Ignore for point
  let markerRadius = 100;

  for (let row = 0; row < data.length; row++) {
    let marker;
    if (markerType == "circleMarker") {
      marker = L.circleMarker([data[row].lat, data[row].lon], {
        radius: markerRadius,
      });
    } else if (markerType == "circle") {
      marker = L.circle([data[row].lat, data[row].lon], {
        radius: markerRadius,
      });
    } else {
      marker = L.marker([data[row].lat, data[row].lon]);
    }
    marker.addTo(pointGroupLayer);

    // AwesomeMarkers is used to create fancier icons
    let icon = L.AwesomeMarkers.icon({
      icon: "info-circle",
      iconColor: "white",
      markerColor: data[row].color,
      prefix: "fa",
      extraClasses: "fa-rotate-0",
    });
    if (!markerType.includes("circle")) {
      marker.setIcon(icon);
    }
  }
}

/*
 * Accepts any GeoJSON-ish object and returns an Array of
 * GeoJSON Features. Attempts to guess the geometry type
 * when a bare coordinates Array is supplied.
 */
function parseGeom(gj) {
  // FeatureCollection
  if (gj.type == "FeatureCollection") {
    return gj.features;
  }

  // Feature
  else if (gj.type == "Feature") {
    return [gj];
  }

  // Geometry
  else if ("type" in gj) {
    return [{ type: "Feature", geometry: gj }];
  }

  // Coordinates
  else {
    let type;
    if (typeof gj[0] == "number") {
      type = "Point";
    } else if (typeof gj[0][0] == "number") {
      type = "LineString";
    } else if (typeof gj[0][0][0] == "number") {
      type = "Polygon";
    } else {
      type = "MultiPolygon";
    }
    return [{ type: "Feature", geometry: { type: type, coordinates: gj } }];
  }
}
