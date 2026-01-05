const STORAGE_KEY = "TenKChallengeData";

/* ---------- State ---------- */
let editingIndex = null;
let deletingIndex = null;

/* ---------- Helpers ---------- */
function loadData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    exercises: [],
    entries: {}
  };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/* ---------- Modal Handling ---------- */
const exerciseModal = document.getElementById("exerciseModal");
const deleteModal = document.getElementById("deleteModal");
const exerciseName = document.getElementById("exerciseName");
const exerciseWeight = document.getElementById("exerciseWeight");
const exerciseUnit = document.getElementById("exerciseUnit");
const deleteText = document.getElementById("deleteText");

function closeAllModals() {
  exerciseModal.hidden = true;
  deleteModal.hidden = true;
}

function openExerciseModal(index = null) {
  const data = loadData();
  editingIndex = index;

  if (index !== null) {
    const ex = data.exercises[index];
    exerciseName.value = ex.name;
    exerciseWeight.value = ex.weight;
    exerciseUnit.value = ex.unit;
  } else {
    exerciseName.value = "";
    exerciseWeight.value = 1;
    exerciseUnit.value = "Wdh";
  }

  exerciseModal.hidden = false;
}

/* ---------- Settings Tab ---------- */
function renderExercises() {
  const list = document.getElementById("exerciseList");
  list.innerHTML = "";

  loadData().exercises.forEach((ex, i) => {
    const row = document.createElement("div");
    row.textContent = `${ex.name} (${ex.weight} ${ex.unit})`;

    const edit = document.createElement("button");
    edit.textContent = "✎";
    edit.onclick = () => openExerciseModal(i);

    const del = document.createElement("button");
    del.textContent = "✖";
    del.onclick = () => {
      deletingIndex = i;
      deleteText.textContent = `Übung "${ex.name}" löschen?`;
      deleteModal.hidden = false;
    };

    row.append(edit, del);
    list.appendChild(row);
  });
}

/* ---------- Gemeinsame Jahres-Berechnung ---------- */
function calculateYearTotal(year) {
  const data = loadData();
  let sum = 0;

  Object.entries(data.entries).forEach(([date, exs]) => {
    if (date.startsWith(year)) {
      Object.entries(exs).forEach(([idx, val]) => {
        const weight = data.exercises[idx]?.weight || 1;
        sum += Math.floor(val / weight);
      });
    }
  });

  return sum;
}

/* ---------- Aktuell Tab ---------- */
const currentExercisesDiv = document.getElementById("currentExercises");
const datePicker = document.getElementById("datePicker");
const yearTotalCurrent = document.getElementById("yearTotalCurrent");
const saveCurrentBtn = document.getElementById("saveCurrentBtn");

function renderCurrent() {
  const data = loadData();
  currentExercisesDiv.innerHTML = "";

  const selectedDate = datePicker.value
    ? new Date(datePicker.value)
    : new Date();

  datePicker.value = dateKey(selectedDate);

  data.exercises.forEach((ex, i) => {
    const row = document.createElement("div");
    row.className = "exercise-row";

    const label = document.createElement("label");
    label.textContent = ex.name;

    const input = document.createElement("input");
    input.type = "number";
    input.min = 0;
    input.value = data.entries[dateKey(selectedDate)]?.[i] || 0;
    input.dataset.index = i;

    row.append(label, input);
    currentExercisesDiv.appendChild(row);
  });

  yearTotalCurrent.textContent =
    calculateYearTotal(selectedDate.getFullYear().toString());
}

saveCurrentBtn.onclick = () => {
  const data = loadData();
  const key = dateKey(new Date(datePicker.value));

  if (!data.entries[key]) data.entries[key] = {};

  currentExercisesDiv.querySelectorAll("input").forEach(input => {
    const idx = input.dataset.index;
    const val = parseInt(input.value) || 0;
    data.entries[key][idx] = val;
  });

  saveData(data);
  renderCurrent();
};

datePicker.onchange = renderCurrent;

/* ---------- Statistik Tab ---------- */
const yearSelect = document.getElementById("yearSelect");
const yearTotalStats = document.getElementById("yearTotalStats");
const yearGrid = document.getElementById("yearGrid");
const statsPlot = document.getElementById("statsPlot");
const ctx = statsPlot.getContext("2d");

function populateYearSelect() {
  const data = loadData();
  const years = new Set();
  Object.keys(data.entries).forEach(k => years.add(k.slice(0, 4)));

  yearSelect.innerHTML = "";
  Array.from(years).sort().forEach(y => {
    const option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    yearSelect.appendChild(option);
  });

  if (yearSelect.options.length) {
    yearSelect.value = yearSelect.options[0].value;
  }
}

