// Sidebar navigation
document.querySelectorAll('.sidebar button').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.sidebar button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
    document.getElementById('panel-'+btn.dataset.panel).classList.add('active');
  };
});

// Calculator grid
const display = document.getElementById('display');
const btnGrid = document.getElementById('btn-grid');
const keys = [
  ['(',')','sin(','cos(','tan('],
  ['log(','ln(','√','^','!'],
  ['7','8','9','÷','×'],
  ['4','5','6','−','+'],
  ['1','2','3','.','='],
  ['0','C','⌫','π','e']
];
keys.forEach(row=>row.forEach(k=>{
  const b=document.createElement('button');
  b.textContent=k;
  if(['÷','×','−','+','^','sin(','cos(','tan(','log(','ln(','√','!','π','e','='].includes(k)) b.classList.add('operator');
  if(['=','C','⌫','π','e'].includes(k)) b.classList.add('wide');
  b.onclick = () => {
    if(k==='=') calc();
    else if(k==='C') display.value='';
    else if(k==='⌫') display.value = display.value.slice(0,-1);
    else if(k==='π') display.value += Math.PI;
    else if(k==='e') display.value += Math.E;
    else display.value += k;
  };
  btnGrid.append(b);
}));
display.addEventListener('keydown',e => {
  if(e.key==='Enter') { e.preventDefault(); calc(); }
});

// Calculation logic
function calc(){
  try {
    let expr = display.value.replace(/÷/g,'/').replace(/×/g,'*').replace(/−/g,'-')
      .replace(/sin\(/g,'Math.sin(').replace(/cos\(/g,'Math.cos(')
      .replace(/tan\(/g,'Math.tan(').replace(/log\(/g,'Math.log10(')
      .replace(/ln\(/g,'Math.log(').replace(/√/g,'Math.sqrt(')
      .replace(/\^/g,'**').replace(/(\d+)!/g,'factorial($1)');
    display.value = Function('"use strict";return('+expr+')')();
  } catch { display.value='Error'; }
}
function factorial(n){ return n<2?1:n*factorial(n-1); }

// Utility modes
document.getElementById('calc-perc').onclick = () => {
  let b=parseFloat(document.getElementById('perc-base').value),
      p=parseFloat(document.getElementById('perc-percent').value),
      r=(b*p/100).toFixed(2);
  document.getElementById('perc-result').textContent = isNaN(r)?'Error':r;
};
document.getElementById('calc-bmi').onclick = () => {
  let w=parseFloat(document.getElementById('bmi-weight').value),
      h=parseFloat(document.getElementById('bmi-height').value)/100,
      bmi=(w/(h*h)).toFixed(2),
      cat=bmi<18.5?'Underweight':bmi<25?'Normal':bmi<30?'Overweight':'Obese';
  document.getElementById('bmi-result').textContent = isNaN(bmi)?'Error':`${bmi} (${cat})`;
};
(async()=>{
  const key='7b46c9d6348fe49e3acccd34';
  let res=await fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/USD`);
  let rates=(await res.json()).conversion_rates;
  let from=document.getElementById('curr-from'),to=document.getElementById('curr-to');
  Object.keys(rates).forEach(c=>{
    from.add(new Option(c,c)); to.add(new Option(c,c));
  });
  document.getElementById('calc-curr').onclick = () => {
    let a=parseFloat(document.getElementById('curr-amount').value),
        f=from.value,t=to.value,
        rr=(a*rates[t]/rates[f]).toFixed(4);
    document.getElementById('curr-result').textContent = isNaN(rr)?'Error':rr;
  };
})();

// Unit converter data & logic
const convDefs = {
  length: {m:1, cm:0.01, ft:0.3048, in:0.0254},
  area: {m2:1, ft2:0.092903, acre:4046.86, ha:10000},
  volume: {l:1, m3:1000, gal:3.78541},
  weight: {kg:1, g:0.001, lb:0.453592},
  temp:{C:1, F:[x=>x*9/5+32, x=> (x-32)*5/9], K:[x=>x+273.15, x=>x-273.15]},
  time: {s:1, min:60, hr:3600},
  speed:{ 'm/s':1, 'km/h':0.277778, 'mph':0.44704},
  data: {B:1, KB:1e3, MB:1e6, GB:1e9, TB:1e12},
  pressure:{Pa:1, atm:101325, bar:1e5, psi:6894.76},
  energy:{J:1, kcal:4184, kWh:3.6e6},
  angle:{deg:1, rad:Math.PI/180}
};

document.querySelectorAll('.conv-panel button').forEach(b=>{
  let unit=b.dataset.conv;
  let def=convDefs[unit];
  let selFrom = document.getElementById(`${unit}-from`);
  let selTo = document.getElementById(`${unit}-to`);
  Object.keys(def).forEach(u=>{
    selFrom.add(new Option(u,u));selTo.add(new Option(u,u));
  });
  b.onclick = ()=>{
    let val = parseFloat(document.getElementById(`${unit}-in`).value);
    if(isNaN(val)) return;
    let a=def[selFrom.value], c=def[selTo.value];
    let out;
    if(unit==='temp'){
      out = selFrom.value==='C'? def.temp.F[0](val) :
            selFrom.value==='F'? def.temp.K[0](val) :
            selFrom.value==='K'? def.temp.F[0](def.temp.K[1](val)): NaN;
    } else if(unit==='angle'){
      out = (val * def.angle[selFrom.value]) / def.angle[selTo.value];
    } else {
      out = val * a / c;
    }
    document.querySelector(`#panel-${unit} .conv-out`).textContent = out;
  };
});
