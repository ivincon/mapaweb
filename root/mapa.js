map = L.map('map').setView([-33.505, -57], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});
googleSat.addTo(map);


L.control.zoom({position: "topright"}).addTo(map);


// Menu desplegable seleccion
document.getElementById('select-location').addEventListener('change', function(e){
    let coords = e.target.value.split(",");
    map.flyTo(coords,18);
});


// Agregar control para ver los datos al pasar el puntero

var info = L.control();

// Crear un div con una clase info
info.onAdd = function(map){
    this._div = L.DomUtil.create('div','info');
    this.update();
    return this._div;
};

// Agregar el metodo que actualiza el control segun el puntero vaya pasando
info.update = function(props){
    this._div.innerHTML = '<h4>CODCOMP</h4>' + 
                            (props ? '<b>' + props.CODCOMP + '</b><br/>' + ' NomLoc:</sup>' + props.NOMBLOC 
                            : 'Pase el puntero');
};
info.addTo(map);



// Generar rangos de colores de acuerdo con el atributo o campo CODCOMP
function getColor(d){
    return  d > 9000 ? '#d7191c' :
            d > 7500 ? '#d7191c' :
            d > 6000 ? '#d7191c' :
            d > 4500 ? '#d7191c' :
            d > 2500 ? '#d7191c' :
            d > 1000 ? '#d7191c' :
            d > 0    ? '#d7191c' :
                       '#d7191c';
};

// Crear la funcion para mostrar la simbologia de acuerdo al campo CODCOMP

function style(feature){
    return {
        fillColor: getColor(feature.properties.CODCOMP),
        weight: 2,
        opacity: 100,
        color: 'red',
        dashArray: '20',
        fillOpacity: 0,
        
    };
}


// AGregar interaccion del puntero con la capa para resaltar el objeto

        // resaltar
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#900',
        dashArray: '',
        fillOpacity: 0
    });

    info.update(layer.feature.properties);
}

// Configurar los cambios de resaltado y zoom de la capa

var zonasCJS;

         // reset de resaltar
function resetHighlight(e){
            //reset Style
    zonasCJS.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e){
    // adaptar              //obtener
    map.fitBounds(e.target.getBounds());
}
        // una función que se llama en cada característica antes de agregarla a una capa GeoJSON . 
function onEachFeature(feature, layer){
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
    });
}




// Agregar capa en formato GeoJson
zonasCJS = L.geoJson(zonasC,{
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);