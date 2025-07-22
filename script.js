// --- Core Calculator ---
const display = document.getElementById('display');
let expr = '';
const calcButtons = ['7','8','9','/','C','4','5','6','*','(','1','2','3','-','0','.','=','+','√'];
const btnGrid = document.getElementById('btn-grid');
calcButtons.forEach(v => {
  const b = document.createElement('button');
  b.innerText = v;
  if (['+','-','*','/','=','√'].includes(v)) b.classList.add('operator');
  b.onclick = () => {
    if (v === 'C') { expr = ''; display.value = ''; }
    else if (v === '=') {
      try {
        const temp = display.value.replace(/√/g, 'Math.sqrt');
        const res = Function('"use strict";return(' + temp + ')')();
        display.value = res;
        expr = res.toString();
      } catch {
        display.value = 'Error';
        expr = '';
      }
    } else { display.value += v; expr = display.value; }
  };
  btnGrid.appendChild(b);
});

// --- Sidebar Tab Switching ---
document.querySelectorAll('.tab-button').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('.tab-button').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    b.classList.add('active');
    document.getElementById(b.dataset.panel).classList.add('active');
  };
});

// --- Utility: BMI ---
document.getElementById('calc-bmi').onclick = () => {
  const w = parseFloat(document.getElementById('bmi-weight').value);
  const h = parseFloat(document.getElementById('bmi-height').value) / 100;
  const bmi = (w / (h * h)).toFixed(2);
  const cat = bmi < 18.5 ? 'Underweight' :
              bmi < 25 ? 'Normal' :
              bmi < 30 ? 'Overweight' : 'Obese';
  document.getElementById('bmi-result').innerText = isNaN(bmi) ? 'Error' : `${bmi} (${cat})`;
};

// --- Utility: Percentage ---
document.getElementById('calc-perc').onclick = () => {
  const b = parseFloat(document.getElementById('perc-base').value);
  const p = parseFloat(document.getElementById('perc-percent').value);
  const r = (b * p / 100).toFixed(2);
  document.getElementById('perc-result').innerText = isNaN(r) ? 'Error' : r;
};

