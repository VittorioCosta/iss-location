// npm i bulma npm i react-leaflet leaflet
// api http://open-notify.org/

import './App.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker,Popup } from 'react-leaflet'
import { useState, useEffect } from 'react';

const markesISS = new L.icon({

  iconUrl: 'iss.png',     // from public
  iconSize:[150, 130],
  iconAnchor: [25, 16]

})

function App() {

  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState([0, 0])
  const [map, setMap] = useState(null)

  useEffect( ()=>{

    const fetcData = async ()=> {

      const response = await fetch('http://api.open-notify.org/iss-now.json')
      const result = await response.json()
      const data = [

        result.iss_position.latitude,
        result.iss_position.longitude
      ]

      if(loading){setLoading(false)}

      if(map) {

        map.flyTo(data) 
      }
  
      setLocation(data)
      
    }
    
    // intervall va in conflitto con useeff, si risolve cosi
    const intervall = setInterval(() => {fetcData()}, 5000);
    return ()=> clearInterval(intervall)
    
    // eslint-disable-next-line
  },[map, location])

  return (
    
    <div className='container'>
      <section className='section'>
        <h1 className='title'>Where is sthe ISS?</h1>
        {loading && <h2 className='subtitle'>loading...</h2>}

        <div className='box'>
          Current Position: {location[0]}, {location[1]}  
        </div>'

        {/* per funzionare dare un altezza nel css a .leaflet-container */}
         {/* whenCreated aggiunto per il FLY TO */}
        <MapContainer center={[0, 0]} zoom={4} scrollWheelZoom={false} whenCreated={setMap}>
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={location} icon={markesISS}>
            <Popup>
              Hello form ISS!
            </Popup>
          </Marker>
        </MapContainer>
      </section>
    </div>
  );
}

export default App;
