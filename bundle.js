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
    Page.prototype.showNew = function () {
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
        document.getElementById("edit-title").innerText = "Edit Habit";
        var divEdit = document.getElementById("edit");
        divEdit.dataset.id = id;
        var habit = this.habits.get(id);
        document.getElementById("txt-edit-name").value = habit.name;
        this.hideAllSections();
        this.show("edit");
        this.hide("btn-options");
        this.show("btn-back");
        this.show("btn-edit-delete");
    };
    Page.prototype.showOptions = function () {
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
    Page.prototype.showMain = function () {
        this.hideAllSections();
        this.show("main");
        this.refreshHabits();
        this.hide("btn-back");
        this.show("btn-options");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUM7SUFDekIsQ0FBQztJQUVELHlCQUFNLEdBQU4sVUFBTyxFQUFVO1FBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsdUJBQUksR0FBSjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDO0FBTUQsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztBQUN4QyxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oYWJpdHplbi8uL3NyYy9kYXRhU3RvcmVDb29raWUudHMiLCJ3ZWJwYWNrOi8vaGFiaXR6ZW4vLi9zcmMvaGFiaXQudHMiLCJ3ZWJwYWNrOi8vaGFiaXR6ZW4vLi9zcmMvaGFiaXRzLnRzIiwid2VicGFjazovL2hhYml0emVuLy4vc3JjL3BhZ2UudHMiLCJ3ZWJwYWNrOi8vaGFiaXR6ZW4vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vaGFiaXR6ZW4vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2hhYml0emVuL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vaGFiaXR6ZW4vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9oYWJpdHplbi8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEYXRhU3RvcmUgfSBmcm9tIFwiLi9kYXRhU3RvcmVcIlxuaW1wb3J0IHsgSGFiaXQgfSBmcm9tIFwiLi9oYWJpdFwiXG5cbmV4cG9ydCBjbGFzcyBIYWJpdERhdGFDb29raWUgaW1wbGVtZW50cyBEYXRhU3RvcmUge1xuXG4gICAgcmVhZG9ubHkgY29va2llTmFtZTogc3RyaW5nID0gXCJoYWJpdHplbi5kYXRhXCI7XG5cbiAgICBsb2FkKCk6IEFycmF5PEhhYml0PiB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuZ2V0Q29va2llKCk7XG5cbiAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBcnJheTxIYWJpdD4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJMb2FkZWQgVmFsdWU6IFwiICsgdmFsdWUpXG4gICAgICAgIGxldCBpdGVtcyA9IEpTT04ucGFyc2UodmFsdWUpXG4gICAgICAgIHJldHVybiBpdGVtcztcbiAgICB9XG5cbiAgICBzYXZlKGhhYml0RGF0YTogQXJyYXk8SGFiaXQ+KTogdm9pZCB7XG4gICAgICAgIGxldCBqc29uID0gSlNPTi5zdHJpbmdpZnkoaGFiaXREYXRhKTtcbiAgICAgICAgdGhpcy5zZXRDb29raWUoanNvbik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGF0YVN0b3JlQ29va2llOiBzYXZlXCIpXG4gICAgfVxuXG5cbiAgICBwcml2YXRlIHNldENvb2tpZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IHRoaXMuY29va2llTmFtZSArIFwiPVwiICsgdmFsdWUgKyBcIjtTYW1lU2l0ZT1TdHJpY3Q7U2VjdXJlOyBleHBpcmVzPUZyaSwgMzEgRGVjIDk5OTkgMjM6NTk6NTkgR01UOyBwYXRoPS9cIjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldENvb2tpZSgpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBcIjsgXCIgKyBkb2N1bWVudC5jb29raWU7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gdmFsdWUuc3BsaXQoXCI7IFwiICsgdGhpcy5jb29raWVOYW1lICsgXCI9XCIpO1xuXG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT0gMikge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnRzLnBvcCgpLnNwbGl0KFwiO1wiKS5zaGlmdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwiZXhwb3J0IGNsYXNzIEhhYml0IHtcbiAgICBpZDogc3RyaW5nO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICB0aW1lc3RhbXA6IG51bWJlcjtcbn0iLCJpbXBvcnQgeyBIYWJpdCB9IGZyb20gXCIuL2hhYml0XCI7XG5pbXBvcnQgeyBIYWJpdERhdGFDb29raWUgfSBmcm9tIFwiLi9kYXRhU3RvcmVDb29raWVcIjtcbmltcG9ydCB7IERhdGFTdG9yZSB9IGZyb20gXCIuL2RhdGFTdG9yZVwiO1xuXG5cbmV4cG9ydCBjbGFzcyBIYWJpdHMge1xuXG4gICAgZGF0YVN0b3JlOiBEYXRhU3RvcmU7XG4gICAgZGF0YTogQXJyYXk8SGFiaXQ+O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZGF0YVN0b3JlID0gbmV3IEhhYml0RGF0YUNvb2tpZSgpO1xuICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICB9XG5cbiAgICBnZXQgbGlzdCgpOiBBcnJheTxIYWJpdD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IGl0ZW1zID0gdGhpcy5kYXRhU3RvcmUubG9hZCgpO1xuICAgICAgICB0aGlzLmRhdGEgPSBpdGVtcztcbiAgICB9XG5cbiAgICBkZWxldGUoaWQ6IHN0cmluZykge1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5saXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5saXN0W2ldLmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2F2ZUFsbCgpO1xuICAgIH1cblxuICAgIGdldChpZDogc3RyaW5nKTogSGFiaXQge1xuXG4gICAgICAgIGxldCBoYWJpdCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5saXN0LmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUuaWQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICBoYWJpdCA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gaGFiaXQ7XG4gICAgfVxuXG4gICAgc2F2ZShoYWJpdDogSGFiaXQpOiB2b2lkIHtcbiAgICAgICAgaWYgKGhhYml0LmlkKSB7XG4gICAgICAgICAgICB0aGlzLm1vZGlmeShoYWJpdCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZShoYWJpdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNhdmVBbGwoKSB7XG4gICAgICAgIHRoaXMuZGF0YVN0b3JlLnNhdmUodGhpcy5kYXRhKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZShoYWJpdDogSGFiaXQpIHtcbiAgICAgICAgaGFiaXQuaWQgPSBjcnlwdG8ucmFuZG9tVVVJRCgpO1xuICAgICAgICB0aGlzLmxpc3QucHVzaChoYWJpdCk7XG4gICAgICAgIHRoaXMuc2F2ZUFsbCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbW9kaWZ5KGhhYml0OiBIYWJpdCkge1xuICAgICAgICB0aGlzLmxpc3QuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5pZCA9PSBoYWJpdC5pZCkge1xuICAgICAgICAgICAgICAgIHZhbHVlLm5hbWUgPSBoYWJpdC5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNhdmVBbGwoKTtcbiAgICB9XG5cbiAgICBjb21wbGV0ZShpZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMubGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChoYWJpdCkge1xuICAgICAgICAgICAgaWYgKGhhYml0LmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgaGFiaXQudGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2F2ZUFsbCgpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBIYWJpdCB9IGZyb20gXCIuL2hhYml0XCI7XG5pbXBvcnQgeyBIYWJpdHMgfSBmcm9tIFwiLi9oYWJpdHNcIjtcblxuZXhwb3J0IGNsYXNzIFBhZ2Uge1xuXG4gICAgaGFiaXRzOiBIYWJpdHMgPSBuZXcgSGFiaXRzKCk7XG5cbiAgICByZWZyZXNoSGFiaXRzKCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGRpdkhhYml0TGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoYWJpdC1saXN0Jyk7XG4gICAgICAgIHRoaXMuY2xlYXIoZGl2SGFiaXRMaXN0LmlkKTtcblxuICAgICAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgdGhpcy5oYWJpdHMubGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChoYWJpdCkge1xuICAgICAgICAgICAgbGV0IGlzQ29tcGxldGUgPSBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKGhhYml0LnRpbWVzdGFtcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RDb21wbGV0ZWQgPSBuZXcgRGF0ZShoYWJpdC50aW1lc3RhbXApO1xuICAgICAgICAgICAgICAgIGlzQ29tcGxldGUgPSBzZWxmLmlzU2FtZURheShsYXN0Q29tcGxldGVkLCB0b2RheSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICAgICAgaWYgKGlzQ29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IFwiaGFiaXQtaXRlbSBjb21wbGV0ZVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IFwiaGFiaXQtaXRlbVwiXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzZWxmLmVzY2FwZUh0bWwoaGFiaXQubmFtZSk7XG4gICAgICAgICAgICBlbGVtZW50Lm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuY29tcGxldGUoaGFiaXQuaWQpOyB9O1xuICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBcIjxzcGFuPlwiICsgbmFtZSArIFwiPC9zcGFuPlwiO1xuICAgICAgICAgICAgZGl2SGFiaXRMaXN0LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzU2FtZURheShhOiBEYXRlLCBiOiBEYXRlKSB7XG4gICAgICAgIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYS5nZXRGdWxsWWVhcigpID09PSBiLmdldEZ1bGxZZWFyKCkgJiYgYS5nZXRNb250aCgpID09PSBiLmdldE1vbnRoKCkgJiYgYS5nZXREYXRlKCkgPT09IGIuZ2V0RGF0ZSgpO1xuICAgIH1cblxuICAgIGNvbXBsZXRlKGlkOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKGNvbmZpcm0oXCJDb21wbGV0ZSB0aGlzIGhhYml0IGZvciB0b2RheT9cIikpIHtcbiAgICAgICAgICAgIHRoaXMuaGFiaXRzLmNvbXBsZXRlKGlkKTtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaEhhYml0cygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2F2ZSgpIHtcbiAgICAgICAgY29uc3QgaGFiaXQgPSBuZXcgSGFiaXQoKTtcbiAgICAgICAgY29uc3QgZGl2RWRpdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdFwiKTtcbiAgICAgICAgaGFiaXQuaWQgPSBkaXZFZGl0LmRhdGFzZXQuaWQ7XG4gICAgICAgIGhhYml0Lm5hbWUgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0eHQtZWRpdC1uYW1lXCIpKS52YWx1ZTtcbiAgICAgICAgdGhpcy5oYWJpdHMuc2F2ZShoYWJpdCk7XG4gICAgICAgIHRoaXMuc2hvd01haW4oKTtcbiAgICB9XG5cbiAgICBkZWxldGUoKSB7XG4gICAgICAgIGlmIChjb25maXJtKFwiRGVsZXRlIHRoaXMgaGFiaXQ/XCIpKSB7XG4gICAgICAgICAgICBjb25zdCBkaXZFZGl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0XCIpO1xuICAgICAgICAgICAgY29uc3QgaWQgPSBkaXZFZGl0LmRhdGFzZXQuaWQ7XG4gICAgICAgICAgICB0aGlzLmhhYml0cy5kZWxldGUoaWQpO1xuICAgICAgICAgICAgdGhpcy5zaG93TWFpbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvd05ldygpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0LXRpdGxlXCIpLmlubmVyVGV4dCA9IFwiQ3JlYXRlIE5ldyBIYWJpdFwiO1xuICAgICAgICBjb25zdCBkaXZFZGl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0XCIpO1xuICAgICAgICBkaXZFZGl0LmRhdGFzZXQuaWQgPSBcIlwiO1xuICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0eHQtZWRpdC1uYW1lXCIpKS52YWx1ZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuaGlkZUFsbFNlY3Rpb25zKCk7XG4gICAgICAgIHRoaXMuc2hvdyhcImVkaXRcIik7XG4gICAgICAgIHRoaXMuaGlkZShcImJ0bi1vcHRpb25zXCIpO1xuICAgICAgICB0aGlzLnNob3coXCJidG4tYmFja1wiKTtcbiAgICAgICAgdGhpcy5oaWRlKFwiYnRuLWVkaXQtZGVsZXRlXCIpO1xuICAgIH1cblxuICAgIHNob3dFZGl0KGlkOiBzdHJpbmcpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0LXRpdGxlXCIpLmlubmVyVGV4dCA9IFwiRWRpdCBIYWJpdFwiO1xuICAgICAgICBjb25zdCBkaXZFZGl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0XCIpO1xuICAgICAgICBkaXZFZGl0LmRhdGFzZXQuaWQgPSBpZDtcbiAgICAgICAgbGV0IGhhYml0ID0gdGhpcy5oYWJpdHMuZ2V0KGlkKTtcbiAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHh0LWVkaXQtbmFtZVwiKSkudmFsdWUgPSBoYWJpdC5uYW1lO1xuICAgICAgICB0aGlzLmhpZGVBbGxTZWN0aW9ucygpO1xuICAgICAgICB0aGlzLnNob3coXCJlZGl0XCIpO1xuICAgICAgICB0aGlzLmhpZGUoXCJidG4tb3B0aW9uc1wiKTtcbiAgICAgICAgdGhpcy5zaG93KFwiYnRuLWJhY2tcIik7XG4gICAgICAgIHRoaXMuc2hvdyhcImJ0bi1lZGl0LWRlbGV0ZVwiKTtcbiAgICB9XG5cbiAgICBzaG93T3B0aW9ucygpIHtcbiAgICAgICAgdGhpcy5oaWRlQWxsU2VjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5zaG93KFwib3B0aW9uc1wiKTtcbiAgICAgICAgdGhpcy5oaWRlKFwiYnRuLW9wdGlvbnNcIik7XG4gICAgICAgIHRoaXMuc2hvdyhcImJ0bi1iYWNrXCIpO1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIGRpdkVkaXRMaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VkaXQtbGlzdCcpO1xuICAgICAgICB0aGlzLmNsZWFyKGRpdkVkaXRMaXN0LmlkKTtcblxuICAgICAgICB0aGlzLmhhYml0cy5saXN0LmZvckVhY2goZnVuY3Rpb24gKGhhYml0KSB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gc2VsZi5lc2NhcGVIdG1sKGhhYml0Lm5hbWUpO1xuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBcIjxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzcz0nYnRuIGJ0bi1lZGl0JyBvbmNsaWNrPSdoYWJpdHplbi5lZGl0KFxcXCJcIiArIGhhYml0LmlkICsgXCJcXFwiKSc+4pyOJm5ic3A7XCIgKyBuYW1lICsgXCI8L2J1dHRvbj5cIjtcbiAgICAgICAgICAgIGRpdkVkaXRMaXN0LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBlc2NhcGVIdG1sKHVuc2FmZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB1bnNhZmVcbiAgICAgICAgICAgIC5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC88L2csIFwiJmx0O1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoLz4vZywgXCImZ3Q7XCIpXG4gICAgICAgICAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiJiMwMzk7XCIpO1xuICAgIH1cblxuICAgIHNob3dNYWluKCkge1xuICAgICAgICB0aGlzLmhpZGVBbGxTZWN0aW9ucygpO1xuICAgICAgICB0aGlzLnNob3coXCJtYWluXCIpO1xuICAgICAgICB0aGlzLnJlZnJlc2hIYWJpdHMoKTtcbiAgICAgICAgdGhpcy5oaWRlKFwiYnRuLWJhY2tcIik7XG4gICAgICAgIHRoaXMuc2hvdyhcImJ0bi1vcHRpb25zXCIpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGlkZUFsbFNlY3Rpb25zKCkge1xuICAgICAgICBjb25zdCBzZWN0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCcuc2VjdGlvbicpO1xuICAgICAgICBzZWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChzZWN0aW9uKSB7XG4gICAgICAgICAgICBzZWN0aW9uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2hvdyhpZDogc3RyaW5nKSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB9XG5cbiAgICBwcml2YXRlIGhpZGUoaWQ6IHN0cmluZykge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG5cbiAgICBwcml2YXRlIGNsZWFyKGlkOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9ICcnO1xuICAgIH1cblxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgUGFnZSB9IGZyb20gJy4vcGFnZSc7XG5cbmNsYXNzIEhhYml0emVuIHtcbiAgcHJpdmF0ZSBwYWdlOiBQYWdlID0gbmV3IFBhZ2UoKTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYucGFnZS5zaG93TWFpbigpO1xuICAgIH0pO1xuICB9XG5cbiAgbWFpbigpIHtcbiAgICB0aGlzLnBhZ2Uuc2hvd01haW4oKTtcbiAgfVxuXG4gIG9wdGlvbnMoKSB7XG4gICAgdGhpcy5wYWdlLnNob3dPcHRpb25zKCk7XG4gIH1cblxuICBuZXcoKSB7XG4gICAgdGhpcy5wYWdlLnNob3dOZXcoKTtcbiAgfVxuXG4gIGVkaXQoaWQ6IHN0cmluZykge1xuICAgIHRoaXMucGFnZS5zaG93RWRpdChpZCk7XG4gIH1cblxuICBkZWxldGUoaWQ6IHN0cmluZykge1xuICAgIHRoaXMucGFnZS5kZWxldGUoKTtcbiAgfVxuXG4gIHNhdmUoKSB7XG4gICAgdGhpcy5wYWdlLnNhdmUoKTtcbiAgfVxufVxuXG5kZWNsYXJlIGdsb2JhbCB7XG4gIGludGVyZmFjZSBXaW5kb3cgeyBoYWJpdHplbjogYW55OyB9XG59XG5cbndpbmRvdy5oYWJpdHplbiA9IHdpbmRvdy5oYWJpdHplbiB8fCB7fTtcbndpbmRvdy5oYWJpdHplbiA9IG5ldyBIYWJpdHplbigpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==