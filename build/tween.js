(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["mojs-tween"] = factory();
	else
		root["mojs-tween"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.mojs = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  (function (global, factory) {
    if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
      factory(exports);
    } else {
      var mod = {
        exports: {}
      };
      factory(mod.exports);
      global.mojs = mod.exports;
    }
  })(undefined, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    /**
     * Tweener - singleton object that is responsible of:
     *  - starting `requestAnimationFrame` loop
     *  - stopping `requestAnimationFrame` loop
     *  - holding `tween`/`timeline` objects and passing current time to them.
     */

    var tweens = [];
    var savedTweens = [];
    var isRunning = false;

    /**
     * `savePlayingTweens` - function to store all playing tweenes
     *                       when user leaves a page.
     */
    var savePlayingTweens = function () {
      savedTweens = tweens.slice(0);
      for (var i = 0; i < savedTweens.length; i++) {
        savedTweens[i].pause();
      }
    };

    /**
     * `restorePlayingTweens` - function to restore all playing tweens.
     */
    var restorePlayingTweens = function () {
      for (var i = 0; i < savedTweens.length; i++) {
        savedTweens[i].play();
      }
    };

    /**
     * `onVisibilityChange` - visibilityChange handler.
     */
    var onVisibilityChange = function () {
      if (document.hidden) {
        savePlayingTweens();
      } else {
        restorePlayingTweens();
      }
    };

    /**
     * `stop` - function to stop the animation loop.
     */
    var stop = function () {
      tweens.length = 0;
      isRunning = false;
    };

    // needed?
    // /**
    //  * `removeAll` - function stop updating all the child tweens/timelines.
    //  *
    //  * @return {type}  description
    //  */
    // const removeAll = function () { tweens.length = 0; };

    /**
     * `remove` - function to remove specific tween/timeline form updating.
     */
    var remove = function (tween) {
      var index = typeof tween === 'number' ? tween : tweens.indexOf(tween);

      if (index !== -1) {
        tweens.splice(index, 1);
      }
    };

    /**
     *  `update` - fucntion  to update every tween/timeline on animation frame.
     */
    var update = function (time) {
      var i = tweens.length;
      while (i--) {
        var tween = tweens[i];
        if (tween.update(time) === true) {
          remove(tween);
          tween.onTweenerFinish();
        }
      }
    };

    /*
     Main animation loop. Should have only one concurrent loop.
     @private
     @returns this
    */
    var loop = function () {
      if (tweens.length === 0) {
        return stop();
      }
      update(performance.now());
      requestAnimationFrame(loop);
    };

    /**
     * `start` - function to start the animation loop.
     */
    var start = function () {
      if (isRunning) {
        return;
      }
      isRunning = true;
      requestAnimationFrame(loop);
    };

    /**
     * `add` - function to add a Tween/Timeline to loop pool.
     */
    var add = function (tween) {
      tweens.push(tween);
      start();
    };

    /**
     * `caffeinate` - function to keep tweener awake on page blur.
     */
    var caffeinate = function () {
      document.removeEventListener('visibilitychange', onVisibilityChange, false);
    };

    // listen to visibility change
    document.addEventListener('visibilitychange', onVisibilityChange, false);

    var tweener = { add: add, remove: remove, caffeinate: caffeinate };

    exports.tweener = tweener;
  });
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.mojs = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  (function (global, factory) {
    if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
      factory(exports);
    } else {
      var mod = {
        exports: {}
      };
      factory(mod.exports);
      global.mojs = mod.exports;
    }
  })(undefined, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var tweenDefaults = {
      // delay of the tween [-∞..∞]
      delay: 0,
      // duration of the tween [0..∞]
      duration: 350,
      // speed of playback [0..∞], speed that is less then 1
      // will slowdown playback, for instance .5 will make tween
      // run 2x slower. Speed of 2 will speedup the tween to 2x.
      speed: 1,
      // easing for the tween, could be any easing type
      easing: 'Sin.Out',
      // Easing for backward direction of the tweenthe tween,
      // if `null` - fallbacks to `easing` property.
      // forward direction in `yoyo` period is treated as backward for the easing.
      backwardEasing: null,
      // if should reverse the tween
      isReverse: false,
      // how many times repeat the tween (excluding the first run)
      repeat: 0,
      // if should `reverse` before repeating
      isReverseOnRepeat: false,
      onUpdate: function (ep, p, isForward) {},
      onStart: function () {},
      onComplete: function () {},
      onChimeIn: function () {},
      onChimeOut: function () {},
      onRefresh: function () {},
      onPlaybackStart: function () {},
      onPlaybackPause: function () {},
      onPlaybackStop: function () {},
      onPlaybackComplete: function () {},

      // tween index
      index: 0,
      // shift time - mostly needed for timeline
      shiftTime: 0
    };

    exports.tweenDefaults = tweenDefaults;
  });
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["mojs-util-parse-stagger-property"] = factory();
	else
		root["mojs-util-parse-stagger-property"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.mojs = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  (function (global, factory) {
    if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
      factory(exports);
    } else {
      var mod = {
        exports: {}
      };
      factory(mod.exports);
      global.mojs = mod.exports;
    }
  })(undefined, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    /**
     * Function to check whether a property is a stagger `map`.
     * @param {*} prop Property to check.
     * @returns {Boolean} If property is stagger map.
     */
    var isStaggerMap = exports.isStaggerMap = function (prop) {
      return prop instanceof Array && prop.__mojs__isStaggerMap;
    };

    /**
     * Function to check whether a property is a stagger `function`.
     * @param {*} prop Property to check.
     * @returns {Boolean} If property is stagger function.
     */
    var isStaggerFunction = exports.isStaggerFunction = function (prop) {
      return typeof prop === 'function' && prop.__mojs__isStaggerFunction;
    };

    /**
     * Function to parse stagger utility function to a value.
     * @param {*} prop Property to check.
     * @param {Number} index Index of the current item.
     * @param {Number} totalItems Total items in stagger.
     * @returns {*} Parsed property or property itself(if not stagger prop).
     */
    var parseStaggerProperty = exports.parseStaggerProperty = function (prop, index, totalItems) {
      // if property is an array map the index to some array item
      if (isStaggerMap(prop)) {
        prop = prop[index % prop.length];
      }
      // if prop is a function, call the it with index and return the result
      if (isStaggerFunction(prop)) {
        prop = prop(index, totalItems);
      }
      // if nested, parse it
      return isStaggerMap(prop) || isStaggerFunction(prop) ? parseStaggerProperty(prop, index, totalItems) : prop;
    };

    exports.default = parseStaggerProperty;
  });
});

