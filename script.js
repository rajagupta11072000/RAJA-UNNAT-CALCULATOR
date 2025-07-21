const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons-grid button');

display.addEventListener('keydown', e => {
  if (!/[0-9+\-/*().^%!]/.test(e.key) && e.key !== 'Enter' && e.key !== 'Backspace') {
    e.preventDefault();
  }
  if (e.key === 'Enter') calc();
});

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const k = btn.dataset.key;
    if (k) append(k);
  });
});

document.getElementById('equals').addEventListener('click', calc);
document.getElementById('clear').addEventListener('click', () => display.value = '');
document.getElementById('back').addEventListener('click', () => {
  display.value = display.value.slice(0, -1);
});

function append(val) {
  display.value += val;
}

function calc() {
  try {
    let expr = display.value
      .replace(/÷/g, '/').replace(/×/g, '*')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/√/g, 'Math.sqrt(')
      .replace(/\^/g, '**')
      .replace(/(\d+)!/g, 'factorial($1)')
    ;
    const result = Function('"use strict"; return ('+expr+')')();
    display.value = result;
  } catch {
    display.value = 'Error';
  }
}

function factorial(n) {
  if (n < 0) return NaN;
  if (n <= 1) return 1;
  let res = 1;
  for (let i=2; i<=n; i++) res *= i;
  return res;
}