// --- Currency Converter (with API) ---
(async () => {
  const key = 'YOUR_KEY_HERE'; // ← replace with your real API key
  const resp = await fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/USD`);
  const data = await resp.json();
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
    const res = isNaN(a) ? 'Error' : (a * rates[t] / rates[f]).toFixed(2);
    document.getElementById('curr-result').innerText = res;
  };
})();

// --- Unit Converters & Pro Tools Setup ---
const units = {
  length: { m:1, km:0.001, cm:100, mm:1000, in:39.37, ft:3.281 },
  area: { m2:1, km2:1e-6, ft2:10.764, in2:1550 },
  volume: { l:1, ml:1000, gal:0.2642 },
  weight: { kg:1, g:1000, lb:2.2046 },
  temp: { C:1, F:'F', K:'K' },
  time: { s:1, min:1/60, hr:1/3600 },
  speed: { 'm/s':1, 'km/h':3.6, mph:2.237 },
  data: { B:1, KB:1/1024, MB:1/1048576 },
  pressure: { Pa:1, bar:1e-5, psi:0.000145 },
  energy: { J:1, kWh:2.78e-7, kcal:0.000239 },
  angle: { deg:1, rad:Math.PI/180 }
};

// Pro Financial Tools
function round(x){return Math.round((x+Number.EPSILON)*100)/100;}
const pro = [
  {id:'emi', func: () => {
    let P=+prompt('Principal'), r=+prompt('Annual Rate (%)')/1200, n=+prompt('Months');
    let EMI = round((P*r)/(1-Math.pow(1+r,-n)));
    alert(`EMI = ${EMI}`);
  }, label:'EMI'},
  {id:'investment', func: () => {
    let P=+prompt('Principal'), r=+prompt('Annual Rate (%)')/100, t=+prompt('Years');
    let A = P*Math.pow((1+r),t);
    alert(`Final = ${round(A)}, Return% = ${round(((A/P-1)*100))}%`);
  }, label:'Return'},
  {id:'stats', func: () => {
    let arr=prompt('Enter numbers separated by commas').split(',').map(n=>+n);
    let n=arr.length, mean=round(arr.reduce((a,b)=>a+b,0)/n);
    let sorted=arr.slice().sort((a,b)=>a-b);
    let median = n%2? sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2;
    let mode = arr.sort((a,b)=> arr.filter(v=>v===a).length - arr.filter(v=>v===b).length).pop();
    let sd = round(Math.sqrt(arr.map(x=>Math.pow(x-mean,2)).reduce((a,b)=>a+b)/n));
    alert(`Mean=${mean}, Median=${median}, Mode=${mode}, SD=${sd}`);
  }, label:'Stats'},
  {id:'percentchange', func: () => {
    let a=+prompt('Old value'), b=+prompt('New value');
    let pc = round(((b-a)/a*100));
    alert(`Change = ${pc}%`);
  }, label:'%Change'},
  {id:'cgpa', func: () => {
    let g=+prompt('Enter CGPA (out of 10)');
    alert(`Percentage = ${round(g*9.5)}%`);
  }, label:'CGPA'},
  {id:'fuel', func: () => {
    let d=+prompt('Distance (km)'), f=+prompt('Fuel used (L)');
    alert(`Efficiency = ${round(d/f)} km/L`);
  }, label:'Fuel'},
  {id:'ratio', func: () => {
    let a=+prompt('Numerator'), b=+prompt('Denominator');
    let g = (g=>g?g:1)( (g=a,b=b,(a%b||b)) );
    alert(`Simplified = ${a/g}:${b/g}`);
  }, label:'Ratio'},
  {id:'geometry', func: () => {
    let t=prompt('Shape (square,circle,triangle)'), res='';
    if(t==='square'){let s=+prompt('Side'); res=`Area=${round(s*s)}, Perimeter=${round(4*s)}`;}
    else if(t==='circle'){let r=+prompt('Radius'); res=`Area=${round(Math.PI*r*r)}, Circ=${round(2*Math.PI*r)}`;}
    else if(t==='triangle'){let b=+prompt('Base'), h=+prompt('Height'); res=`Area=${round(.5*b*h)}`;}
    alert(res);
  }, label:'Geo'}
];

Object.keys(units).forEach(type=>{
  const panel = document.createElement('section');
  panel.id = type;
  panel.className = 'panel';
  panel.innerHTML = `<h2>${type.toUpperCase()}</h2><div class="calc-grid">
    <input id="${type}-val" placeholder="Value"><select id="${type}-from"></select><select id="${type}-to"></select>
    <button id="calc-${type}">Convert</button><p id="${type}-result">–</p></div>`;
  document.querySelector('.main-content').appendChild(panel);

  const from = panel.querySelector(`#${type}-from`);
  const to = panel.querySelector(`#${type}-to`);
  Object.keys(units[type]).forEach(u => from.add(new Option(u,u)) & to.add(new Option(u,u)));

  panel.querySelector(`#calc-${type}`).onclick = () => {
    const v = parseFloat(panel.querySelector(`#${type}-val`).value);
    const f = from.value, t = to.value;
    let res;
    if (type === 'temp') {
      if(f==='C'&&t==='F') res = (v*9/5+32).toFixed(2);
      else if(f==='C'&&t==='K') res = (v+273.15).toFixed(2);
      else if(f==='F'&&t==='C') res = ((v-32)*5/9).toFixed(2);
      else if(f==='F'&&t==='K') res = ((v-32)*5/9+273.15).toFixed(2);
      else if(f==='K'&&t==='C') res = (v-273.15).toFixed(2);
      else if(f==='K'&&t==='F') res = ((v-273.15)*9/5+32).toFixed(2);
      else res = v.toFixed(2);
    } else res = (v*(units[type][t]/units[type][f])).toFixed(4);

    panel.querySelector(`#${type}-result`).innerText = isNaN(res) ? 'Error' : res;
  };
});

// --- Attach Pro Tools Buttons in Panels ---
pro.forEach(item => {
  const panel = document.getElementById(item.id);
  if (panel) {
    const btn = document.createElement('button');
    btn.innerText = item.label;
    btn.onclick = item.func;
    panel.querySelector('.calc-grid').appendChild(btn);
  }
});
