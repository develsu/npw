const KEYS={
  cities:'admin.cities',
  stations:'admin.stations',
  users:'admin.users',
  plans:'admin.plans',
  ops:'admin.ops',
  audit:'admin.audit',
  settings:'admin.settings'
};

function seed(){
  if(!localStorage.getItem(KEYS.cities)){
    localStorage.setItem(KEYS.cities, JSON.stringify([{id:'almaty',name:'Almaty',lat:43.22,lng:76.85,active:true}]));
  }
  if(!localStorage.getItem(KEYS.plans)){
    localStorage.setItem(KEYS.plans, JSON.stringify([
      {id:'start',price:0,limitPerDay:1,features:['basic'],visible:true},
      {id:'standard',price:5000,limitPerDay:3,features:['basic','support'],visible:true},
      {id:'enterprise',price:10000,limitPerDay:Infinity,features:['basic','support','vip'],visible:true}
    ]));
  }
}

seed();

function get(key){
  return JSON.parse(localStorage.getItem(key) || '[]');
}
function set(key,val){
  localStorage.setItem(key, JSON.stringify(val));
}
function audit(entry){
  const list=get(KEYS.audit);
  list.push({...entry,tsISO:new Date().toISOString()});
  set(KEYS.audit,list);
}

export const cities={
  list:async()=>get(KEYS.cities),
  create:async(c)=>{const list=get(KEYS.cities);list.push(c);set(KEYS.cities,list);audit({action:'city.create',entityId:c.id});},
  update:async(id,data)=>{const list=get(KEYS.cities);const i=list.findIndex(x=>x.id===id);const before=list[i];list[i]={...before,...data};set(KEYS.cities,list);audit({action:'city.update',entityId:id,before,after:list[i]});},
  remove:async(id)=>{const list=get(KEYS.cities).filter(c=>c.id!==id);set(KEYS.cities,list);audit({action:'city.delete',entityId:id});}
};

export const stations={
  list:async()=>get(KEYS.stations),
  create:async(s)=>{const list=get(KEYS.stations);list.push(s);set(KEYS.stations,list);audit({action:'station.create',entityId:s.id});},
  update:async(id,data)=>{const list=get(KEYS.stations);const i=list.findIndex(x=>x.id===id);const before=list[i];list[i]={...before,...data};set(KEYS.stations,list);audit({action:'station.update',entityId:id,before,after:list[i]});},
  remove:async(id)=>{const list=get(KEYS.stations).filter(c=>c.id!==id);set(KEYS.stations,list);audit({action:'station.delete',entityId:id});}
};

export const users={
  list:async()=>get(KEYS.users),
  update:async(id,data)=>{const list=get(KEYS.users);const i=list.findIndex(x=>x.id===id);const before=list[i];list[i]={...before,...data};set(KEYS.users,list);audit({action:'user.update',entityId:id,before,after:list[i]});},
  block:async(id)=>users.update(id,{blocked:true}),
  unblock:async(id)=>users.update(id,{blocked:false}),
  resetLimit:async(id)=>users.update(id,{usedToday:0})
};

export const plans={
  list:async()=>get(KEYS.plans),
  create:async(p)=>{const list=get(KEYS.plans);list.push(p);set(KEYS.plans,list);audit({action:'plan.create',entityId:p.id});},
  update:async(id,data)=>{const list=get(KEYS.plans);const i=list.findIndex(x=>x.id===id);const before=list[i];list[i]={...before,...data};set(KEYS.plans,list);audit({action:'plan.update',entityId:id,before,after:list[i]});},
  remove:async(id)=>{const list=get(KEYS.plans).filter(c=>c.id!==id);set(KEYS.plans,list);audit({action:'plan.delete',entityId:id});}
};

export const ops={
  list:async()=>get(KEYS.ops),
  update:async(id,data)=>{const list=get(KEYS.ops);const i=list.findIndex(x=>x.id===id);const before=list[i];list[i]={...before,...data};set(KEYS.ops,list);audit({action:'op.update',entityId:id,before,after:list[i]});}
};

export const auditLog={
  list:async()=>get(KEYS.audit),
  add:async(e)=>audit(e)
};

export const settings={
  get:async()=>JSON.parse(localStorage.getItem(KEYS.settings)||'{}'),
  set:async(data)=>{localStorage.setItem(KEYS.settings,JSON.stringify(data));audit({action:'settings.update'});}
};
