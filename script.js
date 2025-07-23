// --- Sidebar Navigation ---
document.querySelectorAll('.tool').forEach(tool => {
  tool.addEventListener('click', () => {
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
    tool.classList.add('active');
    const selected = tool.getAttribute('data-tool');
    document.querySelectorAll('.tool-section').forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(selected).classList.add('active');
  });
});

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
    if (c === '=') calcBasic();
    else if (c === 'C') clearBasic();
    else addBasic(c);
  };
  bDiv.appendChild(b);
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

const sciButtons = [
  'Math.sin(', 'Math.cos(', 'Math.tan(', 'Math.log(', 'Math.sqrt(', 'Math.PI', 'Math.E', ')',
  '7', '8', '9', '+', '4', '5', '6', '-', '1', '2', '3', '*', '0', '.', '=', '/', 'C'
];

const sDiv = document.getElementById('sci-buttons');
sciButtons.forEach(c => {
  const b = document.createElement('button');
  b.innerText = c.replace('Math.', '');
  b.onclick = () => {
    if (c === '=') calcSci();
    else if (c === 'C') clearSci();
    else addSci(c);
  };
  sDiv.appendChild(b);
});

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

// --- Percentage Calculator ---
document.getElementById('calc-perc').onclick = () => {
  let base = parseFloat(document.getElementById('perc-base').value);
  let perc = parseFloat(document.getElementById('perc-percent').value);
  let res = (base * perc / 100).toFixed(2);
  document.getElementById('perc-result').innerText = isNaN(res) ? 'Error' : res;
};

// --- Currency Converter ---
(async () => {
  const key = 'YOUR_API_KEY'; // Replace with your actual API key
  try {
    const resp = await fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/USD`);
    const data = await resp.json();
    const rates = data.conversion_rates;
    const from = document.getElementById('curr-from');
    const to = document.getElementById('curr-to');
    Object.keys(rates).forEach(c => {
      from.append(new Option(c, c));
      to.append(new Option(c, c));
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
  } catch (err) {
    document.getElementById('curr-result').innerText = 'API error';
  }
})();
