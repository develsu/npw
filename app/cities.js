export const cities = [
  { value: 'almaty', label: 'Алматы' },
  { value: 'astana', label: 'Астана' },
  { value: 'shymkent', label: 'Шымкент' },
  { value: 'aktobe', label: 'Актобе' },
  { value: 'karaganda', label: 'Караганда' },
  { value: 'pavlodar', label: 'Павлодар' },
  { value: 'ust-kamenogorsk', label: 'Усть-Каменогорск' },
  { value: 'taraz', label: 'Тараз' }
];

export function populateCitySelect(selectEl) {
  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city.value;
    option.textContent = city.label;
    selectEl.appendChild(option);
  });
}
