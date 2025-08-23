export function isNameValid(fullName) {
  if (!fullName) return false;
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2 || parts.length > 4) return false;
  const re = /^[A-Za-zА-Яа-яЁёӘәӨөҒғҚқҢңІіҰұҮүҺһ\-]{2,}$/;
  return parts.every(p => re.test(p));
}

export function isEmailValid(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function checksum(iin) {
  const digits = iin.split('').map(d => parseInt(d));
  let s1 = 0;
  for (let i = 0; i < 11; i++) s1 += digits[i] * (i + 1);
  let c1 = s1 % 11;
  if (c1 < 10) return c1;
  let s2 = 0;
  for (let i = 0; i < 11; i++) s2 += digits[i] * (i + 2);
  let c2 = s2 % 11;
  return c2 === 10 ? 0 : c2;
}

export function extractDobFromIIN(iin) {
  if (!/^[0-9]{12}$/.test(iin)) return null;
  const yy = parseInt(iin.slice(0, 2), 10);
  const mm = parseInt(iin.slice(2, 4), 10);
  const dd = parseInt(iin.slice(4, 6), 10);
  const c = parseInt(iin[6], 10);
  let century;
  if (c === 1 || c === 2) century = 1900;
  else if (c === 3 || c === 4) century = 2000;
  else if (c === 5 || c === 6) century = 2100;
  else return null;
  const year = century + yy;
  const date = new Date(year, mm - 1, dd);
  if (date.getFullYear() !== year || date.getMonth() !== mm - 1 || date.getDate() !== dd) return null;
  return date.toISOString().slice(0, 10);
}

export function isIINValid(iin, dob) {
  if (!/^[0-9]{12}$/.test(iin)) return false;
  if (parseInt(iin[11], 10) !== checksum(iin)) return false;
  const derived = extractDobFromIIN(iin);
  if (!derived) return false;
  if (dob && derived !== dob) return false;
  return true;
}

export function isAdult(dob, minYears = 18) {
  if (!dob) return false;
  const birth = new Date(dob);
  if (Number.isNaN(birth)) return false;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age >= minYears;
}

export function isAddressValid(a) {
  return !!(a && a.region && a.street);
}

export default { isNameValid, isEmailValid, isIINValid, isAdult, isAddressValid, extractDobFromIIN };
