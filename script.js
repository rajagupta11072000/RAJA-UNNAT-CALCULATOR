// Side-menu toggle
const sections = { calculator: 'panel-calculator', percent: 'panel-percent', bmi: 'panel-bmi', currency: 'panel-currency' };
function setActive(key) {
  document.querySelectorAll('.sidebar button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('btn-'+key).classList.add('active');
  document.getElementById('panel-'+key).classList.add('active');
}
Object.keys(sections).forEach(key => document.getElementById('btn-'+key).onclick = () => setActive(key));

// --- Calculator Logic ---
const display = document.getElementById('display');
const grid = document.getElementById('buttons-grid');
const keys = [
  ['(',' )','sin(','cos(','tan('],
  ['log(','ln(','√','^','!'],
  ['7','8','9','÷','×'],
  ['4','5','6','−','+'],
  ['1','2','3','.','='],
  ['0','C','⌫']
];
keys.forEach(row => row.forEach(k => {
  const b = document.createElement('button');
  b.textContent = k;
  if (['÷','×','−','+','^','sin(','cos(','tan(','log(','ln(','√','!','='].includes(k)) b.classList.add('operator');
  if (k==='='||k==='C'||k==='⌫') b.classList.add('wide');
  b.onclick = () => {
    if (k==='=') calc(); 
    else if (k==='C') display.value='';
    else if (k==='⌫') display.value=display.value.slice(0,-1);
    else display.value += k;
  };
  grid.append(b);
}));
display.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); calc(); }
});

// Evaluate
function calc() {
  try {
    let expr = display.value
      .replace(/÷/g,'/').replace(/×/g,'*').replace(/−/g,'-')
      .replace(/sin\(/g,'Math.sin(').replace(/cos\(/g,'Math.cos(').replace(/tan\(/g,'Math.tan(')
      .replace(/log\(/g,'Math.log10(').replace(/ln\(/g,'Math.log(').replace(/√/g,'Math.sqrt(')
      .replace(/\^/g,'**')
      .replace(/(\d+)!/g,'factorial($1)');
    display.value = Function('"use strict";return('+expr+')')();
  } catch { display.value = 'Error'; }
}
function factorial(n) { return n<2?1:n*factorial(n-1); }

// Percentage
document.getElementById('calc-perc').onclick = () => {
  let b=parseFloat(document.getElementById('perc-base').value),
      p=parseFloat(document.getElementById('perc-percent').value),
      r=(b*p/100).toFixed(2);
  document.getElementById('perc-result').textContent = isNaN(r)?'Error':r;
};

// BMI
document.getElementById('calc-bmi').onclick = () => {
  let w=parseFloat(document.getElementById('bmi-weight').value),
      h=parseFloat(document.getElementById('bmi-height').value)/100,
      bmi=(w/(h*h)).toFixed(2),
      cat=bmi<18.5?'Underweight':bmi<25?'Normal':bmi<30?'Overweight':'Obese';
  document.getElementById('bmi-result').textContent = isNaN(bmi)?'Error':`${bmi} (${cat})`;
};

// Currency
(async()=>{
  const key='7b46c9d6348fe49e3acccd34';
  const res=await fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/USD`);
  const {conversion_rates:rates}=await res.json();
  const from=document.getElementById('curr-from'),to=document.getElementById('curr-to');
  Object.keys(rates).forEach(c=>{from.append(new Option(c,c));to.append(new Option(c,c));});
  document.getElementById('calc-curr').onclick = () => {
    let a=parseFloat(document.getElementById('curr-amount').value),
        f=from.value, t=to.value,
        r=(a * rates[t] / rates[f]).toFixed(4);
    document.getElementById('curr-result').textContent = isNaN(r)?'Error':r;
  };
})();
