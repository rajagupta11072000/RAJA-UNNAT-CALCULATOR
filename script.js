// Advanced Calculator logic
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons-grid button');

display.addEventListener('keydown', e => {
  if (!/[0-9+\-/*().^%!]/.test(e.key) && e.key !== 'Enter' && e.key !== 'Backspace') e.preventDefault();
  if (e.key === 'Enter') calc();
});
buttons.forEach(btn => btn.addEventListener('click', () => {
  const k = btn.dataset.key;
  if (k) display.value += k;
}));
document.getElementById('equals').onclick = calc;
document.getElementById('clear').onclick = () => display.value = '';
document.getElementById('back').onclick = () => display.value = display.value.slice(0, -1);

function calc() {
  try {
    let expr = display.value
      .replace(/÷/g,'/').replace(/×/g,'*')
      .replace(/sin\(/g,'Math.sin(').replace(/cos\(/g,'Math.cos(')
      .replace(/tan\(/g,'Math.tan(').replace(/log\(/g,'Math.log10(')
      .replace(/ln\(/g,'Math.log(').replace(/√/g,'Math.sqrt(')
      .replace(/\^/g,'**').replace(/(\d+)!/g,'factorial($1)');
    const r = Function('"use strict";return ('+expr+')')();
    display.value = r;
  } catch { display.value = 'Error'; }
}

function factorial(n) {
  if (n < 0) return NaN;
  let res = 1;
  for (let i = 1; i <= n; i++) res *= i;
  return res;
}

// Percentage
document.getElementById('calc-perc').onclick = () => {
  const b = parseFloat(document.getElementById('perc-base').value);
  const p = parseFloat(document.getElementById('perc-percent').value);
  const res = (b * p / 100).toFixed(2);
  document.getElementById('perc-result').innerText = isNaN(res) ? 'Error' : res;
};

// BMI
document.getElementById('calc-bmi').onclick = () => {
  const w = parseFloat(document.getElementById('bmi-weight').value);
  const h = parseFloat(document.getElementById('bmi-height').value)/100;
  const bmi = (w/(h*h)).toFixed(2);
  const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
  document.getElementById('bmi-result').innerText = isNaN(bmi) ? 'Error' : `${bmi} (${cat})`;
};

// Currency
(async () => {
  const key = '7b46c9d6348fe49e3acccd34';
  const resp = await fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/USD`);
  const json = await resp.json();
  const rates = json.conversion_rates;
  const from = document.getElementById('curr-from');
  const to = document.getElementById('curr-to');
  
  Object.keys(rates).forEach(c => {
    from.add(new Option(c,c));
    to.add(new Option(c,c));
  });
  
  document.getElementById('calc-curr').onclick = () => {
    const a = parseFloat(document.getElementById('curr-amount').value);
    const f = from.value, t = to.value;
    const res = isNaN(a) ? 'Error' : (a * rates[t] / rates[f]).toFixed(4);
    document.getElementById('curr-result').innerText = res;
  };
})();
