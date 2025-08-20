// Elements
const minEl = document.getElementById('min');
const secEl = document.getElementById('sec');
const csEl  = document.getElementById('cs'); // centiseconds (1/100s)

const startPauseBtn = document.getElementById('startPauseBtn');
const lapBtn        = document.getElementById('lapBtn');
const resetBtn      = document.getElementById('resetBtn');
const lapsList      = document.getElementById('lapsList');

// State
let startTime = 0;      // timestamp when (re)started
let elapsed   = 0;      // total elapsed ms
let timerId   = null;   // setInterval id
let lapCount  = 0;

// Helpers
const pad2 = n => n.toString().padStart(2,'0');

function render(ms){
  const totalCs = Math.floor(ms / 10);           // to centiseconds
  const m  = Math.floor(totalCs / 6000);         // 60s * 100cs
  const s  = Math.floor((totalCs % 6000) / 100);
  const cs = totalCs % 100;

  minEl.textContent = pad2(m);
  secEl.textContent = pad2(s);
  csEl.textContent  = pad2(cs);
}

function tick(){
  const now = Date.now();
  const ms = now - startTime + elapsed;
  render(ms);
}

function start(){
  startTime = Date.now();
  timerId = setInterval(tick, 10);               // update every 10ms
  startPauseBtn.textContent = 'Pause';
  lapBtn.disabled = false;
}

function pause(){
  clearInterval(timerId);
  timerId = null;
  // freeze elapsed time
  const now = Date.now();
  elapsed += now - startTime;
  startPauseBtn.textContent = 'Start';
  lapBtn.disabled = true;
}

function reset(){
  clearInterval(timerId);
  timerId = null;
  startTime = 0;
  elapsed = 0;
  lapCount = 0;
  lapsList.innerHTML = '';
  render(0);
  startPauseBtn.textContent = 'Start';
  lapBtn.disabled = true;
}

function lap(){
  if (!timerId) return;
  // current ms = (now - startTime) + elapsed
  const now = Date.now();
  const ms = now - startTime + elapsed;

  const totalCs = Math.floor(ms / 10);
  const m  = Math.floor(totalCs / 6000);
  const s  = Math.floor((totalCs % 6000) / 100);
  const cs = totalCs % 100;

  lapCount += 1;
  const li = document.createElement('li');
  li.innerHTML = `<strong>#${lapCount}</strong><span>${pad2(m)}:${pad2(s)}.${pad2(cs)}</span>`;
  lapsList.prepend(li);
}

// Events
startPauseBtn.addEventListener('click', () => timerId ? pause() : start());
lapBtn.addEventListener('click', lap);
resetBtn.addEventListener('click', reset);

// Keyboard shortcuts
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space'){ e.preventDefault(); timerId ? pause() : start(); }
  if (e.key.toLowerCase() === 'l'){ lap(); }
  if (e.key.toLowerCase() === 'r'){ reset(); }
});

// Initial
render(0);
