let $map = document.querySelector('#map')

class LeafletMp{

    constructor(){
        this.map = null
        this.bounds = []
    }

    async load(element){
        return new Promise((resolve, reject) =>{
            $script(['https://unpkg.com/leaflet@1.3.1/dist/leaflet.js', 'http://maps.stamen.com/js/tile.stamen.js?v1.3.0'], () =>{
                this.map = L.map(element, {scrollWheelZoom: false})
            
                L.tileLayer('//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 18,
                tileSize: 512,
                zoomOffset: -1,
            }).addTo(this.map)
            
           /* this.map.addLayer(new L.StamenTileLayer('watercolor', {
                detectRetina: true
            }))*/
            resolve()
            })
        })
    }

    addMarker(lat, lng, text){
        let point = [lat, lng]
        this.bounds.push(point)
        return new leafletMarker(point, text, this.map)
    }

    center () {
        this.map.fitBounds(this.bounds)
    }

}

class leafletMarker{
    constructor(point, text, map){
        this.text = text
        this.map = map
        this.popup = L.popup({
            autoClose: false,
            closeOnEscapeKey: false,
            closeOnClick: false,
            closeButton: false,
            className: 'marker',
            maxWidth: 400
        })
        .setLatLng(point)
        .setContent(text)
        .openOn(map)
    }

    setActive(){
        this.popup.getElement().classList.add('is-active')
    }

    UnsetActive(){
        this.popup.getElement().classList.remove('is-active')
    }

    addEventListener(event, cb){
        this.popup.addEventListener('add', () =>{
            this.popup.getElement().addEventListener(event, cb)
        })
    }

    setContent(text){
        this.popup.setContent(text)
        this.popup.getElement().classList.add('is-expended')
        this.popup.update()
    }

    resetContent(){
        this.popup.setContent(this.text)
        this.popup.getElement().classList.remove('is-expended')
        this.popup.update()
    }

    handleSetView(lat, lng){
        let pointe = [lat, lng]
        this.map.setView(pointe, 14)
    }
}

const initMap = async function(){
    let map = new LeafletMp()
    let hoverMarker = null
    let activeMarker = null
    let setAView = null
    await map.load($map)
    Array.from(document.querySelectorAll('.js-marker')).forEach((item) =>{
        let marker = map.addMarker(item.dataset.lat, item.dataset.lng, item.dataset.price + ' <small>depuis</small> ' + item.dataset.heure)
        item.addEventListener('mouseover', function(){
            if(hoverMarker !== null){
                hoverMarker.UnsetActive()
            }
            marker.setActive()
            hoverMarker = marker
        })
        item.addEventListener('click', function(){
            console.log('item', item.dataset)
            marker.handleSetView(item.dataset.lat, item.dataset.lng);
        })
        item.addEventListener('mouseleave', function(){
            if(hoverMarker !== null){
                hoverMarker.UnsetActive()
            }
        })
        marker.addEventListener('click', function(){
            if(activeMarker !== null){
                activeMarker.resetContent()
            }
            marker.setContent(item.innerHTML)
            activeMarker = marker
        })
    })
    map.center()
}

if($map !== null){
    initMap()
}

// let map = L.map('map').setView([51.505, -0.09], 13);

// L.tileLayer('//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//     maxZoom: 18,
//     tileSize: 512,
//     zoomOffset: -1,
// }).addTo(map);

// map.addLayer(new L.StamenTileLayer('watercolor', {
//     detectRetina: true
// }))

// L.popup()
//     .setLatLng([51.505, -0.09])
//     .setContent('<p>Hello world!<br />This is a nice popup.</p>')
//     .openOn(map);