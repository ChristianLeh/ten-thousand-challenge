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
  return date.toISOString().slice(0, 10);
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

/* ---------- Settings ---------- */
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

/* ---------- Events ---------- */
document.getElementById("addExerciseBtn").onclick = () => openExerciseModal();

document.getElementById("exerciseCancelBtn").onclick = closeAllModals;
document.getElementById("deleteCancelBtn").onclick = closeAllModals;

document.getElementById("exerciseSaveBtn").onclick = () => {
  const data = loadData();
  const ex = {
    name: exerciseName.value.trim(),
    weight: Number(exerciseWeight.value),
    unit: exerciseUnit.value
  };

  if (editingIndex === null) data.exercises.push(ex);
  else data.exercises[editingIndex] = ex;

  saveData(data);
  closeAllModals();
  renderExercises();
};

document.getElementById("deleteConfirmBtn").onclick = () => {
  const data = loadData();
  data.exercises.splice(deletingIndex, 1);
  saveData(data);
  closeAllModals();
  renderExercises();
};

/* ---------- Tabs ---------- */
document.querySelectorAll(".tab").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll("section").forEach(v => v.hidden = true);
    document.getElementById(btn.dataset.view + "View").hidden = false;
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
  };
});

/* ---------- Init ---------- */
function init() {
  // Modals niemals beim Start öffnen
  closeAllModals();
  renderExercises();
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("pageshow", init);
