export function validate(s){
 if(!s||s.version!==1||typeof s.name!=='string'||!s.name.trim())throw Error('Name and version 1 required.');
 if(!Number.isInteger(s.seed)||s.seed<1||s.seed>4294967295)throw Error('Seed must be an integer in 1–4294967295.');
 if(!Number.isInteger(s.symbols)||s.symbols<100||s.symbols>100000)throw Error('Use 100–100000 symbols.');
 if(!Array.isArray(s.ebn0)||!s.ebn0.length||s.ebn0.length>15||s.ebn0.some(x=>typeof x!=='number'||!Number.isFinite(x)||x< -10||x>30))throw Error('Use 1–15 Eb/N0 values between −10 and 30 dB.');
 if(typeof s.phaseDeg!=='number'||!Number.isFinite(s.phaseDeg)||Math.abs(s.phaseDeg)>180)throw Error('Phase error must be −180 to 180 degrees.');
 if(typeof s.review!=='string'||typeof s.source!=='string')throw Error('Review and source must be text.');
 return s;
}
export function rng(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return((x>>>0)+.5)/4294967296;};}
export function wilson(errors,n){
 if(!Number.isInteger(n)||n<1||!Number.isInteger(errors)||errors<0||errors>n)throw Error('Invalid binomial counts.');
 const z=1.959963984540054,p=errors/n,d=1+z*z/n,c=(p+z*z/(2*n))/d,h=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d;
 return [Math.max(0,c-h),Math.min(1,c+h)];
}
export function simulate(s,waveform,db){
 validate(s);if(!['BPSK','QPSK'].includes(waveform)||!s.ebn0.includes(db))throw Error('Unsupported experiment.');
 const random=rng(s.seed),normal=()=>Math.sqrt(-2*Math.log(random()))*Math.cos(2*Math.PI*random());
 const k=waveform==='BPSK'?1:2,a=1/Math.sqrt(k),sigma=Math.sqrt(1/(2*k*10**(db/10)));
 const phase=s.phaseDeg*Math.PI/180,c=Math.cos(phase),q=Math.sin(phase);
 let errors=0,evmSum=0;const constellation=[];
 for(let i=0;i<s.symbols;i++){
  const bi=random()<.5?0:1,bq=k===2?(random()<.5?0:1):0;
  const ti=bi?a:-a,tq=k===2?(bq?a:-a):0;
  const ri=ti*c-tq*q+sigma*normal(),rq=ti*q+tq*c+sigma*normal();
  errors+=Number((ri>=0?1:0)!==bi);if(k===2)errors+=Number((rq>=0?1:0)!==bq);
  evmSum+=(ri-ti)**2+(rq-tq)**2;
  if(i<300)constellation.push({i:ri,q:rq});
 }
 const bits=s.symbols*k;
 return {waveform,ebn0Db:db,symbols:s.symbols,bits,errors,ber:errors/bits,interval:wilson(errors,bits),evmRms:Math.sqrt(evmSum/s.symbols),bitsPerSymbol:k,constellation};
}
export function evaluate(s){validate(s);return ['BPSK','QPSK'].flatMap(w=>s.ebn0.map(db=>simulate(s,w,db)));}
export function csv(rows){
 const cols=['waveform','ebn0Db','bits','errors','ber','berLow','berHigh','evmRms','bitsPerSymbol'];
 const data=rows.map(r=>[r.waveform,r.ebn0Db,r.bits,r.errors,r.ber,...r.interval,r.evmRms,r.bitsPerSymbol]);
 return [cols,...data].map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');
}
