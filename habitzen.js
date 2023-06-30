/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/dataStoreCookie.ts":
/*!********************************!*\
  !*** ./src/dataStoreCookie.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HabitDataCookie": () => (/* binding */ HabitDataCookie)
/* harmony export */ });
var HabitDataCookie = /** @class */ (function () {
    function HabitDataCookie() {
        this.cookieName = "habit-data";
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



/***/ }),

/***/ "./src/habit.ts":
/*!**********************!*\
  !*** ./src/habit.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Habit": () => (/* binding */ Habit)
/* harmony export */ });
var Habit = /** @class */ (function () {
    function Habit() {
        this.streak = 0;
        this.icon = '<i class="fa-solid fa-star fa-3x"></i>';
        this.complete = false;
    }
    return Habit;
}());



/***/ }),

/***/ "./src/habits.ts":
/*!***********************!*\
  !*** ./src/habits.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Habits": () => (/* binding */ Habits)
/* harmony export */ });
/* harmony import */ var _dataStoreCookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dataStoreCookie */ "./src/dataStoreCookie.ts");

var Habits = /** @class */ (function () {
    function Habits() {
        this.dataStore = new _dataStoreCookie__WEBPACK_IMPORTED_MODULE_0__.HabitDataCookie();
        this.load();
    }
    Object.defineProperty(Habits.prototype, "list", {
        get: function () {
            this.load();
            return this.data;
        },
        enumerable: false,
        configurable: true
    });
    Habits.prototype.load = function () {
        var items = this.dataStore.load();
        items.sort(function (a, b) { return a.name.localeCompare(b.name); });
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
                value.icon = habit.icon;
                value.streak = habit.streak;
            }
        });
        this.saveAll();
    };
    Habits.prototype.complete = function (id) {
        this.list.forEach(function (habit) {
            if (habit.id == id) {
                habit.timestamp = new Date().getTime();
                habit.streak += 1;
            }
        });
        this.saveAll();
    };
    return Habits;
}());



/***/ }),

/***/ "./src/page.ts":
/*!*********************!*\
  !*** ./src/page.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Page": () => (/* binding */ Page)
/* harmony export */ });
/* harmony import */ var _habit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./habit */ "./src/habit.ts");
/* harmony import */ var _habits__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./habits */ "./src/habits.ts");


var Page = /** @class */ (function () {
    function Page() {
        this.habits = new _habits__WEBPACK_IMPORTED_MODULE_1__.Habits();
        this.mainActive = false;
        this.goldStreak = 7;
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
            if (habit.timestamp) {
                var lastCompleted = new Date(habit.timestamp);
                //isComplete = self.isSameDay(lastCompleted, today);
                habit.complete = self.isSameDay(lastCompleted, today);
                if (!habit.complete) {
                    var daysOverdue = self.getDaysOverdue(lastCompleted);
                    if (daysOverdue > 2) {
                        habit.streak = 0;
                        self.habits.save(habit);
                    }
                }
            }
            var element = document.createElement('div');
            //if (isComplete) {
            var isGold = habit.streak >= self.goldStreak;
            if (habit.complete && isGold) {
                element.className = "habit-item complete gold";
            }
            else if (habit.complete) {
                element.className = "habit-item complete";
            }
            else {
                element.className = "habit-item";
            }
            if (!habit.complete) {
                element.onclick = function () { self.complete(habit.id); };
            }
            var name = self.escapeHtml(habit.name);
            element.innerHTML = habit.icon;
            element.innerHTML += "<div style='margin-top: 15px;'>" + name + "</div>";
            element.innerHTML += "<span class='streak'>" + self.streakDisplay(habit.streak) + "</span>";
            divHabitList.appendChild(element);
        });
        if (divHabitList.childNodes.length == 0) {
            this.hide('quote');
            this.show('no-habits');
        }
        else {
            this.show('quote');
            this.hide('no-habits');
        }
        document.getElementById("debug-last-update").innerText = today.toISOString();
    };
    Page.prototype.streakDisplay = function (streak) {
        if (streak >= this.goldStreak) {
            return '<i class="fa-solid fa-star"></i>';
        }
        return streak.toString();
    };
    Page.prototype.isSameDay = function (a, b) {
        if (a == null || b == null) {
            return false;
        }
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    };
    Page.prototype.getDaysOverdue = function (completed) {
        var today = new Date();
        //TODO: fix this to adjust to daylight savings time
        var timeOffsetInMS = today.getTimezoneOffset() * 60000;
        today.setTime(today.getTime() - timeOffsetInMS);
        var diff = today.getTime() - completed.getTime();
        var days = diff / (1000 * 3600 * 24);
        return days;
    };
    Page.prototype.complete = function (id) {
        if (confirm("Complete this habit for today?")) {
            this.habits.complete(id);
            this.refreshHabits();
        }
    };
    Page.prototype.save = function () {
        var habit = new _habit__WEBPACK_IMPORTED_MODULE_0__.Habit();
        var divEdit = document.getElementById("edit");
        habit.id = divEdit.dataset.id;
        habit.name = document.getElementById("txt-edit-name").value;
        habit.icon = document.getElementById("ddl-edit-icon").value;
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
        document.getElementById("ddl-edit-icon").value = habit.icon;
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
    Page.prototype.getQuote = function () {
        var quotes = [
            '“Life is like riding a bicycle. To keep your balance you must keep moving.”<br>— Albert Einstein',
            '“In difficult times carry something beautiful in your heart.”<br>— Blaise Pascal'
        ];
        var quote = quotes[Math.floor(Math.random() * quotes.length)];
        return quote;
    };
    return Page;
}());



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./page */ "./src/page.ts");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.css */ "./src/style.css");


