// -- Normal + Scientific Calculator Setup --
const display = document.getElementById('display'),
      sciDisplay = document.getElementById('sci-display');
let expr = '', sciExpr = '';

const mainButtons = ['7','8','9','/','C','4','5','6','*','(','1','2','3','-','0','.','=','+','√'];
mainButtons.forEach(v=>{
  const b=document.createElement('button'); b.innerText=v;
  if(['+','-','*','/','=','√'].includes(v)) b.classList.add('operator');
  b.onclick = ()=>{
    if(v==='C'){ expr=''; display.value=''; }
    else if(v==='='){
      try{ 
        const res = Function('"use strict";return('+display.value.replace(/√/g,'Math.sqrt')+')')();
        display.value=res; expr=res.toString();
      } catch{ display.value='Error'; expr=''; }
    } else { display.value+=v; expr=display.value; }
  };
  document.getElementById('btn-grid').appendChild(b);
});

const sciButtons = ['sin(','cos(','tan(','log(','√(','(',')','^','7','8','9','/','C','4','5','6','*','1','2','3','-','0','.','=','+'];
sciButtons.forEach(v=>{
  const b=document.createElement('button'); b.innerText=v;
  if(['sin(','cos(','tan(','log(','√(','^','/','*','-','+','=','C'].includes(v)) b.classList.add('operator');
  b.onclick=()=>{
    if(v==='C'){ sciExpr=''; sciDisplay.value=''; }
    else if(v==='='){
      try{
        let temp = sciDisplay.value.replace(/√\(/g,'Math.sqrt(').replace(/\^/g,'**');
        const res=Function('"use strict";return('+temp+')')();
        sciDisplay.value=res; sciExpr=res.toString();
      } catch{ sciDisplay.value='Error'; sciExpr=''; }
    } else { sciDisplay.value+=v; sciExpr=sciDisplay.value; }
  };
  document.getElementById('sci-buttons').appendChild(b);
});

// -- Sidebar Navigation / Panels --
document.querySelectorAll('.tab-button').forEach(b=>{
  b.onclick=()=>{
    document.querySelectorAll('.tab-button').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
    b.classList.add('active');
    document.getElementById(b.dataset.panel).classList.add('active');
  };
});

// -- Utility Converters --
function setupGridCalc(id, inputIds, btnId, resultId, callback){
  document.getElementById(btnId).onclick = ()=>{
    document.getElementById(resultId).innerText = callback();
  };
}

// BMI
setupGridCalc('bmi', ['bmi-weight','bmi-height'], 'calc-bmi', 'bmi-result', ()=>{
  const w=parseFloat(document.getElementById('bmi-weight').value),
    h=parseFloat(document.getElementById('bmi-height').value)/100,
    bmi=(w/(h*h)).toFixed(2);
  const cat = bmi<18.5?'Underweight':bmi<25?'Normal':bmi<30?'Overweight':'Obese';
  return isNaN(bmi)?'Error':`${bmi} (${cat})`;
});

// Percentage
setupGridCalc('percentage',['perc-base','perc-percent'],'calc-perc','perc-result',()=>{
  const b=parseFloat(document.getElementById('perc-base').value),
        p=parseFloat(document.getElementById('perc-percent').value),
        res=(b*p/100).toFixed(2);
  return isNaN(res)?'Error':res;
});

// Currency with API
(async()=>{
  const key='YOUR_KEY_HERE';
  const r = await fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/USD`);
  const data = await r.json();
  const rates=data.conversion_rates, from=document.getElementById('curr-from'), to=document.getElementById('curr-to');
  Object.keys(rates).forEach(c=>{ from.add(new Option(c,c)); to.add(new Option(c,c)); });
  setupGridCalc('currency',['curr-amount'], 'calc-curr','curr-result',()=>{
    const a=parseFloat(document.getElementById('curr-amount').value),
          f=from.value, t=to.value,
          res=(isNaN(a)?'Error':(a * rates[t]/rates[f]).toFixed(2));
    return res;
  });
})();

// -- Unit Converters & Pro Tools
const units = {
 length:{m:1,km:0.001,cm:100,mm:1000,in:39.37,ft:3.281},
 area:{m2:1,k㎡:1e-6,ft2:10.764,in2:1550},
 volume:{l:1,ml:1000,gal:0.2642},
 weight:{kg:1,g:1000,lb:2.2046},
 temp:{C:1,F:'F',K:'K'},
 time:{s:1,min:1/60,hr:1/3600},
 speed:{'m/s':1,'km/h':3.6,mph:2.237},
 data:{B:1,KB:1/1024,MB:1/1048576},
 pressure:{Pa:1,bar:1e-5,psi:0.000145},
 energy:{J:1,kWh:2.78e-7,kcal:0.000239},
 angle:{deg:1,rad:Math.PI/180}
};

function registerUnit(type){
  const p = document.getElementById(type);
  const from = p.querySelector(`#${type}-from`), to = p.querySelector(`#${type}-to`);
  Object.keys(units[type]).forEach(u=>from.add(new Option(u,u))&to.add(new Option(u,u)));
  setupGridCalc(type,[`${type}-val`],`calc-${type}`,`${type}-result`,()=>{
    const v=parseFloat(p.querySelector(`#${type}-val`).value),
          f=from.value, t=to.value;
    let res;
    if(type==='temp'){
      if(f==='C'&&t==='F') res=(v*9/5+32).toFixed(2);
      else if(f==='C'&&t==='K') res=(v+273.15).toFixed(2);
      else if(f==='F'&&t==='C') res=((v-32)*5/9).toFixed(2);
      else if(f==='F'&&t==='K') res=((v-32)*5/9+273.15).toFixed(2);
      else if(f==='K'&&t==='C') res=(v-273.15).toFixed(2);
      else if(f==='K'&&t==='F') res=((v-273.15)*9/5+32).toFixed(2);
      else res=v.toFixed(2);
    } else res=(v*(units[type][t]/units[type][f])).toFixed(4);
    return isNaN(res)?'Error':res;
  });
}

Object.keys(units).forEach(registerUnit);

// -- Pro Tools Wiring --
const proTools = [
  {id:'emi',func:()=>{
    const P=+prompt('Principal amount'),r=+prompt('Rate %')/1200,n=+prompt('Months');
    const emi=(P*r)/(1-Math.pow(1+r,-n));
    alert(`EMI = ${emi.toFixed(2)}`);
  }},
  {id:'investment',func:()=>{
    const P=+prompt('Principal'),r=+prompt('Rate %')/100,t=+prompt('Years');
    const A=P*Math.pow(1+r,t);
    alert(`Total: ${A.toFixed(2)} Return%: ${((A/P-1)*100).toFixed(2)}%`);
  }},
  {id:'stats',func:()=>{
    const arr=prompt('Numbers comma separated').split(',').map(Number);
    const mean=arr.reduce((a,b)=>a+b)/arr.length;
    const sorted=arr.slice().sort((a,b)=>a-b);
    const median = arr.length%2?sorted[(arr.length-1)/2]:(sorted[arr.length/2-1]+sorted[arr.length/2])/2;
    const mode = arr.sort((a,b)=>arr.filter(v=>v===a).length-arr.filter(v=>v===b).length).pop();
    const sd=Math.sqrt(arr.map(x=>Math.pow(x-mean,2)).reduce((a,b)=>a+b)/arr.length);
    alert(`Mean:${mean.toFixed(2)} Median:${median.toFixed(2)} Mode:${mode} SD:${sd.toFixed(2)}`);
  }},
  {id:'percentchange',func:()=>{
    const o=+prompt('Old value'),n=+prompt('New value');
    alert('Change: '+(((n-o)/o*100).toFixed(2))+'%');
  }},
  {id:'cgpa',func:()=>{
    const cg=+prompt('CGPA (out of 10)');
    alert('Percentage: '+(cg*9.5).toFixed(2)+'%');
  }},
  {id:'fuel',func:()=>{
    const d=+prompt('Distance km'),f=+prompt('Fuel L');
    alert('Efficiency: '+(d/f).toFixed(2)+' km/L');
  }},
  {id:'ratio',func:()=>{
    let a=+prompt('Numerator'),b=+prompt('Denominator');
    const g=(function gcd(x,y){return y?gcd(y,x%y):x;})(a,b);
    alert(`Simplified: ${(a/g)}:${(b/g)}`);
  }},
  {id:'geometry',func:()=>{
    const s=prompt('square/circle/triangle');
    let res='';
    if(s==='square'){ const a=+prompt('Side'); res=`Area:${(a*a).toFixed(2)}, Per:${(4*
a).toFixed(2)}`}
    else if(s==='circle'){ const r=+prompt('Radius'); res=`Area:${(Math.PI*r*r).toFixed(2)}, Circ:${(2*
Math.PI*r).toFixed(2)}`}
    else if(s==='triangle'){ const b=+prompt('Base'),h=+prompt('Height'); res=`Area:${(0.5*b*h).toFixed(2)}`}
    alert(res);
  }},
];

proTools.forEach(t=>{
  const panel=document.getElementById(t.id);
  if(panel){
    const btn=document.createElement('button');
    btn.innerText='Run';
    btn.onclick=t.func;
    panel.querySelector('.calc-grid').appendChild(btn);
  }
});
