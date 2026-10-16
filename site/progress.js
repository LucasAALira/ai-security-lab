/* Progresso local: XP calculado a partir das conquistas, sem incremento repetido. */
const StudyProgress = (() => {
  const count = 8, key = 'ai-security-study-v2';
  function clean(raw) {
    const s = {version:2,modules:{},lab:raw?.lab===true,migrated:raw?.migrated===true,cases:[0,1,2,3,4,5].map(i=>raw?.cases?.[i]===true)};
    for(let i=0;i<count;i++) {
      const m=raw?.modules?.[i]||{};
      s.modules[i]={reads:[0,1,2].map(j=>m.reads?.[j]===true),research:m.research===true,practice:m.practice===true,solved:[0,1].map(j=>m.solved?.[j]===true),notes:typeof m.notes==='string'?m.notes:'',researchNote:typeof m.researchNote==='string'?m.researchNote:''};
    }
    return s;
  }
  function load(storage) {
    try { const current=storage.getItem(key); if(current) return clean(JSON.parse(current)); } catch {}
    let s=clean({});
    try { const legacy=JSON.parse(storage.getItem('ai-security-study-v1')||'{}');for(let i=0;i<count;i++){if(legacy?.[i]?.done){s.modules[i].reads=[true,true,true];s.migrated=true;}if(typeof legacy?.[i]?.notes==='string')s.modules[i].notes=legacy[i].notes;} }catch{}
    return s;
  }
  function steps(m){return m.reads.filter(Boolean).length+Number(m.research)+Number(m.practice)+m.solved.filter(Boolean).length;}
  function xp(m){return m.reads.filter(Boolean).length*10+Number(m.research)*20+Number(m.practice)*20+m.solved.filter(Boolean).length*15;}
  function complete(m){return steps(m)===7;}
  function summary(s){const values=Object.values(s.modules);return {xp:values.reduce((n,m)=>n+xp(m),0)+(s.lab?30:0)+s.cases.filter(Boolean).length*40,complete:values.filter(complete).length,steps:values.reduce((n,m)=>n+steps(m),0)+(s.lab?1:0)+s.cases.filter(Boolean).length,total:63};}
  function level(xp){const levels=[{at:0,name:'Iniciante'},{at:100,name:'Explorador'},{at:300,name:'Praticante'},{at:500,name:'Analista'},{at:800,name:'Trilha avançada'},{at:1000,name:'Defensor de IA'}];let n=levels.findLastIndex(l=>xp>=l.at);return {number:n+1,name:levels[n].name,next:levels[n+1]?.at??null,start:levels[n].at};}
  function award(s,i,type,index){const m=s.modules[i];if(!m)return;if(type==='read'&&Number.isInteger(index)&&index>=0&&index<3)m.reads[index]=true;if(type==='research')m.research=true;if(type==='practice')m.practice=true;if(type==='question'&&Number.isInteger(index)&&index>=0&&index<2)m.solved[index]=true;}
  function solveCase(s,index){if(Number.isInteger(index)&&index>=0&&index<6)s.cases[index]=true;}
  return {key,clean,load,steps,xp,complete,summary,level,award,solveCase};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=StudyProgress;