var Habitzen = /** @class */ (function () {
    function Habitzen() {
        this.page = new _page__WEBPACK_IMPORTED_MODULE_0__.Page();
        var self = this;
        document.addEventListener("DOMContentLoaded", function () {
            self.page.showMain();
        });
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "visible") {
                window.location.reload();
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUksR0FBSjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDO0FBTUQsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztBQUN4QyxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oYWJpdHplbi8uL3NyYy9zdHlsZS5jc3M/ZTMyMCIsIndlYnBhY2s6Ly9oYWJpdHplbi8uL3NyYy9kYXRhU3RvcmVDb29raWUudHMiLCJ3ZWJwYWNrOi8vaGFiaXR6ZW4vLi9zcmMvaGFiaXQudHMiLCJ3ZWJwYWNrOi8vaGFiaXR6ZW4vLi9zcmMvaGFiaXRzLnRzIiwid2VicGFjazovL2hhYml0emVuLy4vc3JjL3BhZ2UudHMiLCJ3ZWJwYWNrOi8vaGFiaXR6ZW4vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vaGFiaXR6ZW4vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2hhYml0emVuL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vaGFiaXR6ZW4vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9oYWJpdHplbi8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgeyBEYXRhU3RvcmUgfSBmcm9tIFwiLi9kYXRhU3RvcmVcIlxuaW1wb3J0IHsgSGFiaXQgfSBmcm9tIFwiLi9oYWJpdFwiXG5cbmV4cG9ydCBjbGFzcyBIYWJpdERhdGFDb29raWUgaW1wbGVtZW50cyBEYXRhU3RvcmUge1xuXG4gICAgcmVhZG9ubHkgY29va2llTmFtZTogc3RyaW5nID0gXCJoYWJpdC1kYXRhXCI7XG5cbiAgICBsb2FkKCk6IEFycmF5PEhhYml0PiB7XG4gICAgICAgIGxldCBjb29raWVEYXRhID0gdGhpcy5nZXRDb29raWUoKTtcblxuICAgICAgICBpZiAoIWNvb2tpZURhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQXJyYXk8SGFiaXQ+KCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoYWJpdHM6IEFycmF5PEhhYml0PiA9IEpTT04ucGFyc2UoY29va2llRGF0YSk7XG4gICAgICAgIHJldHVybiBoYWJpdHM7XG4gICAgfVxuXG4gICAgc2F2ZShoYWJpdERhdGE6IEFycmF5PEhhYml0Pik6IHZvaWQge1xuICAgICAgICBsZXQganNvbiA9IEpTT04uc3RyaW5naWZ5KGhhYml0RGF0YSk7XG4gICAgICAgIHRoaXMuc2V0Q29va2llKGpzb24pO1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBzZXRDb29raWUodmFsdWU6IHN0cmluZykge1xuICAgICAgICBkb2N1bWVudC5jb29raWUgPSB0aGlzLmNvb2tpZU5hbWUgKyBcIj1cIiArIHZhbHVlICsgXCI7U2FtZVNpdGU9U3RyaWN0O1NlY3VyZTsgZXhwaXJlcz1GcmksIDMxIERlYyA5OTk5IDIzOjU5OjU5IEdNVDsgcGF0aD0vXCI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDb29raWUoKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gXCI7IFwiICsgZG9jdW1lbnQuY29va2llO1xuICAgICAgICBjb25zdCBwYXJ0cyA9IHZhbHVlLnNwbGl0KFwiOyBcIiArIHRoaXMuY29va2llTmFtZSArIFwiPVwiKTtcblxuICAgICAgICBpZiAocGFydHMubGVuZ3RoID09IDIpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJ0cy5wb3AoKS5zcGxpdChcIjtcIikuc2hpZnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxufSIsImV4cG9ydCBjbGFzcyBIYWJpdCB7XG4gICAgaWQ6IHN0cmluZztcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgdGltZXN0YW1wOiBudW1iZXI7XG4gICAgc3RyZWFrOiBudW1iZXIgPSAwO1xuICAgIGljb246IHN0cmluZyA9ICc8aSBjbGFzcz1cImZhLXNvbGlkIGZhLXN0YXIgZmEtM3hcIj48L2k+JztcbiAgICBjb21wbGV0ZTogYm9vbGVhbiA9IGZhbHNlO1xufSIsImltcG9ydCB7IEhhYml0IH0gZnJvbSBcIi4vaGFiaXRcIjtcbmltcG9ydCB7IEhhYml0RGF0YUNvb2tpZSB9IGZyb20gXCIuL2RhdGFTdG9yZUNvb2tpZVwiO1xuaW1wb3J0IHsgRGF0YVN0b3JlIH0gZnJvbSBcIi4vZGF0YVN0b3JlXCI7XG5cblxuZXhwb3J0IGNsYXNzIEhhYml0cyB7XG5cbiAgICBkYXRhU3RvcmU6IERhdGFTdG9yZTtcbiAgICBkYXRhOiBBcnJheTxIYWJpdD47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kYXRhU3RvcmUgPSBuZXcgSGFiaXREYXRhQ29va2llKCk7XG4gICAgICAgIHRoaXMubG9hZCgpO1xuICAgIH1cblxuICAgIGdldCBsaXN0KCk6IEFycmF5PEhhYml0PiB7XG4gICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IGl0ZW1zID0gdGhpcy5kYXRhU3RvcmUubG9hZCgpO1xuICAgICAgICBpdGVtcy5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUpKVxuICAgICAgICB0aGlzLmRhdGEgPSBpdGVtcztcbiAgICB9XG5cbiAgICBkZWxldGUoaWQ6IHN0cmluZykge1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5saXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5saXN0W2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2F2ZUFsbCgpO1xuICAgIH1cblxuICAgIGdldChpZDogc3RyaW5nKTogSGFiaXQge1xuXG4gICAgICAgIGxldCBoYWJpdCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5saXN0LmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUuaWQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICBoYWJpdCA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gaGFiaXQ7XG4gICAgfVxuXG4gICAgc2F2ZShoYWJpdDogSGFiaXQpOiB2b2lkIHtcbiAgICAgICAgaWYgKGhhYml0LmlkKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGlmeShoYWJpdCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZShoYWJpdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2F2ZUFsbCgpIHtcbiAgICAgICAgdGhpcy5kYXRhU3RvcmUuc2F2ZSh0aGlzLmRhdGEpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlKGhhYml0OiBIYWJpdCkge1xuICAgICAgICBoYWJpdC5pZCA9IGNyeXB0by5yYW5kb21VVUlEKCk7XG4gICAgICAgIHRoaXMubGlzdC5wdXNoKGhhYml0KTtcbiAgICAgICAgdGhpcy5zYXZlQWxsKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtb2RpZnkoaGFiaXQ6IEhhYml0KSB7XG4gICAgICAgIHRoaXMubGlzdC5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlLmlkID09IGhhYml0LmlkKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUubmFtZSA9IGhhYml0Lm5hbWU7XG4gICAgICAgICAgICAgICAgdmFsdWUuaWNvbiA9IGhhYml0Lmljb247XG4gICAgICAgICAgICAgICAgdmFsdWUuc3RyZWFrID0gaGFiaXQuc3RyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNhdmVBbGwoKTtcbiAgICB9XG5cbiAgICBjb21wbGV0ZShpZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMubGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChoYWJpdCkge1xuICAgICAgICAgICAgaWYgKGhhYml0LmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgaGFiaXQudGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgaGFiaXQuc3RyZWFrICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2F2ZUFsbCgpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBIYWJpdCB9IGZyb20gXCIuL2hhYml0XCI7XG5pbXBvcnQgeyBIYWJpdHMgfSBmcm9tIFwiLi9oYWJpdHNcIjtcblxuZXhwb3J0IGNsYXNzIFBhZ2Uge1xuXG4gICAgaGFiaXRzOiBIYWJpdHMgPSBuZXcgSGFiaXRzKCk7XG4gICAgbWFpbkFjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGdvbGRTdHJlYWs6IG51bWJlciA9IDc7XG5cblxuICAgIHJlZnJlc2hIYWJpdHMoKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgZGl2SGFiaXRMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hhYml0LWxpc3QnKTtcbiAgICAgICAgdGhpcy5jbGVhcihkaXZIYWJpdExpc3QuaWQpO1xuXG4gICAgICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcblxuICAgICAgICAvL1RPRE86IGZpeCB0aGlzIHRvIGFkanVzdCB0byBkYXlsaWdodCBzYXZpbmdzIHRpbWVcbiAgICAgICAgdmFyIHRpbWVPZmZzZXRJbk1TOiBudW1iZXIgPSB0b2RheS5nZXRUaW1lem9uZU9mZnNldCgpICogNjAwMDA7XG4gICAgICAgIHRvZGF5LnNldFRpbWUodG9kYXkuZ2V0VGltZSgpIC0gdGltZU9mZnNldEluTVMpO1xuXG4gICAgICAgIHRoaXMuaGFiaXRzLmxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaGFiaXQpIHtcblxuICAgICAgICAgICAgaWYgKGhhYml0LnRpbWVzdGFtcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RDb21wbGV0ZWQgPSBuZXcgRGF0ZShoYWJpdC50aW1lc3RhbXApO1xuICAgICAgICAgICAgICAgIC8vaXNDb21wbGV0ZSA9IHNlbGYuaXNTYW1lRGF5KGxhc3RDb21wbGV0ZWQsIHRvZGF5KTtcbiAgICAgICAgICAgICAgICBoYWJpdC5jb21wbGV0ZSA9IHNlbGYuaXNTYW1lRGF5KGxhc3RDb21wbGV0ZWQsIHRvZGF5KTtcblxuICAgICAgICAgICAgICAgIGlmICghaGFiaXQuY29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF5c092ZXJkdWUgPSBzZWxmLmdldERheXNPdmVyZHVlKGxhc3RDb21wbGV0ZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXlzT3ZlcmR1ZSA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhYml0LnN0cmVhayA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhhYml0cy5zYXZlKGhhYml0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgICAgICAvL2lmIChpc0NvbXBsZXRlKSB7XG4gICAgICAgICAgICBjb25zdCBpc0dvbGQgPSBoYWJpdC5zdHJlYWsgPj0gc2VsZi5nb2xkU3RyZWFrO1xuXG4gICAgICAgICAgICBpZiAoaGFiaXQuY29tcGxldGUgJiYgaXNHb2xkKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBcImhhYml0LWl0ZW0gY29tcGxldGUgZ29sZFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChoYWJpdC5jb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gXCJoYWJpdC1pdGVtIGNvbXBsZXRlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gXCJoYWJpdC1pdGVtXCJcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFoYWJpdC5jb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQub25jbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5jb21wbGV0ZShoYWJpdC5pZCk7IH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzZWxmLmVzY2FwZUh0bWwoaGFiaXQubmFtZSk7XG4gICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IGhhYml0Lmljb247XG4gICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCArPSBcIjxkaXYgc3R5bGU9J21hcmdpbi10b3A6IDE1cHg7Jz5cIiArIG5hbWUgKyBcIjwvZGl2PlwiO1xuICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgKz0gXCI8c3BhbiBjbGFzcz0nc3RyZWFrJz5cIiArIHNlbGYuc3RyZWFrRGlzcGxheShoYWJpdC5zdHJlYWspICsgXCI8L3NwYW4+XCI7XG4gICAgICAgICAgICBkaXZIYWJpdExpc3QuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChkaXZIYWJpdExpc3QuY2hpbGROb2Rlcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5oaWRlKCdxdW90ZScpO1xuICAgICAgICAgICAgdGhpcy5zaG93KCduby1oYWJpdHMnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2hvdygncXVvdGUnKTtcbiAgICAgICAgICAgIHRoaXMuaGlkZSgnbm8taGFiaXRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYnVnLWxhc3QtdXBkYXRlXCIpLmlubmVyVGV4dCA9IHRvZGF5LnRvSVNPU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdHJlYWtEaXNwbGF5KHN0cmVhazogbnVtYmVyKTogc3RyaW5nIHtcblxuICAgICAgICBpZiAoc3RyZWFrID49IHRoaXMuZ29sZFN0cmVhaykge1xuICAgICAgICAgICAgcmV0dXJuICc8aSBjbGFzcz1cImZhLXNvbGlkIGZhLXN0YXJcIj48L2k+JztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdHJlYWsudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzU2FtZURheShhOiBEYXRlLCBiOiBEYXRlKSB7XG4gICAgICAgIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYS5nZXRGdWxsWWVhcigpID09PSBiLmdldEZ1bGxZZWFyKCkgJiYgYS5nZXRNb250aCgpID09PSBiLmdldE1vbnRoKCkgJiYgYS5nZXREYXRlKCkgPT09IGIuZ2V0RGF0ZSgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0RGF5c092ZXJkdWUoY29tcGxldGVkOiBEYXRlKSB7XG5cbiAgICAgICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAvL1RPRE86IGZpeCB0aGlzIHRvIGFkanVzdCB0byBkYXlsaWdodCBzYXZpbmdzIHRpbWVcbiAgICAgICAgdmFyIHRpbWVPZmZzZXRJbk1TOiBudW1iZXIgPSB0b2RheS5nZXRUaW1lem9uZU9mZnNldCgpICogNjAwMDA7XG4gICAgICAgIHRvZGF5LnNldFRpbWUodG9kYXkuZ2V0VGltZSgpIC0gdGltZU9mZnNldEluTVMpO1xuXG4gICAgICAgIHZhciBkaWZmID0gdG9kYXkuZ2V0VGltZSgpIC0gY29tcGxldGVkLmdldFRpbWUoKTtcbiAgICAgICAgdmFyIGRheXMgPSBkaWZmIC8gKDEwMDAgKiAzNjAwICogMjQpO1xuXG4gICAgICAgIHJldHVybiBkYXlzO1xuICAgIH1cblxuICAgIGNvbXBsZXRlKGlkOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKGNvbmZpcm0oXCJDb21wbGV0ZSB0aGlzIGhhYml0IGZvciB0b2RheT9cIikpIHtcbiAgICAgICAgICAgIHRoaXMuaGFiaXRzLmNvbXBsZXRlKGlkKTtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaEhhYml0cygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaGFiaXQgPSBuZXcgSGFiaXQoKTtcbiAgICAgICAgY29uc3QgZGl2RWRpdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdFwiKTtcbiAgICAgICAgaGFiaXQuaWQgPSBkaXZFZGl0LmRhdGFzZXQuaWQ7XG4gICAgICAgIGhhYml0Lm5hbWUgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0eHQtZWRpdC1uYW1lXCIpKS52YWx1ZTtcbiAgICAgICAgaGFiaXQuaWNvbiA9ICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRkbC1lZGl0LWljb25cIikpLnZhbHVlO1xuICAgICAgICB0aGlzLmhhYml0cy5zYXZlKGhhYml0KTtcbiAgICAgICAgdGhpcy5zaG93TWFpbigpO1xuICAgIH1cblxuICAgIGRlbGV0ZSgpIHtcbiAgICAgICAgaWYgKGNvbmZpcm0oXCJEZWxldGUgdGhpcyBoYWJpdD9cIikpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpdkVkaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRcIik7XG4gICAgICAgICAgICBjb25zdCBpZCA9IGRpdkVkaXQuZGF0YXNldC5pZDtcbiAgICAgICAgICAgIHRoaXMuaGFiaXRzLmRlbGV0ZShpZCk7XG4gICAgICAgICAgICB0aGlzLnNob3dNYWluKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93TWFpbigpIHtcbiAgICAgICAgdGhpcy5tYWluQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oaWRlQWxsU2VjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5zaG93KFwibWFpblwiKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoSGFiaXRzKCk7XG4gICAgICAgIHRoaXMuaGlkZShcImJ0bi1iYWNrXCIpO1xuICAgICAgICB0aGlzLnNob3coXCJidG4tb3B0aW9uc1wiKTtcbiAgICB9XG5cbiAgICBzaG93TmV3KCkge1xuICAgICAgICB0aGlzLm1haW5BY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0LXRpdGxlXCIpLmlubmVyVGV4dCA9IFwiQ3JlYXRlIE5ldyBIYWJpdFwiO1xuICAgICAgICBjb25zdCBkaXZFZGl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0XCIpO1xuICAgICAgICBkaXZFZGl0LmRhdGFzZXQuaWQgPSBcIlwiO1xuICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0eHQtZWRpdC1uYW1lXCIpKS52YWx1ZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuaGlkZUFsbFNlY3Rpb25zKCk7XG4gICAgICAgIHRoaXMuc2hvdyhcImVkaXRcIik7XG4gICAgICAgIHRoaXMuaGlkZShcImJ0bi1vcHRpb25zXCIpO1xuICAgICAgICB0aGlzLnNob3coXCJidG4tYmFja1wiKTtcbiAgICAgICAgdGhpcy5oaWRlKFwiYnRuLWVkaXQtZGVsZXRlXCIpO1xuICAgIH1cblxuICAgIHNob3dFZGl0KGlkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5tYWluQWN0aXZlID0gZmFsc2U7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdC10aXRsZVwiKS5pbm5lclRleHQgPSBcIkVkaXQgSGFiaXRcIjtcbiAgICAgICAgY29uc3QgZGl2RWRpdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdFwiKTtcbiAgICAgICAgZGl2RWRpdC5kYXRhc2V0LmlkID0gaWQ7XG4gICAgICAgIGxldCBoYWJpdCA9IHRoaXMuaGFiaXRzLmdldChpZCk7XG4gICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR4dC1lZGl0LW5hbWVcIikpLnZhbHVlID0gaGFiaXQubmFtZTtcbiAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGRsLWVkaXQtaWNvblwiKSkudmFsdWUgPSBoYWJpdC5pY29uO1xuICAgICAgICB0aGlzLmhpZGVBbGxTZWN0aW9ucygpO1xuICAgICAgICB0aGlzLnNob3coXCJlZGl0XCIpO1xuICAgICAgICB0aGlzLmhpZGUoXCJidG4tb3B0aW9uc1wiKTtcbiAgICAgICAgdGhpcy5zaG93KFwiYnRuLWJhY2tcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLWVkaXQtZGVsZXRlXCIpLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcbiAgICB9XG5cbiAgICBzaG93T3B0aW9ucygpIHtcbiAgICAgICAgdGhpcy5tYWluQWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaGlkZUFsbFNlY3Rpb25zKCk7XG4gICAgICAgIHRoaXMuc2hvdyhcIm9wdGlvbnNcIik7XG4gICAgICAgIHRoaXMuaGlkZShcImJ0bi1vcHRpb25zXCIpO1xuICAgICAgICB0aGlzLnNob3coXCJidG4tYmFja1wiKTtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBkaXZFZGl0TGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlZGl0LWxpc3QnKTtcbiAgICAgICAgdGhpcy5jbGVhcihkaXZFZGl0TGlzdC5pZCk7XG5cbiAgICAgICAgdGhpcy5oYWJpdHMubGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChoYWJpdCkge1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9IHNlbGYuZXNjYXBlSHRtbChoYWJpdC5uYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gXCI8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3M9J2J0biBidG4tZWRpdCcgb25jbGljaz0naGFiaXR6ZW4uZWRpdChcXFwiXCIgKyBoYWJpdC5pZCArIFwiXFxcIiknPuKcjiZuYnNwO1wiICsgbmFtZSArIFwiPC9idXR0b24+XCI7XG4gICAgICAgICAgICBkaXZFZGl0TGlzdC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZXNjYXBlSHRtbCh1bnNhZmU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdW5zYWZlXG4gICAgICAgICAgICAucmVwbGFjZSgvJi9nLCBcIiZhbXA7XCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC8+L2csIFwiJmd0O1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1wiL2csIFwiJnF1b3Q7XCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIiYjMDM5O1wiKTtcbiAgICB9XG5cblxuICAgIHByaXZhdGUgaGlkZUFsbFNlY3Rpb25zKCkge1xuICAgICAgICBjb25zdCBzZWN0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCcuc2VjdGlvbicpO1xuICAgICAgICBzZWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChzZWN0aW9uKSB7XG4gICAgICAgICAgICBzZWN0aW9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdyhpZDogc3RyaW5nKSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB9XG5cbiAgICBwcml2YXRlIGhpZGUoaWQ6IHN0cmluZykge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG5cbiAgICBwcml2YXRlIGNsZWFyKGlkOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9ICcnO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0UXVvdGUoKSB7XG5cbiAgICAgICAgY29uc3QgcXVvdGVzID0gW1xuICAgICAgICAgICAgJ+KAnExpZmUgaXMgbGlrZSByaWRpbmcgYSBiaWN5Y2xlLiBUbyBrZWVwIHlvdXIgYmFsYW5jZSB5b3UgbXVzdCBrZWVwIG1vdmluZy7igJ08YnI+4oCUIEFsYmVydCBFaW5zdGVpbicsXG4gICAgICAgICAgICAn4oCcSW4gZGlmZmljdWx0IHRpbWVzIGNhcnJ5IHNvbWV0aGluZyBiZWF1dGlmdWwgaW4geW91ciBoZWFydC7igJ08YnI+4oCUIEJsYWlzZSBQYXNjYWwnXG4gICAgICAgIF1cblxuICAgICAgICBjb25zdCBxdW90ZSA9IHF1b3Rlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBxdW90ZXMubGVuZ3RoKV07XG5cbiAgICAgICAgcmV0dXJuIHF1b3RlO1xuICAgIH1cblxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gJy4vcGFnZSc7XG5pbXBvcnQgXCIuL3N0eWxlLmNzc1wiO1xuXG5jbGFzcyBIYWJpdHplbiB7XG4gIHByaXZhdGUgcGFnZTogUGFnZSA9IG5ldyBQYWdlKCk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLnBhZ2Uuc2hvd01haW4oKTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ2aXNpYmlsaXR5Y2hhbmdlXCIsICgpID0+IHtcbiAgICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09IFwidmlzaWJsZVwiKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG1haW4oKSB7XG4gICAgdGhpcy5wYWdlLnNob3dNYWluKCk7XG4gIH1cblxuICBvcHRpb25zKCkge1xuICAgIHRoaXMucGFnZS5zaG93T3B0aW9ucygpO1xuICB9XG5cbiAgbmV3KCkge1xuICAgIHRoaXMucGFnZS5zaG93TmV3KCk7XG4gIH1cblxuICBlZGl0KGlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLnBhZ2Uuc2hvd0VkaXQoaWQpO1xuICB9XG5cbiAgZGVsZXRlKGlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLnBhZ2UuZGVsZXRlKCk7XG4gIH1cblxuICBzYXZlKCkge1xuICAgIHRoaXMucGFnZS5zYXZlKCk7XG4gIH1cbn1cblxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgV2luZG93IHsgaGFiaXR6ZW46IGFueTsgfVxufVxuXG53aW5kb3cuaGFiaXR6ZW4gPSB3aW5kb3cuaGFiaXR6ZW4gfHwge307XG53aW5kb3cuaGFiaXR6ZW4gPSBuZXcgSGFiaXR6ZW4oKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=