/***/ })
/******/ ]);
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["mojs-easing"] = factory();
	else
		root["mojs-easing"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.mojs = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  (function (global, factory) {
    if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
      factory(exports);
    } else {
      var mod = {
        exports: {}
      };
      factory(mod.exports);
      global.mojs = mod.exports;
    }
  })(undefined, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var parsePath = function (path) {
      var domPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      domPath.setAttributeNS(null, 'd', path);
      return domPath;
    };

    var sample = function (path, n) {
      var step = 1 / n;
      var totalLength = path.getTotalLength();
      // create the samples map and save main properties
      var samples = [];
      // samples the path, `key` is in range of [0..1]
      for (var i = 0; i < n + 1; i++) {
        var point = path.getPointAtLength(i * step * totalLength);
        samples[i] = {
          x: point.x / 100,
          y: point.y / 100
        };
      }

      return samples;
    };

    var findY = function (key, samples, n) {
      var start = 0;
      var end = samples.length - 1;
      var step = 1 / n;
      // find `start`/`end` bounds with binary search
      while (Math.abs(end - start) > 1) {
        var delta = end - start;
        var middle = start + Math.floor(delta / 2);
        var _value = samples[middle];

        if (key === _value.x) {
          return _value.y;
        }
        // shift a bound regarding the `value.x` value
        if (key < _value.x) {
          end = middle;
        } else {
          start = middle;
        }
      }
      // when the loop stops - we've found `start` and `end` bounds
      var value = samples[start];
      // if key is greate than `start` - normalize it
      if (key > value.x) {
        var nextValue = samples[start + 1];
        if (nextValue !== undefined) {
          var diff = value.x - key;
          return value.y - (nextValue.y - value.y) * (diff / step);
        }
      }

      return value.y;
    };

    var translateSamples = function (samples, n) {
      var map = new Map();
      var step = 1 / n;
      // samples the path, `key` is in range of [0..1]
      for (var i = 0; i < n + 1; i++) {
        var key = i * step;
        map.set(key, 1 - findY(key, samples, n));
      }

      return map;
    };

    var path = function (pathCoordinates) {
      var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;

      var preSamples = sample(parsePath(pathCoordinates), n);
      var samples = translateSamples(preSamples, n);
      var step = 1 / n;

      return function (p) {
        var index = p / step | 0; // convert to integer
        var key = index * step; // get the key
        var nextKey = (index + 1) * step; // get the next key
        var y = samples.get(key); // get the y
        // if next key is present, calculate the normalized y
        // regarding the progress error
        if (nextKey <= 1) {
          var nextY = samples.get(nextKey);
          y += (nextY - y) * ((p - key) / step);
        }

        return y;
      };
    };

    exports.path = path;
  });
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["mojs-pow-easing"] = factory();
	else
		root["mojs-pow-easing"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.mojs = mod.exports;
  }
})(this, function (module, exports) {
  "use strict";

  (function (global, factory) {
    if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
      factory(module, exports);
    } else {
      var mod = {
        exports: {}
      };
      factory(mod, mod.exports);
      global.mojs = mod.exports;
    }
  })(undefined, function (module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    /*
     * Generate power easing.
     *
     * @param {Number} p Easing power.
     * @returns {Function} Easing function with the defined power.
     */
    var pow = function () {
      var p = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;

      var easeIn = function (k) {
        return function (t) {
          return Math.pow(t, k);
        };
      }(p);
      var easeOut = function (k) {
        return function (t) {
          return 1 - Math.abs(Math.pow(t - 1, k));
        };
      }(p);

      return {
        in: easeIn,
        out: easeOut,
        inout: function (t) {
          return t < .5 ? easeIn(t * 2) / 2 : easeOut(t * 2 - 1) / 2 + .5;
        }
      };
    };

    exports.default = pow;
    module.exports = exports["default"];
  });
});

