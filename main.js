/* global L Papa */

/*
 * Script to display two tables from Google Sheets as point and geometry layers using Leaflet
 * The Sheets are then imported using PapaParse and overwrite the initially laded layers
 */

// the first is the geometry layer and the second the points
let geomURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8_4O-l9fGClAHY2cuI3_mmtI9Kd6TRfSBephRcnRLnBW31j61WdDpfJRb2-6E_LUfroPyuHFzyqOS/pub?output=csv";
let airbnbURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSdU62QZyz0TP7CZWm_KRwkfzsQ8Va_Rt_w40jHEe6nlqgKfR0wDrvmMXrQZN5VSoFWl5tiAI31pO3E/pub?output=csv";
let developmentURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSO2MSvOnLzYCM2wcJXy_qbYtjK_YWzM5DIqJ1C0V_kWewAm8X3VZ-7RBUdoNXzNaOcalr6ZV3KjiaW/pub?output=csv";


window.addEventListener("DOMContentLoaded", init);

let map;
let drGeojsonLayer;
let pvGeojsonLayer;
let pv2GeojsonLayer;
let pv3GeojsonLayer;
let pv4GeojsonLayer;
let pv5GeojsonLayer;
let pv6GeojsonLayer;
let pv7GeojsonLayer;
let pv8GeojsonLayer;
let dcGeojsonLayer;
let dc1GeojsonLayer;
let dc2GeojsonLayer;
let dc3GeojsonLayer;
let dc4GeojsonLayer;
let hmGeojsonLayer;
let hm1GeojsonLayer;
let hm2GeojsonLayer;
let airbnbLayer = L.layerGroup();
let developmentLayer = L.layerGroup();

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
    maxZoom: 20
}).addTo(map);

 map.on("click", function () {
    map.closePopup();
  });

  Papa.parse(geomURL, {
    download: true,
    header: true,
    complete: addGeoms,
  });

  Papa.parse(airbnbURL, {
    download: true,
    header: true,
    complete: addAirbnbPoints,
  });

  Papa.parse(developmentURL, {
    download: true,
    header: true,
    complete: addDevelopmentPoints,
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
  let fillColor = feature.properties.drcolor || "##bdbdbd";
  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 0.6,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStylePV(feature) {
  let fillColor = feature.properties.PVcolor || "##bdbdbd";
  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 0.6,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStylePV1(feature) {
  let fillColor = feature.properties.PV1color || "##bdbdbd";
  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 0.6,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStylePV2(feature) {
  let fillColor = feature.properties.PV2color || "##bdbdbd";
  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 0.6,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStylePV3(feature) {
  let fillColor = feature.properties.PV3color || "##bdbdbd";
  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 0.6,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStylePV4(feature) {
  let fillColor = feature.properties.PV4color || "##bdbdbd";
  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 0.6,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStylePV5(feature) {
  let fillColor = feature.properties.PV5color || "##bdbdbd";
  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 0.6,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStylePV6(feature) {
  let fillColor = feature.properties.PV6color || "##bdbdbd";
  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 0.6,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStylePV7(feature) {
  let fillColor = feature.properties.PV7color || "##bdbdbd";
  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 0.6,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStylePV8(feature) {
  let fillColor = feature.properties.PV8color || "##bdbdbd";
  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 0.6,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStyleDC(feature) {
  let fillColor = feature.properties.DCcolor || "##bdbdbd";
  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 0.6,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStyleDC1(feature) {
  let fillColor = feature.properties.DC1color || "##bdbdbd";
  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 0.6,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStyleDC2(feature) {
  let fillColor = feature.properties.DC2color || "##bdbdbd";
  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 0.6,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStyleDC3(feature) {
  let fillColor = feature.properties.DC3color || "##bdbdbd";
  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 0.6,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStyleDC4(feature) {
  let fillColor = feature.properties.DC4color || "##bdbdbd";
  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 0.6,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStyleHM(feature) {
  let fillColor = feature.properties.HMcolor || "##bdbdbd";
  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 0.6,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStyleHM1(feature) {
  let fillColor = feature.properties.HM1color || "##bdbdbd";
  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 0.6,
    color: 'white',
    fillOpacity: 0.8
  };
}

function geomStyleHM2(feature) {
  let fillColor = feature.properties.HM2color || "##bdbdbd";
  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 0.6,
    color: 'white',
    fillOpacity: 0.8
  };
}

  let geomHoverStyle = { color: "black", weight: 0 };



/*
* Layers
*/

  // Displacement Risk
  drGeojsonLayer = L.geoJSON(fc, {
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
                  <tr>
                  <td><strong>Population Vulnerability:</strong></td>
                  <td>${e.target.feature.properties.PV}</td>
                  </tr> 
                  <tr>
                  <td><strong>Demographic Change:</strong></td>
                  <td>${e.target.feature.properties.DC}</td>
                  </tr>  
                  <tr>
                  <td><strong>Housing Market Status:</strong></td>
                  <td>${e.target.feature.properties.HM}</td>
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
  }).addTo(map);

    // Population Vulnerability
    pvGeojsonLayer = L.geoJSON(fc, {
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
                    <tr>
                        <td><strong>Percent Renters:</strong></td>
                        <td>${e.target.feature.properties.PV1rent}</td>
                    </tr>
                    <tr>
                        <td><strong>Percent PoC:</strong></td>
                        <td>${e.target.feature.properties.PV2poc}</td>
                    </tr>
                    <tr>
                        <td><strong>Percent Less than BA:</strong></td>
                        <td>${e.target.feature.properties.PV3highed}</td>
                    </tr>
                    <tr>
                        <td><strong>Income:</strong></td>
                        <td>${e.target.feature.properties.PV4income}</td>
                    </tr>
                    <tr>
                        <td><strong>Rent Burden:</strong></td>
                        <td>${e.target.feature.properties.PV5burden}</td>
                    </tr>
                    <tr>
                        <td><strong>Percent SNAP:</strong></td>
                        <td>${e.target.feature.properties.PV6snap}</td>
                    </tr>
                    <tr>
                        <td><strong>Percent Limited English:</strong></td>
                        <td>${e.target.feature.properties.PV7language}</td>
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
      style: geomStylePV,
    });

// Population Vulnerability - Indicator 1 - Renters
pv1GeojsonLayer = L.geoJSON(fc, {
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
pv2GeojsonLayer = L.geoJSON(fc, {
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
pv3GeojsonLayer = L.geoJSON(fc, {
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
pv4GeojsonLayer = L.geoJSON(fc, {
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
pv5GeojsonLayer = L.geoJSON(fc, {
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
pv6GeojsonLayer = L.geoJSON(fc, {
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
pv7GeojsonLayer = L.geoJSON(fc, {
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
pv8GeojsonLayer = L.geoJSON(fc, {
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



    // Demographic Change
    dcGeojsonLayer = L.geoJSON(fc, {
      onEachFeature: function (feature, layer) {
        layer.on({
          mouseout: function (e) {
               e.target.setStyle(geomStyleDC);
          },
          click: function (e) {
            var popupContent = `
                <table class="popup-table">
                    <tr>
                        <td><strong>ID:</strong></td>
                        <td>${e.target.feature.properties.id}</td>
                    </tr>
                    <tr>
                        <td><strong>Demographic Change:</strong></td>
                        <td>${e.target.feature.properties.DC}</td>
                    </tr>
                    <tr>
                    <td><strong>Percent Change White:</strong></td>
                    <td>${e.target.feature.properties.DC1white}</td>
                    </tr>
                    <tr>
                    <td><strong>Percent Change Income:</strong></td>
                    <td>${e.target.feature.properties.DC2income}</td>
                    </tr>
                    <tr>
                    <td><strong>Percent Change Higher Education:</strong></td>
                    <td>${e.target.feature.properties.DC3highed}</td>
                    </tr>
                    <tr>
                    <td><strong>Percent Change Ownership:</strong></td>
                    <td>${e.target.feature.properties.DC4own}</td>
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
      style: geomStyleDC,
    });

// Demographic Change - Indicator 1 - Percent Change White
dc1GeojsonLayer = L.geoJSON(fc, {
  onEachFeature: function (feature, layer) {
    layer.on({
      mouseout: function (e) {
           e.target.setStyle(geomStyleDC1);
      },
      click: function (e) {
        var popupContent = `
            <table class="popup-table">
                <tr>
                    <td><strong>ID:</strong></td>
                    <td>${e.target.feature.properties.id}</td>
                </tr>
                <tr>
                    <td><strong>Percent Change white:</strong></td>
                    <td>${e.target.feature.properties.DC1white}</td>
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
  style: geomStyleDC1,
});

// Demographic Change - Indicator 2 - Percent Change Income
dc2GeojsonLayer = L.geoJSON(fc, {
  onEachFeature: function (feature, layer) {
    layer.on({
      mouseout: function (e) {
           e.target.setStyle(geomStyleDC2);
      },
      click: function (e) {
        var popupContent = `
            <table class="popup-table">
                <tr>
                    <td><strong>ID:</strong></td>
                    <td>${e.target.feature.properties.id}</td>
                </tr>
                <tr>
                    <td><strong>Percent Change Income:</strong></td>
                    <td>${e.target.feature.properties.DC2income}</td>
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
  style: geomStyleDC2,
});

// Demographic Change - Indicator 3 - Percent Change Higher Education
dc3GeojsonLayer = L.geoJSON(fc, {
  onEachFeature: function (feature, layer) {
    layer.on({
      mouseout: function (e) {
           e.target.setStyle(geomStyleDC3);
      },
      click: function (e) {
        var popupContent = `
            <table class="popup-table">
                <tr>
                    <td><strong>ID:</strong></td>
                    <td>${e.target.feature.properties.id}</td>
                </tr>
                <tr>
                    <td><strong>Percent Change Higher Ed:</strong></td>
                    <td>${e.target.feature.properties.DC3highed}</td>
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
  style: geomStyleDC3,
});

// Demographic Change - Indicator 4 - Percent Change Owners
dc4GeojsonLayer = L.geoJSON(fc, {
  onEachFeature: function (feature, layer) {
    layer.on({
      mouseout: function (e) {
           e.target.setStyle(geomStyleDC4);
      },
      click: function (e) {
        var popupContent = `
            <table class="popup-table">
                <tr>
                    <td><strong>ID:</strong></td>
                    <td>${e.target.feature.properties.id}</td>
                </tr>
                <tr>
                    <td><strong>Percent Change Owners:</strong></td>
                    <td>${e.target.feature.properties.DC4own}</td>
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
  style: geomStyleDC4,
});

    // Housing Market
    hmGeojsonLayer = L.geoJSON(fc, {
      onEachFeature: function (feature, layer) {
        layer.on({
          mouseout: function (e) {
               e.target.setStyle(geomStyleHM);
          },
          click: function (e) {
            var popupContent = `
                <table class="popup-table">
                    <tr>
                        <td><strong>ID:</strong></td>
                        <td>${e.target.feature.properties.id}</td>
                    </tr>
                    <tr>
                        <td><strong>Housing Market Status:</strong></td>
                        <td>${e.target.feature.properties.HM}</td>
                    </tr>
                    <tr>
                        <td><strong>Home Value Type:</strong></td>
                        <td>${e.target.feature.properties.HM1hvt}</td>
                    </tr>
                    <tr>
                        <td><strong>Appreciation Type:</strong></td>
                        <td>${e.target.feature.properties.HM2at}</td>
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
      style: geomStyleHM,
    });

// Housing Market - Indicator 1 - Home Value Type
hm1GeojsonLayer = L.geoJSON(fc, {
  onEachFeature: function (feature, layer) {
    layer.on({
      mouseout: function (e) {
           e.target.setStyle(geomStyleHM1);
      },
      click: function (e) {
        var popupContent = `
            <table class="popup-table">
                <tr>
                    <td><strong>ID:</strong></td>
                    <td>${e.target.feature.properties.id}</td>
                </tr>
                <tr>
                    <td><strong>Home Value Type:</strong></td>
                    <td>${e.target.feature.properties.HM1hvt}</td>
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
  style: geomStyleHM1,
});

// Housing Market - Indicator 2 - Appreciation Type
hm2GeojsonLayer = L.geoJSON(fc, {
  onEachFeature: function (feature, layer) {
    layer.on({
      mouseout: function (e) {
           e.target.setStyle(geomStyleHM2);
      },
      click: function (e) {
        var popupContent = `
            <table class="popup-table">
                <tr>
                    <td><strong>ID:</strong></td>
                    <td>${e.target.feature.properties.id}</td>
                </tr>
                <tr>
                    <td><strong>Appreciation Type:</strong></td>
                    <td>${e.target.feature.properties.HM2at}</td>
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
  style: geomStyleHM2,
});


    addLayerControl();


})
}

/*
 * Add Airbnb points to the map
 */
function addAirbnbPoints(data) {
  data = data.data;

  // Marker radius
  // Wil be in pixels for circleMarker, metres for circle
  // Ignore for point
  let markerRadius = 2;

  for (let row = 0; row < data.length; row++) {
    let fillColor = data[row].color ? data[row].color : 'red'; // Check if color is defined, otherwise default to black
    let marker = L.circleMarker([data[row].lat, data[row].lon], {
      radius: markerRadius,
      fillColor: fillColor, // Fill color of the circle
      fillOpacity: 1, // Opacity of the circle
      stroke: false // Remove stroke
    });

    marker.addTo(airbnbLayer); // Add marker to Airbnb layer
  }
}

/*
 * Add development points to the map
 */
function addDevelopmentPoints(data) {
  data = data.data;

  // Marker radius
  // Wil be in pixels for circleMarker, metres for circle
  // Ignore for point
  let markerRadius = 2;

  for (let row = 0; row < data.length; row++) {
    let fillColor = data[row].color ? data[row].color : 'black'; // Check if color is defined, otherwise default to black
    let marker = L.circleMarker([data[row].lat, data[row].lon], {
      radius: markerRadius,
      fillColor: fillColor, // Fill color of the circle
      fillOpacity: 1, // Opacity of the circle
      stroke: false // Remove stroke
    });

    marker.addTo(developmentLayer); // Add marker to development layer
  }
}

/*
 * Add layer control
 */
function addLayerControl() {
  var baseMaps = {
    "<b>Displacement Risk</b>": drGeojsonLayer,
    "<b><i>1 Population Vulnerability</i></b>": pvGeojsonLayer,
    "1.1 Percent Renters": pv1GeojsonLayer,
    "1.2 Percent PoC": pv2GeojsonLayer,
    "1.3 Percent No Higher Ed": pv3GeojsonLayer,
    "1.4 Income": pv4GeojsonLayer,
    "1.5 Rent Burden": pv5GeojsonLayer,
    "1.6 Percent SNAP": pv6GeojsonLayer,
    "1.7 Percent Limited English": pv7GeojsonLayer,
    "1.8 Percent Single Parent": pv8GeojsonLayer,
    "<b><i>2 Demographic Change</i></b>": dcGeojsonLayer,
    "2.1 Percent Change White": dc1GeojsonLayer,
    "2.2 Percent Change Income": dc2GeojsonLayer,
    "2.3 Percent Change Education": dc3GeojsonLayer,
    "2.4 Percent Change Ownership": dc4GeojsonLayer,
    "<b><i>3 Housing Market</i></b>": hmGeojsonLayer,
    "3.1 Home Value Type": hm1GeojsonLayer,
    "3.2 Appreciation Type": hm2GeojsonLayer
  };

  // Create the control and add it to the map;
  var control = L.control.layers(baseMaps, null, { collapsed: false, position: 'topleft' });
  control.addTo(map);

  control.addOverlay(airbnbLayer, "Airbnb Sites");
  control.addOverlay(developmentLayer, "Development Sites");

  // Call the getContainer routine.
  var htmlObject = control.getContainer();

  // Get the desired parent node.
  var sidebar = document.getElementById('sidebar');

  // Finally append the control container to the sidebar.
  sidebar.appendChild(htmlObject);

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
