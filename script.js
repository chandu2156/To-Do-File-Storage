const taskInput = document.getElementById("taskinput");
const fileInput = document.getElementById("fileinput");
const taskList = document.getElementById("tasklist");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

function addTask() {
  const text = taskInput.value.trim();
  const file = fileInput.files[0];

  if (text === "" && !file) {
    alert("Please enter a task or upload a file!");
    return;
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const fileData = e.target.result;
      const task = {
        text,
        filename: file.name,
        fileData: fileData,
      };
      tasks.push(task);
      saveTasks();
      renderTasks();
    };
    reader.readAsDataURL(file);
  } else {
    const task = { text, filename: null, fileData: null };
    tasks.push(task);
    saveTasks();
    renderTasks();
  }

  taskInput.value = "";
  fileInput.value = "";
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    let html = "";
    if (task.text) html += `<p>${task.text}</p>`;

    if (task.fileData) {
      if (
        task.filename.endsWith(".png") ||
        task.filename.endsWith(".jpg") ||
        task.filename.endsWith(".jpeg") ||
        task.filename.endsWith(".gif")
      ) {
        html += `<img src="${task.fileData}" alt="${task.filename}" class="file-preview" onclick="openFile('${task.fileData}')">`;
      } else if (task.filename.endsWith(".pdf")) {
        html += `<iframe src="${task.fileData}" class="file-preview" onclick="openFile('${task.fileData}')"></iframe>`;
      } else {
        html += `<a href="${task.fileData}" target="_blank" class="file-link">${task.filename}</a>`;
      }
    }

    li.innerHTML = `
      ${html}
      <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

function openFile(fileUrl) {
  window.open(fileUrl, "_blank");
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
