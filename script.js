// Left sidebar tab buttons and content panes
const tabs = document.querySelectorAll('#sidebar-list button');
const tabPanes = document.querySelectorAll('.tab-pane');
const tabTitle = document.getElementById('tab-title');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const target = tab.getAttribute('data-tab');
    tabPanes.forEach(pane => {
      if(pane.id === target) pane.classList.add('active');
      else pane.classList.remove('active');
    });
    tabTitle.innerText = tab.innerText;
  });
});

// Calculator logic
const display = document.getElementById('calcDisplay');
function press(value) {
  if(display.value === "0" || display.value === "त्रुटि") {
    display.value = value;
  } else {
    display.value += value;
  }
}
function clearCalc() {
  display.value = "0";
}
function calculate() {
  try {
    const hindiToEng = {'०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9'};
    let val = display.value.replace(/[०-९]/g, d => hindiToEng[d]);
    let result = eval(val);
    display.value = result.toString();
  } catch {
    display.value = "त्रुटि";
  }
}

// Length Converter logic:
document.getElementById('lengthInput').addEventListener('input', e => {
  const meters = parseFloat(e.target.value) || 0;
  document.getElementById('lengthKilometer').textContent = (meters / 1000).toFixed(5);
  document.getElementById('lengthMeter').textContent = meters.toFixed(5);
  document.getElementById('lengthFeet').textContent = (meters * 3.28084).toFixed(5);
  document.getElementById('lengthInch').textContent = (meters * 39.3701).toFixed(5);
});

// Area Converter logic:
document.getElementById('areaInput').addEventListener('input', e=>{
  const acres = parseFloat(e.target.value) || 0;
  document.getElementById('areaSquareMeter').textContent = (acres * 4046.86).toFixed(5);
  document.getElementById('areaAre').textContent = (acres * 40.4686).toFixed(5);
  document.getElementById('acre').textContent = acres.toFixed(5);
});

// Volume Converter logic:
document.getElementById('volumeInput').addEventListener('input', e=>{
  const liters = parseFloat(e.target.value) || 0;
  document.getElementById('volumeGallon').textContent = (liters * 0.264172).toFixed(5);
  document.getElementById('volumeCubicMeter').textContent = (liters / 1000).toFixed(5);
});
