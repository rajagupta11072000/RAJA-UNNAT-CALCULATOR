// ------------------------- Calculator Buttons -------------------------
const display = document.getElementById('display');
let expr = '';

const basicButtons = [
  '7', '8', '9', '/', 'C',
  '4', '5', '6', '*', '(', 
  '1', '2', '3', '-', ')', 
  '0', '.', '=', '+', '√'
];

const btnGrid = document.getElementById('btn-grid');
basicButtons.forEach(text => {
  const btn = document.createElement('button');
  btn.innerText = text;
  btn.onclick = () => handleClick(text);
  if (['+', '-', '*', '/', '=', '√'].includes(text)) btn.classList.add('operator');
  btnGrid.appendChild(btn);
});

function handleClick(val) {
  if (val === 'C') {
    expr = '';
    display.value = '';
  } else if (val === '=') {
    try {
      expr = expr.replace(/√/g, 'Math.sqrt');
      display.value = Function('"use strict";return (' + expr + ')')();
    } catch {
      display.value = 'Error';
    }
  } else {
    expr += val;
    display.value = expr;
  }
}

// ------------------------- Sidebar Navigation -------------------------
document.querySelectorAll('.tab-button').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.panel).classList.add('active');
  };
});

// ------------------------- BMI Calculator -------------------------
document.getElementById('calc-bmi').onclick = () => {
  const w = parseFloat(document.getElementById('bmi-weight').value);
  const h = parseFloat(document.getElementById('bmi-height').value) / 100;
  const bmi = (w / (h * h)).toFixed(2);
  const cat = bmi < 18.5 ? 'Underweight' :
              bmi < 25 ? 'Normal' :
              bmi < 30 ? 'Overweight' : 'Obese';
  document.getElementById('bmi-result').innerText = isNaN(bmi) ? 'Error' : `${bmi} (${cat})`;
};

// ------------------------- Percentage -------------------------
document.getElementById('calc-perc').onclick = () => {
  const b = parseFloat(document.getElementById('perc-base').value);
  const p = parseFloat(document.getElementById('perc-percent').value);
  const res = (b * p / 100).toFixed(2);
  document.getElementById('perc-result').innerText = isNaN(res) ? 'Error' : res;
};

// ------------------------- Currency -------------------------
(async () => {
  const key = '7b46c9d6348fe49e3acccd34';
  const res = await fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/USD`);
  const data = await res.json();
  const rates = data.conversion_rates;
  const from = document.getElementById('curr-from');
  const to = document.getElementById('curr-to');
  Object.keys(rates).forEach(c => {
    from.add(new Option(c, c));
    to.add(new Option(c, c));
  });
  document.getElementById('calc-curr').onclick = () => {
    const a = parseFloat(document.getElementById('curr-amount').value);
    const f = from.value;
    const t = to.value;
    if (isNaN(a)) {
      document.getElementById('curr-result').innerText = 'Error';
      return;
    }
    const res = (a * rates[t] / rates[f]).toFixed(2);
    document.getElementById('curr-result').innerText = res;
  };
})();

// ------------------------- Unit Converter Factory -------------------------
const units = {
  length: { m: 1, km: 0.001, cm: 100, mm: 1000, in: 39.37, ft: 3.281 },
  area: { m2: 1, km2: 0.000001, ft2: 10.7639, in2: 1550 },
  volume: { l: 1, ml: 1000, gal: 0.2642 },
  weight: { kg: 1, g: 1000, lb: 2.2046 },
  temp: { C: 1, F: 'F', K: 'K' },
  time: { sec: 1, min: 1/60, hr: 1/3600 },
  speed: { 'm/s': 1, 'km/h': 3.6, mph: 2.237 },
  data: { B: 1, KB: 1/1024, MB: 1/1048576 },
  pressure: { Pa: 1, bar: 0.00001, psi: 0.000145 },
  energy: { J: 1, kWh: 2.78e-7, kcal: 0.000239 },
  angle: { deg: 1, rad: 0.0174533 }
};

Object.keys(units).forEach(type => {
  const panel = document.createElement('section');
  panel.className = 'panel';
  panel.id = type;
  panel.innerHTML = `
    <h2>${type.toUpperCase()} Converter</h2>
    <input id="${type}-val" type="number" placeholder="Enter value" />
    <select id="${type}-from"></select>
    <select id="${type}-to"></select>
    <button id="calc-${type}">Convert</button>
    <p>Result: <span id="${type}-result">–</span></p>
  `;
  document.querySelector('.main-content').appendChild(panel);

  const fromSel = panel.querySelector(`#${type}-from`);
  const toSel = panel.querySelector(`#${type}-to`);
  Object.keys(units[type]).forEach(u => {
    fromSel.add(new Option(u, u));
    toSel.add(new Option(u, u));
  });

  panel.querySelector(`#calc-${type}`).onclick = () => {
    const val = parseFloat(panel.querySelector(`#${type}-val`).value);
    const from = fromSel.value;
    const to = toSel.value;
    let result;
    if (type === 'temp') {
      if (from === 'C' && to === 'F') result = (val * 9/5 + 32).toFixed(2);
      else if (from === 'C' && to === 'K') result = (val + 273.15).toFixed(2);
      else if (from === 'F' && to === 'C') result = ((val - 32) * 5/9).toFixed(2);
      else if (from === 'F' && to === 'K') result = ((val - 32) * 5/9 + 273.15).toFixed(2);
      else if (from === 'K' && to === 'C') result = (val - 273.15).toFixed(2);
      else if (from === 'K' && to === 'F') result = ((val - 273.15) * 9/5 + 32).toFixed(2);
      else result = val.toFixed(2);
    } else {
      result = (val * (units[type][to] / units[type][from])).toFixed(4);
    }
    panel.querySelector(`#${type}-result`).innerText = isNaN(result) ? 'Error' : result;
  };
});
