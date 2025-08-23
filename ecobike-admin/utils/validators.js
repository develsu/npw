export function isLat(v){ return v>=-90 && v<=90; }
export function isLng(v){ return v>=-180 && v<=180; }
export function isPrice(v){ return v>=0; }
export function isLimit(v){ return v>=0; }
export function isPhone(v){ return /^\+?\d{10,15}$/.test(v); }
