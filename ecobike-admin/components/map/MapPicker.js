export default async function MapPicker(lat,lng,onPick){
  if(!window.L){
    await new Promise((res,rej)=>{
      const link=document.createElement('link');link.rel='stylesheet';link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.appendChild(link);
      const s=document.createElement('script');s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';s.onload=res;s.onerror=rej;document.head.appendChild(s);
    });
  }
  const div=document.createElement('div');
  div.id='pick-map';div.style.height='300px';
  const modal=document.createElement('div');
  modal.appendChild(div);
  const m=L.map(div).setView([lat,lng],13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(m);
  const marker=L.marker([lat,lng]).addTo(m);
  m.on('click',e=>{marker.setLatLng(e.latlng);onPick(e.latlng);});
  return modal;
}
