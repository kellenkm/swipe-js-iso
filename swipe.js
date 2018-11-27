(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Swipe"] = factory();
	else
		root["Swipe"] = factory();
})(window, function() {
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

function Swipe(container, options) {
  // utilities
  var noop = function() {}; // simple no operation function
  var offloadFn = function(fn) {
    setTimeout(fn || noop, 0);
  }; // offload a functions execution

  // check browser capabilities
  var browser = {
    addEventListener: !!window.addEventListener,
    touch:
      'ontouchstart' in window ||
      (window.DocumentTouch && document instanceof window.DocumentTouch),
    transitions: (function(temp) {
      var props = [
        'transitionProperty',
        'WebkitTransition',
        'MozTransition',
        'OTransition',
        'msTransition'
      ];
      for (var i in props) if (temp.style[props[i]] !== undefined) return true;
      return false;
    })(document.createElement('swipe'))
  };

  // quit if no root element
  if (!container) return;
  var element = container.children[0];
  var slides, slidePos, width, length;
  options = options || {};
  var index = parseInt(options.startSlide, 10) || 0;
  var speed = options.speed || 300;
  var continuous = (options.continuous =
    options.continuous !== undefined ? options.continuous : true);
  var continuous_end = (options.continuous_end =
    options.continuous_end !== undefined ? options.continuous_end : false);

  function setup() {
    // cache slides
    slides = element.children;
    length = slides.length;

    // set continuous to false if only one slide
    continuous = slides.length < 2 ? false : options.continuous;

    // create an array to store current positions of each slide
    slidePos = new Array(slides.length);

    // determine width of each slide
    width = Math.round(
      container.getBoundingClientRect().width || container.offsetWidth
    );

    element.style.width = slides.length * width + 'px';

    // stack elements
    var pos = slides.length;
    while (pos--) {
      var slide = slides[pos];

      slide.style.width = width + 'px';
      slide.setAttribute('data-index', pos);

      if (browser.transitions) {
        slide.style.left = pos * -width + 'px';
        move(pos, index > pos ? -width : index < pos ? width : 0, 0);
      }
    }

    // reposition elements before and after index
    if ((continuous || continuous_end) && browser.transitions) {
      move(circle(index - 1), -width, 0);
      move(circle(index + 1), width, 0);
    }

    if (!browser.transitions) element.style.left = index * -width + 'px';

    container.style.visibility = 'visible';
  }

  function prev() {
    if (continuous) slide(index - 1);
    else if (index) slide(index - 1);
  }

  function next() {
    if (continuous || continuous_end) slide(index + 1);
    else if (index < slides.length - 1) slide(index + 1);
  }

  function circle(index) {
    // a simple positive modulo using slides.length
    return (slides.length + (index % slides.length)) % slides.length;
  }

  function slide(to, slideSpeed) {
    // do nothing if already on requested slide
    if (index == to) return;

    if (browser.transitions) {
      var direction = Math.abs(index - to) / (index - to); // 1: backward, -1: forward

      // get the actual position of the slide
      if (continuous || continuous_end) {
        var natural_direction = direction;
        direction = -slidePos[circle(to)] / width;

        // if going forward but to < index, use to = slides.length + to
        // if going backward but to > index, use to = -slides.length + to
        if (direction !== natural_direction)
          to = -direction * slides.length + to;
      }

      var diff = Math.abs(index - to) - 1;

      // move all the slides between index and to in the right direction
      while (diff--)
        move(
          circle((to > index ? to : index) - diff - 1),
          width * direction,
          0
        );

      to = circle(to);

      move(index, width * direction, slideSpeed || speed);
      move(to, 0, slideSpeed || speed);

      if (continuous || continuous_end)
        move(circle(to - direction), -(width * direction), 0); // we need to get the next in place
    } else {
      to = circle(to);
      animate(index * -width, to * -width, slideSpeed || speed);
      //no fallback for a circular continuous if the browser does not accept transitions
    }

    index = to;
    offloadFn(options.callback && options.callback(index, slides[index]));
  }

  function move(index, dist, speed) {
    translate(index, dist, speed);
    slidePos[index] = dist;
  }

  function translate(index, dist, speed) {
    var slide = slides[index];
    var style = slide && slide.style;

    if (!style) return;

    style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration =
      speed + 'ms';

    style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
    style.msTransform = style.MozTransform = style.OTransform =
      'translateX(' + dist + 'px)';
  }

  function animate(from, to, speed) {
    // if not an animation, just reposition
    if (!speed) {
      element.style.left = to + 'px';
      return;
    }

    var start = +new Date();

    var timer = setInterval(function() {
      var timeElap = +new Date() - start;

      if (timeElap > speed) {
        element.style.left = to + 'px';

        if (delay) begin();

        options.transitionEnd &&
          options.transitionEnd.call(event, index, slides[index]);

        clearInterval(timer);
        return;
      }

      element.style.left =
        (to - from) * (Math.floor((timeElap / speed) * 100) / 100) +
        from +
        'px';
    }, 4);
  }

  // setup auto slideshow
  var delay = options.auto || 0;
  var interval;

  function begin() {
    clearTimeout(interval);
    interval = setTimeout(next, delay);
  }

  function stop() {
    delay = 0;
    clearTimeout(interval);
  }

  // setup initial vars
  var start = {};
  var delta = {};
  var isScrolling;

  // setup event capturing
  var events = {
    handleEvent: function(event) {
      switch (event.type) {
        case 'touchstart':
          this.start(event);
          break;
        case 'touchmove':
          this.move(event);
          break;
        case 'touchend':
          offloadFn(this.end(event));
          break;
        case 'webkitTransitionEnd':
        case 'msTransitionEnd':
        case 'oTransitionEnd':
        case 'otransitionend':
        case 'transitionend':
          offloadFn(this.transitionEnd(event));
          break;
        case 'resize':
          offloadFn(setup);
          break;
      }

      if (options.stopPropagation) event.stopPropagation();
    },
    start: function(event) {
      var touches = event.touches[0];

      // measure start values
      start = {
        // get initial touch coords
        x: touches.pageX,
        y: touches.pageY,

        // store time to determine touch duration
        time: +new Date()
      };

      // used for testing first move event
      isScrolling = undefined;

      // reset delta and end measurements
      delta = {};

      // attach touchmove and touchend listeners
      element.addEventListener('touchmove', this, false);
      element.addEventListener('touchend', this, false);
    },
    move: function(event) {
      // ensure swiping with one touch and not pinching
      if (event.touches.length > 1 || (event.scale && event.scale !== 1))
        return;

      if (options.disableScroll) return;

      var touches = event.touches[0];

      // measure change in x and y
      delta = {
        x: touches.pageX - start.x,
        y: touches.pageY - start.y
      };

      // determine if scrolling test has run - one time test
      if (typeof isScrolling == 'undefined') {
        isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
      }

      // if user is not trying to scroll vertically
      if (!isScrolling) {
        // prevent native scrolling
        event.preventDefault();

        // stop slideshow
        stop();

        // increase resistance if first or last slide
        if (continuous) {
          // we don't add resistance at the end

          translate(
            circle(index - 1),
            delta.x + slidePos[circle(index - 1)],
            0
          );
          translate(index, delta.x + slidePos[index], 0);
          translate(
            circle(index + 1),
            delta.x + slidePos[circle(index + 1)],
            0
          );
        } else if (continuous_end) {
          console.log('continuous_end', index);

          delta.x =
            delta.x /
            (!index && delta.x > 0 ? Math.abs(delta.x) / width + 1 : 1);

          console.log(delta.x);
          
          translate(
            circle(index - 1),
            delta.x + slidePos[circle(index - 1)],
            0
          );
          translate(index, delta.x + slidePos[index], 0);
          translate(
            circle(index + 1),
            delta.x + slidePos[circle(index + 1)],
            0
          );
        } else {
          delta.x =
            delta.x /
            ((!index && delta.x > 0) || // if first slide and sliding left
            (index == slides.length - 1 && // or if last slide and sliding right
              delta.x < 0) // and if sliding at all
              ? Math.abs(delta.x) / width + 1 // determine resistance level
              : 1); // no resistance if false

          // translate 1:1
          translate(index - 1, delta.x + slidePos[index - 1], 0);
          translate(index, delta.x + slidePos[index], 0);
          translate(index + 1, delta.x + slidePos[index + 1], 0);
        }
        options.swiping && options.swiping(-delta.x / width);
      }
    },
    end: function(event) {
      // measure duration
      var duration = +new Date() - start.time;

      // determine if slide attempt triggers next/prev slide
      var isValidSlide =
        (Number(duration) < 250 && // if slide duration is less than 250ms
          Math.abs(delta.x) > 20) || // and if slide amt is greater than 20px
        Math.abs(delta.x) > width / 2; // or if slide amt is greater than half the width

      // determine if slide attempt is past start and end
      var isPastBounds =
        (!index && delta.x > 0) || // if first slide and slide amt is greater than 0
        (index == slides.length - 1 && delta.x < 0); // or if last slide and slide amt is less than 0

      if (continuous) isPastBounds = false;
      else if (continuous_end) {
        isPastBounds = !index && delta.x > 0;
      }

      // determine direction of swipe (true:right, false:left)
      var direction = delta.x < 0;

      // if not scrolling vertically
      if (!isScrolling) {
        if (isValidSlide && !isPastBounds) {
          if (direction) {
            if (continuous || continuous_end) {
              // we need to get the next in this direction in place

              move(circle(index - 1), -width, 0);
              move(circle(index + 2), width, 0);
            } else {
              move(index - 1, -width, 0);
            }

            move(index, slidePos[index] - width, speed);
            move(circle(index + 1), slidePos[circle(index + 1)] - width, speed);
            index = circle(index + 1);
          } else {
            if (continuous || continuous_end) {
              // we need to get the next in this direction in place

              move(circle(index + 1), width, 0);
              move(circle(index - 2), -width, 0);
            } else {
              move(index + 1, width, 0);
            }

            move(index, slidePos[index] + width, speed);
            move(circle(index - 1), slidePos[circle(index - 1)] + width, speed);
            index = circle(index - 1);
          }

          options.callback && options.callback(index, slides[index]);
        } else {
          if (continuous || continuous_end) {
            move(circle(index - 1), -width, speed);
            move(index, 0, speed);
            move(circle(index + 1), width, speed);
          } else {
            move(index - 1, -width, speed);
            move(index, 0, speed);
            move(index + 1, width, speed);
          }
        }
      }

      // kill touchmove and touchend event listeners until touchstart called again
      element.removeEventListener('touchmove', events, false);
      element.removeEventListener('touchend', events, false);
      element.removeEventListener('touchforcechange', function() {}, false);
    },
    transitionEnd: function(event) {
      if (parseInt(event.target.getAttribute('data-index'), 10) == index) {
        if (delay) begin();

        options.transitionEnd &&
          options.transitionEnd.call(event, index, slides[index]);
      }
    }
  };

  // trigger setup
  setup();

  // start auto slideshow if applicable
  if (delay) begin();

  // add event listeners
  if (browser.addEventListener) {
    // set touchstart event on element
    if (browser.touch) {
      element.addEventListener('touchstart', events, false);
      element.addEventListener('touchforcechange', function() {}, false);
    }

    if (browser.transitions) {
      element.addEventListener('webkitTransitionEnd', events, false);
      element.addEventListener('msTransitionEnd', events, false);
      element.addEventListener('oTransitionEnd', events, false);
      element.addEventListener('otransitionend', events, false);
      element.addEventListener('transitionend', events, false);
    }

    // set resize event on window
    window.addEventListener('resize', events, false);
  } else {
    window.onresize = function() {
      setup();
    }; // to play nice with old IE
  }

  // expose the Swipe API
  return {
    setup: function() {
      setup();
    },
    slide: function(to, speed) {
      // cancel slideshow
      stop();

      slide(to, speed);
    },
    prev: function() {
      // cancel slideshow
      stop();

      prev();
    },
    next: function() {
      // cancel slideshow
      stop();

      next();
    },
    stop: function() {
      // cancel slideshow
      stop();
    },
    getPos: function() {
      // return current index position
      return index;
    },
    getNumSlides: function() {
      // return total number of slides
      return length;
    },
    disableScrolling: function(disableScroll) {
      options.disableScroll = disableScroll;
    },
    kill: function() {
      // cancel slideshow
      stop();

      // reset element
      element.style.width = '';
      element.style.left = '';

      // reset slides
      var pos = slides.length;
      while (pos--) {
        var slide = slides[pos];
        slide.style.width = '';
        slide.style.left = '';

        if (browser.transitions) translate(pos, 0, 0);
      }

      // removed event listeners
      if (browser.addEventListener) {
        // remove current event listeners
        element.removeEventListener('touchstart', events, false);
        element.removeEventListener('webkitTransitionEnd', events, false);
        element.removeEventListener('msTransitionEnd', events, false);
        element.removeEventListener('oTransitionEnd', events, false);
        element.removeEventListener('otransitionend', events, false);
        element.removeEventListener('transitionend', events, false);
        window.removeEventListener('resize', events, false);
      } else {
        window.onresize = null;
      }
    }
  };
}

module.exports = Swipe;


/***/ })

/******/ });
});