function updateYearTotal(year) {
  yearTotalStats.textContent = calculateYearTotal(year);
}

/* ---------- Kalender ---------- */
function renderYearCalendar(year) {
  const data = loadData();
  yearGrid.innerHTML = "";

  for (let month = 0; month < 12; month++) {
    const monthDiv = document.createElement("div");
    monthDiv.className = "month";

    const title = document.createElement("h3");
    title.textContent = new Date(year, month).toLocaleString("de-DE", {
      month: "long"
    });
    monthDiv.appendChild(title);

    const daysDiv = document.createElement("div");
    daysDiv.className = "days";

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const key = dateKey(d);

      const cell = document.createElement("div");
      cell.className = "day";

      if (data.entries[key]) {
        let daySum = 0;
        Object.entries(data.entries[key]).forEach(([idx, val]) => {
          const weight = data.exercises[idx]?.weight || 1;
          daySum += Math.floor(val / weight);
        });
        cell.textContent = daySum;
        cell.classList.add("ok");
      } else {
        cell.textContent = day;
      }

      cell.onclick = () => {
        datePicker.value = key;
        switchToTab("current");
      };

      daysDiv.appendChild(cell);
    }

    monthDiv.appendChild(daysDiv);
    yearGrid.appendChild(monthDiv);
  }

  updateYearTotal(year);
  renderPlot(year);
}

/* ---------- Plot: kumulativ + 1000er Linien ---------- */
function renderPlot(year) {
  const data = loadData();
  const entries = Object.entries(data.entries)
    .filter(([date]) => date.startsWith(year))
    .sort(([a], [b]) => new Date(a) - new Date(b));

  const width = statsPlot.width;
  const height = statsPlot.height;
  ctx.clearRect(0, 0, width, height);

  if (!entries.length) return;

  const daily = entries.map(([_, exs]) => {
    let sum = 0;
    Object.entries(exs).forEach(([idx, val]) => {
      const weight = data.exercises[idx]?.weight || 1;
      sum += Math.floor(val / weight);
    });
    return sum;
  });

  /* kumulative Werte */
  const cumulative = [];
  daily.reduce((acc, v, i) => {
    cumulative[i] = acc + v;
    return cumulative[i];
  }, 0);

  /* 🔧 Headroom oberhalb von 10.000 */
  const rawMax = Math.max(10000, ...cumulative);
  const maxVal = Math.ceil(rawMax / 1000) * 1000 + 1000;

  const stepX = width / (cumulative.length - 1 || 1);

  /* ---------- Referenzlinien ---------- */
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  for (let v = 1000; v <= maxVal; v += 1000) {
    const y = height - (v / maxVal) * height;

    ctx.beginPath();
    ctx.strokeStyle = v === 10000 ? "#E53935" : "#ccc";
    ctx.lineWidth = v === 10000 ? 2 : 1;
    ctx.setLineDash(v === 10000 ? [] : [4, 4]);
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle = v === 10000 ? "#E53935" : "#777";
    ctx.font = v === 10000
      ? "bold 12px system-ui"
      : "10px system-ui";

    ctx.fillText(v.toString(), 4, y - 2);
  }

  /* ---------- Kumulative Linie ---------- */
  ctx.beginPath();
  ctx.strokeStyle = "#3694E9";
  ctx.lineWidth = 2;

  cumulative.forEach((v, i) => {
    const x = i * stepX;
    const y = height - (v / maxVal) * height;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();
}


/* ---------- Tab Switching ---------- */
function switchToTab(view) {
  document.querySelectorAll("section").forEach(v => v.hidden = true);
  document.getElementById(view + "View").hidden = false;

  document.querySelectorAll(".tab").forEach(t =>
    t.classList.toggle("active", t.dataset.view === view)
  );

  if (view === "current") renderCurrent();
  if (view === "stats") {
    populateYearSelect();
    renderYearCalendar(yearSelect.value);
  }
}

document.querySelectorAll(".tab").forEach(btn => {
  btn.onclick = () => switchToTab(btn.dataset.view);
});

yearSelect.onchange = () =>
  renderYearCalendar(yearSelect.value);

/* ---------- Init ---------- */
function init() {
  closeAllModals();
  renderExercises();
  renderCurrent();
  populateYearSelect();
  if (yearSelect.value) renderYearCalendar(yearSelect.value);
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("pageshow", init);
