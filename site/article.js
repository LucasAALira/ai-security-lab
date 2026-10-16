(() => {
 const index=Number(document.body.dataset.module);
 if(!Number.isInteger(index)||index<0||index>7)return;
 let storageWorks=true;
 const reader={getItem:key=>{try{return localStorage.getItem(key);}catch{storageWorks=false;return null;}}};
 let articleState=StudyProgress.load(reader), notice='';
 const status=document.getElementById('article-progress');
 function refresh(){
  const m=articleState.modules[index];
  document.querySelectorAll('[data-article-read]').forEach(button=>{
   const done=m.reads[Number(button.dataset.articleRead)];button.disabled=done;
   button.textContent=done?'✓ Leitura registrada · 10 XP':'Li esta parte · +10 XP';
  });
  status.textContent=`${m.reads.filter(Boolean).length}/3 partes lidas · ${StudyProgress.xp(m)}/100 XP no módulo. ${storageWorks?'Progresso compartilhado com o painel neste navegador.':'Armazenamento indisponível; esta leitura fica apenas nesta sessão.'}${notice}`;
 }
 document.querySelectorAll('[data-article-read]').forEach(button=>button.addEventListener('click',()=>{
  if(storageWorks){const latest=StudyProgress.load(reader);if(storageWorks)articleState=latest;}
  const changed=StudyProgress.award(articleState,index,'read',Number(button.dataset.articleRead));
  const fresh=changed?StudyProgress.sync(articleState):[];
  notice=fresh.length?` Medalha conquistada: ${fresh.map(m=>`${m.name} (+${m.xp} XP)`).join(', ')}.`:'';
  try{localStorage.setItem(StudyProgress.key,JSON.stringify(articleState));}catch{storageWorks=false;}
  refresh();
 }));
 window.addEventListener('storage',event=>{if(event.key===StudyProgress.key||event.key===null){articleState=StudyProgress.load(reader);notice='';refresh();}});
 refresh();
})();
