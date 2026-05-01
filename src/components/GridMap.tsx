import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MOCK_LISTINGS, EnergyListing } from '@/src/mockData';
import L from 'leaflet';

// Fix Leaflet icons
const icon = new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href;
const iconShadow = new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href;

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export function GridMap({ listings = MOCK_LISTINGS }: { listings?: EnergyListing[] }) {
  const center: [number, number] = listings[0]?.location || [6.4698, 3.5852];

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden relative border-2 border-slate-100 shadow-inner group">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {listings.map((listing) => (
          <React.Fragment key={listing.id}>
            <Marker position={listing.location}>
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-slate-900">{listing.sellerName}</h3>
                  <p className="text-sm text-slate-500">{listing.available} kWh Available</p>
                  <p className="text-emerald-600 font-semibold">₦{listing.price}/kWh</p>
                </div>
              </Popup>
            </Marker>
            {/* Energy radius */}
            <Circle 
              center={listing.location} 
              radius={2000} 
              pathOptions={{ 
                fillColor: listing.id === 'user' ? '#10B981' : '#3B82F6', 
                color: 'transparent',
                fillOpacity: 0.1 
              }} 
            />
            
            {/* Mock energy flows if user is nearby */}
            {listing.id !== 'user' && (
              <Polyline 
                positions={[[6.4600, 3.5900], listing.location]} 
                pathOptions={{ 
                  color: '#FACC15', 
                  weight: 2, 
                  dashArray: '10, 10',
                  opacity: 0.5 
                }}
                className="energy-beam"
              />
            )}
          </React.Fragment>
        ))}
      </MapContainer>
      
      <div className="absolute bottom-4 left-4 z-[1000] glass px-3 py-2 rounded-lg text-[10px] font-mono flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-primary" /> Active Nodes
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-energy-yellow" /> Energy Transfer
        </div>
      </div>
    </div>
  );
}

import React from 'react';
