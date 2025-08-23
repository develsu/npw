import Storage from './storage.js';
import { t, getLang } from './i18n.js';

const storage = new Storage('eco');

function baseCatalog() {
  return {
    kz: {
      active: [
        { id: 'service_agreement_start', title: 'Қызмет шарты Start', file: 'service_agreement_start.html', requiresSign: true, updatedAt: '2024-01-01', shortDesc: 'Start тарифі үшін шарт' },
        { id: 'service_agreement_standard', title: 'Қызмет шарты Standard', file: 'service_agreement_standard.html', requiresSign: true, updatedAt: '2024-01-01', shortDesc: 'Standard тарифі үшін шарт' },
        { id: 'service_agreement_enterprise', title: 'Қызмет шарты Enterprise', file: 'service_agreement_enterprise.html', requiresSign: true, updatedAt: '2024-01-01', shortDesc: 'Enterprise тарифі үшін шарт' },
        { id: 'rental_agreement', title: 'Жалдау шарты', file: 'rental_agreement.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Велосипедті жалдау' },
        { id: 'leasing_agreement', title: 'Лизинг шарты', file: 'leasing_agreement.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Лизинг шарттары' }
      ],
      warranty: [
        { id: 'warranty', title: 'Кепілдік шарттары', file: 'warranty.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Қызмет көрсету кепілдігі' }
      ],
      technical: [
        { id: 'handover_act', title: 'Қабылдау-тапсыру актісі', file: 'handover_act.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Велосипедті беру' },
        { id: 'maintenance_protocol', title: 'Техникалық қызмет актісі', file: 'maintenance_protocol.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Қызмет көрсету протоколы' },
        { id: 'terms', title: 'Пайдалану шарттары', file: 'terms.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Жалпы ережелер' },
        { id: 'privacy', title: 'Құпиялылық саясаты', file: 'privacy.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Деректерді қорғау' },
        { id: 'safety', title: 'Қауіпсіздік ережелері', file: 'safety.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Жолда қауіпсіздік' }
      ],
      financial: [
        { id: 'invoice_template', title: 'Шот үлгісі', file: 'invoice_template.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Төлем шоты' }
      ]
    },
    ru: {
      active: [
        { id: 'service_agreement_start', title: 'Договор обслуживания Start', file: 'service_agreement_start.html', requiresSign: true, updatedAt: '2024-01-01', shortDesc: 'Условия для тарифа Start' },
        { id: 'service_agreement_standard', title: 'Договор обслуживания Standard', file: 'service_agreement_standard.html', requiresSign: true, updatedAt: '2024-01-01', shortDesc: 'Условия для тарифа Standard' },
        { id: 'service_agreement_enterprise', title: 'Договор обслуживания Enterprise', file: 'service_agreement_enterprise.html', requiresSign: true, updatedAt: '2024-01-01', shortDesc: 'Условия для тарифа Enterprise' },
        { id: 'rental_agreement', title: 'Договор аренды', file: 'rental_agreement.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Аренда велосипеда' },
        { id: 'leasing_agreement', title: 'Договор лизинга', file: 'leasing_agreement.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Условия лизинга' }
      ],
      warranty: [
        { id: 'warranty', title: 'Условия гарантии', file: 'warranty.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Гарантийное обслуживание' }
      ],
      technical: [
        { id: 'handover_act', title: 'Акт приема-передачи', file: 'handover_act.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Передача велосипеда' },
        { id: 'maintenance_protocol', title: 'Акт технического обслуживания', file: 'maintenance_protocol.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Протокол ТО' },
        { id: 'terms', title: 'Пользовательское соглашение', file: 'terms.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Общие правила' },
        { id: 'privacy', title: 'Политика конфиденциальности', file: 'privacy.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Защита данных' },
        { id: 'safety', title: 'Правила безопасности', file: 'safety.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Безопасность на дороге' }
      ],
      financial: [
        { id: 'invoice_template', title: 'Шаблон счета', file: 'invoice_template.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Платежный счет' }
      ]
    },
    en: {
      active: [
        { id: 'service_agreement_start', title: 'Service Agreement Start', file: 'service_agreement_start.html', requiresSign: true, updatedAt: '2024-01-01', shortDesc: 'Terms for Start plan' },
        { id: 'service_agreement_standard', title: 'Service Agreement Standard', file: 'service_agreement_standard.html', requiresSign: true, updatedAt: '2024-01-01', shortDesc: 'Terms for Standard plan' },
        { id: 'service_agreement_enterprise', title: 'Service Agreement Enterprise', file: 'service_agreement_enterprise.html', requiresSign: true, updatedAt: '2024-01-01', shortDesc: 'Terms for Enterprise plan' },
        { id: 'rental_agreement', title: 'Rental Agreement', file: 'rental_agreement.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Bike rental' },
        { id: 'leasing_agreement', title: 'Leasing Agreement', file: 'leasing_agreement.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Leasing terms' }
      ],
      warranty: [
        { id: 'warranty', title: 'Warranty Terms', file: 'warranty.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Service warranty' }
      ],
      technical: [
        { id: 'handover_act', title: 'Handover Act', file: 'handover_act.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Bike handover' },
        { id: 'maintenance_protocol', title: 'Maintenance Protocol', file: 'maintenance_protocol.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Service protocol' },
        { id: 'terms', title: 'Terms of Use', file: 'terms.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'General rules' },
        { id: 'privacy', title: 'Privacy Policy', file: 'privacy.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Data protection' },
        { id: 'safety', title: 'Safety Rules', file: 'safety.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Road safety' }
      ],
      financial: [
        { id: 'invoice_template', title: 'Invoice Template', file: 'invoice_template.html', requiresSign: false, updatedAt: '2024-01-01', shortDesc: 'Payment invoice' }
      ]
    }
  };
}

export function getCatalog(lang = getLang()) {
  const catalog = baseCatalog();
  return catalog[lang] || catalog.en;
}

export function markSigned(docId, dataURL, tsISO, lang = getLang()) {
  const sigs = storage.get('docs.signatures', {});
  sigs[docId] = { dataURL, tsISO, lang };
  storage.set('docs.signatures', sigs);
}

export function isSigned(docId) {
  const sigs = storage.get('docs.signatures', {});
  if (sigs[docId]) return { signed: true, ...sigs[docId] };
  return { signed: false };
}

export default { getCatalog, markSigned, isSigned };
