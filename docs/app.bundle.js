/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"app": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
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
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./src/js/index.jsx","vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/App.jsx":
/*!************************!*\
  !*** ./src/js/App.jsx ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_markdown__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-markdown */ \"./node_modules/react-markdown/lib/react-markdown.js\");\n/* harmony import */ var react_markdown__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_markdown__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ \"./node_modules/prop-types/index.js\");\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ \"./node_modules/classnames/index.js\");\n/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @material-ui/core */ \"./node_modules/@material-ui/core/index.es.js\");\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @material-ui/core/styles */ \"./node_modules/@material-ui/core/styles/index.js\");\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var react_social_icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-social-icons */ \"./node_modules/react-social-icons/dist/react-social-icons.js\");\n/* harmony import */ var react_social_icons__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_social_icons__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _Post_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Post.jsx */ \"./src/js/Post.jsx\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\n/* global $ */\n\n\n\n\n\n\n\n\n\nvar styles = function styles(theme) {\n  return {\n    root: {\n      display: \"flex\"\n    },\n    content: {\n      flexGrow: 1,\n      paddingTop: theme.spacing.unit,\n      paddingBottom: theme.spacing.unit * 2\n    },\n    avatar: {\n      margin: 10,\n      width: 128,\n      height: 128\n    }\n  };\n};\n\nvar App =\n/*#__PURE__*/\nfunction (_React$Component) {\n  _inherits(App, _React$Component);\n\n  function App(props) {\n    var _this;\n\n    _classCallCheck(this, App);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, props));\n    _this.state = {\n      width: null,\n      mounted: false,\n      loaded: false,\n      content: null,\n      rendered: 0,\n      language_en: false\n    };\n    _this.handleLanguageChange = _this.handleLanguageChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));\n    _this.loadMorePosts = _this.loadMorePosts.bind(_assertThisInitialized(_assertThisInitialized(_this)));\n    _this.updateListPosition = _this.updateListPosition.bind(_assertThisInitialized(_assertThisInitialized(_this)));\n    return _this;\n  }\n\n  _createClass(App, [{\n    key: \"componentDidMount\",\n    value: function componentDidMount() {\n      this.setState({\n        mounted: true,\n        width: $(window).width()\n      });\n      this.request = $.getJSON(\"content.json\", function (data) {\n        this.setState({\n          loaded: true,\n          content: data\n        });\n      }.bind(this));\n      var loadOnScroll = null;\n      $(window).scroll(function () {\n        this.updateListPosition();\n\n        if ($(\"#load-more-button\").length > 0 && $(window).scrollTop() + $(window).height() > $(\"#load-more-button\").offset().top) {\n          window.clearTimeout(loadOnScroll);\n          loadOnScroll = window.setTimeout(function () {\n            $(\"#load-more-button button\").click();\n          }, 200);\n        }\n      }.bind(this));\n      window.setInterval(function () {\n        this.updateListPosition();\n      }.bind(this), 200);\n    } // FUNCTIONS\n\n  }, {\n    key: \"loadMorePosts\",\n    value: function loadMorePosts(rendered) {\n      return function () {\n        this.setState({\n          rendered: rendered\n        });\n      }.bind(this);\n    }\n  }, {\n    key: \"handleLanguageChange\",\n    value: function handleLanguageChange(event) {\n      this.setState({\n        language_en: event.target.checked\n      });\n    }\n  }, {\n    key: \"updateListPosition\",\n    value: function updateListPosition() {\n      var i = 0,\n          $leftLast,\n          $rightLast;\n      $(\".twitter-post, .facebook-post, .instagram-post\").each(function () {\n        if (i == 0) {\n          $(this).css(\"float\", \"left\");\n          $leftLast = $(this);\n        } else if (i == 1) {\n          $(this).css(\"float\", \"right\");\n          $rightLast = $(this);\n        } else {\n          if ($leftLast.offset().top + $leftLast.height() < $rightLast.offset().top + $rightLast.height()) {\n            $(this).css(\"float\", \"left\");\n            $leftLast = $(this);\n          } else {\n            $(this).css(\"float\", \"right\");\n            $rightLast = $(this);\n          }\n        }\n\n        i++;\n      });\n    } // RENDER\n\n  }, {\n    key: \"render\",\n    value: function render() {\n      var _this$props = this.props,\n          classes = _this$props.classes,\n          theme = _this$props.theme;\n      var _this$state = this.state,\n          mounted = _this$state.mounted,\n          loaded = _this$state.loaded,\n          content = _this$state.content;\n\n      if (!mounted || !loaded) {\n        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n          className: \"app-loading\"\n        });\n      } else {\n        var postsPerLoad = 5;\n        var postWidth = this.state.width > 600 ? 500 : 350;\n        var numberOfColumns = this.state.width > 1100 ? 2 : 1;\n        var index,\n            columns = [];\n\n        for (index = 0; index < Math.min(this.state.rendered + postsPerLoad, content.posts.length); index++) {\n          var columnIdx = 0; // index % numberOfColumns;\n\n          if (!columns[columnIdx]) columns[columnIdx] = [];\n          columns[columnIdx].push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Post_jsx__WEBPACK_IMPORTED_MODULE_7__[\"default\"], {\n            key: \"post_\" + index,\n            links: content.posts[index].links,\n            width: postWidth,\n            onSocialRender: this.updateListPosition\n          }));\n        }\n\n        var contentGrid = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__[\"Grid\"], {\n          container: true,\n          spacing: 0,\n          style: {\n            width: postWidth * numberOfColumns + 12 * (numberOfColumns - 1),\n            margin: \"0 auto\"\n          }\n        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__[\"Grid\"], {\n          item: true,\n          xs: 12,\n          style: {\n            margin: theme.spacing.unit * 3\n          }\n        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__[\"Divider\"], {\n          variant: \"middle\"\n        })), columns.map(function (column, index) {\n          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__[\"Grid\"], {\n            key: \"column-\" + index,\n            item: true,\n            xs: 12 / columns.length\n          }, column);\n        }));\n        var loadMorePostsButton = index >= content.posts.length ? null : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n          id: \"load-more-button\",\n          style: {\n            display: \"flex\",\n            justifyContent: \"center\"\n          }\n        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__[\"Button\"], {\n          color: \"primary\",\n          className: classes.button,\n          onClick: this.loadMorePosts(index)\n        }, \"Load \", postsPerLoad, \" more posts...\"));\n        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n          className: classes.root\n        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__[\"CssBaseline\"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"main\", {\n          className: classes.content\n        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__[\"Grid\"], {\n          container: true,\n          justify: \"center\",\n          alignItems: \"center\"\n        }, \"HU \", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__[\"Switch\"], {\n          checked: this.state.language_en,\n          onChange: this.handleLanguageChange,\n          color: \"default\"\n        }), \" EN\"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__[\"Grid\"], {\n          container: true,\n          justify: \"center\",\n          alignItems: \"center\"\n        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__[\"Avatar\"], {\n          alt: \"Antal Orcsik (Tony)\",\n          src: \"https://aorcsik.com/images/a72262970767e4fd07a9aea4aad8c360.jpg\",\n          className: classes.avatar\n        })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__[\"Grid\"], {\n          container: true,\n          justify: \"center\",\n          alignItems: \"center\"\n        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__[\"Typography\"], {\n          variant: \"h4\",\n          gutterBottom: true\n        }, content.title)), content.greeting[this.state.language_en ? \"en\" : \"hu\"].map(function (line, index) {\n          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__[\"Grid\"], {\n            key: index,\n            className: \"greeting-grid\",\n            container: true,\n            justify: \"center\",\n            alignItems: \"center\"\n          }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_markdown__WEBPACK_IMPORTED_MODULE_1___default.a, {\n            source: line\n          }));\n        }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_4__[\"Grid\"], {\n          container: true,\n          justify: \"center\",\n          alignItems: \"center\",\n          style: {\n            marginTop: theme.spacing.unit * 2\n          }\n        }, [\"http://facebook.com/aorcsik\", \"http://twitter.com/aorcsik\", \"http://linkedin.com/in/aorcsik\", \"https://dribbble.com/aorcsik\"].map(function (url, index) {\n          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_social_icons__WEBPACK_IMPORTED_MODULE_6__[\"SocialIcon\"], {\n            key: index,\n            url: url,\n            target: \"_blank\",\n            style: {\n              height: 32,\n              width: 32,\n              margin: theme.spacing.unit / 2\n            }\n          });\n        })), contentGrid, loadMorePostsButton));\n      }\n    }\n  }]);\n\n  return App;\n}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);\n\nApp.propTypes = {\n  classes: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.object.isRequired,\n  theme: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.object.isRequired\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_5__[\"withStyles\"])(styles, {\n  withTheme: true\n})(App));\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\")))\n\n//# sourceURL=webpack:///./src/js/App.jsx?");

