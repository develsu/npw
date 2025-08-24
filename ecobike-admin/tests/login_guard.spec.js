import { handleRoute } from '../router.js';
import { navigate } from './helpers.js';

export default async function(notes){
  const root = document.createElement('div');
  document.body.appendChild(root);

  // not authenticated -> redirect to login
  localStorage.removeItem('eco.admin');
  navigate('#/admin/dashboard');
  await handleRoute(root);
  if(location.hash !== '#/admin/login'){
    throw new Error('unauthenticated access should redirect to login');
  }

  // authenticated -> redirect away from login
  localStorage.setItem('eco.admin', JSON.stringify({ role: 'admin' }));
  navigate('#/admin/login');
  await handleRoute(root);
  if(location.hash !== '#/admin/dashboard'){
    throw new Error('logged-in admin should not stay on login');
  }

  notes.push('login guard verified');
}
