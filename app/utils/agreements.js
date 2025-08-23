import Storage from './storage.js';
import { getLang } from './i18n.js';

const storage = new Storage('eco');

export const CURRENT_VERSIONS = {
  terms: 'v1.0',
  privacy: 'v1.0',
  safety: 'v1.0'
};

export function getAcceptedVersions() {
  return storage.get('agreements.acceptedVersions', null);
}

export function isAllAccepted() {
  const accepted = getAcceptedVersions();
  if (!accepted) return false;
  return Object.keys(CURRENT_VERSIONS).every((k) => accepted[k] === CURRENT_VERSIONS[k]);
}

export function setAcceptedVersions(versions, meta = {}) {
  storage.set('agreements.acceptedVersions', versions);
  storage.set('agreements.acceptedAt', new Date().toISOString());
  storage.set('agreements.lang', meta.lang || getLang());
}

export default { CURRENT_VERSIONS, getAcceptedVersions, isAllAccepted, setAcceptedVersions };
