const display=document.getElementById('display');
let expr='';

const btns=['7','8','9','/','C','4','5','6','*','(','1','2','3','-',')','0','.','=','+','√'];
const grid=document.getElementById('btn-grid');
btns.forEach(v=>{
  const b=document.createElement('button');
  b.innerText=v;
  b.onclick=()=>{ 
    if(v==='C'){expr='';display.value='';}
    else if(v==='='){
      try{expr=expr.replace(/√/g,'Math.sqrt');
        display.value=Function('"use strict";return('+expr+')')();
        expr=display.value;
      } catch {display.value='Error';expr='';}
    } else {expr+=v;display.value=expr;}
  };
  if(['+','-','*','/','=','√'].includes(v))b.classList.add('operator');
  grid.appendChild(b);
});

document.querySelectorAll('.tab-button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.tab-button').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  document.getElementById(b.dataset.panel).classList.add('active');
});

document.getElementById('calc-bmi').onclick=()=>{
  const w=parseFloat(document.getElementById('bmi-weight').value);
  const h=parseFloat(document.getElementById('bmi-height').value)/100;
  const bmi=(w/(h*h)).toFixed(2);
  const cat=bmi<18.5?'Underweight':bmi<25?'Normal':bmi<30?'Overweight':'Obese';
  document.getElementById('bmi-result').innerText=isNaN(bmi)?'Error':`${bmi} (${cat})`;
};

document.getElementById('calc-perc').onclick=()=>{
  const b=parseFloat(document.getElementById('perc-base').value);
  const p=parseFloat(document.getElementById('perc-percent').value);
  const r=(b*p/100).toFixed(2);
  document.getElementById('perc-result').innerText=isNaN(r)?'Error':r;
};

(async()=>{
  const key='YOUR_KEY_HERE';
  const res=await fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/USD`);
  const data=await res.json();const rates=data.conversion_rates;
  const from=document.getElementById('curr-from'),to=document.getElementById('curr-to');
  Object.keys(rates).forEach(c=>{from.add(new Option(c,c));to.add(new Option(c,c));});
  document.getElementById('calc-curr').onclick=()=>{
    const a=parseFloat(document.getElementById('curr-amount').value);
    const f=from.value,t=to.value;
    if(isNaN(a)){document.getElementById('curr-result').innerText='Error';return;}
    document.getElementById('curr-result').innerText=(a*rates[t]/rates[f]).toFixed(2);
  };
})();
