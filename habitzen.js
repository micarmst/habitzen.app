/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/habit.ts
var Habit = /** @class */ (function () {
    function Habit() {
    }
    return Habit;
}());


;// CONCATENATED MODULE: ./src/dataStoreCookie.ts
var HabitDataCookie = /** @class */ (function () {
    function HabitDataCookie() {
        this.cookieName = "habitzen.data";
    }
    HabitDataCookie.prototype.load = function () {
        var cookieData = this.getCookie();
        if (!cookieData) {
            return new Array();
        }
        var habits = JSON.parse(cookieData);
        return habits;
    };
    HabitDataCookie.prototype.save = function (habitData) {
        var json = JSON.stringify(habitData);
        this.setCookie(json);
        console.log("DataStoreCookie: save");
    };
    HabitDataCookie.prototype.setCookie = function (value) {
        document.cookie = this.cookieName + "=" + value + ";SameSite=Strict;Secure; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    };
    HabitDataCookie.prototype.getCookie = function () {
        var value = "; " + document.cookie;
        var parts = value.split("; " + this.cookieName + "=");
        if (parts.length == 2) {
            return parts.pop().split(";").shift();
        }
    };
    return HabitDataCookie;
}());


;// CONCATENATED MODULE: ./src/habits.ts

var Habits = /** @class */ (function () {
    function Habits() {
        this.dataStore = new HabitDataCookie();
        this.load();
    }
    Object.defineProperty(Habits.prototype, "list", {
        get: function () {
            return this.data;
        },
        enumerable: false,
        configurable: true
    });
    Habits.prototype.load = function () {
        var items = this.dataStore.load();
        this.data = items;
    };
    Habits.prototype.delete = function (id) {
        for (var i = this.list.length - 1; i >= 0; --i) {
            if (this.list[i].id == id) {
                this.list.splice(i, 1);
            }
        }
        this.saveAll();
    };
    Habits.prototype.get = function (id) {
        var habit = null;
        this.list.forEach(function (value) {
            if (value.id == id) {
                habit = value;
            }
        });
        return habit;
    };
    Habits.prototype.save = function (habit) {
        if (habit.id) {
            this.modify(habit);
        }
        else {
            this.create(habit);
        }
    };
    Habits.prototype.saveAll = function () {
        this.dataStore.save(this.data);
    };
    Habits.prototype.create = function (habit) {
        habit.id = crypto.randomUUID();
        this.list.push(habit);
        this.saveAll();
    };
    Habits.prototype.modify = function (habit) {
        this.list.forEach(function (value) {
            if (value.id == habit.id) {
                value.name = habit.name;
            }
        });
        this.saveAll();
    };
    Habits.prototype.complete = function (id) {
        this.list.forEach(function (habit) {
            if (habit.id == id) {
                habit.timestamp = new Date().getTime();
            }
        });
        this.saveAll();
    };
    return Habits;
}());


;// CONCATENATED MODULE: ./src/page.ts


var Page = /** @class */ (function () {
    function Page() {
        this.habits = new Habits();
        this.mainActive = false;
    }
    Page.prototype.refreshHabits = function () {
        var self = this;
        var divHabitList = document.getElementById('habit-list');
        this.clear(divHabitList.id);
        var today = new Date();
        //TODO: fix this to adjust to daylight savings time
        var timeOffsetInMS = today.getTimezoneOffset() * 60000;
        today.setTime(today.getTime() - timeOffsetInMS);
        this.habits.list.forEach(function (habit) {
            var isComplete = false;
            if (habit.timestamp) {
                var lastCompleted = new Date(habit.timestamp);
                isComplete = self.isSameDay(lastCompleted, today);
            }
            var element = document.createElement('div');
            if (isComplete) {
                element.className = "habit-item complete";
            }
            else {
                element.className = "habit-item";
            }
            var name = self.escapeHtml(habit.name);
            element.onclick = function () { self.complete(habit.id); };
            element.innerHTML = "<span>" + name + "</span>";
            divHabitList.appendChild(element);
        });
        document.getElementById("debug-last-update").innerText = today.toISOString();
    };
    Page.prototype.isSameDay = function (a, b) {
        if (a == null || b == null) {
            return false;
        }
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    };
    Page.prototype.complete = function (id) {
        if (confirm("Complete this habit for today?")) {
            this.habits.complete(id);
            this.refreshHabits();
        }
    };
    Page.prototype.save = function () {
        var habit = new Habit();
        var divEdit = document.getElementById("edit");
        habit.id = divEdit.dataset.id;
        habit.name = document.getElementById("txt-edit-name").value;
        this.habits.save(habit);
        this.showMain();
    };
    Page.prototype.delete = function () {
        if (confirm("Delete this habit?")) {
            var divEdit = document.getElementById("edit");
            var id = divEdit.dataset.id;
            this.habits.delete(id);
            this.showMain();
        }
    };
    Page.prototype.showMain = function () {
        this.mainActive = true;
        this.hideAllSections();
        this.show("main");
        this.refreshHabits();
        this.hide("btn-back");
        this.show("btn-options");
    };
    Page.prototype.showNew = function () {
        this.mainActive = false;
        document.getElementById("edit-title").innerText = "Create New Habit";
        var divEdit = document.getElementById("edit");
        divEdit.dataset.id = "";
        document.getElementById("txt-edit-name").value = "";
        this.hideAllSections();
        this.show("edit");
        this.hide("btn-options");
        this.show("btn-back");
        this.hide("btn-edit-delete");
    };
    Page.prototype.showEdit = function (id) {
        this.mainActive = false;
        document.getElementById("edit-title").innerText = "Edit Habit";
        var divEdit = document.getElementById("edit");
        divEdit.dataset.id = id;
        var habit = this.habits.get(id);
        document.getElementById("txt-edit-name").value = habit.name;
        this.hideAllSections();
        this.show("edit");
        this.hide("btn-options");
        this.show("btn-back");
        document.getElementById("btn-edit-delete").style.display = 'inline-block';
    };
    Page.prototype.showOptions = function () {
        this.mainActive = false;
        this.hideAllSections();
        this.show("options");
        this.hide("btn-options");
        this.show("btn-back");
        var self = this;
        var divEditList = document.getElementById('edit-list');
        this.clear(divEditList.id);
        this.habits.list.forEach(function (habit) {
            var name = self.escapeHtml(habit.name);
            var element = document.createElement('div');
            element.innerHTML = "<button type='button' class='btn btn-edit' onclick='habitzen.edit(\"" + habit.id + "\")'>✎&nbsp;" + name + "</button>";
            divEditList.appendChild(element);
        });
    };
    Page.prototype.escapeHtml = function (unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };
    Page.prototype.hideAllSections = function () {
        var sections = document.querySelectorAll('.section');
        sections.forEach(function (section) {
            section.style.display = 'none';
        });
    };
    Page.prototype.show = function (id) {
        document.getElementById(id).style.display = 'block';
    };
    Page.prototype.hide = function (id) {
        document.getElementById(id).style.display = 'none';
    };
    Page.prototype.clear = function (id) {
        var element = document.getElementById(id);
        element.textContent = '';
    };
    return Page;
}());


;// CONCATENATED MODULE: ./src/index.ts


var Habitzen = /** @class */ (function () {
    function Habitzen() {
        this.page = new Page();
        var self = this;
        document.addEventListener("DOMContentLoaded", function () {
            self.page.showMain();
        });
        // Refresh on focus
        document.addEventListener("focus", function () {
            //self.page.refreshHabits();
        });
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "visible") {
                alert('test');
            }
        });
    }
    Habitzen.prototype.main = function () {
        this.page.showMain();
    };
    Habitzen.prototype.options = function () {
        this.page.showOptions();
    };
    Habitzen.prototype.new = function () {
        this.page.showNew();
    };
    Habitzen.prototype.edit = function (id) {
        this.page.showEdit(id);
    };
    Habitzen.prototype.delete = function (id) {
        this.page.delete();
    };
    Habitzen.prototype.save = function () {
        this.page.save();
    };
    return Habitzen;
}());
window.habitzen = window.habitzen || {};
window.habitzen = new Habitzen();

/******/ })()
;