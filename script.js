// --- Sidebar Toggle ---
document.querySelectorAll('.tool').forEach(tool => {
  tool.addEventListener('click', () => {
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
    tool.classList.add('active');
    const selected = tool.getAttribute('data-tool');
    document.querySelectorAll('.tool-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(selected).classList.add('active');
  });
});

// --- Scientific + Basic Calculator ---
const sciDisplay = document.getElementById('sci-display');
let sciExp = '';
function addSci(c) { sciExp += c; sciDisplay.value = sciExp; }
function calcSci() {
  try {
    let result = Function('"use strict";return (' + sciExp + ')')();
    sciDisplay.value = result;
    sciExp = result.toString();
  } catch {
    sciDisplay.value = 'Error';
    sciExp = '';
  }
}
function clearSci() { sciExp = ''; sciDisplay.value = ''; }

const sciButtons = [
  '7','8','9','+',
  '4','5','6','-',
  '1','2','3','*',
  '0','.','=','/',
  'Math.sin(','Math.cos(','Math.tan(','Math.log(',
  'Math.sqrt(','Math.PI','Math.E','C'
];
sciButtons.forEach(c => {
  const b = document.createElement('button');
  b.innerText = c === 'Math.PI' ? 'π' : c === 'Math.E' ? 'e' : c.replace('Math.', '');
  b.onclick = () => {
    if (c === '=') calcSci();
    else if (c === 'C') clearSci();
    else addSci(c);
  };
  document.getElementById('sci-buttons').append(b);
});

// --- BMI Calculator ---
document.getElementById('calc-bmi').onclick = () => {
  const w = parseFloat(document.getElementById('bmi-weight').value);
  const h = parseFloat(document.getElementById('bmi-height').value) / 100;
  const bmi = (w / (h * h)).toFixed(2);
  const cat = bmi < 18.5 ? 'Underweight' :
              bmi < 25 ? 'Normal' :
              bmi < 30 ? 'Overweight' : 'Obese';
  document.getElementById('bmi-result').innerText = isNaN(bmi) ? 'Error' : `${bmi} (${cat})`;
};

// --- Percentage Calculator ---
document.getElementById('calc-perc').onclick = () => {
  const base = parseFloat(document.getElementById('perc-base').value);
  const perc = parseFloat(document.getElementById('perc-percent').value);
  const res = (base * perc / 100).toFixed(2);
  document.getElementById('perc-result').innerText = isNaN(res) ? 'Error' : res;
};

// --- Currency Converter ---
(async () => {
  const key = 'YOUR_API_KEY'; // Replace with your own exchangerate-api.com key
  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/USD`);
    const data = await res.json();
    const rates = data.conversion_rates;
    const from = document.getElementById('curr-from');
    const to = document.getElementById('curr-to');
    Object.keys(rates).forEach(k => {
      from.append(new Option(k, k));
      to.append(new Option(k, k));
    });
    document.getElementById('calc-curr').onclick = () => {
      const amt = parseFloat(document.getElementById('curr-amount').value);
      const f = from.value;
      const t = to.value;
      if (isNaN(amt)) {
        document.getElementById('curr-result').innerText = 'Error';
        return;
      }
      const result = (amt * rates[t] / rates[f]).toFixed(2);
      document.getElementById('curr-result').innerText = result;
    };
  } catch (e) {
    document.getElementById('curr-result').innerText = 'API Error';
  }
})();
