export function formatDate(date, lang = 'kz') {
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  if (lang === 'en') {
    return `${mm}/${dd}/${yyyy}`;
  }
  return `${dd}.${mm}.${yyyy}`;
}

export function formatPhoneKZ(raw) {
  const digits = raw.replace(/\D/g, '');
  let phone = '';
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    phone = digits.slice(1);
  } else if (digits.length === 10) {
    phone = digits;
  } else {
    return null;
  }
  return `+7 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6, 8)} ${phone.slice(8, 10)}`;
}

export function formatMoneyKZT(value) {
  const num = Number(value);
  if (isNaN(num)) return '';
  const formatted = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(num);
  return `${formatted}\u00A0₸`;
}