/***/ })
/******/ ]);
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(1), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('mojs-pow-easing'), require('./path.babel.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.mojsPowEasing, global.pathBabel);
    global.mojs = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  (function (global, factory) {
    if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(1), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
      factory(module, exports);
    } else {
      var mod = {
        exports: {}
      };
      factory(mod, mod.exports, global.mojsPowEasing, global.pathBabel);
      global.mojs = mod.exports;
    }
  })(undefined, function (module, exports, _mojsPowEasing, _pathBabel) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _mojsPowEasing2 = _interopRequireDefault(_mojsPowEasing);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    var CONSOLE_NAME = ':mojs :';
    var DEFAULT_EASING = ['sin', 'out'];
    var DEFAULT_EASING_STRING = DEFAULT_EASING.join('.');

    /**
     * `easing` - object that holds all easing avaliable in `mojs`.
     */
    var easing = {
      /**
       * `Linear` easing, also `null` or `id` easing - simply returns whatever
       * passed to the function.
       * @param {Number} Progress in range of `[0...1]`
       * @returns {Number} Eased progress in range of `[0...1]`
       */
      linear: { none: function (k) {
          return k;
        } },

      /**
       * `Sin` easing. Has `in`/`out`/`inout` options.
       * @param {Number} Progress in range of `[0...1]`
       * @returns {Number} Eased progress in range of `[0...1]`
       */
      sin: {
        in: function (k) {
          return 1 - Math.cos(k * Math.PI / 2);
        },
        out: function (k) {
          return Math.sin(k * Math.PI / 2);
        },
        inout: function (k) {
          return 0.5 * (1 - Math.cos(Math.PI * k));
        }
      },

      pow: _mojsPowEasing2.default,
      path: _pathBabel.path,

      parseEasing: function () {
        var ease = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_EASING_STRING;

        var type = typeof ease;

        switch (type) {
          case 'function':
            {
              return ease;
            }
          case 'string':
            {
              // path easing
              if (ease[0].toLowerCase() === 'm') {
                return (0, _pathBabel.path)(ease);
              }

              ease = ease.toLowerCase().split('.');
              var easeParent = easing[ease[0]];

              if (!easeParent) {
                console.error(CONSOLE_NAME + ' Easing with name "' + ease[0] + '" wasn\'t found, fallback to "' + DEFAULT_EASING_STRING + '" instead.', easing); // eslint-disable-line no-console

                return easing[DEFAULT_EASING[0]][DEFAULT_EASING[1]];
              }
              return easeParent[ease[1]];
            }
          default:
            console.error(CONSOLE_NAME + ' Only strings and function supported atm.', ease); // eslint-disable-line no-console
        }
      }
    };

    exports.default = easing;
    module.exports = exports['default'];
  });
});

