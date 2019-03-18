/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nSyntaxError: /home/richard/PhpstormProjects/gidget4/Gidget/resources/js/app.js: Unterminated string constant (77:65)\n\n\u001b[0m \u001b[90m 75 | \u001b[39m    auth\u001b[33m:\u001b[39m require(\u001b[32m'@websanova/vue-auth/drivers/auth-bearer.js'\u001b[39m)\u001b[33m,\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 76 | \u001b[39m\u001b[0m\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 77 | \u001b[39m    http\u001b[33m:\u001b[39m require(\u001b[32m'@websanova/vue-auth/drivers/http/axios.1.x.js'\u001b[39m\u001b[32m'),\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m    | \u001b[39m                                                                 \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 78 | \u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 79 | \u001b[39m    router\u001b[33m:\u001b[39m require(\u001b[32m'@websanova/vue-auth/drivers/router/vue-router.2.x.js'\u001b[39m)\u001b[33m,\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 80 | \u001b[39m\u001b[0m\n    at Parser.raise (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:3831:17)\n    at Parser.readString (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:4785:14)\n    at Parser.getTokenFromCode (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:4464:14)\n    at Parser.nextToken (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:4034:12)\n    at Parser.next (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:3974:10)\n    at Parser.parseLiteral (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:6380:10)\n    at Parser.parseExprAtom (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:6203:21)\n    at Parser.parseExprSubscripts (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5862:23)\n    at Parser.parseMaybeUnary (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5842:21)\n    at Parser.parseExprOps (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5729:23)\n    at Parser.parseMaybeConditional (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5702:23)\n    at Parser.parseMaybeAssign (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5647:21)\n    at Parser.parseExprListItem (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:6940:18)\n    at Parser.parseCallExpressionArguments (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:6070:22)\n    at Parser.parseSubscript (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5965:29)\n    at Parser.parseSubscripts (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5882:19)\n    at Parser.parseExprSubscripts (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5872:17)\n    at Parser.parseMaybeUnary (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5842:21)\n    at Parser.parseExprOps (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5729:23)\n    at Parser.parseMaybeConditional (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5702:23)\n    at Parser.parseMaybeAssign (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5647:21)\n    at Parser.parseObjectProperty (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:6730:101)\n    at Parser.parseObjPropValue (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:6755:101)\n    at Parser.parseObj (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:6670:12)\n    at Parser.parseExprAtom (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:6229:21)\n    at Parser.parseExprSubscripts (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5862:23)\n    at Parser.parseMaybeUnary (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5842:21)\n    at Parser.parseExprOps (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5729:23)\n    at Parser.parseMaybeConditional (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5702:23)\n    at Parser.parseMaybeAssign (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5647:21)\n    at Parser.parseExprListItem (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:6940:18)\n    at Parser.parseCallExpressionArguments (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:6070:22)\n    at Parser.parseSubscript (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5965:29)\n    at Parser.parseSubscripts (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5882:19)\n    at Parser.parseExprSubscripts (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5872:17)\n    at Parser.parseMaybeUnary (/home/richard/PhpstormProjects/gidget4/Gidget/node_modules/@babel/parser/lib/index.js:5842:21)");

/***/ }),

/***/ "./resources/sass/app.scss":
/*!*********************************!*\
  !*** ./resources/sass/app.scss ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 0:
/*!*************************************************************!*\
  !*** multi ./resources/js/app.js ./resources/sass/app.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /home/richard/PhpstormProjects/gidget4/Gidget/resources/js/app.js */"./resources/js/app.js");
module.exports = __webpack_require__(/*! /home/richard/PhpstormProjects/gidget4/Gidget/resources/sass/app.scss */"./resources/sass/app.scss");


/***/ })

/******/ });