/***/ }),

/***/ "./src/js/Post.jsx":
/*!*************************!*\
  !*** ./src/js/Post.jsx ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ \"./node_modules/prop-types/index.js\");\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ \"./node_modules/classnames/index.js\");\n/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _material_ui_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @material-ui/core */ \"./node_modules/@material-ui/core/index.es.js\");\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @material-ui/core/styles */ \"./node_modules/@material-ui/core/styles/index.js\");\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_4__);\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\n/* global $ */\n\n\n\n\n\n\nvar styles = function styles(theme) {\n  return {\n    root: {\n      //...theme.mixins.gutters(),\n      marginBottom: theme.spacing.unit * 2\n    }\n  };\n};\n\nvar Post =\n/*#__PURE__*/\nfunction (_React$Component) {\n  _inherits(Post, _React$Component);\n\n  function Post(props) {\n    var _this;\n\n    _classCallCheck(this, Post);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(Post).call(this, props));\n    _this.state = {\n      mounted: false,\n      loaded: false,\n      data: {}\n    };\n    _this.loadOEmbedLink = _this.loadOEmbedLink.bind(_assertThisInitialized(_assertThisInitialized(_this)));\n    return _this;\n  }\n\n  _createClass(Post, [{\n    key: \"componentDidMount\",\n    value: function componentDidMount() {\n      this.setState({\n        mounted: true\n      });\n      this.loadOEmbedLink(this.props.links, 0);\n    } // https://developers.facebook.com/docs/reference/javascript/FB.XFBML.parse/\n    // https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/scripting-loading-and-initialization\n\n  }, {\n    key: \"componentDidUpdate\",\n    value: function componentDidUpdate() {\n      if (this.state.data.facebook && window.FB.XFBML) window.FB.XFBML.parse(document.getElementById(\"facebook-\" + this.state.data.facebook.id));\n      if (this.state.data.twitter && window.twttr.widgets) window.twttr.widgets.load(document.getElementById(\"twitter-\" + this.state.data.twitter.id));\n      if (this.state.data.instagram && window.instgrm) window.instgrm.Embeds.process(document.getElementById(\"instagram-\" + this.state.data.instagram.id));\n      window.setTimeout(function () {\n        this.props.onSocialRender();\n      }.bind(this), 200);\n    } // FUNCTIONS\n\n  }, {\n    key: \"loadOEmbedLink\",\n    value: function loadOEmbedLink(links, idx) {\n      var _this2 = this;\n\n      if (!links[idx]) return;\n      var link = links[idx];\n      var source = null;\n\n      if (link.match(/facebook\\.com/)) {\n        // https://developers.facebook.com/docs/plugins/oembed-endpoints/\n        source = {\n          url: \"https://www.facebook.com/plugins/post/oembed.json/?maxwidth=350&omitscript=1&url=\" + encodeURIComponent(link),\n          type: \"facebook\",\n          dataType: \"jsonp\"\n        };\n      } else if (link.match(/twitter\\.com/)) {\n        // https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/get-statuses-oembed\n        source = {\n          url: \"https://publish.twitter.com/oembed?maxwidth=350&omit_script=1&url=\" + encodeURIComponent(link),\n          type: \"twitter\",\n          dataType: \"jsonp\"\n        };\n      } else if (link.match(/instagram\\.com/)) {\n        // https://www.instagram.com/developer/embedding/\n        source = {\n          url: \"https://api.instagram.com/oembed?maxwidth=350&omitscript=1&url=\" + encodeURIComponent(link),\n          type: \"instagram\",\n          dataType: \"json\"\n        };\n      }\n\n      if (source) {\n        $.ajax({\n          url: source.url,\n          dataType: source.dataType,\n          success: function success(data) {\n            data.id = data.media_id || data.url.replace(/http.*\\//, \"\");\n\n            _this2.setState({\n              loaded: true,\n              data: $.extend(_this2.state.data, _defineProperty({}, source.type, data))\n            });\n          }\n        });\n      } else {\n        this.loadOEmbedLink(links, idx + 1);\n      }\n    } // RENDER\n\n  }, {\n    key: \"render\",\n    value: function render() {\n      var classes = this.props.classes;\n      var _this$state = this.state,\n          mounted = _this$state.mounted,\n          loaded = _this$state.loaded,\n          data = _this$state.data;\n\n      if (!mounted || !loaded) {\n        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n          className: classes.root\n        });\n      } else {\n        if (data.instagram) {\n          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Paper\"], {\n            className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(classes.root, \"instagram-post\"),\n            id: \"instagram-\" + data.instagram.id,\n            style: {\n              width: this.props.width,\n              padding: 0\n            }\n          }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n            dangerouslySetInnerHTML: {\n              __html: data.instagram.html.replace(/max-width:350px/, \"max-width:\" + this.props.width + \"px\")\n            }\n          }));\n        } else if (data.facebook) {\n          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Paper\"], {\n            className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(classes.root, \"facebook-post\"),\n            id: \"facebook-\" + data.facebook.id,\n            style: {\n              width: this.props.width,\n              padding: 0\n            }\n          }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n            dangerouslySetInnerHTML: {\n              __html: data.facebook.html.replace(/data-width=\"350\"/, \"data-width=\\\"\" + this.props.width + \"\\\"\")\n            }\n          }));\n        } else if (data.twitter) {\n          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_material_ui_core__WEBPACK_IMPORTED_MODULE_3__[\"Paper\"], {\n            className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(classes.root, \"twitter-post\"),\n            id: \"twitter-\" + data.twitter.id,\n            style: {\n              width: this.props.width,\n              padding: 0\n            }\n          }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n            dangerouslySetInnerHTML: {\n              __html: data.twitter.html.replace(/data-width=\"350\"/, \"data-width=\\\"\" + this.props.width + \"\\\"\")\n            }\n          }));\n        }\n      }\n    }\n  }]);\n\n  return Post;\n}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);\n\nPost.propTypes = {\n  classes: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object.isRequired,\n  theme: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object.isRequired,\n  links: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array.isRequired,\n  width: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number.isRequired\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_4__[\"withStyles\"])(styles, {\n  withTheme: true\n})(Post));\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\")))\n\n//# sourceURL=webpack:///./src/js/Post.jsx?");

