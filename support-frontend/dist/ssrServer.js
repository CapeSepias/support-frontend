module.exports =
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./assets/ssrServer.jsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/components/HelloWorld.jsx":
/*!******************************************!*\
  !*** ./assets/components/HelloWorld.jsx ***!
  \******************************************/
/*! exports provided: HelloWorld */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"HelloWorld\", function() { return HelloWorld; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @emotion/core */ \"@emotion/core\");\n/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_emotion_core__WEBPACK_IMPORTED_MODULE_1__);\nfunction _EMOTION_STRINGIFIED_CSS_ERROR__() { return \"You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).\"; }\n\n\n\n\nvar makeItRed =  false ? undefined : {\n  name: \"1s581jb-makeItRed\",\n  styles: \"color:red;;label:makeItRed;\",\n  map: \"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9nZW9yZ2VfaGFiZXJpcy9jb2RlL3N1cHBvcnQtZnJvbnRlbmQvc3VwcG9ydC1mcm9udGVuZC9hc3NldHMvY29tcG9uZW50cy9IZWxsb1dvcmxkLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJcUIiLCJmaWxlIjoiL1VzZXJzL2dlb3JnZV9oYWJlcmlzL2NvZGUvc3VwcG9ydC1mcm9udGVuZC9zdXBwb3J0LWZyb250ZW5kL2Fzc2V0cy9jb21wb25lbnRzL0hlbGxvV29ybGQuanN4Iiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjc3MgfSBmcm9tICdAZW1vdGlvbi9jb3JlJztcblxuY29uc3QgbWFrZUl0UmVkID0gY3NzYFxuICBjb2xvcjogcmVkO1xuYDtcblxuY29uc3QgSGVsbG9Xb3JsZCA9ICgpID0+IChcbiAgPGgxIGNzcz17bWFrZUl0UmVkfT5oZWxsbyB3b3JsZCE8L2gxPlxuKTtcblxuZXhwb3J0IHsgSGVsbG9Xb3JsZCB9O1xuIl19 */\",\n  toString: _EMOTION_STRINGIFIED_CSS_ERROR__\n};\n\nvar HelloWorld = function HelloWorld() {\n  return Object(_emotion_core__WEBPACK_IMPORTED_MODULE_1__[\"jsx\"])(\"h1\", {\n    css: makeItRed\n  }, \"hello world!\");\n};\n\nHelloWorld.displayName = \"HelloWorld\";\n\n\n//# sourceURL=webpack:///./assets/components/HelloWorld.jsx?");

/***/ }),

/***/ "./assets/ssrServer.jsx":
/*!******************************!*\
  !*** ./assets/ssrServer.jsx ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var emotion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! emotion */ \"emotion\");\n/* harmony import */ var emotion__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(emotion__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-dom/server */ \"react-dom/server\");\n/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_dom_server__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var emotion_server__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! emotion-server */ \"emotion-server\");\n/* harmony import */ var emotion_server__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(emotion_server__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @emotion/core */ \"@emotion/core\");\n/* harmony import */ var _emotion_core__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_emotion_core__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _guardian_src_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @guardian/src-button */ \"@guardian/src-button\");\n/* harmony import */ var _guardian_src_button__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_guardian_src_button__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _components_HelloWorld__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/HelloWorld */ \"./assets/components/HelloWorld.jsx\");\n\n\n\n\n\n\n\n\n\nvar app = express__WEBPACK_IMPORTED_MODULE_2___default()();\nvar port = 3000;\napp.get('/', function (req, res) {\n  var App = Object(_emotion_core__WEBPACK_IMPORTED_MODULE_5__[\"jsx\"])(_emotion_core__WEBPACK_IMPORTED_MODULE_5__[\"CacheProvider\"], {\n    value: emotion__WEBPACK_IMPORTED_MODULE_0__[\"cache\"]\n  }, Object(_emotion_core__WEBPACK_IMPORTED_MODULE_5__[\"jsx\"])(_components_HelloWorld__WEBPACK_IMPORTED_MODULE_7__[\"HelloWorld\"], null), Object(_emotion_core__WEBPACK_IMPORTED_MODULE_5__[\"jsx\"])(_guardian_src_button__WEBPACK_IMPORTED_MODULE_6__[\"Button\"], {\n    priority: \"primary\",\n    size: \"small\",\n    onClick: function onClick() {\n      console.log('click!');\n    }\n  }, \"Check date\"));\n\n  var critical = Object(emotion_server__WEBPACK_IMPORTED_MODULE_4__[\"extractCritical\"])(Object(react_dom_server__WEBPACK_IMPORTED_MODULE_3__[\"renderToString\"])(App));\n  res.status(200).header('Content-Type', 'text/html').send(\"<!DOCTYPE html>\\n        <html lang=\\\"en\\\">\\n        <head>\\n            <meta charset=\\\"UTF-8\\\">\\n            <meta name=\\\"viewport\\\" content=\\\"width=device-width, initial-scale=1.0\\\">\\n            <meta http-equiv=\\\"X-UA-Compatible\\\" content=\\\"ie=edge\\\">\\n            <title>SSR test</title>\\n            <style data-emotion=\\\"\".concat(critical.ids.join(' '), \"\\\">\").concat(critical.css, \"</style>\\n        </head>\\n        <body>\\n            <div id=\\\"root\\\">\").concat(critical.html, \"</div>\\n        </body>\\n        </html>\"));\n});\napp.listen(port, function () {\n  return console.log(\"server is listening on \".concat(port));\n});\n\n//# sourceURL=webpack:///./assets/ssrServer.jsx?");

/***/ }),

/***/ "@emotion/core":
/*!********************************!*\
  !*** external "@emotion/core" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@emotion/core\");\n\n//# sourceURL=webpack:///external_%22@emotion/core%22?");

/***/ }),

/***/ "@guardian/src-button":
/*!***************************************!*\
  !*** external "@guardian/src-button" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@guardian/src-button\");\n\n//# sourceURL=webpack:///external_%22@guardian/src-button%22?");

/***/ }),

/***/ "emotion":
/*!**************************!*\
  !*** external "emotion" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"emotion\");\n\n//# sourceURL=webpack:///external_%22emotion%22?");

/***/ }),

/***/ "emotion-server":
/*!*********************************!*\
  !*** external "emotion-server" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"emotion-server\");\n\n//# sourceURL=webpack:///external_%22emotion-server%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react\");\n\n//# sourceURL=webpack:///external_%22react%22?");

/***/ }),

/***/ "react-dom/server":
/*!***********************************!*\
  !*** external "react-dom/server" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react-dom/server\");\n\n//# sourceURL=webpack:///external_%22react-dom/server%22?");

/***/ })

/******/ });