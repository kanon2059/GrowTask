const input = document.getElementById("taskInput");
const button = document.getElementById("addButton");


// ====================
// ゲームデータ
// ====================

let exp = 30;
let level = 1;
let tasks = [];


// ====================
// セーブデータを読み込む
// ====================

function loadGame() {

    const savedGame = localStorage.getItem("growTaskData");

    if (savedGame) {

        const data = JSON.parse(savedGame);

        exp = data.exp;
        level = data.level;
        tasks = data.tasks;

        // HTMLにある最初のタスクを消す
        document.querySelector(".task-list").innerHTML = "";

        // 保存されていたタスクを表示
        tasks.forEach(function (taskData) {

            createTask(
                taskData.name,
                taskData.completed
            );

        });

    }

    updateExp();
    updateLevel();
    growIsland();

}


// ====================
// ゲームを保存
// ====================

function saveGame() {

    const gameData = {

        exp: exp,
        level: level,
        tasks: tasks

    };

    localStorage.setItem(
        "growTaskData",
        JSON.stringify(gameData)
    );

}


// ====================
// タスクを作る
// ====================

function createTask(taskName, completed = false) {

    const taskList = document.querySelector(".task-list");

    const task = document.createElement("div");

    task.className = "task";

    if (completed) {
        task.classList.add("completed");
    }

    task.innerHTML = `
        <button class="check">${completed ? "✓" : "○"}</button>
        <span>${taskName}</span>
        <span class="point">+10 EXP</span>
        <button class="delete">🗑️</button>
    `;

    taskList.appendChild(task);

    setupTask(task);

}


// ====================
// タスクの機能
// ====================

function setupTask(task) {

    const checkButton = task.querySelector(".check");
    const deleteButton = task.querySelector(".delete");
    const taskName = task.querySelector("span").textContent;


    // 完了ボタン
    checkButton.addEventListener("click", function () {

        if (task.classList.contains("completed")) {
            return;
        }

        task.classList.add("completed");

        checkButton.textContent = "✓";

        // EXPを増やす
        addExp(10);

        // タスクデータを更新
        const targetTask = tasks.find(function (item) {
            return item.name === taskName;
        });

        if (targetTask) {
            targetTask.completed = true;
        }

        saveGame();

    });


    // 削除ボタン
    deleteButton.addEventListener("click", function () {

        task.remove();

        // タスクデータから削除
        tasks = tasks.filter(function (item) {
            return item.name !== taskName;
        });

        saveGame();

    });

}


// ====================
// タスク追加
// ====================

button.addEventListener("click", addTask);


// Enterでも追加
input.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        addTask();
    }

});


function addTask() {

    const taskName = input.value.trim();

    if (taskName === "") {
        return;
    }


    // データに追加
    tasks.push({
        name: taskName,
        completed: false
    });


    // 画面に追加
    createTask(taskName);


    input.value = "";

    saveGame();

}


// ====================
// EXPを増やす
// ====================

function addExp(amount) {

    exp += amount;


    if (exp >= 100) {

        levelUp();

    }


    updateExp();

    saveGame();

}


// ====================
// レベルアップ
// ====================

function levelUp() {

    level++;

    exp = exp - 100;

    updateLevel();

    growIsland();

    showLevelUp();

}


// ====================
// EXP表示
// ====================

function updateExp() {

    const expBar = document.querySelector(".exp");

    expBar.style.width = exp + "%";


    const expText = document.querySelector(".exp-text");

    expText.textContent =
        exp + " / 100 EXP";

}


// ====================
// LEVEL表示
// ====================

function updateLevel() {

    const levelText =
        document.querySelector(".level span:first-child");

    levelText.textContent =
        "LEVEL " + level;

}


// ====================
// 島を成長させる
// ====================

function growIsland() {

    const tree = document.querySelector(".tree");


    if (level === 1) {

        tree.textContent = "🌱";

    }

    else if (level === 2) {

        tree.textContent = "🌳";

    }

    else if (level === 3) {

        tree.textContent = "🌳🏠";

    }

    else if (level === 4) {

        tree.textContent = "🌳🏠🌷";

    }

    else {

        tree.textContent = "🌳🏠🌷🌳";

    }

}


// ====================
// LEVEL UP演出
// ====================

function showLevelUp() {

    const message =
        document.createElement("div");

    message.className = "level-up";

    message.textContent =
        "🎉 LEVEL UP! 🎉";

    document.body.appendChild(message);


    setTimeout(function () {

        message.remove();

    }, 2000);

}


// ====================
// ゲーム開始
// ====================

loadGame();

// ====================
// PWA Service Worker
// ====================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", function () {

        navigator.serviceWorker.register("./sw.js")
            .then(function () {

                console.log("Service Worker registered!");

            })
            .catch(function (error) {

                console.log(
                    "Service Worker registration failed:",
                    error
                );

            });

    });

}