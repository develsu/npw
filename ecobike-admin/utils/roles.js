const perms = {
  admin: { view: 'all', edit: 'all' },
  operator: { view: ['dashboard','cities','stations','ops'], edit: ['cities','stations','ops'] },
  support: { view: ['dashboard','users','ops'], edit: ['users'] },
  viewer: { view: ['dashboard','cities','stations','users','plans','ops','audit','settings'], edit: [] }
};

function has(list, role, entity){
  const p = perms[role];
  if(!p) return false;
  const val = p[list];
  return val==='all' || val.includes(entity);
}
export function canView(entity, role){
  return has('view', role, entity);
}
export function canEdit(entity, role){
  return has('edit', role, entity);
}