/***/ }),

/***/ "./src/js/index.jsx":
/*!**************************!*\
  !*** ./src/js/index.jsx ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(React) {/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-dom */ \"./node_modules/react-dom/index.js\");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material-ui/core/styles */ \"./node_modules/@material-ui/core/styles/index.js\");\n/* harmony import */ var _material_ui_core_styles__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _material_ui_core_colors_blue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material-ui/core/colors/blue */ \"./node_modules/@material-ui/core/colors/blue.js\");\n/* harmony import */ var _material_ui_core_colors_blue__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_material_ui_core_colors_blue__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _App_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./App.jsx */ \"./src/js/App.jsx\");\n/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../scss/index.scss */ \"./src/scss/index.scss\");\n/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_scss_index_scss__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\nvar theme = Object(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_1__[\"createMuiTheme\"])({\n  palette: {\n    primary: _material_ui_core_colors_blue__WEBPACK_IMPORTED_MODULE_2___default.a\n  },\n  typography: {\n    useNextVariants: true,\n    fontFamily: [\"-apple-system\", \"BlinkMacSystemFont\", \"\\\"Segoe UI\\\"\", \"Roboto\", \"\\\"Helvetica Neue\\\"\", \"Arial\", \"sans-serif\", \"\\\"Apple Color Emoji\\\"\", \"\\\"Segoe UI Emoji\\\"\", \"\\\"Segoe UI Symbol\\\"\"].join(\",\")\n  }\n});\nObject(react_dom__WEBPACK_IMPORTED_MODULE_0__[\"render\"])(React.createElement(_material_ui_core_styles__WEBPACK_IMPORTED_MODULE_1__[\"MuiThemeProvider\"], {\n  theme: theme\n}, React.createElement(_App_jsx__WEBPACK_IMPORTED_MODULE_3__[\"default\"], null)), document.getElementById(\"app\"));\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! react */ \"./node_modules/react/index.js\")))\n\n//# sourceURL=webpack:///./src/js/index.jsx?");

/***/ }),

/***/ "./src/scss/index.scss":
/*!*****************************!*\
  !*** ./src/scss/index.scss ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/scss/index.scss?");

/***/ })

/******/ });