/***/ })
/******/ ]);
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["mojs-util-class-proto"] = factory();
	else
		root["mojs-util-class-proto"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.mojs = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  (function (global, factory) {
    if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
      factory(exports);
    } else {
      var mod = {
        exports: {}
      };
      factory(mod.exports);
      global.mojs = mod.exports;
    }
  })(undefined, function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    /*
     * Imitate `class` with wrapper.
     *
     * @param {Object} Options object.
     * @returns {Object} Tween instance.
     */
    var createClass = exports.createClass = function (module) {
      var w = function (o) {
        var instance = Object.create(module);
        var result = instance.init(o);

        return result !== undefined ? result : instance;
      };
      w.__mojsClass = module;
      return w;
    };

    /*
     * Imitate `class` extend.
     *
     * @param {Object} `mojs` class to extend.
     * @returns {Object} Successor.
     */
    var extendClass = exports.extendClass = function (Super) {
      return Object.create(Super.__mojsClass);
    };

    /**
     * ClassProto - base class for module.
     * It is needed to:
     *   - declare `_defaults`
     *   - extend `_defaults` by `options` and save result to `_props`
     *   - declare `_vars` after extention
     *   - call `_render` eventually
     */
    var ClassProtoClass = {};

    /**
     * `get` - Method to get a property from `_props`.
     *
     * @public
     * @param {String} Key.
     * @returns {Any} Value from the `_props` by `key`.
     */
    ClassProtoClass.get = function (key) {
      return this._props[key];
    };

    /**
     * `set` - Method to set a property to `_props`.
     *
     * @public
     * @param {String} Key.
     * @param {Any} Value.
     */
    ClassProtoClass.set = function (key, value) {
      this._props[key] = value;

      return this;
    };

    /**
     * `setBatch` - Method to set a batch of properties to `_props`.
     *
     * @public
     * @param {Object} Batch properties to set.
     * @return {Object} `this` instance.
     */
    ClassProtoClass.setBatch = function () {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var keys = Object.keys(obj);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        this._props[key] = obj[key];
      }

      return this;
    };

    /**
     * `setIfNotSet` - function to set a property if it isn't
     *                 present in the initialization options.
     *
     * @public
     * @param {String} Key.
     * @param {Any} Value.
     * @returns {Object} This instance.
     */
    ClassProtoClass.setIfNotSet = function (key, value) {
      if (this._o[key] === undefined) {
        this.set(key, value);
      }

      return this;
    };

    /**
     * `init` - lifecycle initialization function.
     *
     * @private
     */
    ClassProtoClass.init = function () {
      var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      // save options
      this._o = _extends({}, o);

      // parse index and delete it from options
      this.index = this._o.index || 0;
      delete this._o.index;
      // parse total items and delete it from options
      this._totalItemsInStagger = this._o.totalItemsInStagger || 1;
      delete this._o.totalItemsInStagger;

      this._declareDefaults();
      this._extendDefaults();
      this._vars();
    };

    /**
     * _declareDefaults - function to declare `_defaults` object.
     *
     * @private
     */
    ClassProtoClass._declareDefaults = function () {
      this._defaults = {};
    };

    /**
     * _extendDefaults - Method to copy `_o` options to `_props` object
     *                  with fallback to `_defaults`.
     * @private
     */
    ClassProtoClass._extendDefaults = function () {
      this._props = _extends({}, this._defaults);

      var keys = Object.keys(this._o);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = this._o[key];
        // only if value is defined
        if (value !== undefined) {
          this._props[key] = value;
        }
      }
    };

    /**
     * _vars - function do declare `variables` after `_defaults` were extended
     *         by `options` and saved to `_props`
     *
     * @private
     */
    ClassProtoClass._vars = function () {};

    var ClassProto = createClass(ClassProtoClass);

    exports.default = ClassProto;
    exports.ClassProto = ClassProto;
  });
});

