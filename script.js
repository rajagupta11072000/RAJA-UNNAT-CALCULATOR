// --- Basic Calculator ---
const basicDisplay = document.getElementById('basic-display');
let basicExp = '';
function addBasic(c) { basicExp += c; basicDisplay.value = basicExp; }
function calcBasic() {
  try { basicDisplay.value = eval(basicExp); basicExp = basicDisplay.value; }
  catch { basicDisplay.value = 'Error'; basicExp = ''; }
}
function clearBasic() { basicExp = ''; basicDisplay.value = ''; }

const bDiv = document.getElementById('basic-buttons');
['7','8','9','+','4','5','6','-','1','2','3','*','0','.','=','/','C'].forEach(c => {
  const b = document.createElement('button');
  b.innerText = c;
  b.onclick = () => {
    if(c === '=') calcBasic();
    else if(c === 'C') clearBasic();
    else addBasic(c);
  };
  bDiv.append(b);
});

// --- Scientific Calculator ---
const sciDisplay = document.getElementById('sci-display');
let sciExp = '';
function addSci(c) { sciExp += c; sciDisplay.value = sciExp; }
function calcSci() {
  try {
    let result = Function('"use strict"; return (' + sciExp + ')')();
    sciDisplay.value = result;
    sciExp = result.toString();
  } catch {
    sciDisplay.value = 'Error';
    sciExp = '';
  }
}
function clearSci() { sciExp = ''; sciDisplay.value = ''; }

['Math.sin(','Math.cos(','Math.tan(','Math.log(','Math.sqrt','**')].forEach(c => {
  const b = document.createElement('button');
  b.innerText = c.includes('Math.') ? c.replace('Math.', '').replace('(','') : c;
  b.onclick = () => addSci(c.includes('Math.') ? c + ')' : c);
  document.getElementById('sci-buttons').append(b);
});
['7','8','9','+','4','5','6','-','1','2','3','*','.','=','/','C'].forEach(c => {
  const b = document.createElement('button');
  b.innerText = c;
  b.onclick = () => {
    if(c === '=') calcSci();
    else if(c === 'C') clearSci();
    else addSci(c);
  };
  document.getElementById('sci-buttons').append(b);
});

// --- Percentage Calculator ---
document.getElementById('calc-perc').onclick = () => {
  let b = parseFloat(document.getElementById('perc-base').value);
  let p = parseFloat(document.getElementById('perc-percent').value);
  let res = (b * p / 100).toFixed(2);
  document.getElementById('perc-result').innerText = isNaN(res) ? 'Error' : res;
};

// --- BMI Calculator ---
document.getElementById('calc-bmi').onclick = () => {
  let w = parseFloat(document.getElementById('bmi-weight').value);
  let h = parseFloat(document.getElementById('bmi-height').value) / 100;
  let bmi = (w / (h * h)).toFixed(2);
  let cat = bmi < 18.5 ? 'Underweight' :
            bmi < 25 ? 'Normal' :
            bmi < 30 ? 'Overweight' : 'Obese';
  document.getElementById('bmi-result').innerText = isNaN(bmi) ? 'Error' : `${bmi} (${cat})`;
};

// --- Currency Converter ---
(async () => {
  const key = '7b46c9d6348fe49e3acccd34'; // Your API key
  const resp = await fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/USD`);
  const json = await resp.json();
  const rates = json.conversion_rates;
  const from = document.getElementById('curr-from');
  const to = document.getElementById('curr-to');
  Object.keys(rates).forEach(c => {
    from.append(new Option(c, c));
    to.append(new Option(c, c));
  });
  document.getElementById('calc-curr').onclick = () => {
    const a = parseFloat(document.getElementById('curr-amount').value);
    const f = from.value;
    const t = to.value;
    if (isNaN(a)) {
      document.getElementById('curr-result').innerText = 'Error';
      return;
    }
    const res = (a * rates[t] / rates[f]).toFixed(4);
    document.getElementById('curr-result').innerText = res;
  };
})();
