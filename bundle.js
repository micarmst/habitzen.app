/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
        this.cookieName = "habitzen.data";
    }
    HabitDataCookie.prototype.load = function () {
        var value = this.getCookie();
        if (!value) {
            return new Array();
        }
        //console.log("Loaded Value: " + value)
        var items = JSON.parse(value);
        return items;
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
    }
    Page.prototype.refreshHabits = function () {
        var self = this;
        var divHabitList = document.getElementById('habit-list');
        this.clear(divHabitList.id);
        var today = new Date();
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
        document.getElementById("debug-last-update").innerText = today.toJSON();
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
        var habit = new _habit__WEBPACK_IMPORTED_MODULE_0__.Habit();
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

var Habitzen = /** @class */ (function () {
    function Habitzen() {
        this.page = new _page__WEBPACK_IMPORTED_MODULE_0__.Page();
        var self = this;
        document.addEventListener("DOMContentLoaded", function () {
            self.page.showMain();
        });
        // Refresh on focus
        document.addEventListener("focus", function () {
            self.page.refreshHabits();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SCxtQkFBbUI7UUFDbkIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRTtZQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHVCQUFJLEdBQUo7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCwwQkFBTyxHQUFQO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsc0JBQUcsR0FBSDtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVELHVCQUFJLEdBQUosVUFBSyxFQUFVO1FBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVELHlCQUFNLEdBQU4sVUFBTyxFQUFVO1FBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsdUJBQUksR0FBSjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDO0FBTUQsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztBQUN4QyxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oYWJpdHplbi8uL3NyYy9kYXRhU3RvcmVDb29raWUudHMiLCJ3ZWJwYWNrOi8vaGFiaXR6ZW4vLi9zcmMvaGFiaXQudHMiLCJ3ZWJwYWNrOi8vaGFiaXR6ZW4vLi9zcmMvaGFiaXRzLnRzIiwid2VicGFjazovL2hhYml0emVuLy4vc3JjL3BhZ2UudHMiLCJ3ZWJwYWNrOi8vaGFiaXR6ZW4vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vaGFiaXR6ZW4vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2hhYml0emVuL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vaGFiaXR6ZW4vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9oYWJpdHplbi8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEYXRhU3RvcmUgfSBmcm9tIFwiLi9kYXRhU3RvcmVcIlxuaW1wb3J0IHsgSGFiaXQgfSBmcm9tIFwiLi9oYWJpdFwiXG5cbmV4cG9ydCBjbGFzcyBIYWJpdERhdGFDb29raWUgaW1wbGVtZW50cyBEYXRhU3RvcmUge1xuXG4gICAgcmVhZG9ubHkgY29va2llTmFtZTogc3RyaW5nID0gXCJoYWJpdHplbi5kYXRhXCI7XG5cbiAgICBsb2FkKCk6IEFycmF5PEhhYml0PiB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuZ2V0Q29va2llKCk7XG5cbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBcnJheTxIYWJpdD4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJMb2FkZWQgVmFsdWU6IFwiICsgdmFsdWUpXG4gICAgICAgIGxldCBpdGVtcyA9IEpTT04ucGFyc2UodmFsdWUpXG4gICAgICAgIHJldHVybiBpdGVtcztcbiAgICB9XG5cbiAgICBzYXZlKGhhYml0RGF0YTogQXJyYXk8SGFiaXQ+KTogdm9pZCB7XG4gICAgICAgIGxldCBqc29uID0gSlNPTi5zdHJpbmdpZnkoaGFiaXREYXRhKTtcbiAgICAgICAgdGhpcy5zZXRDb29raWUoanNvbik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGF0YVN0b3JlQ29va2llOiBzYXZlXCIpXG4gICAgfVxuXG5cbiAgICBwcml2YXRlIHNldENvb2tpZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IHRoaXMuY29va2llTmFtZSArIFwiPVwiICsgdmFsdWUgKyBcIjtTYW1lU2l0ZT1TdHJpY3Q7U2VjdXJlOyBleHBpcmVzPUZyaSwgMzEgRGVjIDk5OTkgMjM6NTk6NTkgR01UOyBwYXRoPS9cIjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldENvb2tpZSgpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBcIjsgXCIgKyBkb2N1bWVudC5jb29raWU7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gdmFsdWUuc3BsaXQoXCI7IFwiICsgdGhpcy5jb29raWVOYW1lICsgXCI9XCIpO1xuXG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT0gMikge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnRzLnBvcCgpLnNwbGl0KFwiO1wiKS5zaGlmdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwiZXhwb3J0IGNsYXNzIEhhYml0IHtcbiAgICBpZDogc3RyaW5nO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICB0aW1lc3RhbXA6IG51bWJlcjtcbn0iLCJpbXBvcnQgeyBIYWJpdCB9IGZyb20gXCIuL2hhYml0XCI7XG5pbXBvcnQgeyBIYWJpdERhdGFDb29raWUgfSBmcm9tIFwiLi9kYXRhU3RvcmVDb29raWVcIjtcbmltcG9ydCB7IERhdGFTdG9yZSB9IGZyb20gXCIuL2RhdGFTdG9yZVwiO1xuXG5cbmV4cG9ydCBjbGFzcyBIYWJpdHMge1xuXG4gICAgZGF0YVN0b3JlOiBEYXRhU3RvcmU7XG4gICAgZGF0YTogQXJyYXk8SGFiaXQ+O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZGF0YVN0b3JlID0gbmV3IEhhYml0RGF0YUNvb2tpZSgpO1xuICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICB9XG5cbiAgICBnZXQgbGlzdCgpOiBBcnJheTxIYWJpdD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IGl0ZW1zID0gdGhpcy5kYXRhU3RvcmUubG9hZCgpO1xuICAgICAgICB0aGlzLmRhdGEgPSBpdGVtcztcbiAgICB9XG5cbiAgICBkZWxldGUoaWQ6IHN0cmluZykge1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5saXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5saXN0W2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2F2ZUFsbCgpO1xuICAgIH1cblxuICAgIGdldChpZDogc3RyaW5nKTogSGFiaXQge1xuXG4gICAgICAgIGxldCBoYWJpdCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5saXN0LmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUuaWQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICBoYWJpdCA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gaGFiaXQ7XG4gICAgfVxuXG4gICAgc2F2ZShoYWJpdDogSGFiaXQpOiB2b2lkIHtcbiAgICAgICAgaWYgKGhhYml0LmlkKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGlmeShoYWJpdCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZShoYWJpdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNhdmVBbGwoKSB7XG4gICAgICAgIHRoaXMuZGF0YVN0b3JlLnNhdmUodGhpcy5kYXRhKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZShoYWJpdDogSGFiaXQpIHtcbiAgICAgICAgaGFiaXQuaWQgPSBjcnlwdG8ucmFuZG9tVVVJRCgpO1xuICAgICAgICB0aGlzLmxpc3QucHVzaChoYWJpdCk7XG4gICAgICAgIHRoaXMuc2F2ZUFsbCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbW9kaWZ5KGhhYml0OiBIYWJpdCkge1xuICAgICAgICB0aGlzLmxpc3QuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5pZCA9PSBoYWJpdC5pZCkge1xuICAgICAgICAgICAgICAgIHZhbHVlLm5hbWUgPSBoYWJpdC5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNhdmVBbGwoKTtcbiAgICB9XG5cbiAgICBjb21wbGV0ZShpZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMubGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChoYWJpdCkge1xuICAgICAgICAgICAgaWYgKGhhYml0LmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgaGFiaXQudGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2F2ZUFsbCgpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBIYWJpdCB9IGZyb20gXCIuL2hhYml0XCI7XG5pbXBvcnQgeyBIYWJpdHMgfSBmcm9tIFwiLi9oYWJpdHNcIjtcblxuZXhwb3J0IGNsYXNzIFBhZ2Uge1xuXG4gICAgaGFiaXRzOiBIYWJpdHMgPSBuZXcgSGFiaXRzKCk7XG4gICAgbWFpbkFjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG5cbiAgICByZWZyZXNoSGFiaXRzKCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGRpdkhhYml0TGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoYWJpdC1saXN0Jyk7XG4gICAgICAgIHRoaXMuY2xlYXIoZGl2SGFiaXRMaXN0LmlkKTtcblxuICAgICAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgdGhpcy5oYWJpdHMubGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChoYWJpdCkge1xuICAgICAgICAgICAgbGV0IGlzQ29tcGxldGUgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKGhhYml0LnRpbWVzdGFtcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RDb21wbGV0ZWQgPSBuZXcgRGF0ZShoYWJpdC50aW1lc3RhbXApO1xuICAgICAgICAgICAgICAgIGlzQ29tcGxldGUgPSBzZWxmLmlzU2FtZURheShsYXN0Q29tcGxldGVkLCB0b2RheSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICAgICAgaWYgKGlzQ29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IFwiaGFiaXQtaXRlbSBjb21wbGV0ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IFwiaGFiaXQtaXRlbVwiXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzZWxmLmVzY2FwZUh0bWwoaGFiaXQubmFtZSk7XG4gICAgICAgICAgICBlbGVtZW50Lm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuY29tcGxldGUoaGFiaXQuaWQpOyB9O1xuICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBcIjxzcGFuPlwiICsgbmFtZSArIFwiPC9zcGFuPlwiO1xuICAgICAgICAgICAgZGl2SGFiaXRMaXN0LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYnVnLWxhc3QtdXBkYXRlXCIpLmlubmVyVGV4dCA9IHRvZGF5LnRvSlNPTigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNTYW1lRGF5KGE6IERhdGUsIGI6IERhdGUpIHtcbiAgICAgICAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhLmdldEZ1bGxZZWFyKCkgPT09IGIuZ2V0RnVsbFllYXIoKSAmJiBhLmdldE1vbnRoKCkgPT09IGIuZ2V0TW9udGgoKSAmJiBhLmdldERhdGUoKSA9PT0gYi5nZXREYXRlKCk7XG4gICAgfVxuXG4gICAgY29tcGxldGUoaWQ6IHN0cmluZykge1xuICAgICAgICBpZiAoY29uZmlybShcIkNvbXBsZXRlIHRoaXMgaGFiaXQgZm9yIHRvZGF5P1wiKSkge1xuICAgICAgICAgICAgdGhpcy5oYWJpdHMuY29tcGxldGUoaWQpO1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoSGFiaXRzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzYXZlKCkge1xuICAgICAgICBjb25zdCBoYWJpdCA9IG5ldyBIYWJpdCgpO1xuICAgICAgICBjb25zdCBkaXZFZGl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0XCIpO1xuICAgICAgICBoYWJpdC5pZCA9IGRpdkVkaXQuZGF0YXNldC5pZDtcbiAgICAgICAgaGFiaXQubmFtZSA9ICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR4dC1lZGl0LW5hbWVcIikpLnZhbHVlO1xuICAgICAgICB0aGlzLmhhYml0cy5zYXZlKGhhYml0KTtcbiAgICAgICAgdGhpcy5zaG93TWFpbigpO1xuICAgIH1cblxuICAgIGRlbGV0ZSgpIHtcbiAgICAgICAgaWYgKGNvbmZpcm0oXCJEZWxldGUgdGhpcyBoYWJpdD9cIikpIHtcbiAgICAgICAgICAgIGNvbnN0IGRpdkVkaXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRcIik7XG4gICAgICAgICAgICBjb25zdCBpZCA9IGRpdkVkaXQuZGF0YXNldC5pZDtcbiAgICAgICAgICAgIHRoaXMuaGFiaXRzLmRlbGV0ZShpZCk7XG4gICAgICAgICAgICB0aGlzLnNob3dNYWluKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93TWFpbigpIHtcbiAgICAgICAgdGhpcy5tYWluQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oaWRlQWxsU2VjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5zaG93KFwibWFpblwiKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoSGFiaXRzKCk7XG4gICAgICAgIHRoaXMuaGlkZShcImJ0bi1iYWNrXCIpO1xuICAgICAgICB0aGlzLnNob3coXCJidG4tb3B0aW9uc1wiKTtcbiAgICB9XG5cbiAgICBzaG93TmV3KCkge1xuICAgICAgICB0aGlzLm1haW5BY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0LXRpdGxlXCIpLmlubmVyVGV4dCA9IFwiQ3JlYXRlIE5ldyBIYWJpdFwiO1xuICAgICAgICBjb25zdCBkaXZFZGl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0XCIpO1xuICAgICAgICBkaXZFZGl0LmRhdGFzZXQuaWQgPSBcIlwiO1xuICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0eHQtZWRpdC1uYW1lXCIpKS52YWx1ZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuaGlkZUFsbFNlY3Rpb25zKCk7XG4gICAgICAgIHRoaXMuc2hvdyhcImVkaXRcIik7XG4gICAgICAgIHRoaXMuaGlkZShcImJ0bi1vcHRpb25zXCIpO1xuICAgICAgICB0aGlzLnNob3coXCJidG4tYmFja1wiKTtcbiAgICAgICAgdGhpcy5oaWRlKFwiYnRuLWVkaXQtZGVsZXRlXCIpO1xuICAgIH1cblxuICAgIHNob3dFZGl0KGlkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5tYWluQWN0aXZlID0gZmFsc2U7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdC10aXRsZVwiKS5pbm5lclRleHQgPSBcIkVkaXQgSGFiaXRcIjtcbiAgICAgICAgY29uc3QgZGl2RWRpdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdFwiKTtcbiAgICAgICAgZGl2RWRpdC5kYXRhc2V0LmlkID0gaWQ7XG4gICAgICAgIGxldCBoYWJpdCA9IHRoaXMuaGFiaXRzLmdldChpZCk7XG4gICAgICAgICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR4dC1lZGl0LW5hbWVcIikpLnZhbHVlID0gaGFiaXQubmFtZTtcbiAgICAgICAgdGhpcy5oaWRlQWxsU2VjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5zaG93KFwiZWRpdFwiKTtcbiAgICAgICAgdGhpcy5oaWRlKFwiYnRuLW9wdGlvbnNcIik7XG4gICAgICAgIHRoaXMuc2hvdyhcImJ0bi1iYWNrXCIpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ0bi1lZGl0LWRlbGV0ZVwiKS5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XG4gICAgfVxuXG4gICAgc2hvd09wdGlvbnMoKSB7XG4gICAgICAgIHRoaXMubWFpbkFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmhpZGVBbGxTZWN0aW9ucygpO1xuICAgICAgICB0aGlzLnNob3coXCJvcHRpb25zXCIpO1xuICAgICAgICB0aGlzLmhpZGUoXCJidG4tb3B0aW9uc1wiKTtcbiAgICAgICAgdGhpcy5zaG93KFwiYnRuLWJhY2tcIik7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgZGl2RWRpdExpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZWRpdC1saXN0Jyk7XG4gICAgICAgIHRoaXMuY2xlYXIoZGl2RWRpdExpc3QuaWQpO1xuXG4gICAgICAgIHRoaXMuaGFiaXRzLmxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaGFiaXQpIHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzZWxmLmVzY2FwZUh0bWwoaGFiaXQubmFtZSk7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IFwiPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzPSdidG4gYnRuLWVkaXQnIG9uY2xpY2s9J2hhYml0emVuLmVkaXQoXFxcIlwiICsgaGFiaXQuaWQgKyBcIlxcXCIpJz7inI4mbmJzcDtcIiArIG5hbWUgKyBcIjwvYnV0dG9uPlwiO1xuICAgICAgICAgICAgZGl2RWRpdExpc3QuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGVzY2FwZUh0bWwodW5zYWZlOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHVuc2FmZVxuICAgICAgICAgICAgLnJlcGxhY2UoLyYvZywgXCImYW1wO1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCBcIiZxdW90O1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCImIzAzOTtcIik7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIGhpZGVBbGxTZWN0aW9ucygpIHtcbiAgICAgICAgY29uc3Qgc2VjdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PignLnNlY3Rpb24nKTtcbiAgICAgICAgc2VjdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoc2VjdGlvbikge1xuICAgICAgICAgICAgc2VjdGlvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3coaWQ6IHN0cmluZykge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoaWRlKGlkOiBzdHJpbmcpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbGVhcihpZDogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSAnJztcbiAgICB9XG5cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFBhZ2UgfSBmcm9tICcuL3BhZ2UnO1xuXG5jbGFzcyBIYWJpdHplbiB7XG4gIHByaXZhdGUgcGFnZTogUGFnZSA9IG5ldyBQYWdlKCk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLnBhZ2Uuc2hvd01haW4oKTtcbiAgICB9KTtcblxuICAgIC8vIFJlZnJlc2ggb24gZm9jdXNcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5wYWdlLnJlZnJlc2hIYWJpdHMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG1haW4oKSB7XG4gICAgdGhpcy5wYWdlLnNob3dNYWluKCk7XG4gIH1cblxuICBvcHRpb25zKCkge1xuICAgIHRoaXMucGFnZS5zaG93T3B0aW9ucygpO1xuICB9XG5cbiAgbmV3KCkge1xuICAgIHRoaXMucGFnZS5zaG93TmV3KCk7XG4gIH1cblxuICBlZGl0KGlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLnBhZ2Uuc2hvd0VkaXQoaWQpO1xuICB9XG5cbiAgZGVsZXRlKGlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLnBhZ2UuZGVsZXRlKCk7XG4gIH1cblxuICBzYXZlKCkge1xuICAgIHRoaXMucGFnZS5zYXZlKCk7XG4gIH1cbn1cblxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgV2luZG93IHsgaGFiaXR6ZW46IGFueTsgfVxufVxuXG53aW5kb3cuaGFiaXR6ZW4gPSB3aW5kb3cuaGFiaXR6ZW4gfHwge307XG53aW5kb3cuaGFiaXR6ZW4gPSBuZXcgSGFiaXR6ZW4oKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=