/***/ })
/******/ ]);
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(4), __webpack_require__(2), __webpack_require__(3), __webpack_require__(1), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports, require('mojs-util-class-proto'), require('mojs-util-parse-stagger-property'), require('mojs-easing'), require('./tween-defaults.babel.js'), require('./tweener.babel.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mojsUtilClassProto, global.mojsUtilParseStaggerProperty, global.mojsEasing, global.tweenDefaultsBabel, global.tweenerBabel);
    global.mojs = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  (function (global, factory) {
    if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(4), __webpack_require__(2), __webpack_require__(3), __webpack_require__(1), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
      factory(exports);
    } else {
      var mod = {
        exports: {}
      };
      factory(mod.exports, global.mojsUtilClassProto, global.mojsUtilParseStaggerProperty, global.mojsEasing, global.tweenDefaultsBabel, global.tweenerBabel);
      global.mojs = mod.exports;
    }
  })(undefined, function (exports, _mojsUtilClassProto, _mojsUtilParseStaggerProperty, _mojsEasing, _tweenDefaultsBabel, _tweenerBabel) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Tween = undefined;

    var _mojsUtilClassProto2 = _interopRequireDefault(_mojsUtilClassProto);

    var _mojsUtilParseStaggerProperty2 = _interopRequireDefault(_mojsUtilParseStaggerProperty);

    var _mojsEasing2 = _interopRequireDefault(_mojsEasing);

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }

    /* ------------------ */
    /* The `Tween` class  */
    /* ------------------ */

    var TweenClass = (0, _mojsUtilClassProto.extendClass)(_mojsUtilClassProto2.default);

    /**
     * _declareDefaults - function to declare `_defaults` object.
     *
     * @private
     * @override ClassProto
     */
    TweenClass._declareDefaults = function () {
      // object spread does not work with Karma
      this._defaults = Object.assign({}, _tweenDefaultsBabel.tweenDefaults);
    };

    /* ---------------------- */
    /* The `Public` functions */
    /* ---------------------- */

    /**
     * play - function to `play` the tween.
     *
     * @public
     * @returns {Object} This tween.
     */
    TweenClass.play = function () {
      if (this._state === 'play') {
        return this;
      }

      this._setState('play');
      this._setupPlay();

      this._playTime = performance.now();
      this._speed = this._props.speed;

      return this;
    };

    /**
     * pause - function to `pause` the tween.
     *
     * @public
     * @returns {Object} This tween.
     */
    TweenClass.pause = function () {
      if (this._state === 'pause' || this._state === 'stop') {
        return this;
      }

      _tweenerBabel.tweener.remove(this);
      this._setState('pause');
      // reset speed variable to `1` because speed should not be applied
      // when setProgress is used
      this._speed = 1;

      return this;
    };

    /*
     * stop - function to stop the tween.
     *
     * @public
     * @param {Number} Progress to stop with in [0...1]
     * @returns {Object} This tween.
     */
    TweenClass.stop = function (progress) {
      if (this._state === 'stop') {
        return this;
      }
      var newProgress = this._props.isReverse === true ? 1 : 0;

      var stopProc = progress !== undefined ? progress
      /* if no progress passed - set 1 if tween
         is playingBackward, otherwise set to 0 */
      : newProgress;

      this.setProgress(stopProc);
      this.reset();

      return this;
    };

    /**
     * play - function to `replay`(`retart`) the tween.
     *
     * @public
     * @param {Number} Repeat count.
     * @returns {Object} This tween.
     */
    TweenClass.replay = function (repeat) {
      this.reset();
      this.play(repeat);

      return this;
    };

    /**
     * setSpeed - function to set speed.
     *
     * @public
     * @param {Number} Speed in [0..∞]
     * @return {Object} This tween.
     */
    TweenClass.setSpeed = function (speed) {
      this._props.speed = speed;

      if (this._state === 'play') {
        this.setStartTime();
        this._speed = speed;
        this._playTime = performance.now();
      }

      return this;
    };

    /**
     * reverse - function to `reverse` the tween.
     *
     * @public
     * @returns {Object} This tween.
     */
    TweenClass.reverse = function () {
      this._props.isReverse = !this._props.isReverse;
      // reverse callbacks in the `_cbs`
      this._reverseCallbacks();

      if (this._elapsed > 0) {
        var delay = this._props.delay;

        this._elapsed = this._end - this._spot - (this._elapsed - delay);
      }

      this.setStartTime();

      return this;
    };

    /**
     * setProgress - function to set tween progress.
     *
     * @public
     * @param {Number} Progress to set.
     * @return {Object} This tween.
     */
    TweenClass.setProgress = function () {
      var progress = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (this._start === undefined) {
        this.setStartTime();
      }

      var time = progress === 1 ? this._end : this._spot + progress * (this._end - this._spot);

      // set initial time
      if (this._prevTime === undefined) {
        this._prevTime = this._start;
      }
      // save speed before updating form `setProgress`
      var speed = this._speed;
      this._speed = 1;
      // update with current time
      this.update(time);
      // restore speed after updating form `setProgress`
      this._speed = speed;

      return this;
    };

    /**
     * reset - function to reset the `Tween`.
     */
    TweenClass.reset = function () {
      _tweenerBabel.tweener.remove(this);
      this._isActive = false;
      this._elapsed = 0;
      this._repeatCount = 0;
      this._setState('stop');
      delete this._prevTime;

      return this;
    };

    /* ----------------------- */
    /* The `Private` functions */
    /* ----------------------- */

    /**
     * _setupPlay - function to setup before `play`.
     *
     * @public
     * @returns {Object} This tween.
     */
    TweenClass._setupPlay = function () {
      this.setStartTime();
      _tweenerBabel.tweener.add(this);
    };

    /**
     * _vars - function do declare `variables` after `_defaults` were extended
     *         by `options` and saved to `_props`
     *
     * @return {type}  description
     */
    TweenClass._vars = function () {
      var _props = this._props,
          isReverse = _props.isReverse,
          onStart = _props.onStart,
          onComplete = _props.onComplete,
          onChimeIn = _props.onChimeIn,
          onChimeOut = _props.onChimeOut,
          delay = _props.delay,
          duration = _props.duration;

      // if tween is in active period
      this._isActive = false;
      // time progress
      this._elapsed = 0;
      // initial state
      this._state = 'stop';
      // set "id" speed
      this._speed = 1;
      this._time = delay + duration;
      // how many times we have been repeating
      this._repeatCount = 0;
      // callbacks array - used to flip the callbacks order on `isReverse`
      this._cbs = [onStart, onComplete, 0, 1];
      // chime callbacks
      this._chCbs = [onChimeIn, onChimeOut];
      // if `isReverse` - flip the callbacks
      if (isReverse === true) {
        this._reverseCallbacks();
      }
    };

    /**
     * setStartTime - function to set `startTime`
     *
     * @param {Number, Undefined} Start time to set.
     */
    TweenClass.setStartTime = function () {
      var startTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : performance.now();
      var _props2 = this._props,
          delay = _props2.delay,
          duration = _props2.duration,
          shiftTime = _props2.shiftTime;


      // if `elapsed` is greated that end bound -> reset it to `0`
      if (this._elapsed >= this._end - this._spot) {
        this._elapsed = 0;
      }
      // `_spot` - is the animation initialization spot
      // `_elapsed` is how much time elapsed in the `active` period,
      // needed for `play`/`pause` functionality
      this._spot = startTime - this._elapsed + shiftTime;
      // play time is needed to recalculate time regarding `speed`
      this._playTime = this._spot;
      // `_start` - is the active animation start time bound
      this._start = this._spot + delay;
      // `_end` - is the active animation end time bound
      this._end = this._start + duration;
    };

    /**
     * update - function to update `Tween` with current time.
     *
     * @param {Number} The current update time.
     */
    TweenClass.update = function (time) {
      var _props3 = this._props,
          onUpdate = _props3.onUpdate,
          isReverse = _props3.isReverse,
          easing = _props3.easing,
          backwardEasing = _props3.backwardEasing;


      // `t` - `time` regarding `speed`
      var t = this._playTime + this._speed * (time - this._playTime);
      // save elapsed time
      this._elapsed = t - this._spot;
      // if pregress is not right - call the `onRefresh` function #before
      if (t < this._start && this._progress !== this._cbs[2]) {
        this._props.onRefresh(false, this.index, t);
        this._progress = this._cbs[2];
      }
      // if pregress is not right - call the `onRefresh` function #after
      if (t > this._end && this._progress !== this._cbs[3]) {
        this._props.onRefresh(true, this.index, t);
        this._progress = this._cbs[3];
      }

      // if forward progress
      var isForward = t > this._prevTime;
      var ease = isForward !== isReverse ? easing : backwardEasing;

      if (t >= this._start && t <= this._end && this._prevTime !== undefined) {
        var isActive = void 0;
        var p = (t - this._start) / this._props.duration;
        this._progress = isReverse === false ? p : 1 - p;
        onUpdate(ease(this._progress), this._progress, isForward, t);

        if (t > this._start && this._isActive === false && isForward === true) {
          // `onStart`
          this._cbs[0](isForward, isReverse, this.index);
          // `onChimeIn`
          this._chCbs[0](isForward, isReverse, this.index, t);
        }

        if (t === this._start) {
          // `onStart`
          this._cbs[0](isForward, isReverse, this.index);
          // `onChimeIn`
          this._chCbs[0](isForward, isReverse, this.index, t);
          // set `isActive` to `true` for forward direction
          // but set it to `false` for backward
          isActive = isForward;
        }

        if (t < this._end && this._isActive === false && isForward === false) {
          // `onComplete`
          this._cbs[1](false, isReverse, this.index);
          // `onChimeOut`
          this._chCbs[1](isForward, isReverse, this.index, t);
        }

        if (t === this._end) {
          // `onComplete`
          this._cbs[1](isForward, isReverse, this.index);
          // `onChimeOut`
          this._chCbs[1](isForward, isReverse, this.index, t);
          // set `isActive` to `false` for forward direction
          // but set it to `true` for backward
          isActive = !isForward;
        }

        this._isActive = isActive === undefined ? true : isActive;

        this._prevTime = t;

        return !this._isActive;
      }

      if (t > this._end && this._isActive === true) {
        this._progress = this._cbs[3];
        // one
        onUpdate(ease(this._progress), this._progress, isForward, t);
        // `onComplete`
        this._cbs[1](isForward, isReverse, this.index);
        // `onChimeOut`
        this._chCbs[1](isForward, isReverse, this.index, t);
        this._isActive = false;
        this._prevTime = t;
        return true;
      }

      if (t < this._start && this._isActive === true) {
        this._progress = this._cbs[2];
        // zero
        onUpdate(ease(this._progress), this._progress, isForward, t);
        // `onStart`
        this._cbs[0](isForward, isReverse, this.index);
        // `onChimeIn`
        this._chCbs[0](isForward, isReverse, this.index, t);

        this._isActive = false;
        this._prevTime = t;

        return true;
      }

      this._prevTime = t;
    };

    /**
     * Function to reverse callbacks.
     */
    TweenClass._reverseCallbacks = function () {
      this._cbs = [this._cbs[1], this._cbs[0], this._cbs[3], this._cbs[2]];
    };

    /*
     * Method set playback `_state` string and call appropriate callbacks.
     *
     * @private
     * @param {String} State name [play, pause, 'stop', 'reverse']
     */
    TweenClass._setState = function (state) {
      // save previous state
      this._prevState = this._state;
      this._state = state;
      // callbacks
      var wasPause = this._prevState === 'pause';
      var wasStop = this._prevState === 'stop';
      var wasPlay = this._prevState === 'play';
      var wasReverse = this._prevState === 'reverse';
      var wasPlaying = wasPlay || wasReverse;
      var wasStill = wasStop || wasPause;

      if ((state === 'play' || state === 'reverse') && wasStill) {
        this._props.onPlaybackStart(state, this._prevState);
      }
      if (state === 'pause' && wasPlaying) {
        this._props.onPlaybackPause();
      }
      if (state === 'stop' && (wasPlaying || wasPause)) {
        this._props.onPlaybackStop();
      }
    };

    /**
     * onTweenerFinish - function that is called when the tweeener finished
     *                   playback for this tween and removemd it from the queue
     *
     */
    TweenClass.onTweenerFinish = function () {
      var _props4 = this._props,
          isReverse = _props4.isReverse,
          repeat = _props4.repeat,
          isReverseOnRepeat = _props4.isReverseOnRepeat,
          onPlaybackComplete = _props4.onPlaybackComplete;

      var count = this._repeatCount;

      onPlaybackComplete(!isReverse, count, repeat - count);

      this.reset();

      if (repeat - count > 0) {
        var value = isReverseOnRepeat;
        // if `value` is `array`, parse it
        value = isReverseOnRepeat instanceof Array ? value[count % value.length] : value;
        // if `value` is `function`, parse it
        if (typeof value === 'function') {
          value = value(count);
        }
        if (value) {
          this.reverse();
        }

        this._repeatCount = count + 1;
        this.play();
      }
    };

    /**
     * _extendDefaults - Method to copy `_o` options to `_props` object
     *                  with fallback to `_defaults`.
     * @private
     * @overrides @ ClassProto
     */
    TweenClass._extendDefaults = function () {
      // super call
      _mojsUtilClassProto2.default.__mojsClass._extendDefaults.call(this);
      // parse stagger
      var propsKeys = Object.keys(this._props);
      for (var i = 0; i < propsKeys.length; i++) {
        var key = propsKeys[i];
        this._props[key] = (0, _mojsUtilParseStaggerProperty2.default)(this._props[key], this.index);
      }

      // parse `easing`
      this._props.easing = _mojsEasing2.default.parseEasing(this._props.easing);
      // parse `backwardEasing`, fallback to `easing` if
      // `backwardEasing` is `null`/`undefined`
      var _props5 = this._props,
          easing = _props5.easing,
          backwardEasing = _props5.backwardEasing;

      this._props.backwardEasing = backwardEasing != null ? _mojsEasing2.default.parseEasing(backwardEasing) : easing;
    };

    /**
     * Imitate `class` with wrapper
     */
    var Tween = exports.Tween = (0, _mojsUtilClassProto.createClass)(TweenClass);

    exports.default = Tween;
  });
});

/***/ })
/******/ ]);
});