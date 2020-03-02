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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/animation-frame/index.js":
/*!***********************************************!*\
  !*** ./node_modules/animation-frame/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * An even better animation frame.
 *
 * @copyright Oleg Slobodskoi 2016
 * @website https://github.com/kof/animationFrame
 * @license MIT
 */

module.exports = __webpack_require__(/*! ./lib/animation-frame */ "./node_modules/animation-frame/lib/animation-frame.js")


/***/ }),

/***/ "./node_modules/animation-frame/lib/animation-frame.js":
/*!*************************************************************!*\
  !*** ./node_modules/animation-frame/lib/animation-frame.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var nativeImpl = __webpack_require__(/*! ./native */ "./node_modules/animation-frame/lib/native.js")
var now = __webpack_require__(/*! ./now */ "./node_modules/animation-frame/lib/now.js")
var performance = __webpack_require__(/*! ./performance */ "./node_modules/animation-frame/lib/performance.js")
var root = __webpack_require__(/*! ./root */ "./node_modules/animation-frame/lib/root.js")

// Weird native implementation doesn't work if context is defined.
var nativeRequest = nativeImpl.request
var nativeCancel = nativeImpl.cancel

/**
 * Animation frame constructor.
 *
 * Options:
 *   - `useNative` use the native animation frame if possible, defaults to true
 *   - `frameRate` pass a custom frame rate
 *
 * @param {Object|Number} options
 */
function AnimationFrame(options) {
    if (!(this instanceof AnimationFrame)) return new AnimationFrame(options)
    options || (options = {})

    // Its a frame rate.
    if (typeof options == 'number') options = {frameRate: options}
    options.useNative != null || (options.useNative = true)
    this.options = options
    this.frameRate = options.frameRate || AnimationFrame.FRAME_RATE
    this._frameLength = 1000 / this.frameRate
    this._isCustomFrameRate = this.frameRate !== AnimationFrame.FRAME_RATE
    this._timeoutId = null
    this._callbacks = {}
    this._lastTickTime = 0
    this._tickCounter = 0
}

module.exports = AnimationFrame

/**
 * Default frame rate used for shim implementation. Native implementation
 * will use the screen frame rate, but js have no way to detect it.
 *
 * If you know your target device, define it manually.
 *
 * @type {Number}
 * @api public
 */
AnimationFrame.FRAME_RATE = 60

/**
 * Replace the globally defined implementation or define it globally.
 *
 * @param {Object|Number} [options]
 * @api public
 */
AnimationFrame.shim = function(options) {
    var animationFrame = new AnimationFrame(options)

    root.requestAnimationFrame = function(callback) {
        return animationFrame.request(callback)
    }
    root.cancelAnimationFrame = function(id) {
        return animationFrame.cancel(id)
    }

    return animationFrame
}

/**
 * Request animation frame.
 * We will use the native RAF as soon as we know it does works.
 *
 * @param {Function} callback
 * @return {Number} timeout id or requested animation frame id
 * @api public
 */
AnimationFrame.prototype.request = function(callback) {
  var self = this

  // Alawys inc counter to ensure it never has a conflict with the native counter.
  // After the feature test phase we don't know exactly which implementation has been used.
  // Therefore on #cancel we do it for both.
  ++this._tickCounter

  if (nativeImpl.supported && this.options.useNative && !this._isCustomFrameRate) {
    return nativeRequest(callback)
  }

  if (!callback) throw new TypeError('Not enough arguments')

  if (this._timeoutId == null) {
    // Much faster than Math.max
    // http://jsperf.com/math-max-vs-comparison/3
    // http://jsperf.com/date-now-vs-date-gettime/11
    var delay = this._frameLength + this._lastTickTime - now()
    if (delay < 0) delay = 0

    this._timeoutId = setTimeout(function() {
      self._lastTickTime = now()
      self._timeoutId = null
      ++self._tickCounter
      var callbacks = self._callbacks
      self._callbacks = {}
      for (var id in callbacks) {
        if (callbacks[id]) {
          if (nativeImpl.supported && self.options.useNative) {
            nativeRequest(callbacks[id])
          } else {
            callbacks[id](performance.now())
          }
        }
      }
    }, delay)
  }

  this._callbacks[this._tickCounter] = callback

  return this._tickCounter
}

/**
 * Cancel animation frame.
 *
 * @param {Number} timeout id or requested animation frame id
 *
 * @api public
 */
AnimationFrame.prototype.cancel = function(id) {
if (nativeImpl.supported && this.options.useNative) nativeCancel(id)
delete this._callbacks[id]
}


/***/ }),

/***/ "./node_modules/animation-frame/lib/native.js":
/*!****************************************************!*\
  !*** ./node_modules/animation-frame/lib/native.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var root = __webpack_require__(/*! ./root */ "./node_modules/animation-frame/lib/root.js")

// Test if we are within a foreign domain. Use raf from the top if possible.
try {
  // Accessing .name will throw SecurityError within a foreign domain.
  root.top.name
  root = root.top
} catch(e) {}

exports.request = root.requestAnimationFrame
exports.cancel = root.cancelAnimationFrame || root.cancelRequestAnimationFrame
exports.supported = false

var vendors = ['Webkit', 'Moz', 'ms', 'O']

// Grab the native implementation.
for (var i = 0; i < vendors.length && !exports.request; i++) {
  exports.request = root[vendors[i] + 'RequestAnimationFrame']
  exports.cancel = root[vendors[i] + 'CancelAnimationFrame'] ||
    root[vendors[i] + 'CancelRequestAnimationFrame']
}

// Test if native implementation works.
// There are some issues on ios6
// http://shitwebkitdoes.tumblr.com/post/47186945856/native-requestanimationframe-broken-on-ios-6
// https://gist.github.com/KrofDrakula/5318048

if (exports.request) {
  exports.request.call(null, function() {
    exports.supported = true
  })
}


/***/ }),

/***/ "./node_modules/animation-frame/lib/now.js":
/*!*************************************************!*\
  !*** ./node_modules/animation-frame/lib/now.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Crossplatform Date.now()
 *
 * @return {Number} time in ms
 * @api private
 */
module.exports = Date.now || function() {
  return (new Date).getTime()
}


/***/ }),

/***/ "./node_modules/animation-frame/lib/performance-timing.js":
/*!****************************************************************!*\
  !*** ./node_modules/animation-frame/lib/performance-timing.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var now = __webpack_require__(/*! ./now */ "./node_modules/animation-frame/lib/now.js")

/**
 * Replacement for PerformanceTiming.navigationStart for the case when
 * performance.now is not implemented.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming.navigationStart
 *
 * @type {Number}
 * @api private
 */
exports.navigationStart = now()


/***/ }),

/***/ "./node_modules/animation-frame/lib/performance.js":
/*!*********************************************************!*\
  !*** ./node_modules/animation-frame/lib/performance.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var now = __webpack_require__(/*! ./now */ "./node_modules/animation-frame/lib/now.js")
var PerformanceTiming = __webpack_require__(/*! ./performance-timing */ "./node_modules/animation-frame/lib/performance-timing.js")
var root = __webpack_require__(/*! ./root */ "./node_modules/animation-frame/lib/root.js")

/**
 * Crossplatform performance.now()
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Performance.now()
 *
 * @return {Number} relative time in ms
 * @api public
 */
exports.now = function () {
  if (root.performance && root.performance.now) return root.performance.now()
  return now() - PerformanceTiming.navigationStart
}


/***/ }),

/***/ "./node_modules/animation-frame/lib/root.js":
/*!**************************************************!*\
  !*** ./node_modules/animation-frame/lib/root.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var root
// Browser window
if (typeof window !== 'undefined') {
  root = window
// Web Worker
} else if (typeof self !== 'undefined') {
  root = self
// Other environments
} else {
  root = this
}

module.exports = root


/***/ }),

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/bmp-js/index.js":
/*!**************************************!*\
  !*** ./node_modules/bmp-js/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author shaozilee
 *
 * support 1bit 4bit 8bit 24bit decode
 * encode with 24bit
 * 
 */

var encode = __webpack_require__(/*! ./lib/encoder */ "./node_modules/bmp-js/lib/encoder.js"),
    decode = __webpack_require__(/*! ./lib/decoder */ "./node_modules/bmp-js/lib/decoder.js");

module.exports = {
  encode: encode,
  decode: decode
};


/***/ }),

/***/ "./node_modules/bmp-js/lib/decoder.js":
/*!********************************************!*\
  !*** ./node_modules/bmp-js/lib/decoder.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/**
 * @author shaozilee
 *
 * Bmp format decoder,support 1bit 4bit 8bit 24bit bmp
 *
 */

function BmpDecoder(buffer,is_with_alpha) {
  this.pos = 0;
  this.buffer = buffer;
  this.is_with_alpha = !!is_with_alpha;
  this.bottom_up = true;
  this.flag = this.buffer.toString("utf-8", 0, this.pos += 2);
  if (this.flag != "BM") throw new Error("Invalid BMP File");
  this.parseHeader();
  this.parseRGBA();
}

BmpDecoder.prototype.parseHeader = function() {
  this.fileSize = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.reserved = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.offset = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.headerSize = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.width = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.height = this.buffer.readInt32LE(this.pos);
  this.pos += 4;
  this.planes = this.buffer.readUInt16LE(this.pos);
  this.pos += 2;
  this.bitPP = this.buffer.readUInt16LE(this.pos);
  this.pos += 2;
  this.compress = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.rawSize = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.hr = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.vr = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.colors = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;
  this.importantColors = this.buffer.readUInt32LE(this.pos);
  this.pos += 4;

  if(this.bitPP === 16 && this.is_with_alpha){
    this.bitPP = 15
  }
  if (this.bitPP < 15) {
    var len = this.colors === 0 ? 1 << this.bitPP : this.colors;
    this.palette = new Array(len);
    for (var i = 0; i < len; i++) {
      var blue = this.buffer.readUInt8(this.pos++);
      var green = this.buffer.readUInt8(this.pos++);
      var red = this.buffer.readUInt8(this.pos++);
      var quad = this.buffer.readUInt8(this.pos++);
      this.palette[i] = {
        red: red,
        green: green,
        blue: blue,
        quad: quad
      };
    }
  }
  if(this.height < 0) {
    this.height *= -1;
    this.bottom_up = false;
  }

}

BmpDecoder.prototype.parseRGBA = function() {
    var bitn = "bit" + this.bitPP;
    var len = this.width * this.height * 4;
    this.data = new Buffer(len);
    this[bitn]();
};

BmpDecoder.prototype.bit1 = function() {
  var xlen = Math.ceil(this.width / 8);
  var mode = xlen%4;
  var y = this.height >= 0 ? this.height - 1 : -this.height
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y
    for (var x = 0; x < xlen; x++) {
      var b = this.buffer.readUInt8(this.pos++);
      var location = line * this.width * 4 + x*8*4;
      for (var i = 0; i < 8; i++) {
        if(x*8+i<this.width){
          var rgb = this.palette[((b>>(7-i))&0x1)];

          this.data[location+i*4] = 0;
          this.data[location+i*4 + 1] = rgb.blue;
          this.data[location+i*4 + 2] = rgb.green;
          this.data[location+i*4 + 3] = rgb.red;

        }else{
          break;
        }
      }
    }

    if (mode != 0){
      this.pos+=(4 - mode);
    }
  }
};

BmpDecoder.prototype.bit4 = function() {
    //RLE-4
    if(this.compress == 2){
        this.data.fill(0xff);

        var location = 0;
        var lines = this.bottom_up?this.height-1:0;
        var low_nibble = false;//for all count of pixel

        while(location<this.data.length){
            var a = this.buffer.readUInt8(this.pos++);
            var b = this.buffer.readUInt8(this.pos++);
            //absolute mode
            if(a == 0){
                if(b == 0){//line end
                    if(this.bottom_up){
                        lines--;
                    }else{
                        lines++;
                    }
                    location = lines*this.width*4;
                    low_nibble = false;
                    continue;
                }else if(b == 1){//image end
                    break;
                }else if(b ==2){
                    //offset x,y
                    var x = this.buffer.readUInt8(this.pos++);
                    var y = this.buffer.readUInt8(this.pos++);
                    if(this.bottom_up){
                        lines-=y;
                    }else{
                        lines+=y;
                    }

                    location +=(y*this.width*4+x*4);
                }else{
                    var c = this.buffer.readUInt8(this.pos++);
                    for(var i=0;i<b;i++){
                        if (low_nibble) {
                            setPixelData.call(this, (c & 0x0f));
                        } else {
                            setPixelData.call(this, (c & 0xf0)>>4);
                        }

                        if ((i & 1) && (i+1 < b)){
                            c = this.buffer.readUInt8(this.pos++);
                        }

                        low_nibble = !low_nibble;
                    }

                    if ((((b+1) >> 1) & 1 ) == 1){
                        this.pos++
                    }
                }

            }else{//encoded mode
                for (var i = 0; i < a; i++) {
                    if (low_nibble) {
                        setPixelData.call(this, (b & 0x0f));
                    } else {
                        setPixelData.call(this, (b & 0xf0)>>4);
                    }
                    low_nibble = !low_nibble;
                }
            }

        }




        function setPixelData(rgbIndex){
            var rgb = this.palette[rgbIndex];
            this.data[location] = 0;
            this.data[location + 1] = rgb.blue;
            this.data[location + 2] = rgb.green;
            this.data[location + 3] = rgb.red;
            location+=4;
        }
    }else{

      var xlen = Math.ceil(this.width/2);
      var mode = xlen%4;
      for (var y = this.height - 1; y >= 0; y--) {
        var line = this.bottom_up ? y : this.height - 1 - y
        for (var x = 0; x < xlen; x++) {
          var b = this.buffer.readUInt8(this.pos++);
          var location = line * this.width * 4 + x*2*4;

          var before = b>>4;
          var after = b&0x0F;

          var rgb = this.palette[before];
          this.data[location] = 0;
          this.data[location + 1] = rgb.blue;
          this.data[location + 2] = rgb.green;
          this.data[location + 3] = rgb.red;


          if(x*2+1>=this.width)break;

          rgb = this.palette[after];

          this.data[location+4] = 0;
          this.data[location+4 + 1] = rgb.blue;
          this.data[location+4 + 2] = rgb.green;
          this.data[location+4 + 3] = rgb.red;

        }

        if (mode != 0){
          this.pos+=(4 - mode);
        }
      }

    }

};

BmpDecoder.prototype.bit8 = function() {
    //RLE-8
    if(this.compress == 1){
        this.data.fill(0xff);

        var location = 0;
        var lines = this.bottom_up?this.height-1:0;

        while(location<this.data.length){
            var a = this.buffer.readUInt8(this.pos++);
            var b = this.buffer.readUInt8(this.pos++);
            //absolute mode
            if(a == 0){
                if(b == 0){//line end
                    if(this.bottom_up){
                        lines--;
                    }else{
                        lines++;
                    }
                    location = lines*this.width*4;
                    continue;
                }else if(b == 1){//image end
                    break;
                }else if(b ==2){
                    //offset x,y
                    var x = this.buffer.readUInt8(this.pos++);
                    var y = this.buffer.readUInt8(this.pos++);
                    if(this.bottom_up){
                        lines-=y;
                    }else{
                        lines+=y;
                    }

                    location +=(y*this.width*4+x*4);
                }else{
                    for(var i=0;i<b;i++){
                        var c = this.buffer.readUInt8(this.pos++);
                        setPixelData.call(this, c);
                    }
                    if(b&1 == 1){
                        this.pos++;
                    }

                }

            }else{//encoded mode
                for (var i = 0; i < a; i++) {
                    setPixelData.call(this, b);
                }
            }

        }




        function setPixelData(rgbIndex){
            var rgb = this.palette[rgbIndex];
            this.data[location] = 0;
            this.data[location + 1] = rgb.blue;
            this.data[location + 2] = rgb.green;
            this.data[location + 3] = rgb.red;
            location+=4;
        }
    }else {
        var mode = this.width % 4;
        for (var y = this.height - 1; y >= 0; y--) {
            var line = this.bottom_up ? y : this.height - 1 - y
            for (var x = 0; x < this.width; x++) {
                var b = this.buffer.readUInt8(this.pos++);
                var location = line * this.width * 4 + x * 4;
                if (b < this.palette.length) {
                    var rgb = this.palette[b];

                    this.data[location] = 0;
                    this.data[location + 1] = rgb.blue;
                    this.data[location + 2] = rgb.green;
                    this.data[location + 3] = rgb.red;

                } else {
                    this.data[location] = 0;
                    this.data[location + 1] = 0xFF;
                    this.data[location + 2] = 0xFF;
                    this.data[location + 3] = 0xFF;
                }
            }
            if (mode != 0) {
                this.pos += (4 - mode);
            }
        }
    }
};

BmpDecoder.prototype.bit15 = function() {
  var dif_w =this.width % 3;
  var _11111 = parseInt("11111", 2),_1_5 = _11111;
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y
    for (var x = 0; x < this.width; x++) {

      var B = this.buffer.readUInt16LE(this.pos);
      this.pos+=2;
      var blue = (B & _1_5) / _1_5 * 255 | 0;
      var green = (B >> 5 & _1_5 ) / _1_5 * 255 | 0;
      var red = (B >> 10 & _1_5) / _1_5 * 255 | 0;
      var alpha = (B>>15)?0xFF:0x00;

      var location = line * this.width * 4 + x * 4;

      this.data[location] = alpha;
      this.data[location + 1] = blue;
      this.data[location + 2] = green;
      this.data[location + 3] = red;
    }
    //skip extra bytes
    this.pos += dif_w;
  }
};

BmpDecoder.prototype.bit16 = function() {
  var dif_w =(this.width % 2)*2;
  //default xrgb555
  this.maskRed = 0x7C00;
  this.maskGreen = 0x3E0;
  this.maskBlue =0x1F;
  this.mask0 = 0;

  if(this.compress == 3){
    this.maskRed = this.buffer.readUInt32LE(this.pos);
    this.pos+=4;
    this.maskGreen = this.buffer.readUInt32LE(this.pos);
    this.pos+=4;
    this.maskBlue = this.buffer.readUInt32LE(this.pos);
    this.pos+=4;
    this.mask0 = this.buffer.readUInt32LE(this.pos);
    this.pos+=4;
  }


  var ns=[0,0,0];
  for (var i=0;i<16;i++){
    if ((this.maskRed>>i)&0x01) ns[0]++;
    if ((this.maskGreen>>i)&0x01) ns[1]++;
    if ((this.maskBlue>>i)&0x01) ns[2]++;
  }
  ns[1]+=ns[0]; ns[2]+=ns[1];	ns[0]=8-ns[0]; ns[1]-=8; ns[2]-=8;

  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y;
    for (var x = 0; x < this.width; x++) {

      var B = this.buffer.readUInt16LE(this.pos);
      this.pos+=2;

      var blue = (B&this.maskBlue)<<ns[0];
      var green = (B&this.maskGreen)>>ns[1];
      var red = (B&this.maskRed)>>ns[2];

      var location = line * this.width * 4 + x * 4;

      this.data[location] = 0;
      this.data[location + 1] = blue;
      this.data[location + 2] = green;
      this.data[location + 3] = red;
    }
    //skip extra bytes
    this.pos += dif_w;
  }
};

BmpDecoder.prototype.bit24 = function() {
  for (var y = this.height - 1; y >= 0; y--) {
    var line = this.bottom_up ? y : this.height - 1 - y
    for (var x = 0; x < this.width; x++) {
      //Little Endian rgb
      var blue = this.buffer.readUInt8(this.pos++);
      var green = this.buffer.readUInt8(this.pos++);
      var red = this.buffer.readUInt8(this.pos++);
      var location = line * this.width * 4 + x * 4;
      this.data[location] = 0;
      this.data[location + 1] = blue;
      this.data[location + 2] = green;
      this.data[location + 3] = red;
    }
    //skip extra bytes
    this.pos += (this.width % 4);
  }

};

/**
 * add 32bit decode func
 * @author soubok
 */
BmpDecoder.prototype.bit32 = function() {
  //BI_BITFIELDS
  if(this.compress == 3){
    this.maskRed = this.buffer.readUInt32LE(this.pos);
    this.pos+=4;
    this.maskGreen = this.buffer.readUInt32LE(this.pos);
    this.pos+=4;
    this.maskBlue = this.buffer.readUInt32LE(this.pos);
    this.pos+=4;
    this.mask0 = this.buffer.readUInt32LE(this.pos);
    this.pos+=4;
      for (var y = this.height - 1; y >= 0; y--) {
          var line = this.bottom_up ? y : this.height - 1 - y;
          for (var x = 0; x < this.width; x++) {
              //Little Endian rgba
              var alpha = this.buffer.readUInt8(this.pos++);
              var blue = this.buffer.readUInt8(this.pos++);
              var green = this.buffer.readUInt8(this.pos++);
              var red = this.buffer.readUInt8(this.pos++);
              var location = line * this.width * 4 + x * 4;
              this.data[location] = alpha;
              this.data[location + 1] = blue;
              this.data[location + 2] = green;
              this.data[location + 3] = red;
          }
      }

  }else{
      for (var y = this.height - 1; y >= 0; y--) {
          var line = this.bottom_up ? y : this.height - 1 - y;
          for (var x = 0; x < this.width; x++) {
              //Little Endian argb
              var blue = this.buffer.readUInt8(this.pos++);
              var green = this.buffer.readUInt8(this.pos++);
              var red = this.buffer.readUInt8(this.pos++);
              var alpha = this.buffer.readUInt8(this.pos++);
              var location = line * this.width * 4 + x * 4;
              this.data[location] = alpha;
              this.data[location + 1] = blue;
              this.data[location + 2] = green;
              this.data[location + 3] = red;
          }
      }

  }




};

BmpDecoder.prototype.getData = function() {
  return this.data;
};

module.exports = function(bmpData) {
  var decoder = new BmpDecoder(bmpData);
  return decoder;
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/bmp-js/lib/encoder.js":
/*!********************************************!*\
  !*** ./node_modules/bmp-js/lib/encoder.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/**
 * @author shaozilee
 *
 * BMP format encoder,encode 24bit BMP
 * Not support quality compression
 *
 */

function BmpEncoder(imgData){
	this.buffer = imgData.data;
	this.width = imgData.width;
	this.height = imgData.height;
	this.extraBytes = this.width%4;
	this.rgbSize = this.height*(3*this.width+this.extraBytes);
	this.headerInfoSize = 40;

	this.data = [];
	/******************header***********************/
	this.flag = "BM";
	this.reserved = 0;
	this.offset = 54;
	this.fileSize = this.rgbSize+this.offset;
	this.planes = 1;
	this.bitPP = 24;
	this.compress = 0;
	this.hr = 0;
	this.vr = 0;
	this.colors = 0;
	this.importantColors = 0;
}

BmpEncoder.prototype.encode = function() {
	var tempBuffer = new Buffer(this.offset+this.rgbSize);
	this.pos = 0;
	tempBuffer.write(this.flag,this.pos,2);this.pos+=2;
	tempBuffer.writeUInt32LE(this.fileSize,this.pos);this.pos+=4;
	tempBuffer.writeUInt32LE(this.reserved,this.pos);this.pos+=4;
	tempBuffer.writeUInt32LE(this.offset,this.pos);this.pos+=4;

	tempBuffer.writeUInt32LE(this.headerInfoSize,this.pos);this.pos+=4;
	tempBuffer.writeUInt32LE(this.width,this.pos);this.pos+=4;
	tempBuffer.writeInt32LE(-this.height,this.pos);this.pos+=4;
	tempBuffer.writeUInt16LE(this.planes,this.pos);this.pos+=2;
	tempBuffer.writeUInt16LE(this.bitPP,this.pos);this.pos+=2;
	tempBuffer.writeUInt32LE(this.compress,this.pos);this.pos+=4;
	tempBuffer.writeUInt32LE(this.rgbSize,this.pos);this.pos+=4;
	tempBuffer.writeUInt32LE(this.hr,this.pos);this.pos+=4;
	tempBuffer.writeUInt32LE(this.vr,this.pos);this.pos+=4;
	tempBuffer.writeUInt32LE(this.colors,this.pos);this.pos+=4;
	tempBuffer.writeUInt32LE(this.importantColors,this.pos);this.pos+=4;

	var i=0;
	var rowBytes = 3*this.width+this.extraBytes;

	for (var y = 0; y <this.height; y++){
		for (var x = 0; x < this.width; x++){
			var p = this.pos+y*rowBytes+x*3;
			i++;//a
			tempBuffer[p]= this.buffer[i++];//b
			tempBuffer[p+1] = this.buffer[i++];//g
			tempBuffer[p+2]  = this.buffer[i++];//r
		}
		if(this.extraBytes>0){
			var fillOffset = this.pos+y*rowBytes+this.width*3;
			tempBuffer.fill(0,fillOffset,fillOffset+this.extraBytes);
		}
	}

	return tempBuffer;
};

module.exports = function(imgData, quality) {
  if (typeof quality === 'undefined') quality = 100;
 	var encoder = new BmpEncoder(imgData);
	var data = encoder.encode();
  return {
    data: data,
    width: imgData.width,
    height: imgData.height
  };
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
var isArray = __webpack_require__(/*! isarray */ "./node_modules/isarray/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/isarray/index.js":
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/animation.js":
/*!**************************!*\
  !*** ./src/animation.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Animation; });
class Animation {
    constructor ({ frames, duration }) {
        this.frames = frames;
        this.duration = duration;
        this.currentFrame = 0;
        this.time = 0;
    }

    update (time) {
        this.time += time.elapsed;
        if (this.time >= this.duration) {
            this.time -= this.duration;
            if (this.currentFrame >= this.frames.length) {
                this.currentFrame = 0;
            }
            this.frames[this.currentFrame++]();
        }
    }
}

/***/ }),

/***/ "./src/assets/background.bmp":
/*!***********************************!*\
  !*** ./src/assets/background.bmp ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("../sprites/background.bmp");

/***/ }),

/***/ "./src/assets/sprites.bmp":
/*!********************************!*\
  !*** ./src/assets/sprites.bmp ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("../sprites/sprites.bmp");

/***/ }),

/***/ "./src/bitmapLoader.js":
/*!*****************************!*\
  !*** ./src/bitmapLoader.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(Buffer) {/* harmony import */ var bmp_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bmp-js */ "./node_modules/bmp-js/index.js");
/* harmony import */ var bmp_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bmp_js__WEBPACK_IMPORTED_MODULE_0__);


const loadBitmap = async (url, setData) => {
    const res = await fetch(url);
    const arryBuffer = await res.arrayBuffer();
    var bmpData = bmp_js__WEBPACK_IMPORTED_MODULE_0___default.a.decode(new Buffer(arryBuffer));
    const width = bmpData.width;
    const height = bmpData.height;
    if (width !== 128 || height !== 128) {
        throw new Error(`incorrect bitmap size ${width}x${height}`);
    }
    const data = bmpData.data;
    const length = data.length / 4; // 4 bytes per pixel
    let value = 0;
    for (var i=0;i<length;i++) {
        const blue = data[i*4 + 1];
        const color = (blue >> 6) & 0x03; // 0,1,2,3
        value = (value << 2) & 0xff | color;
        if (i % 4 === 3) {
            const adr = i >> 2;
            setData(adr, value);
        }
    }
};

/* harmony default export */ __webpack_exports__["default"] = (loadBitmap);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./src/dark.css":
/*!**********************!*\
  !*** ./src/dark.css ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/display.js":
/*!************************!*\
  !*** ./src/display.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _palette__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./palette */ "./src/palette.js");


const WIDTH = 256;
const HEIGHT = 240;
const BYTES_PER_PIXEL = 4;
const ROW_WIDTH = WIDTH * BYTES_PER_PIXEL;

class Display {
    constructor (ctx) {
        this.ctx = ctx;
        this.buffer = new ImageData(WIDTH, HEIGHT);
        this.pixels = this.buffer.data;
    }

    getPixel (x, y) {
        const idx = y * ROW_WIDTH + x * BYTES_PER_PIXEL;
        return [
            this.pixels[idx + 0], // r
            this.pixels[idx + 1], // g
            this.pixels[idx + 2], // b
        ];
    }
    
    setPixel (x, y, displayColor) {
        const r = Object(_palette__WEBPACK_IMPORTED_MODULE_0__["getColorByte"])(displayColor, 0);
        const g = Object(_palette__WEBPACK_IMPORTED_MODULE_0__["getColorByte"])(displayColor, 1);
        const b = Object(_palette__WEBPACK_IMPORTED_MODULE_0__["getColorByte"])(displayColor, 2);
        const idx = y * ROW_WIDTH + x * BYTES_PER_PIXEL;
        
        this.pixels[idx + 0] = r;
        this.pixels[idx + 1] = g;
        this.pixels[idx + 2] = b;
        this.pixels[idx + 3] = 0xFF;
    }
    
    draw () {
        this.ctx.putImageData(this.buffer, 0, 0);
    }
}

/* harmony default export */ __webpack_exports__["default"] = (Display);


/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Game; });
/* harmony import */ var animation_frame__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! animation-frame */ "./node_modules/animation-frame/index.js");
/* harmony import */ var animation_frame__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(animation_frame__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _keybindings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keybindings */ "./src/keybindings.js");
/* harmony import */ var _display__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./display */ "./src/display.js");
/* harmony import */ var _spriteManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./spriteManager */ "./src/spriteManager.js");
/* harmony import */ var _ppu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ppu */ "./src/ppu.js");
/* harmony import */ var _bitmapLoader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./bitmapLoader */ "./src/bitmapLoader.js");
/* harmony import */ var _text__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./text */ "./src/text.js");
/* harmony import */ var _gametime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./gametime */ "./src/gametime.js");
/* harmony import */ var _animation__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./animation */ "./src/animation.js");
/* harmony import */ var _assets_background_bmp__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./assets/background.bmp */ "./src/assets/background.bmp");
/* harmony import */ var _assets_sprites_bmp__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./assets/sprites.bmp */ "./src/assets/sprites.bmp");












const {
    HORIZONTAL,
    VERTICAL,
    setCommonBackground,
    setMirroring,
    setScroll,
    setNametable,
    setAttribute,
    setBgPalette,
    setSpritePalette,
    setSpriteData,
    setBackgroundData,
    getPixel,
} = _ppu__WEBPACK_IMPORTED_MODULE_4__["default"];

const BLACK = 0x3f;
const WHITE = 0x30;

const BLANK = 0xFF;
const BRICK = 0x30;
const CIRCLE_TL = 0x31;
const CIRCLE_TR = 0x32;
const CIRCLE_BL = 0x33;
const CIRCLE_BR = 0x34;

const rand = () => Math.random();
const randInt = (max) => Math.floor(Math.random() * max);

class Game {
    constructor (canvas) {
        this.display = new _display__WEBPACK_IMPORTED_MODULE_2__["default"](canvas.getContext('2d'));
        this.spriteManager = new _spriteManager__WEBPACK_IMPORTED_MODULE_3__["default"](this.display);
        this.state = {
            attract: true,
            menuOpen: false,
        }
        this.animationFrame = new animation_frame__WEBPACK_IMPORTED_MODULE_0___default.a(30);
    }
    
    async reset () {
        console.log('RESET');
        // load tile sheets
        await Object(_bitmapLoader__WEBPACK_IMPORTED_MODULE_5__["default"])(_assets_background_bmp__WEBPACK_IMPORTED_MODULE_9__["default"], _ppu__WEBPACK_IMPORTED_MODULE_4__["default"].setBackgroundData);
        await Object(_bitmapLoader__WEBPACK_IMPORTED_MODULE_5__["default"])(_assets_sprites_bmp__WEBPACK_IMPORTED_MODULE_10__["default"], _ppu__WEBPACK_IMPORTED_MODULE_4__["default"].setSpriteData);
        this.spriteManager.clearSprites();

        this.loadTitleScreen();
    }

    play () {
        const self = this;

        this.startTime = this.time = new _gametime__WEBPACK_IMPORTED_MODULE_7__["default"](Date.now(), 0, 0);
        this.fps = 0;

        function tick () {
            const timestamp = Date.now();
            const elapsed = timestamp - self.time.timestamp;
            const time = new _gametime__WEBPACK_IMPORTED_MODULE_7__["default"](timestamp, elapsed);
            self.time = time;
    
            self.update(time);
            self.draw();
    
            self.frameId = self.animationFrame.request(tick);
        }

        this.frameId = this.animationFrame.request(tick);
    }


    pause () {
        this.animationFrame.cancel(this.frameId);
    }

    update (time) {
        this.fps = Math.floor(1000 / time.elapsed);

        if (this.onUpdate) {
            this.onUpdate();
        }
        if (this.titleAnimation) {
            this.titleAnimation.update(time);
        }
        if (this.pacmanAnimation) {
            this.pacmanAnimation.update(time);
        }
    }

    loadTitleScreen () {
        setCommonBackground(BLACK);
        setMirroring(HORIZONTAL);
        setScroll(0, 0);
        
        setBgPalette(0, BLACK, 0x00, 0x10, WHITE);
        setBgPalette(1, BLACK, 0x11, 0x21, 0x31); // blues
        setBgPalette(2, BLACK, 0x07, 0x17, 0x27); // oranges

        setSpritePalette(0, BLACK, 0x18, 0x28, 0x38); // pacman

        this.clear();
        this.updateTitleScreen();
        this.pacman = {
            x: 64,
            y: 64,
            frame: 0
        };
        this.updatePacman();

        // animate the screen once a second
        this.titleAnimation = new _animation__WEBPACK_IMPORTED_MODULE_8__["default"]({
            duration: 1000,
            frames: [
                () => this.updateTitleScreen()
            ]
        });

        this.pacmanAnimation = new _animation__WEBPACK_IMPORTED_MODULE_8__["default"]({
            duration: 30,
            frames: [
                () => this.updatePacman()
            ]
        });
    }

    updateTitleScreen () {
        // fill the screen with squiggles
        for (let y=0; y<30; y++)
        for (let x=0; x<32; x++) {
            setNametable(x, y, CIRCLE_TL + randInt(2)+2);
        }

        // fill the attribute table with orange
        for (let y=0; y<15; y++)
        for (let x=0; x<16; x++) {
            setAttribute(x, y, 2);
        }

        // add the title
        for (let y=8; y<13; y++)
        for (let x=8; x<24; x++) {
            setNametable(x, y, BLANK);
        }
        for (let y=5; y<6; y++)
        for (let x=5; x<12; x++) {
            setAttribute(x, y, 1);
        }
        Object(_text__WEBPACK_IMPORTED_MODULE_6__["default"])(10,10, 'HELLO WORLD!');
    }

    updatePacman () {
        let { x, y, frame } = this.pacman;
        let idx = [0,1,2,3,2,1][frame];
        let flipx = false;
        let flipy = false;
        
        if (y === 64 && x < 192 - 8) {
            x += 2;
        } else if (y < 104 -8 && x > 64) {
            idx += 4;
            y += 2;
            flipy = flipx = true;
        } else if (x > 64) {
            x -= 2;
            flipx = true;
        } else {
            idx += 4;
            y -= 2;
        }
        this.spriteManager.setSprite (0, idx, x, y, flipx, flipy, false, 0);
        this.pacman.frame = (frame + 1) % 6;
        this.pacman.x = x;
        this.pacman.y = y;


    }

    clear () {
        setMirroring(HORIZONTAL);
        for (let y=0; y<60; y++)
        for (let x=0; x<32; x++) {
            setNametable(x, y, BLANK);
        }
    }

    draw () {
        for (let y=0; y<240; y++)
        for (let x=0; x<256; x++) {
            const color = getPixel(x, y);
            this.display.setPixel(x, y, color);
        }
        this.spriteManager.draw();
        this.display.draw();
    }
};


/***/ }),

/***/ "./src/gametime.js":
/*!*************************!*\
  !*** ./src/gametime.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return gametime; });
class gametime {
    constructor (timestamp, elapsed) {
        this.timestamp = timestamp || Date.now();
        this.elapsed = elapsed || 0;
    }
};

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/game.js");
/* harmony import */ var _dark_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dark.css */ "./src/dark.css");
/* harmony import */ var _dark_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_dark_css__WEBPACK_IMPORTED_MODULE_1__);



const canvas = document.getElementById('canvas');
const game = new _game__WEBPACK_IMPORTED_MODULE_0__["default"](canvas);

const fps = document.getElementById('fps');

game.onUpdate = () => {
    if (fps) fps.textContent = game.fps;
};

window.game = game;

document.getElementById('btnReset').onclick = (e) => {
    game.reset();
};

var hidden, visibilityChange; 
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

function handleVisibilityChange() {
  if (document[hidden]) {
    game.pause();
  } else {
    game.play();
  }
}

document.addEventListener(visibilityChange, handleVisibilityChange, false);

// start
game.reset().then(() => game.play());

/***/ }),

/***/ "./src/keybindings.js":
/*!****************************!*\
  !*** ./src/keybindings.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// import keyevents from 'key-events';

//const keys = keyevents();
const keystate = {};
let debug = false;

document.addEventListener('keydown', (event) => {
    const { key, keyCode } = event;
    if (keystate[key]) return;
    keystate[key] = true;
    if (key === '`') debug = !debug;
    if (debug) console.log(`keydown: ${key}`);
}, false);

document.addEventListener('keyup', (event) => {
    const { key, keyCode } = event;
    if (keystate[key] === false) return;
    keystate[key] = false;
    if (debug) console.log(`keyup: ${key}`);
}, false);

/* harmony default export */ __webpack_exports__["default"] = (keystate);


/***/ }),

/***/ "./src/palette.js":
/*!************************!*\
  !*** ./src/palette.js ***!
  \************************/
/*! exports provided: colors, getColorByte */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "colors", function() { return colors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getColorByte", function() { return getColorByte; });
/* 64 colors */
const colors = [
    0x7C, 0x7C, 0x7C,
    0x00, 0x00, 0xFC,
    0x00, 0x00, 0xBC,
    0x44, 0x28, 0xBC,
    0x94, 0x00, 0x84,
    0xA8, 0x00, 0x20,
    0xA8, 0x10, 0x00,
    0x88, 0x14, 0x00,
    0x50, 0x30, 0x00,
    0x00, 0x78, 0x00,
    0x00, 0x68, 0x00,
    0x00, 0x58, 0x00,
    0x00, 0x40, 0x58,
    0x00, 0x00, 0x00,
    0x00, 0x00, 0x00,
    0x00, 0x00, 0x00,
    0xBC, 0xBC, 0xBC,
    0x00, 0x78, 0xF8,
    0x00, 0x58, 0xF8,
    0x68, 0x44, 0xFC,
    0xD8, 0x00, 0xCC,
    0xE4, 0x00, 0x58,
    0xF8, 0x38, 0x00,
    0xE4, 0x5C, 0x10,
    0xAC, 0x7C, 0x00,
    0x00, 0xB8, 0x00,
    0x00, 0xA8, 0x00,
    0x00, 0xA8, 0x44,
    0x00, 0x88, 0x88,
    0x00, 0x00, 0x00,
    0x00, 0x00, 0x00,
    0x00, 0x00, 0x00,
    0xF8, 0xF8, 0xF8,
    0x3C, 0xBC, 0xFC,
    0x68, 0x88, 0xFC,
    0x98, 0x78, 0xF8,
    0xF8, 0x78, 0xF8,
    0xF8, 0x58, 0x98,
    0xF8, 0x78, 0x58,
    0xFC, 0xA0, 0x44,
    0xF8, 0xB8, 0x00,
    0xB8, 0xF8, 0x18,
    0x58, 0xD8, 0x54,
    0x58, 0xF8, 0x98,
    0x00, 0xE8, 0xD8,
    0x78, 0x78, 0x78,
    0x00, 0x00, 0x00,
    0x00, 0x00, 0x00,
    0xFC, 0xFC, 0xFC,
    0xA4, 0xE4, 0xFC,
    0xB8, 0xB8, 0xF8,
    0xD8, 0xB8, 0xF8,
    0xF8, 0xB8, 0xF8,
    0xF8, 0xA4, 0xC0,
    0xF0, 0xD0, 0xB0,
    0xFC, 0xE0, 0xA8,
    0xF8, 0xD8, 0x78,
    0xD8, 0xF8, 0x78,
    0xB8, 0xF8, 0xB8,
    0xB8, 0xF8, 0xD8,
    0x00, 0xFC, 0xFC,
    0xF8, 0xD8, 0xF8,
    0x00, 0x00, 0x00,
    0x00, 0x00, 0x00
];

// returns red, blue, or green value for a 
// color between 0x00 and 0x3f
// offsets: 0-red, 1-green, 2-blue
const getColorByte = (color, offset) => {
    return colors[color * 3 + offset];
};



/***/ }),

/***/ "./src/ppu.js":
/*!********************!*\
  !*** ./src/ppu.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _palette__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./palette */ "./src/palette.js");


/**
 * bg_palette_1: 0
 * bg_palette_2: 4
 * bg_palette_3: 8
 * bg_palette_4: 12
 * sprite_pal_1: 16
 * sprite_pal_2: 20
 * sprite_pal_3: 24
 * sprite_pal_4: 28
 */
const palettes = new Uint8Array(32);

/*
    128x128 pixels
    4 pixels/byte,
    32x128 = 4096 bytes
*/
const spriteTable = new Uint8Array(4096);
const backgroundTable = new Uint8Array(4096);

const nametables = new Uint8Array(32*30 * 2);
const attributes = new Uint8Array(64 * 2);
const spriteScanline = new Uint8Array(64);

const HORIZONTAL = 0;
const VERTICAL = 1;

const state = {
    mirroring: HORIZONTAL,
    scroll: {
        x: 0,
        y: 0
    },
    common_background: 0x3f // black
};

// 0x00-0x3f
/**
 * Sets the common background NES color
 * @param {*} color 0x00-0x3f
 */
const setCommonBackground = (color) => {
    state.common_background = color;
};

const getCommonBackground = () => state.common_background;

// HORIZONTAL:0, VERTICAL:1
const setMirroring = (mode) => {
    state.mirroring = mode;
};

/**
 * Sets the amount of horizontal and vertical scrolling in pixels
 * @param {*} x 0-512
 * @param {*} y 0-479
 */
const setScroll = (x, y) => {
    state.scroll.x = x >= 0 ? x : x + 512;
    state.scroll.y = y > 0 ? y : y + 479;
};

// with mirroring
// 32+32 x 30+30 = 64x60
/**
 * 
 * @param {*} x horizontal index, 0-63
 * @param {*} y vertical index, 0-59
 * @param {*} tile tile index
 */
const setNametable = (x, y, tile) => {
    const adr = getNametableAdr(x, y);
    nametables[adr] = tile;
};

// with mirroring
// 32+32 x 30+30 = 64x60 tiles
/**
 * 
 * @param {*} x horizontal index, 0-63
 * @param {*} y vertical index, 0-59
 * @returns a resolved nametable address offset, 0 - 0x0780
 */
const getNametableAdr = (x, y) => {
    const X = x % 32; // x is either 0-31 or 0-63
    const Y = (state.mirroring == HORIZONTAL) ?
        y : (y % 30) << (x >> 5);

    // X,Y = 32x60
    return Y * 32 + X;
};

// with mirroring
// 16+16 x 15+15 = 32x30
// palette 0-3
/**
 * Sets the palette for a 2x2 area of tiles
 * @param {*} x horizontal attribute index, 0-31
 * @param {*} y vertical attribute index, 0-29
 * @param {*} palette palette number, 0-3
 */
const setAttribute = (x, y, palette) => {
    const adr = getAttributeAdr(x, y);
    const offset = getAttributeOffset(x, y);
    const current_value = attributes[adr];
    const mask = ~(0x03 << offset);
    const value = (palette & 0x03) << offset;
    attributes[adr] = (current_value & mask) | value;
};

const getAttributeAdr = (x, y) => {
    const X = x % 16;
    let Y = (state.mirroring == HORIZONTAL) ?
        y : (y % 15) << (x >> 4);

    // the bottom row does not have attributes c or d
    if (Y > 14) Y++;

    // X,Y = 16x30
    // BX,BY = 8x15
    const BX = X >> 1;
    const BY = Y >> 1;
    return BY * 8 + BX;
};

const getAttributeOffset = (x, y) => {
    const X = x % 16;
    let Y = (state.mirroring == HORIZONTAL) ?
        y : (y % 15) << (x >> 4);

    // the bottom row does not have attributes c or d
    if (Y > 14) Y++;

    const shiftX = (X % 2) << 1;
    const shiftY = (Y % 2) << 2;
    return shiftX << shiftY;
};

/**
 * 
 * @param {*} idx palette index 0-3
 * @param {*} c0 color 0: common background
 * @param {*} c1 color 1
 * @param {*} c2 color 2
 * @param {*} c3 color 3
 */
const setBgPalette = (idx, c0, c1, c2, c3) => {
    palettes[idx * 4 + 0] = c0;
    palettes[idx * 4 + 1] = c1;
    palettes[idx * 4 + 2] = c2;
    palettes[idx * 4 + 3] = c3;
};

/**
 * 
 * @param {*} idx 0-3
 * @param {*} colors [c0, c1, c2, c3]
 */
const setSpritePalette = (idx, c0, c1, c2, c3) => {
    palettes[16 + idx * 4 + 0] = c0;
    palettes[16 + idx * 4 + 1] = c1;
    palettes[16 + idx * 4 + 2] = c2;
    palettes[16 + idx * 4 + 3] = c3;
};

const getBgColor = (idx, colorIdx) => {
    return palettes[idx * 4 + colorIdx];
};

const getSpriteColor = (idx, colorIdx) => {
    return palettes[16 + idx * 4 + colorIdx];
};

/** Sets sprite pixel data for a single byte */
const setSpriteData = (adr, value) => {
    spriteTable[adr] = value;
};

/** Sets background tile pixel data for a single byte*/
const setBackgroundData = (adr, value) => {
    backgroundTable[adr] = value;
};

const getAttribute = (tilex, tiley) => {
    const x = tilex >> 1;
    const y = tiley >> 1;
    const adr = getAttributeAdr(x, y);
    const offset = getAttributeOffset(x, y);
    return (attributes[adr] >> offset) & 0x03;
};

/**
 * Gets the tile number for a screen-space tiled offset
 * @param {*} tilex 0-63
 * @param {*} tiley 0-59
 */
const getTile = (tilex, tiley) => {
    const adr = getNametableAdr(tilex, tiley);
    return nametables[adr];
};

// idx: 0-255
// pixelx: 0-7
// pixely: 0-7
// returns color 0-3
const getTilePixel = (idx, pixelx, pixely) => {
    // 128x128 pixels
    // 16, 8x8 pixel tiles per row
    // 4 pixels per byte. 32 bytes per row
    // 2 bytes per row of pixels per sprite

    const top_left = ((idx >> 4) * 256) + ((idx % 16) * 2);
    const adr = top_left + (pixely * 32) + (pixelx >> 2);
    const data = backgroundTable[adr];
    const offset = 6 - ((pixelx % 4) * 2);
    const color = (data >> offset) & 0x03;
    return color;
};

/**
 * Gets the background pixel color value
 * @param {*} screenx pixel 0-255
 * @param {*} screeny pixel 0-239
 * @returns NES color
 */
const getPixel = (screenx, screeny) => {
    const x = (screenx + state.scroll.x) % 512;
    if (x < 0) x += 512;
    const y = (screeny + state.scroll.y) % 480;
    if (y < 0) y += 480;

    const tilex = x >> 3; // 0-31 (0-63)
    const tiley = y >> 3; // 0-29 (0-59)

    const tile = getTile(tilex, tiley);
    const palette = getAttribute(tilex, tiley);

    const tile_pixel_x = x % 8;
    const tile_pixel_y = y % 8;
    const color = getTilePixel(tile, tile_pixel_x, tile_pixel_y)

    return color === 0 ? 
        state.common_background :
        getBgColor(palette, color);
};



// idx: 0-255
// pixelx: 0-7
// pixely: 0-7
// returns color 0-3
const getSpritePixel = (idx, pixelx, pixely) => {
    // 128x128 pixels
    // 16, 8x8 pixel tiles per row
    // 4 pixels per byte. 32 bytes per row
    // 2 bytes per row of pixels per sprite

    const top_left = ((idx >> 5) * 256) + ((idx % 16) * 2);
    const adr = top_left + (pixely * 32) + (pixelx >> 2);
    const data = spriteTable[adr];
    const offset = 6 - ((pixelx % 4) * 2);
    const color = (data >> offset) & 0x03;
    return color;
};

const draw = () => {

};

/* harmony default export */ __webpack_exports__["default"] = ({
    HORIZONTAL,
    VERTICAL,
    setCommonBackground,
    getCommonBackground,
    setMirroring,
    setScroll,
    setNametable,      // sets the tile index for a nametable entry
    setAttribute,      // sets the palette for an attribute entry
    getBgColor,
    getSpriteColor,
    setBgPalette,
    setSpritePalette,
    setSpriteData,     // writes pixel data to the tile sheet
    setBackgroundData, // writes pixel data to the tile sheet
    getPixel,
    getSpritePixel
});

/***/ }),

/***/ "./src/spriteAttributes.js":
/*!*********************************!*\
  !*** ./src/spriteAttributes.js ***!
  \*********************************/
/*! exports provided: SPRITE_FLIP_X, SPRITE_FLIP_Y, SPRITE_PRIORITY, SPRITE_PALETTE, getAttributeByte, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SPRITE_FLIP_X", function() { return SPRITE_FLIP_X; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SPRITE_FLIP_Y", function() { return SPRITE_FLIP_Y; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SPRITE_PRIORITY", function() { return SPRITE_PRIORITY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SPRITE_PALETTE", function() { return SPRITE_PALETTE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAttributeByte", function() { return getAttributeByte; });
const SPRITE_FLIP_X = 0x80;
const SPRITE_FLIP_Y = 0x40;
const SPRITE_PRIORITY = 0x20;
const SPRITE_PALETTE = 0x03;

const getAttributeByte = (flipx, flipy, priority, palette) => {
    return (flipx << 7) | (flipy << 6) | (priority << 5) | (palette & 0x03);
};

/* harmony default export */ __webpack_exports__["default"] = ({
    SPRITE_FLIP_X,
    SPRITE_FLIP_Y,
    SPRITE_PRIORITY,
    SPRITE_PALETTE,
    getAttributeByte
});


/***/ }),

/***/ "./src/spriteManager.js":
/*!******************************!*\
  !*** ./src/spriteManager.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _spriteAttributes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./spriteAttributes */ "./src/spriteAttributes.js");
/* harmony import */ var _ppu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ppu */ "./src/ppu.js");



// 64 sprites, 4 bytes each
/*
    0: index
    1: screen x
    2: screen y
    3: attributes
        7:  flip x
        6:  flip y
        5:  priority
        10: palette
*/

class SpriteManager {
    constructor(display) {
        this.display = display;
        this.sprites = new Uint8Array(64 * 4);
    }

    draw () {
        for (var i=0; i<64; i++) {
            const y = this.sprites[i*4 + 2];
            if (y > 240) continue;
            const x = this.sprites[i*4 + 1];
            const index = this.sprites[i*4 + 0];
            const attrs = this.sprites[i*4 + 3];

            const flipX = (attrs & _spriteAttributes__WEBPACK_IMPORTED_MODULE_0__["SPRITE_FLIP_X"]) > 0;
            const flipY = (attrs & _spriteAttributes__WEBPACK_IMPORTED_MODULE_0__["SPRITE_FLIP_Y"]) > 0;
            const priority = (attrs & _spriteAttributes__WEBPACK_IMPORTED_MODULE_0__["SPRITE_PRIORITY"]) > 0;
            const palette = attrs & _spriteAttributes__WEBPACK_IMPORTED_MODULE_0__["SPRITE_PALETTE"];

            this.drawSprite(index, x, y, flipX, flipY, priority, palette);
        }
    };

    drawSprite (index, x, y, flipX, flipY, priority, palette) {
        
        for (var pi=0; pi<8; pi++) {
            const px = flipX ? 7-pi : pi;
            for (var pj=0; pj<8; pj++) {
                const py = flipY ? 7-pj : pj;

                if (priority) {
                    const bg = _ppu__WEBPACK_IMPORTED_MODULE_1__["default"].getPixel(x+pi, y+pj);
                    if (bg !== _ppu__WEBPACK_IMPORTED_MODULE_1__["default"].getCommonBackground) continue;
                }

                // check sprite table for pixel value
                const color = _ppu__WEBPACK_IMPORTED_MODULE_1__["default"].getSpritePixel(index, px, py);
                if (color > 0) {
                    const displayColor = _ppu__WEBPACK_IMPORTED_MODULE_1__["default"].getSpriteColor(palette, color);
                    this.display.setPixel(x + pi, y + pj, displayColor);
                }
            }
        }
    }

    setSprite (i, index, x, y, flipX, flipY, priority, palette) {
        this.sprites[i*4 + 0] = 0xff & index;
        this.sprites[i*4 + 1] = 0xff & x;
        this.sprites[i*4 + 2] = 0xff & y;
        this.sprites[i*4 + 3] = Object(_spriteAttributes__WEBPACK_IMPORTED_MODULE_0__["getAttributeByte"])(flipX, flipY, priority, palette);
    };

    clearSprite (i) {
        this.sprites[i*4 + 0] = 0xff;
        this.sprites[i*4 + 1] = 0xff;
        this.sprites[i*4 + 2] = 0xff;
        this.sprites[i*4 + 3] = 0xff;
    };

    clearSprites () {
        for (var i=0; i<64; i++) {
            this.clearSprite(i);
        }
    };
}

/* harmony default export */ __webpack_exports__["default"] = (SpriteManager);


/***/ }),

/***/ "./src/text.js":
/*!*********************!*\
  !*** ./src/text.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ppu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ppu */ "./src/ppu.js");

const { setNametable } = _ppu__WEBPACK_IMPORTED_MODULE_0__["default"];

const characters= "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:!$'.? ";
const unknown = characters.indexOf('?');
const text = (tilex, tiley, str) => {
    const upper = str.toUpperCase();
    for (let i=0; i<upper.length; i++) {
        const char = upper.charAt(i);
        let tile = characters.indexOf(char);
        if (tile < 0) tile = unknown;
        setNametable(tilex + i, tiley, tile);
    }
};

/* harmony default export */ __webpack_exports__["default"] = (text);

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2FuaW1hdGlvbi1mcmFtZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYW5pbWF0aW9uLWZyYW1lL2xpYi9hbmltYXRpb24tZnJhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2FuaW1hdGlvbi1mcmFtZS9saWIvbmF0aXZlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hbmltYXRpb24tZnJhbWUvbGliL25vdy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYW5pbWF0aW9uLWZyYW1lL2xpYi9wZXJmb3JtYW5jZS10aW1pbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2FuaW1hdGlvbi1mcmFtZS9saWIvcGVyZm9ybWFuY2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2FuaW1hdGlvbi1mcmFtZS9saWIvcm9vdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ibXAtanMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JtcC1qcy9saWIvZGVjb2Rlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYm1wLWpzL2xpYi9lbmNvZGVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2lzYXJyYXkvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYW5pbWF0aW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9hc3NldHMvYmFja2dyb3VuZC5ibXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9zcHJpdGVzLmJtcCIsIndlYnBhY2s6Ly8vLi9zcmMvYml0bWFwTG9hZGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9kYXJrLmNzcz8zYWE4Iiwid2VicGFjazovLy8uL3NyYy9kaXNwbGF5LmpzIiwid2VicGFjazovLy8uL3NyYy9nYW1lLmpzIiwid2VicGFjazovLy8uL3NyYy9nYW1ldGltZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tleWJpbmRpbmdzLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWxldHRlLmpzIiwid2VicGFjazovLy8uL3NyYy9wcHUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Nwcml0ZUF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Nwcml0ZU1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNE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QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsU0FBUztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQ0FBMEMsVUFBVTtBQUNwRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7O0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQWEsbUJBQU8sQ0FBQywyREFBZTtBQUNwQyxhQUFhLG1CQUFPLENBQUMsMkRBQWU7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsU0FBUztBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsUUFBUTtBQUN2QztBQUNBLG1CQUFtQixVQUFVO0FBQzdCO0FBQ0E7QUFDQSxxQkFBcUIsT0FBTztBQUM1QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrQkFBK0I7O0FBRS9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGdCQUFnQjtBQUNqQztBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxnQ0FBZ0MsSUFBSTtBQUNwQztBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsYUFBYSxLQUFLO0FBQ2xCLCtCQUErQixPQUFPO0FBQ3RDO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsbUNBQW1DLFFBQVE7QUFDM0M7QUFDQSx1QkFBdUIsVUFBVTtBQUNqQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsZ0JBQWdCO0FBQ2pDO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQjtBQUNqQixnQ0FBZ0MsSUFBSTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsYUFBYSxLQUFLO0FBQ2xCLCtCQUErQixPQUFPO0FBQ3RDO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EscUNBQXFDLFFBQVE7QUFDN0M7QUFDQSwyQkFBMkIsZ0JBQWdCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFFBQVE7QUFDdkM7QUFDQSxtQkFBbUIsZ0JBQWdCOztBQUVuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBLGVBQWUsS0FBSztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsY0FBYyxlQUFlLFVBQVU7O0FBRXRELCtCQUErQixRQUFRO0FBQ3ZDO0FBQ0EsbUJBQW1CLGdCQUFnQjs7QUFFbkM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsK0JBQStCLFFBQVE7QUFDdkM7QUFDQSxtQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxRQUFRO0FBQzNDO0FBQ0EseUJBQXlCLGdCQUFnQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNILG1DQUFtQyxRQUFRO0FBQzNDO0FBQ0EseUJBQXlCLGdCQUFnQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7O0FBS0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDcGVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDLGtEQUFrRDtBQUNsRCxrREFBa0Q7QUFDbEQsZ0RBQWdEOztBQUVoRCx3REFBd0Q7QUFDeEQsK0NBQStDO0FBQy9DLGdEQUFnRDtBQUNoRCxnREFBZ0Q7QUFDaEQsK0NBQStDO0FBQy9DLGtEQUFrRDtBQUNsRCxpREFBaUQ7QUFDakQsNENBQTRDO0FBQzVDLDRDQUE0QztBQUM1QyxnREFBZ0Q7QUFDaEQseURBQXlEOztBQUV6RDtBQUNBOztBQUVBLGdCQUFnQixnQkFBZ0I7QUFDaEMsaUJBQWlCLGdCQUFnQjtBQUNqQztBQUNBLE9BQU87QUFDUCxtQ0FBbUM7QUFDbkMsc0NBQXNDO0FBQ3RDLHVDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRVk7O0FBRVosYUFBYSxtQkFBTyxDQUFDLG9EQUFXO0FBQ2hDLGNBQWMsbUJBQU8sQ0FBQyxnREFBUztBQUMvQixjQUFjLG1CQUFPLENBQUMsZ0RBQVM7O0FBRS9CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsbURBQW1EO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsVUFBVTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsWUFBWTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLHVDQUF1QyxTQUFTO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsaUJBQWlCO0FBQ2hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSxpQkFBaUI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixTQUFTO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixTQUFTO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELEVBQUU7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGVBQWU7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0Esd0JBQXdCLFFBQVE7QUFDaEM7QUFDQSxxQkFBcUIsZUFBZTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsWUFBWTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHFCQUFxQixTQUFTO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQixTQUFTO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixrQkFBa0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLG1CQUFtQixjQUFjO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1REFBdUQsT0FBTztBQUM5RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXVELE9BQU87QUFDOUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLFFBQVE7QUFDN0I7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLGVBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixTQUFTO0FBQzVCO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxl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RUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixXQUFXLEVBQUU7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsV0FBVyxFQUFFO0FBQ2IsV0FBVyxFQUFFO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLFdBQVcsRUFBRTtBQUNiO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsV0FBVyxFQUFFO0FBQ2IsV0FBVyxFQUFFO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLFdBQVcsRUFBRTtBQUNiLFdBQVcsRUFBRTtBQUNiLFdBQVcsRUFBRTtBQUNiLFdBQVcsRUFBRTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixXQUFXLEVBQUU7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixXQUFXLEVBQUU7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsV0FBVyxFQUFFO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEseUJBQXlCO0FBQ3pCLHlCQUF5Qjs7QUFFekI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsRTs7Ozs7Ozs7Ozs7O0FDcFNEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFPO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ1A7QUFDQTs7QUFFZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLEVBQUM7Ozs7Ozs7Ozs7Ozs7QUNmRjtBQUFBO0FBQUE7QUFNNEI7QUFDSjs7QUFFeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLE1BQU07QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQ0FBbUMsK0RBQWE7QUFDaEQsbUNBQW1DLCtEQUFhO0FBQ2hELHNDQUFzQyxpRUFBZTtBQUNyRCxvQ0FBb0MsZ0VBQWM7O0FBRWxEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxzQkFBc0IsTUFBTTtBQUM1QjtBQUNBLDBCQUEwQixNQUFNO0FBQ2hDOztBQUVBO0FBQ0EsK0JBQStCLDRDQUFHO0FBQ2xDLCtCQUErQiw0Q0FBRztBQUNsQzs7QUFFQTtBQUNBLDhCQUE4Qiw0Q0FBRztBQUNqQztBQUNBLHlDQUF5Qyw0Q0FBRztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLDBFQUFnQjtBQUNoRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsTUFBTTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTs7QUFFZSw0RUFBYSxFQUFDOzs7Ozs7Ozs7Ozs7O0FDdkY3QjtBQUFBO0FBQXdCO0FBQ3hCLE9BQU8sZUFBZSxHQUFHLDRDQUFHOztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVlLG1FQUFJLEUiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwiLyoqXG4gKiBBbiBldmVuIGJldHRlciBhbmltYXRpb24gZnJhbWUuXG4gKlxuICogQGNvcHlyaWdodCBPbGVnIFNsb2JvZHNrb2kgMjAxNlxuICogQHdlYnNpdGUgaHR0cHM6Ly9naXRodWIuY29tL2tvZi9hbmltYXRpb25GcmFtZVxuICogQGxpY2Vuc2UgTUlUXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9hbmltYXRpb24tZnJhbWUnKVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBuYXRpdmVJbXBsID0gcmVxdWlyZSgnLi9uYXRpdmUnKVxudmFyIG5vdyA9IHJlcXVpcmUoJy4vbm93JylcbnZhciBwZXJmb3JtYW5jZSA9IHJlcXVpcmUoJy4vcGVyZm9ybWFuY2UnKVxudmFyIHJvb3QgPSByZXF1aXJlKCcuL3Jvb3QnKVxuXG4vLyBXZWlyZCBuYXRpdmUgaW1wbGVtZW50YXRpb24gZG9lc24ndCB3b3JrIGlmIGNvbnRleHQgaXMgZGVmaW5lZC5cbnZhciBuYXRpdmVSZXF1ZXN0ID0gbmF0aXZlSW1wbC5yZXF1ZXN0XG52YXIgbmF0aXZlQ2FuY2VsID0gbmF0aXZlSW1wbC5jYW5jZWxcblxuLyoqXG4gKiBBbmltYXRpb24gZnJhbWUgY29uc3RydWN0b3IuXG4gKlxuICogT3B0aW9uczpcbiAqICAgLSBgdXNlTmF0aXZlYCB1c2UgdGhlIG5hdGl2ZSBhbmltYXRpb24gZnJhbWUgaWYgcG9zc2libGUsIGRlZmF1bHRzIHRvIHRydWVcbiAqICAgLSBgZnJhbWVSYXRlYCBwYXNzIGEgY3VzdG9tIGZyYW1lIHJhdGVcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxOdW1iZXJ9IG9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gQW5pbWF0aW9uRnJhbWUob3B0aW9ucykge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBBbmltYXRpb25GcmFtZSkpIHJldHVybiBuZXcgQW5pbWF0aW9uRnJhbWUob3B0aW9ucylcbiAgICBvcHRpb25zIHx8IChvcHRpb25zID0ge30pXG5cbiAgICAvLyBJdHMgYSBmcmFtZSByYXRlLlxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PSAnbnVtYmVyJykgb3B0aW9ucyA9IHtmcmFtZVJhdGU6IG9wdGlvbnN9XG4gICAgb3B0aW9ucy51c2VOYXRpdmUgIT0gbnVsbCB8fCAob3B0aW9ucy51c2VOYXRpdmUgPSB0cnVlKVxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLmZyYW1lUmF0ZSA9IG9wdGlvbnMuZnJhbWVSYXRlIHx8IEFuaW1hdGlvbkZyYW1lLkZSQU1FX1JBVEVcbiAgICB0aGlzLl9mcmFtZUxlbmd0aCA9IDEwMDAgLyB0aGlzLmZyYW1lUmF0ZVxuICAgIHRoaXMuX2lzQ3VzdG9tRnJhbWVSYXRlID0gdGhpcy5mcmFtZVJhdGUgIT09IEFuaW1hdGlvbkZyYW1lLkZSQU1FX1JBVEVcbiAgICB0aGlzLl90aW1lb3V0SWQgPSBudWxsXG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge31cbiAgICB0aGlzLl9sYXN0VGlja1RpbWUgPSAwXG4gICAgdGhpcy5fdGlja0NvdW50ZXIgPSAwXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQW5pbWF0aW9uRnJhbWVcblxuLyoqXG4gKiBEZWZhdWx0IGZyYW1lIHJhdGUgdXNlZCBmb3Igc2hpbSBpbXBsZW1lbnRhdGlvbi4gTmF0aXZlIGltcGxlbWVudGF0aW9uXG4gKiB3aWxsIHVzZSB0aGUgc2NyZWVuIGZyYW1lIHJhdGUsIGJ1dCBqcyBoYXZlIG5vIHdheSB0byBkZXRlY3QgaXQuXG4gKlxuICogSWYgeW91IGtub3cgeW91ciB0YXJnZXQgZGV2aWNlLCBkZWZpbmUgaXQgbWFudWFsbHkuXG4gKlxuICogQHR5cGUge051bWJlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cbkFuaW1hdGlvbkZyYW1lLkZSQU1FX1JBVEUgPSA2MFxuXG4vKipcbiAqIFJlcGxhY2UgdGhlIGdsb2JhbGx5IGRlZmluZWQgaW1wbGVtZW50YXRpb24gb3IgZGVmaW5lIGl0IGdsb2JhbGx5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fE51bWJlcn0gW29wdGlvbnNdXG4gKiBAYXBpIHB1YmxpY1xuICovXG5BbmltYXRpb25GcmFtZS5zaGltID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBhbmltYXRpb25GcmFtZSA9IG5ldyBBbmltYXRpb25GcmFtZShvcHRpb25zKVxuXG4gICAgcm9vdC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gYW5pbWF0aW9uRnJhbWUucmVxdWVzdChjYWxsYmFjaylcbiAgICB9XG4gICAgcm9vdC5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIHJldHVybiBhbmltYXRpb25GcmFtZS5jYW5jZWwoaWQpXG4gICAgfVxuXG4gICAgcmV0dXJuIGFuaW1hdGlvbkZyYW1lXG59XG5cbi8qKlxuICogUmVxdWVzdCBhbmltYXRpb24gZnJhbWUuXG4gKiBXZSB3aWxsIHVzZSB0aGUgbmF0aXZlIFJBRiBhcyBzb29uIGFzIHdlIGtub3cgaXQgZG9lcyB3b3Jrcy5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7TnVtYmVyfSB0aW1lb3V0IGlkIG9yIHJlcXVlc3RlZCBhbmltYXRpb24gZnJhbWUgaWRcbiAqIEBhcGkgcHVibGljXG4gKi9cbkFuaW1hdGlvbkZyYW1lLnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgLy8gQWxhd3lzIGluYyBjb3VudGVyIHRvIGVuc3VyZSBpdCBuZXZlciBoYXMgYSBjb25mbGljdCB3aXRoIHRoZSBuYXRpdmUgY291bnRlci5cbiAgLy8gQWZ0ZXIgdGhlIGZlYXR1cmUgdGVzdCBwaGFzZSB3ZSBkb24ndCBrbm93IGV4YWN0bHkgd2hpY2ggaW1wbGVtZW50YXRpb24gaGFzIGJlZW4gdXNlZC5cbiAgLy8gVGhlcmVmb3JlIG9uICNjYW5jZWwgd2UgZG8gaXQgZm9yIGJvdGguXG4gICsrdGhpcy5fdGlja0NvdW50ZXJcblxuICBpZiAobmF0aXZlSW1wbC5zdXBwb3J0ZWQgJiYgdGhpcy5vcHRpb25zLnVzZU5hdGl2ZSAmJiAhdGhpcy5faXNDdXN0b21GcmFtZVJhdGUpIHtcbiAgICByZXR1cm4gbmF0aXZlUmVxdWVzdChjYWxsYmFjaylcbiAgfVxuXG4gIGlmICghY2FsbGJhY2spIHRocm93IG5ldyBUeXBlRXJyb3IoJ05vdCBlbm91Z2ggYXJndW1lbnRzJylcblxuICBpZiAodGhpcy5fdGltZW91dElkID09IG51bGwpIHtcbiAgICAvLyBNdWNoIGZhc3RlciB0aGFuIE1hdGgubWF4XG4gICAgLy8gaHR0cDovL2pzcGVyZi5jb20vbWF0aC1tYXgtdnMtY29tcGFyaXNvbi8zXG4gICAgLy8gaHR0cDovL2pzcGVyZi5jb20vZGF0ZS1ub3ctdnMtZGF0ZS1nZXR0aW1lLzExXG4gICAgdmFyIGRlbGF5ID0gdGhpcy5fZnJhbWVMZW5ndGggKyB0aGlzLl9sYXN0VGlja1RpbWUgLSBub3coKVxuICAgIGlmIChkZWxheSA8IDApIGRlbGF5ID0gMFxuXG4gICAgdGhpcy5fdGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHNlbGYuX2xhc3RUaWNrVGltZSA9IG5vdygpXG4gICAgICBzZWxmLl90aW1lb3V0SWQgPSBudWxsXG4gICAgICArK3NlbGYuX3RpY2tDb3VudGVyXG4gICAgICB2YXIgY2FsbGJhY2tzID0gc2VsZi5fY2FsbGJhY2tzXG4gICAgICBzZWxmLl9jYWxsYmFja3MgPSB7fVxuICAgICAgZm9yICh2YXIgaWQgaW4gY2FsbGJhY2tzKSB7XG4gICAgICAgIGlmIChjYWxsYmFja3NbaWRdKSB7XG4gICAgICAgICAgaWYgKG5hdGl2ZUltcGwuc3VwcG9ydGVkICYmIHNlbGYub3B0aW9ucy51c2VOYXRpdmUpIHtcbiAgICAgICAgICAgIG5hdGl2ZVJlcXVlc3QoY2FsbGJhY2tzW2lkXSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2tzW2lkXShwZXJmb3JtYW5jZS5ub3coKSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCBkZWxheSlcbiAgfVxuXG4gIHRoaXMuX2NhbGxiYWNrc1t0aGlzLl90aWNrQ291bnRlcl0gPSBjYWxsYmFja1xuXG4gIHJldHVybiB0aGlzLl90aWNrQ291bnRlclxufVxuXG4vKipcbiAqIENhbmNlbCBhbmltYXRpb24gZnJhbWUuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVvdXQgaWQgb3IgcmVxdWVzdGVkIGFuaW1hdGlvbiBmcmFtZSBpZFxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cbkFuaW1hdGlvbkZyYW1lLnByb3RvdHlwZS5jYW5jZWwgPSBmdW5jdGlvbihpZCkge1xuaWYgKG5hdGl2ZUltcGwuc3VwcG9ydGVkICYmIHRoaXMub3B0aW9ucy51c2VOYXRpdmUpIG5hdGl2ZUNhbmNlbChpZClcbmRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbaWRdXG59XG4iLCIndXNlIHN0cmljdCdcblxudmFyIHJvb3QgPSByZXF1aXJlKCcuL3Jvb3QnKVxuXG4vLyBUZXN0IGlmIHdlIGFyZSB3aXRoaW4gYSBmb3JlaWduIGRvbWFpbi4gVXNlIHJhZiBmcm9tIHRoZSB0b3AgaWYgcG9zc2libGUuXG50cnkge1xuICAvLyBBY2Nlc3NpbmcgLm5hbWUgd2lsbCB0aHJvdyBTZWN1cml0eUVycm9yIHdpdGhpbiBhIGZvcmVpZ24gZG9tYWluLlxuICByb290LnRvcC5uYW1lXG4gIHJvb3QgPSByb290LnRvcFxufSBjYXRjaChlKSB7fVxuXG5leHBvcnRzLnJlcXVlc3QgPSByb290LnJlcXVlc3RBbmltYXRpb25GcmFtZVxuZXhwb3J0cy5jYW5jZWwgPSByb290LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8IHJvb3QuY2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lXG5leHBvcnRzLnN1cHBvcnRlZCA9IGZhbHNlXG5cbnZhciB2ZW5kb3JzID0gWydXZWJraXQnLCAnTW96JywgJ21zJywgJ08nXVxuXG4vLyBHcmFiIHRoZSBuYXRpdmUgaW1wbGVtZW50YXRpb24uXG5mb3IgKHZhciBpID0gMDsgaSA8IHZlbmRvcnMubGVuZ3RoICYmICFleHBvcnRzLnJlcXVlc3Q7IGkrKykge1xuICBleHBvcnRzLnJlcXVlc3QgPSByb290W3ZlbmRvcnNbaV0gKyAnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cbiAgZXhwb3J0cy5jYW5jZWwgPSByb290W3ZlbmRvcnNbaV0gKyAnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fFxuICAgIHJvb3RbdmVuZG9yc1tpXSArICdDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXVxufVxuXG4vLyBUZXN0IGlmIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbiB3b3Jrcy5cbi8vIFRoZXJlIGFyZSBzb21lIGlzc3VlcyBvbiBpb3M2XG4vLyBodHRwOi8vc2hpdHdlYmtpdGRvZXMudHVtYmxyLmNvbS9wb3N0LzQ3MTg2OTQ1ODU2L25hdGl2ZS1yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtYnJva2VuLW9uLWlvcy02XG4vLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9Lcm9mRHJha3VsYS81MzE4MDQ4XG5cbmlmIChleHBvcnRzLnJlcXVlc3QpIHtcbiAgZXhwb3J0cy5yZXF1ZXN0LmNhbGwobnVsbCwgZnVuY3Rpb24oKSB7XG4gICAgZXhwb3J0cy5zdXBwb3J0ZWQgPSB0cnVlXG4gIH0pXG59XG4iLCIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBDcm9zc3BsYXRmb3JtIERhdGUubm93KClcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IHRpbWUgaW4gbXNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gKG5ldyBEYXRlKS5nZXRUaW1lKClcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG52YXIgbm93ID0gcmVxdWlyZSgnLi9ub3cnKVxuXG4vKipcbiAqIFJlcGxhY2VtZW50IGZvciBQZXJmb3JtYW5jZVRpbWluZy5uYXZpZ2F0aW9uU3RhcnQgZm9yIHRoZSBjYXNlIHdoZW5cbiAqIHBlcmZvcm1hbmNlLm5vdyBpcyBub3QgaW1wbGVtZW50ZWQuXG4gKlxuICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1BlcmZvcm1hbmNlVGltaW5nLm5hdmlnYXRpb25TdGFydFxuICpcbiAqIEB0eXBlIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZXhwb3J0cy5uYXZpZ2F0aW9uU3RhcnQgPSBub3coKVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBub3cgPSByZXF1aXJlKCcuL25vdycpXG52YXIgUGVyZm9ybWFuY2VUaW1pbmcgPSByZXF1aXJlKCcuL3BlcmZvcm1hbmNlLXRpbWluZycpXG52YXIgcm9vdCA9IHJlcXVpcmUoJy4vcm9vdCcpXG5cbi8qKlxuICogQ3Jvc3NwbGF0Zm9ybSBwZXJmb3JtYW5jZS5ub3coKVxuICpcbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9QZXJmb3JtYW5jZS5ub3coKVxuICpcbiAqIEByZXR1cm4ge051bWJlcn0gcmVsYXRpdmUgdGltZSBpbiBtc1xuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0cy5ub3cgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChyb290LnBlcmZvcm1hbmNlICYmIHJvb3QucGVyZm9ybWFuY2Uubm93KSByZXR1cm4gcm9vdC5wZXJmb3JtYW5jZS5ub3coKVxuICByZXR1cm4gbm93KCkgLSBQZXJmb3JtYW5jZVRpbWluZy5uYXZpZ2F0aW9uU3RhcnRcbn1cbiIsInZhciByb290XG4vLyBCcm93c2VyIHdpbmRvd1xuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIHJvb3QgPSB3aW5kb3dcbi8vIFdlYiBXb3JrZXJcbn0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gIHJvb3QgPSBzZWxmXG4vLyBPdGhlciBlbnZpcm9ubWVudHNcbn0gZWxzZSB7XG4gIHJvb3QgPSB0aGlzXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcm9vdFxuIiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcbmV4cG9ydHMudG9CeXRlQXJyYXkgPSB0b0J5dGVBcnJheVxuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gZnJvbUJ5dGVBcnJheVxuXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxuXG52YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xuZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgbG9va3VwW2ldID0gY29kZVtpXVxuICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcbn1cblxuLy8gU3VwcG9ydCBkZWNvZGluZyBVUkwtc2FmZSBiYXNlNjQgc3RyaW5ncywgYXMgTm9kZS5qcyBkb2VzLlxuLy8gU2VlOiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CYXNlNjQjVVJMX2FwcGxpY2F0aW9uc1xucmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG5yZXZMb29rdXBbJ18nLmNoYXJDb2RlQXQoMCldID0gNjNcblxuZnVuY3Rpb24gZ2V0TGVucyAoYjY0KSB7XG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cbiAgaWYgKGxlbiAlIDQgPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0JylcbiAgfVxuXG4gIC8vIFRyaW0gb2ZmIGV4dHJhIGJ5dGVzIGFmdGVyIHBsYWNlaG9sZGVyIGJ5dGVzIGFyZSBmb3VuZFxuICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9iZWF0Z2FtbWl0L2Jhc2U2NC1qcy9pc3N1ZXMvNDJcbiAgdmFyIHZhbGlkTGVuID0gYjY0LmluZGV4T2YoJz0nKVxuICBpZiAodmFsaWRMZW4gPT09IC0xKSB2YWxpZExlbiA9IGxlblxuXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSB2YWxpZExlbiA9PT0gbGVuXG4gICAgPyAwXG4gICAgOiA0IC0gKHZhbGlkTGVuICUgNClcblxuICByZXR1cm4gW3ZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW5dXG59XG5cbi8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoYjY0KSB7XG4gIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpXG4gIHZhciB2YWxpZExlbiA9IGxlbnNbMF1cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IGxlbnNbMV1cbiAgcmV0dXJuICgodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzTGVuXG59XG5cbmZ1bmN0aW9uIF9ieXRlTGVuZ3RoIChiNjQsIHZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW4pIHtcbiAgcmV0dXJuICgodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzTGVuXG59XG5cbmZ1bmN0aW9uIHRvQnl0ZUFycmF5IChiNjQpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVucyA9IGdldExlbnMoYjY0KVxuICB2YXIgdmFsaWRMZW4gPSBsZW5zWzBdXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSBsZW5zWzFdXG5cbiAgdmFyIGFyciA9IG5ldyBBcnIoX2J5dGVMZW5ndGgoYjY0LCB2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuKSlcblxuICB2YXIgY3VyQnl0ZSA9IDBcblxuICAvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG4gIHZhciBsZW4gPSBwbGFjZUhvbGRlcnNMZW4gPiAwXG4gICAgPyB2YWxpZExlbiAtIDRcbiAgICA6IHZhbGlkTGVuXG5cbiAgdmFyIGlcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgMTIpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8XG4gICAgICByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVyc0xlbiA9PT0gMikge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAyKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDEpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCA0KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArXG4gICAgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPVxuICAgICAgKCh1aW50OFtpXSA8PCAxNikgJiAweEZGMDAwMCkgK1xuICAgICAgKCh1aW50OFtpICsgMV0gPDwgOCkgJiAweEZGMDApICtcbiAgICAgICh1aW50OFtpICsgMl0gJiAweEZGKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgcGFydHMgPSBbXVxuICB2YXIgbWF4Q2h1bmtMZW5ndGggPSAxNjM4MyAvLyBtdXN0IGJlIG11bHRpcGxlIG9mIDNcblxuICAvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4yID0gbGVuIC0gZXh0cmFCeXRlczsgaSA8IGxlbjI7IGkgKz0gbWF4Q2h1bmtMZW5ndGgpIHtcbiAgICBwYXJ0cy5wdXNoKGVuY29kZUNodW5rKFxuICAgICAgdWludDgsIGksIChpICsgbWF4Q2h1bmtMZW5ndGgpID4gbGVuMiA/IGxlbjIgOiAoaSArIG1heENodW5rTGVuZ3RoKVxuICAgICkpXG4gIH1cblxuICAvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG4gIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XG4gICAgdG1wID0gdWludDhbbGVuIC0gMV1cbiAgICBwYXJ0cy5wdXNoKFxuICAgICAgbG9va3VwW3RtcCA+PiAyXSArXG4gICAgICBsb29rdXBbKHRtcCA8PCA0KSAmIDB4M0ZdICtcbiAgICAgICc9PSdcbiAgICApXG4gIH0gZWxzZSBpZiAoZXh0cmFCeXRlcyA9PT0gMikge1xuICAgIHRtcCA9ICh1aW50OFtsZW4gLSAyXSA8PCA4KSArIHVpbnQ4W2xlbiAtIDFdXG4gICAgcGFydHMucHVzaChcbiAgICAgIGxvb2t1cFt0bXAgPj4gMTBdICtcbiAgICAgIGxvb2t1cFsodG1wID4+IDQpICYgMHgzRl0gK1xuICAgICAgbG9va3VwWyh0bXAgPDwgMikgJiAweDNGXSArXG4gICAgICAnPSdcbiAgICApXG4gIH1cblxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cbiIsIi8qKlxuICogQGF1dGhvciBzaGFvemlsZWVcbiAqXG4gKiBzdXBwb3J0IDFiaXQgNGJpdCA4Yml0IDI0Yml0IGRlY29kZVxuICogZW5jb2RlIHdpdGggMjRiaXRcbiAqIFxuICovXG5cbnZhciBlbmNvZGUgPSByZXF1aXJlKCcuL2xpYi9lbmNvZGVyJyksXG4gICAgZGVjb2RlID0gcmVxdWlyZSgnLi9saWIvZGVjb2RlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZW5jb2RlOiBlbmNvZGUsXG4gIGRlY29kZTogZGVjb2RlXG59O1xuIiwiLyoqXG4gKiBAYXV0aG9yIHNoYW96aWxlZVxuICpcbiAqIEJtcCBmb3JtYXQgZGVjb2RlcixzdXBwb3J0IDFiaXQgNGJpdCA4Yml0IDI0Yml0IGJtcFxuICpcbiAqL1xuXG5mdW5jdGlvbiBCbXBEZWNvZGVyKGJ1ZmZlcixpc193aXRoX2FscGhhKSB7XG4gIHRoaXMucG9zID0gMDtcbiAgdGhpcy5idWZmZXIgPSBidWZmZXI7XG4gIHRoaXMuaXNfd2l0aF9hbHBoYSA9ICEhaXNfd2l0aF9hbHBoYTtcbiAgdGhpcy5ib3R0b21fdXAgPSB0cnVlO1xuICB0aGlzLmZsYWcgPSB0aGlzLmJ1ZmZlci50b1N0cmluZyhcInV0Zi04XCIsIDAsIHRoaXMucG9zICs9IDIpO1xuICBpZiAodGhpcy5mbGFnICE9IFwiQk1cIikgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBCTVAgRmlsZVwiKTtcbiAgdGhpcy5wYXJzZUhlYWRlcigpO1xuICB0aGlzLnBhcnNlUkdCQSgpO1xufVxuXG5CbXBEZWNvZGVyLnByb3RvdHlwZS5wYXJzZUhlYWRlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmZpbGVTaXplID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgdGhpcy5wb3MgKz0gNDtcbiAgdGhpcy5yZXNlcnZlZCA9IHRoaXMuYnVmZmVyLnJlYWRVSW50MzJMRSh0aGlzLnBvcyk7XG4gIHRoaXMucG9zICs9IDQ7XG4gIHRoaXMub2Zmc2V0ID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgdGhpcy5wb3MgKz0gNDtcbiAgdGhpcy5oZWFkZXJTaXplID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgdGhpcy5wb3MgKz0gNDtcbiAgdGhpcy53aWR0aCA9IHRoaXMuYnVmZmVyLnJlYWRVSW50MzJMRSh0aGlzLnBvcyk7XG4gIHRoaXMucG9zICs9IDQ7XG4gIHRoaXMuaGVpZ2h0ID0gdGhpcy5idWZmZXIucmVhZEludDMyTEUodGhpcy5wb3MpO1xuICB0aGlzLnBvcyArPSA0O1xuICB0aGlzLnBsYW5lcyA9IHRoaXMuYnVmZmVyLnJlYWRVSW50MTZMRSh0aGlzLnBvcyk7XG4gIHRoaXMucG9zICs9IDI7XG4gIHRoaXMuYml0UFAgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDE2TEUodGhpcy5wb3MpO1xuICB0aGlzLnBvcyArPSAyO1xuICB0aGlzLmNvbXByZXNzID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgdGhpcy5wb3MgKz0gNDtcbiAgdGhpcy5yYXdTaXplID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgdGhpcy5wb3MgKz0gNDtcbiAgdGhpcy5ociA9IHRoaXMuYnVmZmVyLnJlYWRVSW50MzJMRSh0aGlzLnBvcyk7XG4gIHRoaXMucG9zICs9IDQ7XG4gIHRoaXMudnIgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDMyTEUodGhpcy5wb3MpO1xuICB0aGlzLnBvcyArPSA0O1xuICB0aGlzLmNvbG9ycyA9IHRoaXMuYnVmZmVyLnJlYWRVSW50MzJMRSh0aGlzLnBvcyk7XG4gIHRoaXMucG9zICs9IDQ7XG4gIHRoaXMuaW1wb3J0YW50Q29sb3JzID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgdGhpcy5wb3MgKz0gNDtcblxuICBpZih0aGlzLmJpdFBQID09PSAxNiAmJiB0aGlzLmlzX3dpdGhfYWxwaGEpe1xuICAgIHRoaXMuYml0UFAgPSAxNVxuICB9XG4gIGlmICh0aGlzLmJpdFBQIDwgMTUpIHtcbiAgICB2YXIgbGVuID0gdGhpcy5jb2xvcnMgPT09IDAgPyAxIDw8IHRoaXMuYml0UFAgOiB0aGlzLmNvbG9ycztcbiAgICB0aGlzLnBhbGV0dGUgPSBuZXcgQXJyYXkobGVuKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YXIgYmx1ZSA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgIHZhciBncmVlbiA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgIHZhciByZWQgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICB2YXIgcXVhZCA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgIHRoaXMucGFsZXR0ZVtpXSA9IHtcbiAgICAgICAgcmVkOiByZWQsXG4gICAgICAgIGdyZWVuOiBncmVlbixcbiAgICAgICAgYmx1ZTogYmx1ZSxcbiAgICAgICAgcXVhZDogcXVhZFxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgaWYodGhpcy5oZWlnaHQgPCAwKSB7XG4gICAgdGhpcy5oZWlnaHQgKj0gLTE7XG4gICAgdGhpcy5ib3R0b21fdXAgPSBmYWxzZTtcbiAgfVxuXG59XG5cbkJtcERlY29kZXIucHJvdG90eXBlLnBhcnNlUkdCQSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBiaXRuID0gXCJiaXRcIiArIHRoaXMuYml0UFA7XG4gICAgdmFyIGxlbiA9IHRoaXMud2lkdGggKiB0aGlzLmhlaWdodCAqIDQ7XG4gICAgdGhpcy5kYXRhID0gbmV3IEJ1ZmZlcihsZW4pO1xuICAgIHRoaXNbYml0bl0oKTtcbn07XG5cbkJtcERlY29kZXIucHJvdG90eXBlLmJpdDEgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHhsZW4gPSBNYXRoLmNlaWwodGhpcy53aWR0aCAvIDgpO1xuICB2YXIgbW9kZSA9IHhsZW4lNDtcbiAgdmFyIHkgPSB0aGlzLmhlaWdodCA+PSAwID8gdGhpcy5oZWlnaHQgLSAxIDogLXRoaXMuaGVpZ2h0XG4gIGZvciAodmFyIHkgPSB0aGlzLmhlaWdodCAtIDE7IHkgPj0gMDsgeS0tKSB7XG4gICAgdmFyIGxpbmUgPSB0aGlzLmJvdHRvbV91cCA/IHkgOiB0aGlzLmhlaWdodCAtIDEgLSB5XG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB4bGVuOyB4KyspIHtcbiAgICAgIHZhciBiID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgdmFyIGxvY2F0aW9uID0gbGluZSAqIHRoaXMud2lkdGggKiA0ICsgeCo4KjQ7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDg7IGkrKykge1xuICAgICAgICBpZih4KjgraTx0aGlzLndpZHRoKXtcbiAgICAgICAgICB2YXIgcmdiID0gdGhpcy5wYWxldHRlWygoYj4+KDctaSkpJjB4MSldO1xuXG4gICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uK2kqNF0gPSAwO1xuICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbitpKjQgKyAxXSA9IHJnYi5ibHVlO1xuICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbitpKjQgKyAyXSA9IHJnYi5ncmVlbjtcbiAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24raSo0ICsgM10gPSByZ2IucmVkO1xuXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1vZGUgIT0gMCl7XG4gICAgICB0aGlzLnBvcys9KDQgLSBtb2RlKTtcbiAgICB9XG4gIH1cbn07XG5cbkJtcERlY29kZXIucHJvdG90eXBlLmJpdDQgPSBmdW5jdGlvbigpIHtcbiAgICAvL1JMRS00XG4gICAgaWYodGhpcy5jb21wcmVzcyA9PSAyKXtcbiAgICAgICAgdGhpcy5kYXRhLmZpbGwoMHhmZik7XG5cbiAgICAgICAgdmFyIGxvY2F0aW9uID0gMDtcbiAgICAgICAgdmFyIGxpbmVzID0gdGhpcy5ib3R0b21fdXA/dGhpcy5oZWlnaHQtMTowO1xuICAgICAgICB2YXIgbG93X25pYmJsZSA9IGZhbHNlOy8vZm9yIGFsbCBjb3VudCBvZiBwaXhlbFxuXG4gICAgICAgIHdoaWxlKGxvY2F0aW9uPHRoaXMuZGF0YS5sZW5ndGgpe1xuICAgICAgICAgICAgdmFyIGEgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgICB2YXIgYiA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgIC8vYWJzb2x1dGUgbW9kZVxuICAgICAgICAgICAgaWYoYSA9PSAwKXtcbiAgICAgICAgICAgICAgICBpZihiID09IDApey8vbGluZSBlbmRcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5ib3R0b21fdXApe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMtLTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcysrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uID0gbGluZXMqdGhpcy53aWR0aCo0O1xuICAgICAgICAgICAgICAgICAgICBsb3dfbmliYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGIgPT0gMSl7Ly9pbWFnZSBlbmRcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoYiA9PTIpe1xuICAgICAgICAgICAgICAgICAgICAvL29mZnNldCB4LHlcbiAgICAgICAgICAgICAgICAgICAgdmFyIHggPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB5ID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmJvdHRvbV91cCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcy09eTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcys9eTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uICs9KHkqdGhpcy53aWR0aCo0K3gqNCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDtpPGI7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb3dfbmliYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0UGl4ZWxEYXRhLmNhbGwodGhpcywgKGMgJiAweDBmKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFBpeGVsRGF0YS5jYWxsKHRoaXMsIChjICYgMHhmMCk+PjQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGkgJiAxKSAmJiAoaSsxIDwgYikpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxvd19uaWJibGUgPSAhbG93X25pYmJsZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICgoKChiKzEpID4+IDEpICYgMSApID09IDEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3MrK1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9ZWxzZXsvL2VuY29kZWQgbW9kZVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb3dfbmliYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRQaXhlbERhdGEuY2FsbCh0aGlzLCAoYiAmIDB4MGYpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFBpeGVsRGF0YS5jYWxsKHRoaXMsIChiICYgMHhmMCk+PjQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxvd19uaWJibGUgPSAhbG93X25pYmJsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG5cblxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFBpeGVsRGF0YShyZ2JJbmRleCl7XG4gICAgICAgICAgICB2YXIgcmdiID0gdGhpcy5wYWxldHRlW3JnYkluZGV4XTtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbl0gPSAwO1xuICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMV0gPSByZ2IuYmx1ZTtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDJdID0gcmdiLmdyZWVuO1xuICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgM10gPSByZ2IucmVkO1xuICAgICAgICAgICAgbG9jYXRpb24rPTQ7XG4gICAgICAgIH1cbiAgICB9ZWxzZXtcblxuICAgICAgdmFyIHhsZW4gPSBNYXRoLmNlaWwodGhpcy53aWR0aC8yKTtcbiAgICAgIHZhciBtb2RlID0geGxlbiU0O1xuICAgICAgZm9yICh2YXIgeSA9IHRoaXMuaGVpZ2h0IC0gMTsgeSA+PSAwOyB5LS0pIHtcbiAgICAgICAgdmFyIGxpbmUgPSB0aGlzLmJvdHRvbV91cCA/IHkgOiB0aGlzLmhlaWdodCAtIDEgLSB5XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgeGxlbjsgeCsrKSB7XG4gICAgICAgICAgdmFyIGIgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgdmFyIGxvY2F0aW9uID0gbGluZSAqIHRoaXMud2lkdGggKiA0ICsgeCoyKjQ7XG5cbiAgICAgICAgICB2YXIgYmVmb3JlID0gYj4+NDtcbiAgICAgICAgICB2YXIgYWZ0ZXIgPSBiJjB4MEY7XG5cbiAgICAgICAgICB2YXIgcmdiID0gdGhpcy5wYWxldHRlW2JlZm9yZV07XG4gICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uXSA9IDA7XG4gICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMV0gPSByZ2IuYmx1ZTtcbiAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAyXSA9IHJnYi5ncmVlbjtcbiAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAzXSA9IHJnYi5yZWQ7XG5cblxuICAgICAgICAgIGlmKHgqMisxPj10aGlzLndpZHRoKWJyZWFrO1xuXG4gICAgICAgICAgcmdiID0gdGhpcy5wYWxldHRlW2FmdGVyXTtcblxuICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbis0XSA9IDA7XG4gICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uKzQgKyAxXSA9IHJnYi5ibHVlO1xuICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbis0ICsgMl0gPSByZ2IuZ3JlZW47XG4gICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uKzQgKyAzXSA9IHJnYi5yZWQ7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb2RlICE9IDApe1xuICAgICAgICAgIHRoaXMucG9zKz0oNCAtIG1vZGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9XG5cbn07XG5cbkJtcERlY29kZXIucHJvdG90eXBlLmJpdDggPSBmdW5jdGlvbigpIHtcbiAgICAvL1JMRS04XG4gICAgaWYodGhpcy5jb21wcmVzcyA9PSAxKXtcbiAgICAgICAgdGhpcy5kYXRhLmZpbGwoMHhmZik7XG5cbiAgICAgICAgdmFyIGxvY2F0aW9uID0gMDtcbiAgICAgICAgdmFyIGxpbmVzID0gdGhpcy5ib3R0b21fdXA/dGhpcy5oZWlnaHQtMTowO1xuXG4gICAgICAgIHdoaWxlKGxvY2F0aW9uPHRoaXMuZGF0YS5sZW5ndGgpe1xuICAgICAgICAgICAgdmFyIGEgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgICB2YXIgYiA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgIC8vYWJzb2x1dGUgbW9kZVxuICAgICAgICAgICAgaWYoYSA9PSAwKXtcbiAgICAgICAgICAgICAgICBpZihiID09IDApey8vbGluZSBlbmRcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5ib3R0b21fdXApe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMtLTtcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcysrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uID0gbGluZXMqdGhpcy53aWR0aCo0O1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihiID09IDEpey8vaW1hZ2UgZW5kXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGIgPT0yKXtcbiAgICAgICAgICAgICAgICAgICAgLy9vZmZzZXQgeCx5XG4gICAgICAgICAgICAgICAgICAgIHZhciB4ID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgICAgICAgICB2YXIgeSA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5ib3R0b21fdXApe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMtPXk7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMrPXk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbiArPSh5KnRoaXMud2lkdGgqNCt4KjQpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDtpPGI7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0UGl4ZWxEYXRhLmNhbGwodGhpcywgYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYoYiYxID09IDEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3MrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9ZWxzZXsvL2VuY29kZWQgbW9kZVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFBpeGVsRGF0YS5jYWxsKHRoaXMsIGIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuXG5cbiAgICAgICAgZnVuY3Rpb24gc2V0UGl4ZWxEYXRhKHJnYkluZGV4KXtcbiAgICAgICAgICAgIHZhciByZ2IgPSB0aGlzLnBhbGV0dGVbcmdiSW5kZXhdO1xuICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uXSA9IDA7XG4gICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAxXSA9IHJnYi5ibHVlO1xuICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMl0gPSByZ2IuZ3JlZW47XG4gICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAzXSA9IHJnYi5yZWQ7XG4gICAgICAgICAgICBsb2NhdGlvbis9NDtcbiAgICAgICAgfVxuICAgIH1lbHNlIHtcbiAgICAgICAgdmFyIG1vZGUgPSB0aGlzLndpZHRoICUgNDtcbiAgICAgICAgZm9yICh2YXIgeSA9IHRoaXMuaGVpZ2h0IC0gMTsgeSA+PSAwOyB5LS0pIHtcbiAgICAgICAgICAgIHZhciBsaW5lID0gdGhpcy5ib3R0b21fdXAgPyB5IDogdGhpcy5oZWlnaHQgLSAxIC0geVxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYiA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBsaW5lICogdGhpcy53aWR0aCAqIDQgKyB4ICogNDtcbiAgICAgICAgICAgICAgICBpZiAoYiA8IHRoaXMucGFsZXR0ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJnYiA9IHRoaXMucGFsZXR0ZVtiXTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb25dID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMV0gPSByZ2IuYmx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMl0gPSByZ2IuZ3JlZW47XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDNdID0gcmdiLnJlZDtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbl0gPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAxXSA9IDB4RkY7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDJdID0gMHhGRjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgM10gPSAweEZGO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtb2RlICE9IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBvcyArPSAoNCAtIG1vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuQm1wRGVjb2Rlci5wcm90b3R5cGUuYml0MTUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRpZl93ID10aGlzLndpZHRoICUgMztcbiAgdmFyIF8xMTExMSA9IHBhcnNlSW50KFwiMTExMTFcIiwgMiksXzFfNSA9IF8xMTExMTtcbiAgZm9yICh2YXIgeSA9IHRoaXMuaGVpZ2h0IC0gMTsgeSA+PSAwOyB5LS0pIHtcbiAgICB2YXIgbGluZSA9IHRoaXMuYm90dG9tX3VwID8geSA6IHRoaXMuaGVpZ2h0IC0gMSAtIHlcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xuXG4gICAgICB2YXIgQiA9IHRoaXMuYnVmZmVyLnJlYWRVSW50MTZMRSh0aGlzLnBvcyk7XG4gICAgICB0aGlzLnBvcys9MjtcbiAgICAgIHZhciBibHVlID0gKEIgJiBfMV81KSAvIF8xXzUgKiAyNTUgfCAwO1xuICAgICAgdmFyIGdyZWVuID0gKEIgPj4gNSAmIF8xXzUgKSAvIF8xXzUgKiAyNTUgfCAwO1xuICAgICAgdmFyIHJlZCA9IChCID4+IDEwICYgXzFfNSkgLyBfMV81ICogMjU1IHwgMDtcbiAgICAgIHZhciBhbHBoYSA9IChCPj4xNSk/MHhGRjoweDAwO1xuXG4gICAgICB2YXIgbG9jYXRpb24gPSBsaW5lICogdGhpcy53aWR0aCAqIDQgKyB4ICogNDtcblxuICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uXSA9IGFscGhhO1xuICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMV0gPSBibHVlO1xuICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMl0gPSBncmVlbjtcbiAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDNdID0gcmVkO1xuICAgIH1cbiAgICAvL3NraXAgZXh0cmEgYnl0ZXNcbiAgICB0aGlzLnBvcyArPSBkaWZfdztcbiAgfVxufTtcblxuQm1wRGVjb2Rlci5wcm90b3R5cGUuYml0MTYgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRpZl93ID0odGhpcy53aWR0aCAlIDIpKjI7XG4gIC8vZGVmYXVsdCB4cmdiNTU1XG4gIHRoaXMubWFza1JlZCA9IDB4N0MwMDtcbiAgdGhpcy5tYXNrR3JlZW4gPSAweDNFMDtcbiAgdGhpcy5tYXNrQmx1ZSA9MHgxRjtcbiAgdGhpcy5tYXNrMCA9IDA7XG5cbiAgaWYodGhpcy5jb21wcmVzcyA9PSAzKXtcbiAgICB0aGlzLm1hc2tSZWQgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDMyTEUodGhpcy5wb3MpO1xuICAgIHRoaXMucG9zKz00O1xuICAgIHRoaXMubWFza0dyZWVuID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgICB0aGlzLnBvcys9NDtcbiAgICB0aGlzLm1hc2tCbHVlID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgICB0aGlzLnBvcys9NDtcbiAgICB0aGlzLm1hc2swID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgICB0aGlzLnBvcys9NDtcbiAgfVxuXG5cbiAgdmFyIG5zPVswLDAsMF07XG4gIGZvciAodmFyIGk9MDtpPDE2O2krKyl7XG4gICAgaWYgKCh0aGlzLm1hc2tSZWQ+PmkpJjB4MDEpIG5zWzBdKys7XG4gICAgaWYgKCh0aGlzLm1hc2tHcmVlbj4+aSkmMHgwMSkgbnNbMV0rKztcbiAgICBpZiAoKHRoaXMubWFza0JsdWU+PmkpJjB4MDEpIG5zWzJdKys7XG4gIH1cbiAgbnNbMV0rPW5zWzBdOyBuc1syXSs9bnNbMV07XHRuc1swXT04LW5zWzBdOyBuc1sxXS09ODsgbnNbMl0tPTg7XG5cbiAgZm9yICh2YXIgeSA9IHRoaXMuaGVpZ2h0IC0gMTsgeSA+PSAwOyB5LS0pIHtcbiAgICB2YXIgbGluZSA9IHRoaXMuYm90dG9tX3VwID8geSA6IHRoaXMuaGVpZ2h0IC0gMSAtIHk7XG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLndpZHRoOyB4KyspIHtcblxuICAgICAgdmFyIEIgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDE2TEUodGhpcy5wb3MpO1xuICAgICAgdGhpcy5wb3MrPTI7XG5cbiAgICAgIHZhciBibHVlID0gKEImdGhpcy5tYXNrQmx1ZSk8PG5zWzBdO1xuICAgICAgdmFyIGdyZWVuID0gKEImdGhpcy5tYXNrR3JlZW4pPj5uc1sxXTtcbiAgICAgIHZhciByZWQgPSAoQiZ0aGlzLm1hc2tSZWQpPj5uc1syXTtcblxuICAgICAgdmFyIGxvY2F0aW9uID0gbGluZSAqIHRoaXMud2lkdGggKiA0ICsgeCAqIDQ7XG5cbiAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbl0gPSAwO1xuICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMV0gPSBibHVlO1xuICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMl0gPSBncmVlbjtcbiAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDNdID0gcmVkO1xuICAgIH1cbiAgICAvL3NraXAgZXh0cmEgYnl0ZXNcbiAgICB0aGlzLnBvcyArPSBkaWZfdztcbiAgfVxufTtcblxuQm1wRGVjb2Rlci5wcm90b3R5cGUuYml0MjQgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgeSA9IHRoaXMuaGVpZ2h0IC0gMTsgeSA+PSAwOyB5LS0pIHtcbiAgICB2YXIgbGluZSA9IHRoaXMuYm90dG9tX3VwID8geSA6IHRoaXMuaGVpZ2h0IC0gMSAtIHlcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xuICAgICAgLy9MaXR0bGUgRW5kaWFuIHJnYlxuICAgICAgdmFyIGJsdWUgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICB2YXIgZ3JlZW4gPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICB2YXIgcmVkID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgdmFyIGxvY2F0aW9uID0gbGluZSAqIHRoaXMud2lkdGggKiA0ICsgeCAqIDQ7XG4gICAgICB0aGlzLmRhdGFbbG9jYXRpb25dID0gMDtcbiAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDFdID0gYmx1ZTtcbiAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDJdID0gZ3JlZW47XG4gICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAzXSA9IHJlZDtcbiAgICB9XG4gICAgLy9za2lwIGV4dHJhIGJ5dGVzXG4gICAgdGhpcy5wb3MgKz0gKHRoaXMud2lkdGggJSA0KTtcbiAgfVxuXG59O1xuXG4vKipcbiAqIGFkZCAzMmJpdCBkZWNvZGUgZnVuY1xuICogQGF1dGhvciBzb3Vib2tcbiAqL1xuQm1wRGVjb2Rlci5wcm90b3R5cGUuYml0MzIgPSBmdW5jdGlvbigpIHtcbiAgLy9CSV9CSVRGSUVMRFNcbiAgaWYodGhpcy5jb21wcmVzcyA9PSAzKXtcbiAgICB0aGlzLm1hc2tSZWQgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDMyTEUodGhpcy5wb3MpO1xuICAgIHRoaXMucG9zKz00O1xuICAgIHRoaXMubWFza0dyZWVuID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgICB0aGlzLnBvcys9NDtcbiAgICB0aGlzLm1hc2tCbHVlID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgICB0aGlzLnBvcys9NDtcbiAgICB0aGlzLm1hc2swID0gdGhpcy5idWZmZXIucmVhZFVJbnQzMkxFKHRoaXMucG9zKTtcbiAgICB0aGlzLnBvcys9NDtcbiAgICAgIGZvciAodmFyIHkgPSB0aGlzLmhlaWdodCAtIDE7IHkgPj0gMDsgeS0tKSB7XG4gICAgICAgICAgdmFyIGxpbmUgPSB0aGlzLmJvdHRvbV91cCA/IHkgOiB0aGlzLmhlaWdodCAtIDEgLSB5O1xuICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKSB7XG4gICAgICAgICAgICAgIC8vTGl0dGxlIEVuZGlhbiByZ2JhXG4gICAgICAgICAgICAgIHZhciBhbHBoYSA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgICAgdmFyIGJsdWUgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgICAgIHZhciBncmVlbiA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgICAgdmFyIHJlZCA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gbGluZSAqIHRoaXMud2lkdGggKiA0ICsgeCAqIDQ7XG4gICAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbl0gPSBhbHBoYTtcbiAgICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMV0gPSBibHVlO1xuICAgICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAyXSA9IGdyZWVuO1xuICAgICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb24gKyAzXSA9IHJlZDtcbiAgICAgICAgICB9XG4gICAgICB9XG5cbiAgfWVsc2V7XG4gICAgICBmb3IgKHZhciB5ID0gdGhpcy5oZWlnaHQgLSAxOyB5ID49IDA7IHktLSkge1xuICAgICAgICAgIHZhciBsaW5lID0gdGhpcy5ib3R0b21fdXAgPyB5IDogdGhpcy5oZWlnaHQgLSAxIC0geTtcbiAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMud2lkdGg7IHgrKykge1xuICAgICAgICAgICAgICAvL0xpdHRsZSBFbmRpYW4gYXJnYlxuICAgICAgICAgICAgICB2YXIgYmx1ZSA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OCh0aGlzLnBvcysrKTtcbiAgICAgICAgICAgICAgdmFyIGdyZWVuID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgICB2YXIgcmVkID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KHRoaXMucG9zKyspO1xuICAgICAgICAgICAgICB2YXIgYWxwaGEgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgodGhpcy5wb3MrKyk7XG4gICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IGxpbmUgKiB0aGlzLndpZHRoICogNCArIHggKiA0O1xuICAgICAgICAgICAgICB0aGlzLmRhdGFbbG9jYXRpb25dID0gYWxwaGE7XG4gICAgICAgICAgICAgIHRoaXMuZGF0YVtsb2NhdGlvbiArIDFdID0gYmx1ZTtcbiAgICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgMl0gPSBncmVlbjtcbiAgICAgICAgICAgICAgdGhpcy5kYXRhW2xvY2F0aW9uICsgM10gPSByZWQ7XG4gICAgICAgICAgfVxuICAgICAgfVxuXG4gIH1cblxuXG5cblxufTtcblxuQm1wRGVjb2Rlci5wcm90b3R5cGUuZ2V0RGF0YSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5kYXRhO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihibXBEYXRhKSB7XG4gIHZhciBkZWNvZGVyID0gbmV3IEJtcERlY29kZXIoYm1wRGF0YSk7XG4gIHJldHVybiBkZWNvZGVyO1xufTtcbiIsIi8qKlxuICogQGF1dGhvciBzaGFvemlsZWVcbiAqXG4gKiBCTVAgZm9ybWF0IGVuY29kZXIsZW5jb2RlIDI0Yml0IEJNUFxuICogTm90IHN1cHBvcnQgcXVhbGl0eSBjb21wcmVzc2lvblxuICpcbiAqL1xuXG5mdW5jdGlvbiBCbXBFbmNvZGVyKGltZ0RhdGEpe1xuXHR0aGlzLmJ1ZmZlciA9IGltZ0RhdGEuZGF0YTtcblx0dGhpcy53aWR0aCA9IGltZ0RhdGEud2lkdGg7XG5cdHRoaXMuaGVpZ2h0ID0gaW1nRGF0YS5oZWlnaHQ7XG5cdHRoaXMuZXh0cmFCeXRlcyA9IHRoaXMud2lkdGglNDtcblx0dGhpcy5yZ2JTaXplID0gdGhpcy5oZWlnaHQqKDMqdGhpcy53aWR0aCt0aGlzLmV4dHJhQnl0ZXMpO1xuXHR0aGlzLmhlYWRlckluZm9TaXplID0gNDA7XG5cblx0dGhpcy5kYXRhID0gW107XG5cdC8qKioqKioqKioqKioqKioqKipoZWFkZXIqKioqKioqKioqKioqKioqKioqKioqKi9cblx0dGhpcy5mbGFnID0gXCJCTVwiO1xuXHR0aGlzLnJlc2VydmVkID0gMDtcblx0dGhpcy5vZmZzZXQgPSA1NDtcblx0dGhpcy5maWxlU2l6ZSA9IHRoaXMucmdiU2l6ZSt0aGlzLm9mZnNldDtcblx0dGhpcy5wbGFuZXMgPSAxO1xuXHR0aGlzLmJpdFBQID0gMjQ7XG5cdHRoaXMuY29tcHJlc3MgPSAwO1xuXHR0aGlzLmhyID0gMDtcblx0dGhpcy52ciA9IDA7XG5cdHRoaXMuY29sb3JzID0gMDtcblx0dGhpcy5pbXBvcnRhbnRDb2xvcnMgPSAwO1xufVxuXG5CbXBFbmNvZGVyLnByb3RvdHlwZS5lbmNvZGUgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRlbXBCdWZmZXIgPSBuZXcgQnVmZmVyKHRoaXMub2Zmc2V0K3RoaXMucmdiU2l6ZSk7XG5cdHRoaXMucG9zID0gMDtcblx0dGVtcEJ1ZmZlci53cml0ZSh0aGlzLmZsYWcsdGhpcy5wb3MsMik7dGhpcy5wb3MrPTI7XG5cdHRlbXBCdWZmZXIud3JpdGVVSW50MzJMRSh0aGlzLmZpbGVTaXplLHRoaXMucG9zKTt0aGlzLnBvcys9NDtcblx0dGVtcEJ1ZmZlci53cml0ZVVJbnQzMkxFKHRoaXMucmVzZXJ2ZWQsdGhpcy5wb3MpO3RoaXMucG9zKz00O1xuXHR0ZW1wQnVmZmVyLndyaXRlVUludDMyTEUodGhpcy5vZmZzZXQsdGhpcy5wb3MpO3RoaXMucG9zKz00O1xuXG5cdHRlbXBCdWZmZXIud3JpdGVVSW50MzJMRSh0aGlzLmhlYWRlckluZm9TaXplLHRoaXMucG9zKTt0aGlzLnBvcys9NDtcblx0dGVtcEJ1ZmZlci53cml0ZVVJbnQzMkxFKHRoaXMud2lkdGgsdGhpcy5wb3MpO3RoaXMucG9zKz00O1xuXHR0ZW1wQnVmZmVyLndyaXRlSW50MzJMRSgtdGhpcy5oZWlnaHQsdGhpcy5wb3MpO3RoaXMucG9zKz00O1xuXHR0ZW1wQnVmZmVyLndyaXRlVUludDE2TEUodGhpcy5wbGFuZXMsdGhpcy5wb3MpO3RoaXMucG9zKz0yO1xuXHR0ZW1wQnVmZmVyLndyaXRlVUludDE2TEUodGhpcy5iaXRQUCx0aGlzLnBvcyk7dGhpcy5wb3MrPTI7XG5cdHRlbXBCdWZmZXIud3JpdGVVSW50MzJMRSh0aGlzLmNvbXByZXNzLHRoaXMucG9zKTt0aGlzLnBvcys9NDtcblx0dGVtcEJ1ZmZlci53cml0ZVVJbnQzMkxFKHRoaXMucmdiU2l6ZSx0aGlzLnBvcyk7dGhpcy5wb3MrPTQ7XG5cdHRlbXBCdWZmZXIud3JpdGVVSW50MzJMRSh0aGlzLmhyLHRoaXMucG9zKTt0aGlzLnBvcys9NDtcblx0dGVtcEJ1ZmZlci53cml0ZVVJbnQzMkxFKHRoaXMudnIsdGhpcy5wb3MpO3RoaXMucG9zKz00O1xuXHR0ZW1wQnVmZmVyLndyaXRlVUludDMyTEUodGhpcy5jb2xvcnMsdGhpcy5wb3MpO3RoaXMucG9zKz00O1xuXHR0ZW1wQnVmZmVyLndyaXRlVUludDMyTEUodGhpcy5pbXBvcnRhbnRDb2xvcnMsdGhpcy5wb3MpO3RoaXMucG9zKz00O1xuXG5cdHZhciBpPTA7XG5cdHZhciByb3dCeXRlcyA9IDMqdGhpcy53aWR0aCt0aGlzLmV4dHJhQnl0ZXM7XG5cblx0Zm9yICh2YXIgeSA9IDA7IHkgPHRoaXMuaGVpZ2h0OyB5Kyspe1xuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy53aWR0aDsgeCsrKXtcblx0XHRcdHZhciBwID0gdGhpcy5wb3MreSpyb3dCeXRlcyt4KjM7XG5cdFx0XHRpKys7Ly9hXG5cdFx0XHR0ZW1wQnVmZmVyW3BdPSB0aGlzLmJ1ZmZlcltpKytdOy8vYlxuXHRcdFx0dGVtcEJ1ZmZlcltwKzFdID0gdGhpcy5idWZmZXJbaSsrXTsvL2dcblx0XHRcdHRlbXBCdWZmZXJbcCsyXSAgPSB0aGlzLmJ1ZmZlcltpKytdOy8vclxuXHRcdH1cblx0XHRpZih0aGlzLmV4dHJhQnl0ZXM+MCl7XG5cdFx0XHR2YXIgZmlsbE9mZnNldCA9IHRoaXMucG9zK3kqcm93Qnl0ZXMrdGhpcy53aWR0aCozO1xuXHRcdFx0dGVtcEJ1ZmZlci5maWxsKDAsZmlsbE9mZnNldCxmaWxsT2Zmc2V0K3RoaXMuZXh0cmFCeXRlcyk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRlbXBCdWZmZXI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGltZ0RhdGEsIHF1YWxpdHkpIHtcbiAgaWYgKHR5cGVvZiBxdWFsaXR5ID09PSAndW5kZWZpbmVkJykgcXVhbGl0eSA9IDEwMDtcbiBcdHZhciBlbmNvZGVyID0gbmV3IEJtcEVuY29kZXIoaW1nRGF0YSk7XG5cdHZhciBkYXRhID0gZW5jb2Rlci5lbmNvZGUoKTtcbiAgcmV0dXJuIHtcbiAgICBkYXRhOiBkYXRhLFxuICAgIHdpZHRoOiBpbWdEYXRhLndpZHRoLFxuICAgIGhlaWdodDogaW1nRGF0YS5oZWlnaHRcbiAgfTtcbn07XG4iLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBTbG93QnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcblxuLyoqXG4gKiBJZiBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAobW9zdCBjb21wYXRpYmxlLCBldmVuIElFNilcbiAqXG4gKiBCcm93c2VycyB0aGF0IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssIENocm9tZSA3KywgU2FmYXJpIDUuMSssXG4gKiBPcGVyYSAxMS42KywgaU9TIDQuMisuXG4gKlxuICogRHVlIHRvIHZhcmlvdXMgYnJvd3NlciBidWdzLCBzb21ldGltZXMgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiB3aWxsIGJlIHVzZWQgZXZlblxuICogd2hlbiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0eXBlZCBhcnJheXMuXG4gKlxuICogTm90ZTpcbiAqXG4gKiAgIC0gRmlyZWZveCA0LTI5IGxhY2tzIHN1cHBvcnQgZm9yIGFkZGluZyBuZXcgcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLFxuICogICAgIFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4LlxuICpcbiAqICAgLSBDaHJvbWUgOS0xMCBpcyBtaXNzaW5nIHRoZSBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uLlxuICpcbiAqICAgLSBJRTEwIGhhcyBhIGJyb2tlbiBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYXJyYXlzIG9mXG4gKiAgICAgaW5jb3JyZWN0IGxlbmd0aCBpbiBzb21lIHNpdHVhdGlvbnMuXG5cbiAqIFdlIGRldGVjdCB0aGVzZSBidWdneSBicm93c2VycyBhbmQgc2V0IGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGAgdG8gYGZhbHNlYCBzbyB0aGV5XG4gKiBnZXQgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiwgd2hpY2ggaXMgc2xvd2VyIGJ1dCBiZWhhdmVzIGNvcnJlY3RseS5cbiAqL1xuQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgPSBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVCAhPT0gdW5kZWZpbmVkXG4gID8gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgOiB0eXBlZEFycmF5U3VwcG9ydCgpXG5cbi8qXG4gKiBFeHBvcnQga01heExlbmd0aCBhZnRlciB0eXBlZCBhcnJheSBzdXBwb3J0IGlzIGRldGVybWluZWQuXG4gKi9cbmV4cG9ydHMua01heExlbmd0aCA9IGtNYXhMZW5ndGgoKVxuXG5mdW5jdGlvbiB0eXBlZEFycmF5U3VwcG9ydCAoKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KDEpXG4gICAgYXJyLl9fcHJvdG9fXyA9IHtfX3Byb3RvX186IFVpbnQ4QXJyYXkucHJvdG90eXBlLCBmb286IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH19XG4gICAgcmV0dXJuIGFyci5mb28oKSA9PT0gNDIgJiYgLy8gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWRcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAmJiAvLyBjaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgICAgICAgYXJyLnN1YmFycmF5KDEsIDEpLmJ5dGVMZW5ndGggPT09IDAgLy8gaWUxMCBoYXMgYnJva2VuIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIGtNYXhMZW5ndGggKCkge1xuICByZXR1cm4gQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgICA/IDB4N2ZmZmZmZmZcbiAgICA6IDB4M2ZmZmZmZmZcbn1cblxuZnVuY3Rpb24gY3JlYXRlQnVmZmVyICh0aGF0LCBsZW5ndGgpIHtcbiAgaWYgKGtNYXhMZW5ndGgoKSA8IGxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHR5cGVkIGFycmF5IGxlbmd0aCcpXG4gIH1cbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IG5ldyBVaW50OEFycmF5KGxlbmd0aClcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgaWYgKHRoYXQgPT09IG51bGwpIHtcbiAgICAgIHRoYXQgPSBuZXcgQnVmZmVyKGxlbmd0aClcbiAgICB9XG4gICAgdGhhdC5sZW5ndGggPSBsZW5ndGhcbiAgfVxuXG4gIHJldHVybiB0aGF0XG59XG5cbi8qKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBoYXZlIHRoZWlyXG4gKiBwcm90b3R5cGUgY2hhbmdlZCB0byBgQnVmZmVyLnByb3RvdHlwZWAuIEZ1cnRoZXJtb3JlLCBgQnVmZmVyYCBpcyBhIHN1YmNsYXNzIG9mXG4gKiBgVWludDhBcnJheWAsIHNvIHRoZSByZXR1cm5lZCBpbnN0YW5jZXMgd2lsbCBoYXZlIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBtZXRob2RzXG4gKiBhbmQgdGhlIGBVaW50OEFycmF5YCBtZXRob2RzLiBTcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdFxuICogcmV0dXJucyBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBUaGUgYFVpbnQ4QXJyYXlgIHByb3RvdHlwZSByZW1haW5zIHVubW9kaWZpZWQuXG4gKi9cblxuZnVuY3Rpb24gQnVmZmVyIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmICEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdJZiBlbmNvZGluZyBpcyBzcGVjaWZpZWQgdGhlbiB0aGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZydcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGFsbG9jVW5zYWZlKHRoaXMsIGFyZylcbiAgfVxuICByZXR1cm4gZnJvbSh0aGlzLCBhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbi8vIFRPRE86IExlZ2FjeSwgbm90IG5lZWRlZCBhbnltb3JlLiBSZW1vdmUgaW4gbmV4dCBtYWpvciB2ZXJzaW9uLlxuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIGZyb20gKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZyb21TdHJpbmcodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQpXG4gIH1cblxuICByZXR1cm4gZnJvbU9iamVjdCh0aGF0LCB2YWx1ZSlcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsbHkgZXF1aXZhbGVudCB0byBCdWZmZXIoYXJnLCBlbmNvZGluZykgYnV0IHRocm93cyBhIFR5cGVFcnJvclxuICogaWYgdmFsdWUgaXMgYSBudW1iZXIuXG4gKiBCdWZmZXIuZnJvbShzdHJbLCBlbmNvZGluZ10pXG4gKiBCdWZmZXIuZnJvbShhcnJheSlcbiAqIEJ1ZmZlci5mcm9tKGJ1ZmZlcilcbiAqIEJ1ZmZlci5mcm9tKGFycmF5QnVmZmVyWywgYnl0ZU9mZnNldFssIGxlbmd0aF1dKVxuICoqL1xuQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gZnJvbShudWxsLCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5pZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgQnVmZmVyLnByb3RvdHlwZS5fX3Byb3RvX18gPSBVaW50OEFycmF5LnByb3RvdHlwZVxuICBCdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnNwZWNpZXMgJiZcbiAgICAgIEJ1ZmZlcltTeW1ib2wuc3BlY2llc10gPT09IEJ1ZmZlcikge1xuICAgIC8vIEZpeCBzdWJhcnJheSgpIGluIEVTMjAxNi4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzk3XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlciwgU3ltYm9sLnNwZWNpZXMsIHtcbiAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRTaXplIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyJylcbiAgfSBlbHNlIGlmIChzaXplIDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBuZWdhdGl2ZScpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWxsb2MgKHRoYXQsIHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgaWYgKHNpemUgPD0gMCkge1xuICAgIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSlcbiAgfVxuICBpZiAoZmlsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT25seSBwYXkgYXR0ZW50aW9uIHRvIGVuY29kaW5nIGlmIGl0J3MgYSBzdHJpbmcuIFRoaXNcbiAgICAvLyBwcmV2ZW50cyBhY2NpZGVudGFsbHkgc2VuZGluZyBpbiBhIG51bWJlciB0aGF0IHdvdWxkXG4gICAgLy8gYmUgaW50ZXJwcmV0dGVkIGFzIGEgc3RhcnQgb2Zmc2V0LlxuICAgIHJldHVybiB0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnXG4gICAgICA/IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwsIGVuY29kaW5nKVxuICAgICAgOiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSkuZmlsbChmaWxsKVxuICB9XG4gIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSlcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiBhbGxvYyhzaXplWywgZmlsbFssIGVuY29kaW5nXV0pXG4gKiovXG5CdWZmZXIuYWxsb2MgPSBmdW5jdGlvbiAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGFsbG9jKG51bGwsIHNpemUsIGZpbGwsIGVuY29kaW5nKVxufVxuXG5mdW5jdGlvbiBhbGxvY1Vuc2FmZSAodGhhdCwgc2l6ZSkge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSA8IDAgPyAwIDogY2hlY2tlZChzaXplKSB8IDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7ICsraSkge1xuICAgICAgdGhhdFtpXSA9IDBcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIEJ1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShudWxsLCBzaXplKVxufVxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIFNsb3dCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShudWxsLCBzaXplKVxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nICh0aGF0LCBzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZW5jb2RpbmdcIiBtdXN0IGJlIGEgdmFsaWQgc3RyaW5nIGVuY29kaW5nJylcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBieXRlTGVuZ3RoKHN0cmluZywgZW5jb2RpbmcpIHwgMFxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbmd0aClcblxuICB2YXIgYWN0dWFsID0gdGhhdC53cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuXG4gIGlmIChhY3R1YWwgIT09IGxlbmd0aCkge1xuICAgIC8vIFdyaXRpbmcgYSBoZXggc3RyaW5nLCBmb3IgZXhhbXBsZSwgdGhhdCBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlcnMgd2lsbFxuICAgIC8vIGNhdXNlIGV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGZpcnN0IGludmFsaWQgY2hhcmFjdGVyIHRvIGJlIGlnbm9yZWQuIChlLmcuXG4gICAgLy8gJ2FieHhjZCcgd2lsbCBiZSB0cmVhdGVkIGFzICdhYicpXG4gICAgdGhhdCA9IHRoYXQuc2xpY2UoMCwgYWN0dWFsKVxuICB9XG5cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCA8IDAgPyAwIDogY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIHRoYXRbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUJ1ZmZlciAodGhhdCwgYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICBhcnJheS5ieXRlTGVuZ3RoIC8vIHRoaXMgdGhyb3dzIGlmIGBhcnJheWAgaXMgbm90IGEgdmFsaWQgQXJyYXlCdWZmZXJcblxuICBpZiAoYnl0ZU9mZnNldCA8IDAgfHwgYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXFwnb2Zmc2V0XFwnIGlzIG91dCBvZiBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0ICsgKGxlbmd0aCB8fCAwKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdsZW5ndGhcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYnl0ZU9mZnNldCA9PT0gdW5kZWZpbmVkICYmIGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSlcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQpXG4gIH0gZWxzZSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IGFycmF5XG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIHRoYXQgPSBmcm9tQXJyYXlMaWtlKHRoYXQsIGFycmF5KVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKHRoYXQsIG9iaikge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG9iaikpIHtcbiAgICB2YXIgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbilcblxuICAgIGlmICh0aGF0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoYXRcbiAgICB9XG5cbiAgICBvYmouY29weSh0aGF0LCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIHRoYXRcbiAgfVxuXG4gIGlmIChvYmopIHtcbiAgICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgb2JqLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB8fCAnbGVuZ3RoJyBpbiBvYmopIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ251bWJlcicgfHwgaXNuYW4ob2JqLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCAwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqKVxuICAgIH1cblxuICAgIGlmIChvYmoudHlwZSA9PT0gJ0J1ZmZlcicgJiYgaXNBcnJheShvYmouZGF0YSkpIHtcbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iai5kYXRhKVxuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCBvciBhcnJheS1saWtlIG9iamVjdC4nKVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwga01heExlbmd0aCgpYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IGtNYXhMZW5ndGgoKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBrTWF4TGVuZ3RoKCkudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZnVuY3Rpb24gU2xvd0J1ZmZlciAobGVuZ3RoKSB7XG4gIGlmICgrbGVuZ3RoICE9IGxlbmd0aCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuICAgIGxlbmd0aCA9IDBcbiAgfVxuICByZXR1cm4gQnVmZmVyLmFsbG9jKCtsZW5ndGgpXG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIG11c3QgYmUgQnVmZmVycycpXG4gIH1cblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcblxuICB2YXIgeCA9IGEubGVuZ3RoXG4gIHZhciB5ID0gYi5sZW5ndGhcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXVxuICAgICAgeSA9IGJbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIGlzRW5jb2RpbmcgKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gY29uY2F0IChsaXN0LCBsZW5ndGgpIHtcbiAgaWYgKCFpc0FycmF5KGxpc3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBCdWZmZXIuYWxsb2MoMClcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGxlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgbGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShsZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIGJ1ZiA9IGxpc3RbaV1cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBBcnJheUJ1ZmZlci5pc1ZpZXcgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIChBcnJheUJ1ZmZlci5pc1ZpZXcoc3RyaW5nKSB8fCBzdHJpbmcgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikpIHtcbiAgICByZXR1cm4gc3RyaW5nLmJ5dGVMZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICBzdHJpbmcgPSAnJyArIHN0cmluZ1xuICB9XG5cbiAgdmFyIGxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKGxlbiA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBVc2UgYSBmb3IgbG9vcCB0byBhdm9pZCByZWN1cnNpb25cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGVuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiBsZW4gKiAyXG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gbGVuID4+PiAxXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGggLy8gYXNzdW1lIHV0ZjhcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuXG5mdW5jdGlvbiBzbG93VG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG5cbiAgLy8gTm8gbmVlZCB0byB2ZXJpZnkgdGhhdCBcInRoaXMubGVuZ3RoIDw9IE1BWF9VSU5UMzJcIiBzaW5jZSBpdCdzIGEgcmVhZC1vbmx5XG4gIC8vIHByb3BlcnR5IG9mIGEgdHlwZWQgYXJyYXkuXG5cbiAgLy8gVGhpcyBiZWhhdmVzIG5laXRoZXIgbGlrZSBTdHJpbmcgbm9yIFVpbnQ4QXJyYXkgaW4gdGhhdCB3ZSBzZXQgc3RhcnQvZW5kXG4gIC8vIHRvIHRoZWlyIHVwcGVyL2xvd2VyIGJvdW5kcyBpZiB0aGUgdmFsdWUgcGFzc2VkIGlzIG91dCBvZiByYW5nZS5cbiAgLy8gdW5kZWZpbmVkIGlzIGhhbmRsZWQgc3BlY2lhbGx5IGFzIHBlciBFQ01BLTI2MiA2dGggRWRpdGlvbixcbiAgLy8gU2VjdGlvbiAxMy4zLjMuNyBSdW50aW1lIFNlbWFudGljczogS2V5ZWRCaW5kaW5nSW5pdGlhbGl6YXRpb24uXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkIHx8IHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIC8vIFJldHVybiBlYXJseSBpZiBzdGFydCA+IHRoaXMubGVuZ3RoLiBEb25lIGhlcmUgdG8gcHJldmVudCBwb3RlbnRpYWwgdWludDMyXG4gIC8vIGNvZXJjaW9uIGZhaWwgYmVsb3cuXG4gIGlmIChzdGFydCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVuZCA8PSAwKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICAvLyBGb3JjZSBjb2Vyc2lvbiB0byB1aW50MzIuIFRoaXMgd2lsbCBhbHNvIGNvZXJjZSBmYWxzZXkvTmFOIHZhbHVlcyB0byAwLlxuICBlbmQgPj4+PSAwXG4gIHN0YXJ0ID4+Pj0gMFxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdXRmMTZsZVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9IChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vLyBUaGUgcHJvcGVydHkgaXMgdXNlZCBieSBgQnVmZmVyLmlzQnVmZmVyYCBhbmQgYGlzLWJ1ZmZlcmAgKGluIFNhZmFyaSA1LTcpIHRvIGRldGVjdFxuLy8gQnVmZmVyIGluc3RhbmNlcy5cbkJ1ZmZlci5wcm90b3R5cGUuX2lzQnVmZmVyID0gdHJ1ZVxuXG5mdW5jdGlvbiBzd2FwIChiLCBuLCBtKSB7XG4gIHZhciBpID0gYltuXVxuICBiW25dID0gYlttXVxuICBiW21dID0gaVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAxNiA9IGZ1bmN0aW9uIHN3YXAxNiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgMiAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMTYtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDEpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMzIgPSBmdW5jdGlvbiBzd2FwMzIgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDQgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDMyLWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAzKVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyAyKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDY0ID0gZnVuY3Rpb24gc3dhcDY0ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA4ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA2NC1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA4KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgNylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgNilcbiAgICBzd2FwKHRoaXMsIGkgKyAyLCBpICsgNSlcbiAgICBzd2FwKHRoaXMsIGkgKyAzLCBpICsgNClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGggfCAwXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIHZhciBzdHIgPSAnJ1xuICB2YXIgbWF4ID0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSB0YXJnZXQgPyB0YXJnZXQubGVuZ3RoIDogMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNTdGFydCA9IDBcbiAgfVxuICBpZiAodGhpc0VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc0VuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IGVuZCA+IHRhcmdldC5sZW5ndGggfHwgdGhpc1N0YXJ0IDwgMCB8fCB0aGlzRW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCAmJiBzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCkge1xuICAgIHJldHVybiAtMVxuICB9XG4gIGlmIChzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgc3RhcnQgPj4+PSAwXG4gIGVuZCA+Pj49IDBcbiAgdGhpc1N0YXJ0ID4+Pj0gMFxuICB0aGlzRW5kID4+Pj0gMFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQpIHJldHVybiAwXG5cbiAgdmFyIHggPSB0aGlzRW5kIC0gdGhpc1N0YXJ0XG4gIHZhciB5ID0gZW5kIC0gc3RhcnRcbiAgdmFyIGxlbiA9IE1hdGgubWluKHgsIHkpXG5cbiAgdmFyIHRoaXNDb3B5ID0gdGhpcy5zbGljZSh0aGlzU3RhcnQsIHRoaXNFbmQpXG4gIHZhciB0YXJnZXRDb3B5ID0gdGFyZ2V0LnNsaWNlKHN0YXJ0LCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGlmICh0aGlzQ29weVtpXSAhPT0gdGFyZ2V0Q29weVtpXSkge1xuICAgICAgeCA9IHRoaXNDb3B5W2ldXG4gICAgICB5ID0gdGFyZ2V0Q29weVtpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbi8vIEZpbmRzIGVpdGhlciB0aGUgZmlyc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0ID49IGBieXRlT2Zmc2V0YCxcbi8vIE9SIHRoZSBsYXN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA8PSBgYnl0ZU9mZnNldGAuXG4vL1xuLy8gQXJndW1lbnRzOlxuLy8gLSBidWZmZXIgLSBhIEJ1ZmZlciB0byBzZWFyY2hcbi8vIC0gdmFsIC0gYSBzdHJpbmcsIEJ1ZmZlciwgb3IgbnVtYmVyXG4vLyAtIGJ5dGVPZmZzZXQgLSBhbiBpbmRleCBpbnRvIGBidWZmZXJgOyB3aWxsIGJlIGNsYW1wZWQgdG8gYW4gaW50MzJcbi8vIC0gZW5jb2RpbmcgLSBhbiBvcHRpb25hbCBlbmNvZGluZywgcmVsZXZhbnQgaXMgdmFsIGlzIGEgc3RyaW5nXG4vLyAtIGRpciAtIHRydWUgZm9yIGluZGV4T2YsIGZhbHNlIGZvciBsYXN0SW5kZXhPZlxuZnVuY3Rpb24gYmlkaXJlY3Rpb25hbEluZGV4T2YgKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIC8vIEVtcHR5IGJ1ZmZlciBtZWFucyBubyBtYXRjaFxuICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXRcbiAgaWYgKHR5cGVvZiBieXRlT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gYnl0ZU9mZnNldFxuICAgIGJ5dGVPZmZzZXQgPSAwXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIHtcbiAgICBieXRlT2Zmc2V0ID0gMHg3ZmZmZmZmZlxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkge1xuICAgIGJ5dGVPZmZzZXQgPSAtMHg4MDAwMDAwMFxuICB9XG4gIGJ5dGVPZmZzZXQgPSArYnl0ZU9mZnNldCAgLy8gQ29lcmNlIHRvIE51bWJlci5cbiAgaWYgKGlzTmFOKGJ5dGVPZmZzZXQpKSB7XG4gICAgLy8gYnl0ZU9mZnNldDogaXQgaXQncyB1bmRlZmluZWQsIG51bGwsIE5hTiwgXCJmb29cIiwgZXRjLCBzZWFyY2ggd2hvbGUgYnVmZmVyXG4gICAgYnl0ZU9mZnNldCA9IGRpciA/IDAgOiAoYnVmZmVyLmxlbmd0aCAtIDEpXG4gIH1cblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldDogbmVnYXRpdmUgb2Zmc2V0cyBzdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICBpZiAoYnl0ZU9mZnNldCA8IDApIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoICsgYnl0ZU9mZnNldFxuICBpZiAoYnl0ZU9mZnNldCA+PSBidWZmZXIubGVuZ3RoKSB7XG4gICAgaWYgKGRpcikgcmV0dXJuIC0xXG4gICAgZWxzZSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCAtIDFcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgMCkge1xuICAgIGlmIChkaXIpIGJ5dGVPZmZzZXQgPSAwXG4gICAgZWxzZSByZXR1cm4gLTFcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB2YWxcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsID0gQnVmZmVyLmZyb20odmFsLCBlbmNvZGluZylcbiAgfVxuXG4gIC8vIEZpbmFsbHksIHNlYXJjaCBlaXRoZXIgaW5kZXhPZiAoaWYgZGlyIGlzIHRydWUpIG9yIGxhc3RJbmRleE9mXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsKSkge1xuICAgIC8vIFNwZWNpYWwgY2FzZTogbG9va2luZyBmb3IgZW1wdHkgc3RyaW5nL2J1ZmZlciBhbHdheXMgZmFpbHNcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAweEZGIC8vIFNlYXJjaCBmb3IgYSBieXRlIHZhbHVlIFswLTI1NV1cbiAgICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiZcbiAgICAgICAgdHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgWyB2YWwgXSwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbmZ1bmN0aW9uIGFycmF5SW5kZXhPZiAoYXJyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgdmFyIGluZGV4U2l6ZSA9IDFcbiAgdmFyIGFyckxlbmd0aCA9IGFyci5sZW5ndGhcbiAgdmFyIHZhbExlbmd0aCA9IHZhbC5sZW5ndGhcblxuICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKGVuY29kaW5nID09PSAndWNzMicgfHwgZW5jb2RpbmcgPT09ICd1Y3MtMicgfHxcbiAgICAgICAgZW5jb2RpbmcgPT09ICd1dGYxNmxlJyB8fCBlbmNvZGluZyA9PT0gJ3V0Zi0xNmxlJykge1xuICAgICAgaWYgKGFyci5sZW5ndGggPCAyIHx8IHZhbC5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiAtMVxuICAgICAgfVxuICAgICAgaW5kZXhTaXplID0gMlxuICAgICAgYXJyTGVuZ3RoIC89IDJcbiAgICAgIHZhbExlbmd0aCAvPSAyXG4gICAgICBieXRlT2Zmc2V0IC89IDJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkIChidWYsIGkpIHtcbiAgICBpZiAoaW5kZXhTaXplID09PSAxKSB7XG4gICAgICByZXR1cm4gYnVmW2ldXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBidWYucmVhZFVJbnQxNkJFKGkgKiBpbmRleFNpemUpXG4gICAgfVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGRpcikge1xuICAgIHZhciBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpIDwgYXJyTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWFkKGFyciwgaSkgPT09IHJlYWQodmFsLCBmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleCkpIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgICBpZiAoaSAtIGZvdW5kSW5kZXggKyAxID09PSB2YWxMZW5ndGgpIHJldHVybiBmb3VuZEluZGV4ICogaW5kZXhTaXplXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZm91bmRJbmRleCAhPT0gLTEpIGkgLT0gaSAtIGZvdW5kSW5kZXhcbiAgICAgICAgZm91bmRJbmRleCA9IC0xXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChieXRlT2Zmc2V0ICsgdmFsTGVuZ3RoID4gYXJyTGVuZ3RoKSBieXRlT2Zmc2V0ID0gYXJyTGVuZ3RoIC0gdmFsTGVuZ3RoXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciBmb3VuZCA9IHRydWVcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHJlYWQoYXJyLCBpICsgaikgIT09IHJlYWQodmFsLCBqKSkge1xuICAgICAgICAgIGZvdW5kID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmQpIHJldHVybiBpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gdGhpcy5pbmRleE9mKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpICE9PSAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCB0cnVlKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gbGFzdEluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGZhbHNlKVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChzdHJMZW4gJSAyICE9PSAwKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgcGFyc2VkID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGlmIChpc05hTihwYXJzZWQpKSByZXR1cm4gaVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHBhcnNlZFxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIHV0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGFzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gbGF0aW4xV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB1Y3MyV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gd3JpdGUgKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcpXG4gIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgb2Zmc2V0WywgbGVuZ3RoXVssIGVuY29kaW5nXSlcbiAgfSBlbHNlIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGggfCAwXG4gICAgICBpZiAoZW5jb2RpbmcgPT09IHVuZGVmaW5lZCkgZW5jb2RpbmcgPSAndXRmOCdcbiAgICB9IGVsc2Uge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgLy8gbGVnYWN5IHdyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKSAtIHJlbW92ZSBpbiB2MC4xM1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCdcbiAgICApXG4gIH1cblxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGxhdGluMVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpICsgMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgdmFyIG5ld0J1ZlxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBuZXdCdWYgPSB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpXG4gICAgbmV3QnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyArK2kpIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXdCdWZcbn1cblxuLypcbiAqIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYnVmZmVyIGlzbid0IHRyeWluZyB0byB3cml0ZSBvdXQgb2YgYm91bmRzLlxuICovXG5mdW5jdGlvbiBjaGVja09mZnNldCAob2Zmc2V0LCBleHQsIGxlbmd0aCkge1xuICBpZiAoKG9mZnNldCAlIDEpICE9PSAwIHx8IG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdvZmZzZXQgaXMgbm90IHVpbnQnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gbGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRSA9IGZ1bmN0aW9uIHJlYWRVSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRSA9IGZ1bmN0aW9uIHJlYWRVSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiByZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdICogMHgxMDAwMDAwKSArXG4gICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgIHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludExFID0gZnVuY3Rpb24gcmVhZEludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoXG4gIHZhciBtdWwgPSAxXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0taV1cbiAgd2hpbGUgKGkgPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1pXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiByZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICBpZiAoISh0aGlzW29mZnNldF0gJiAweDgwKSkgcmV0dXJuICh0aGlzW29mZnNldF0pXG4gIHJldHVybiAoKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gcmVhZEludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIDFdIHwgKHRoaXNbb2Zmc2V0XSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiByZWFkSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiByZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgNTIsIDgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZmZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCAyKTsgaSA8IGo7ICsraSkge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgNCk7IGkgPCBqOyArK2kpIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gMFxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgLSAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgKyAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG4gIHZhciBpXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yIChpID0gbGVuIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2UgaWYgKGxlbiA8IDEwMDAgfHwgIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gYXNjZW5kaW5nIGNvcHkgZnJvbSBzdGFydFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoY29kZSA8IDI1Nikge1xuICAgICAgICB2YWwgPSBjb2RlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMjU1XG4gIH1cblxuICAvLyBJbnZhbGlkIHJhbmdlcyBhcmUgbm90IHNldCB0byBhIGRlZmF1bHQsIHNvIGNhbiByYW5nZSBjaGVjayBlYXJseS5cbiAgaWYgKHN0YXJ0IDwgMCB8fCB0aGlzLmxlbmd0aCA8IHN0YXJ0IHx8IHRoaXMubGVuZ3RoIDwgZW5kKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ091dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyB0aGlzLmxlbmd0aCA6IGVuZCA+Pj4gMFxuXG4gIGlmICghdmFsKSB2YWwgPSAwXG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgdGhpc1tpXSA9IHZhbFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYnl0ZXMgPSBCdWZmZXIuaXNCdWZmZXIodmFsKVxuICAgICAgPyB2YWxcbiAgICAgIDogdXRmOFRvQnl0ZXMobmV3IEJ1ZmZlcih2YWwsIGVuY29kaW5nKS50b1N0cmluZygpKVxuICAgIHZhciBsZW4gPSBieXRlcy5sZW5ndGhcbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5kIC0gc3RhcnQ7ICsraSkge1xuICAgICAgdGhpc1tpICsgc3RhcnRdID0gYnl0ZXNbaSAlIGxlbl1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbnZhciBJTlZBTElEX0JBU0U2NF9SRSA9IC9bXitcXC8wLTlBLVphLXotX10vZ1xuXG5mdW5jdGlvbiBiYXNlNjRjbGVhbiAoc3RyKSB7XG4gIC8vIE5vZGUgc3RyaXBzIG91dCBpbnZhbGlkIGNoYXJhY3RlcnMgbGlrZSBcXG4gYW5kIFxcdCBmcm9tIHRoZSBzdHJpbmcsIGJhc2U2NC1qcyBkb2VzIG5vdFxuICBzdHIgPSBzdHJpbmd0cmltKHN0cikucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIHZhciBjb2RlUG9pbnRcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgdmFyIGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIHZhciBieXRlcyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvZGVQb2ludCA9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cbiAgICAvLyBpcyBzdXJyb2dhdGUgY29tcG9uZW50XG4gICAgaWYgKGNvZGVQb2ludCA+IDB4RDdGRiAmJiBjb2RlUG9pbnQgPCAweEUwMDApIHtcbiAgICAgIC8vIGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoIWxlYWRTdXJyb2dhdGUpIHtcbiAgICAgICAgLy8gbm8gbGVhZCB5ZXRcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+IDB4REJGRikge1xuICAgICAgICAgIC8vIHVuZXhwZWN0ZWQgdHJhaWxcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGkgKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAvLyB1bnBhaXJlZCBsZWFkXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkIGxlYWRcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIgbGVhZHMgaW4gYSByb3dcbiAgICAgIGlmIChjb2RlUG9pbnQgPCAweERDMDApIHtcbiAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gdmFsaWQgc3Vycm9nYXRlIHBhaXJcbiAgICAgIGNvZGVQb2ludCA9IChsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwKSArIDB4MTAwMDBcbiAgICB9IGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUpIHtcbiAgICAgIC8vIHZhbGlkIGJtcCBjaGFyLCBidXQgbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgIH1cblxuICAgIGxlYWRTdXJyb2dhdGUgPSBudWxsXG5cbiAgICAvLyBlbmNvZGUgdXRmOFxuICAgIGlmIChjb2RlUG9pbnQgPCAweDgwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDEpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goY29kZVBvaW50KVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHg4MDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiB8IDB4QzAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDMpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgfCAweEUwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSA0KSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHgxMiB8IDB4RjAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBpc25hbiAodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IHZhbCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuIiwiZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSAoZSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSAobSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICgodmFsdWUgKiBjKSAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoYXJyKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGFycikgPT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCJ2YXIgZztcblxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcbmcgPSAoZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzO1xufSkoKTtcblxudHJ5IHtcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXG5cdGcgPSBnIHx8IG5ldyBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG59IGNhdGNoIChlKSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXG5cdGlmICh0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKSBnID0gd2luZG93O1xufVxuXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGc7XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBBbmltYXRpb24ge1xyXG4gICAgY29uc3RydWN0b3IgKHsgZnJhbWVzLCBkdXJhdGlvbiB9KSB7XHJcbiAgICAgICAgdGhpcy5mcmFtZXMgPSBmcmFtZXM7XHJcbiAgICAgICAgdGhpcy5kdXJhdGlvbiA9IGR1cmF0aW9uO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEZyYW1lID0gMDtcclxuICAgICAgICB0aGlzLnRpbWUgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSAodGltZSkge1xyXG4gICAgICAgIHRoaXMudGltZSArPSB0aW1lLmVsYXBzZWQ7XHJcbiAgICAgICAgaWYgKHRoaXMudGltZSA+PSB0aGlzLmR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGltZSAtPSB0aGlzLmR1cmF0aW9uO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50RnJhbWUgPj0gdGhpcy5mcmFtZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRGcmFtZSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5mcmFtZXNbdGhpcy5jdXJyZW50RnJhbWUrK10oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBcIi4uL3Nwcml0ZXMvYmFja2dyb3VuZC5ibXBcIjsiLCJleHBvcnQgZGVmYXVsdCBcIi4uL3Nwcml0ZXMvc3ByaXRlcy5ibXBcIjsiLCJpbXBvcnQgYm1wIGZyb20gJ2JtcC1qcyc7XHJcblxyXG5jb25zdCBsb2FkQml0bWFwID0gYXN5bmMgKHVybCwgc2V0RGF0YSkgPT4ge1xyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2godXJsKTtcclxuICAgIGNvbnN0IGFycnlCdWZmZXIgPSBhd2FpdCByZXMuYXJyYXlCdWZmZXIoKTtcclxuICAgIHZhciBibXBEYXRhID0gYm1wLmRlY29kZShuZXcgQnVmZmVyKGFycnlCdWZmZXIpKTtcclxuICAgIGNvbnN0IHdpZHRoID0gYm1wRGF0YS53aWR0aDtcclxuICAgIGNvbnN0IGhlaWdodCA9IGJtcERhdGEuaGVpZ2h0O1xyXG4gICAgaWYgKHdpZHRoICE9PSAxMjggfHwgaGVpZ2h0ICE9PSAxMjgpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGluY29ycmVjdCBiaXRtYXAgc2l6ZSAke3dpZHRofXgke2hlaWdodH1gKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGRhdGEgPSBibXBEYXRhLmRhdGE7XHJcbiAgICBjb25zdCBsZW5ndGggPSBkYXRhLmxlbmd0aCAvIDQ7IC8vIDQgYnl0ZXMgcGVyIHBpeGVsXHJcbiAgICBsZXQgdmFsdWUgPSAwO1xyXG4gICAgZm9yICh2YXIgaT0wO2k8bGVuZ3RoO2krKykge1xyXG4gICAgICAgIGNvbnN0IGJsdWUgPSBkYXRhW2kqNCArIDFdO1xyXG4gICAgICAgIGNvbnN0IGNvbG9yID0gKGJsdWUgPj4gNikgJiAweDAzOyAvLyAwLDEsMiwzXHJcbiAgICAgICAgdmFsdWUgPSAodmFsdWUgPDwgMikgJiAweGZmIHwgY29sb3I7XHJcbiAgICAgICAgaWYgKGkgJSA0ID09PSAzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFkciA9IGkgPj4gMjtcclxuICAgICAgICAgICAgc2V0RGF0YShhZHIsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBsb2FkQml0bWFwO1xyXG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iLCJpbXBvcnQge1xyXG4gICAgY29sb3JzLFxyXG4gICAgZ2V0Q29sb3JCeXRlXHJcbn0gZnJvbScuL3BhbGV0dGUnO1xyXG5cclxuY29uc3QgV0lEVEggPSAyNTY7XHJcbmNvbnN0IEhFSUdIVCA9IDI0MDtcclxuY29uc3QgQllURVNfUEVSX1BJWEVMID0gNDtcclxuY29uc3QgUk9XX1dJRFRIID0gV0lEVEggKiBCWVRFU19QRVJfUElYRUw7XHJcblxyXG5jbGFzcyBEaXNwbGF5IHtcclxuICAgIGNvbnN0cnVjdG9yIChjdHgpIHtcclxuICAgICAgICB0aGlzLmN0eCA9IGN0eDtcclxuICAgICAgICB0aGlzLmJ1ZmZlciA9IG5ldyBJbWFnZURhdGEoV0lEVEgsIEhFSUdIVCk7XHJcbiAgICAgICAgdGhpcy5waXhlbHMgPSB0aGlzLmJ1ZmZlci5kYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBpeGVsICh4LCB5KSB7XHJcbiAgICAgICAgY29uc3QgaWR4ID0geSAqIFJPV19XSURUSCArIHggKiBCWVRFU19QRVJfUElYRUw7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgdGhpcy5waXhlbHNbaWR4ICsgMF0sIC8vIHJcclxuICAgICAgICAgICAgdGhpcy5waXhlbHNbaWR4ICsgMV0sIC8vIGdcclxuICAgICAgICAgICAgdGhpcy5waXhlbHNbaWR4ICsgMl0sIC8vIGJcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXRQaXhlbCAoeCwgeSwgZGlzcGxheUNvbG9yKSB7XHJcbiAgICAgICAgY29uc3QgciA9IGdldENvbG9yQnl0ZShkaXNwbGF5Q29sb3IsIDApO1xyXG4gICAgICAgIGNvbnN0IGcgPSBnZXRDb2xvckJ5dGUoZGlzcGxheUNvbG9yLCAxKTtcclxuICAgICAgICBjb25zdCBiID0gZ2V0Q29sb3JCeXRlKGRpc3BsYXlDb2xvciwgMik7XHJcbiAgICAgICAgY29uc3QgaWR4ID0geSAqIFJPV19XSURUSCArIHggKiBCWVRFU19QRVJfUElYRUw7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5waXhlbHNbaWR4ICsgMF0gPSByO1xyXG4gICAgICAgIHRoaXMucGl4ZWxzW2lkeCArIDFdID0gZztcclxuICAgICAgICB0aGlzLnBpeGVsc1tpZHggKyAyXSA9IGI7XHJcbiAgICAgICAgdGhpcy5waXhlbHNbaWR4ICsgM10gPSAweEZGO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBkcmF3ICgpIHtcclxuICAgICAgICB0aGlzLmN0eC5wdXRJbWFnZURhdGEodGhpcy5idWZmZXIsIDAsIDApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEaXNwbGF5O1xyXG4iLCJpbXBvcnQgQW5pbWF0aW9uRnJhbWUgZnJvbSAnYW5pbWF0aW9uLWZyYW1lJztcclxuaW1wb3J0IGtleXN0YXRlIGZyb20gJy4va2V5YmluZGluZ3MnO1xyXG5pbXBvcnQgRGlzcGxheSBmcm9tICcuL2Rpc3BsYXknO1xyXG5pbXBvcnQgU3ByaXRlTWFuYWdlciBmcm9tICcuL3Nwcml0ZU1hbmFnZXInO1xyXG5pbXBvcnQgcHB1IGZyb20gJy4vcHB1JztcclxuaW1wb3J0IGxvYWRCaXRtYXAgZnJvbSAnLi9iaXRtYXBMb2FkZXInO1xyXG5pbXBvcnQgdGV4dCBmcm9tICcuL3RleHQnO1xyXG5pbXBvcnQgZ2FtZXRpbWUgZnJvbSAnLi9nYW1ldGltZSc7XHJcbmltcG9ydCBBbmltYXRpb24gZnJvbSAnLi9hbmltYXRpb24nO1xyXG5pbXBvcnQgdGlsZVNoZWV0IGZyb20gJy4vYXNzZXRzL2JhY2tncm91bmQuYm1wJztcclxuaW1wb3J0IHNwcml0ZVNoZWV0IGZyb20gJy4vYXNzZXRzL3Nwcml0ZXMuYm1wJztcclxuXHJcbmNvbnN0IHtcclxuICAgIEhPUklaT05UQUwsXHJcbiAgICBWRVJUSUNBTCxcclxuICAgIHNldENvbW1vbkJhY2tncm91bmQsXHJcbiAgICBzZXRNaXJyb3JpbmcsXHJcbiAgICBzZXRTY3JvbGwsXHJcbiAgICBzZXROYW1ldGFibGUsXHJcbiAgICBzZXRBdHRyaWJ1dGUsXHJcbiAgICBzZXRCZ1BhbGV0dGUsXHJcbiAgICBzZXRTcHJpdGVQYWxldHRlLFxyXG4gICAgc2V0U3ByaXRlRGF0YSxcclxuICAgIHNldEJhY2tncm91bmREYXRhLFxyXG4gICAgZ2V0UGl4ZWwsXHJcbn0gPSBwcHU7XHJcblxyXG5jb25zdCBCTEFDSyA9IDB4M2Y7XHJcbmNvbnN0IFdISVRFID0gMHgzMDtcclxuXHJcbmNvbnN0IEJMQU5LID0gMHhGRjtcclxuY29uc3QgQlJJQ0sgPSAweDMwO1xyXG5jb25zdCBDSVJDTEVfVEwgPSAweDMxO1xyXG5jb25zdCBDSVJDTEVfVFIgPSAweDMyO1xyXG5jb25zdCBDSVJDTEVfQkwgPSAweDMzO1xyXG5jb25zdCBDSVJDTEVfQlIgPSAweDM0O1xyXG5cclxuY29uc3QgcmFuZCA9ICgpID0+IE1hdGgucmFuZG9tKCk7XHJcbmNvbnN0IHJhbmRJbnQgPSAobWF4KSA9PiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZSB7XHJcbiAgICBjb25zdHJ1Y3RvciAoY2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0gbmV3IERpc3BsYXkoY2FudmFzLmdldENvbnRleHQoJzJkJykpO1xyXG4gICAgICAgIHRoaXMuc3ByaXRlTWFuYWdlciA9IG5ldyBTcHJpdGVNYW5hZ2VyKHRoaXMuZGlzcGxheSk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgYXR0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgbWVudU9wZW46IGZhbHNlLFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gbmV3IEFuaW1hdGlvbkZyYW1lKDMwKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgYXN5bmMgcmVzZXQgKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdSRVNFVCcpO1xyXG4gICAgICAgIC8vIGxvYWQgdGlsZSBzaGVldHNcclxuICAgICAgICBhd2FpdCBsb2FkQml0bWFwKHRpbGVTaGVldCwgcHB1LnNldEJhY2tncm91bmREYXRhKTtcclxuICAgICAgICBhd2FpdCBsb2FkQml0bWFwKHNwcml0ZVNoZWV0LCBwcHUuc2V0U3ByaXRlRGF0YSk7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVNYW5hZ2VyLmNsZWFyU3ByaXRlcygpO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRUaXRsZVNjcmVlbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXkgKCkge1xyXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IHRoaXMudGltZSA9IG5ldyBnYW1ldGltZShEYXRlLm5vdygpLCAwLCAwKTtcclxuICAgICAgICB0aGlzLmZwcyA9IDA7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRpY2sgKCkge1xyXG4gICAgICAgICAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xyXG4gICAgICAgICAgICBjb25zdCBlbGFwc2VkID0gdGltZXN0YW1wIC0gc2VsZi50aW1lLnRpbWVzdGFtcDtcclxuICAgICAgICAgICAgY29uc3QgdGltZSA9IG5ldyBnYW1ldGltZSh0aW1lc3RhbXAsIGVsYXBzZWQpO1xyXG4gICAgICAgICAgICBzZWxmLnRpbWUgPSB0aW1lO1xyXG4gICAgXHJcbiAgICAgICAgICAgIHNlbGYudXBkYXRlKHRpbWUpO1xyXG4gICAgICAgICAgICBzZWxmLmRyYXcoKTtcclxuICAgIFxyXG4gICAgICAgICAgICBzZWxmLmZyYW1lSWQgPSBzZWxmLmFuaW1hdGlvbkZyYW1lLnJlcXVlc3QodGljayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmZyYW1lSWQgPSB0aGlzLmFuaW1hdGlvbkZyYW1lLnJlcXVlc3QodGljayk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHBhdXNlICgpIHtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lLmNhbmNlbCh0aGlzLmZyYW1lSWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSAodGltZSkge1xyXG4gICAgICAgIHRoaXMuZnBzID0gTWF0aC5mbG9vcigxMDAwIC8gdGltZS5lbGFwc2VkKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub25VcGRhdGUpIHtcclxuICAgICAgICAgICAgdGhpcy5vblVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy50aXRsZUFuaW1hdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlQW5pbWF0aW9uLnVwZGF0ZSh0aW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMucGFjbWFuQW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFjbWFuQW5pbWF0aW9uLnVwZGF0ZSh0aW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFRpdGxlU2NyZWVuICgpIHtcclxuICAgICAgICBzZXRDb21tb25CYWNrZ3JvdW5kKEJMQUNLKTtcclxuICAgICAgICBzZXRNaXJyb3JpbmcoSE9SSVpPTlRBTCk7XHJcbiAgICAgICAgc2V0U2Nyb2xsKDAsIDApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHNldEJnUGFsZXR0ZSgwLCBCTEFDSywgMHgwMCwgMHgxMCwgV0hJVEUpO1xyXG4gICAgICAgIHNldEJnUGFsZXR0ZSgxLCBCTEFDSywgMHgxMSwgMHgyMSwgMHgzMSk7IC8vIGJsdWVzXHJcbiAgICAgICAgc2V0QmdQYWxldHRlKDIsIEJMQUNLLCAweDA3LCAweDE3LCAweDI3KTsgLy8gb3Jhbmdlc1xyXG5cclxuICAgICAgICBzZXRTcHJpdGVQYWxldHRlKDAsIEJMQUNLLCAweDE4LCAweDI4LCAweDM4KTsgLy8gcGFjbWFuXHJcblxyXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRpdGxlU2NyZWVuKCk7XHJcbiAgICAgICAgdGhpcy5wYWNtYW4gPSB7XHJcbiAgICAgICAgICAgIHg6IDY0LFxyXG4gICAgICAgICAgICB5OiA2NCxcclxuICAgICAgICAgICAgZnJhbWU6IDBcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudXBkYXRlUGFjbWFuKCk7XHJcblxyXG4gICAgICAgIC8vIGFuaW1hdGUgdGhlIHNjcmVlbiBvbmNlIGEgc2Vjb25kXHJcbiAgICAgICAgdGhpcy50aXRsZUFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24oe1xyXG4gICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcclxuICAgICAgICAgICAgZnJhbWVzOiBbXHJcbiAgICAgICAgICAgICAgICAoKSA9PiB0aGlzLnVwZGF0ZVRpdGxlU2NyZWVuKClcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBhY21hbkFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24oe1xyXG4gICAgICAgICAgICBkdXJhdGlvbjogMzAsXHJcbiAgICAgICAgICAgIGZyYW1lczogW1xyXG4gICAgICAgICAgICAgICAgKCkgPT4gdGhpcy51cGRhdGVQYWNtYW4oKVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVGl0bGVTY3JlZW4gKCkge1xyXG4gICAgICAgIC8vIGZpbGwgdGhlIHNjcmVlbiB3aXRoIHNxdWlnZ2xlc1xyXG4gICAgICAgIGZvciAobGV0IHk9MDsgeTwzMDsgeSsrKVxyXG4gICAgICAgIGZvciAobGV0IHg9MDsgeDwzMjsgeCsrKSB7XHJcbiAgICAgICAgICAgIHNldE5hbWV0YWJsZSh4LCB5LCBDSVJDTEVfVEwgKyByYW5kSW50KDIpKzIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZmlsbCB0aGUgYXR0cmlidXRlIHRhYmxlIHdpdGggb3JhbmdlXHJcbiAgICAgICAgZm9yIChsZXQgeT0wOyB5PDE1OyB5KyspXHJcbiAgICAgICAgZm9yIChsZXQgeD0wOyB4PDE2OyB4KyspIHtcclxuICAgICAgICAgICAgc2V0QXR0cmlidXRlKHgsIHksIDIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gYWRkIHRoZSB0aXRsZVxyXG4gICAgICAgIGZvciAobGV0IHk9ODsgeTwxMzsgeSsrKVxyXG4gICAgICAgIGZvciAobGV0IHg9ODsgeDwyNDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHNldE5hbWV0YWJsZSh4LCB5LCBCTEFOSyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IHk9NTsgeTw2OyB5KyspXHJcbiAgICAgICAgZm9yIChsZXQgeD01OyB4PDEyOyB4KyspIHtcclxuICAgICAgICAgICAgc2V0QXR0cmlidXRlKHgsIHksIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZXh0KDEwLDEwLCAnSEVMTE8gV09STEQhJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlUGFjbWFuICgpIHtcclxuICAgICAgICBsZXQgeyB4LCB5LCBmcmFtZSB9ID0gdGhpcy5wYWNtYW47XHJcbiAgICAgICAgbGV0IGlkeCA9IFswLDEsMiwzLDIsMV1bZnJhbWVdO1xyXG4gICAgICAgIGxldCBmbGlweCA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBmbGlweSA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh5ID09PSA2NCAmJiB4IDwgMTkyIC0gOCkge1xyXG4gICAgICAgICAgICB4ICs9IDI7XHJcbiAgICAgICAgfSBlbHNlIGlmICh5IDwgMTA0IC04ICYmIHggPiA2NCkge1xyXG4gICAgICAgICAgICBpZHggKz0gNDtcclxuICAgICAgICAgICAgeSArPSAyO1xyXG4gICAgICAgICAgICBmbGlweSA9IGZsaXB4ID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHggPiA2NCkge1xyXG4gICAgICAgICAgICB4IC09IDI7XHJcbiAgICAgICAgICAgIGZsaXB4ID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZHggKz0gNDtcclxuICAgICAgICAgICAgeSAtPSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNwcml0ZU1hbmFnZXIuc2V0U3ByaXRlICgwLCBpZHgsIHgsIHksIGZsaXB4LCBmbGlweSwgZmFsc2UsIDApO1xyXG4gICAgICAgIHRoaXMucGFjbWFuLmZyYW1lID0gKGZyYW1lICsgMSkgJSA2O1xyXG4gICAgICAgIHRoaXMucGFjbWFuLnggPSB4O1xyXG4gICAgICAgIHRoaXMucGFjbWFuLnkgPSB5O1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXIgKCkge1xyXG4gICAgICAgIHNldE1pcnJvcmluZyhIT1JJWk9OVEFMKTtcclxuICAgICAgICBmb3IgKGxldCB5PTA7IHk8NjA7IHkrKylcclxuICAgICAgICBmb3IgKGxldCB4PTA7IHg8MzI7IHgrKykge1xyXG4gICAgICAgICAgICBzZXROYW1ldGFibGUoeCwgeSwgQkxBTkspO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkcmF3ICgpIHtcclxuICAgICAgICBmb3IgKGxldCB5PTA7IHk8MjQwOyB5KyspXHJcbiAgICAgICAgZm9yIChsZXQgeD0wOyB4PDI1NjsgeCsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gZ2V0UGl4ZWwoeCwgeSk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheS5zZXRQaXhlbCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3ByaXRlTWFuYWdlci5kcmF3KCk7XHJcbiAgICAgICAgdGhpcy5kaXNwbGF5LmRyYXcoKTtcclxuICAgIH1cclxufTtcclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgZ2FtZXRpbWUge1xyXG4gICAgY29uc3RydWN0b3IgKHRpbWVzdGFtcCwgZWxhcHNlZCkge1xyXG4gICAgICAgIHRoaXMudGltZXN0YW1wID0gdGltZXN0YW1wIHx8IERhdGUubm93KCk7XHJcbiAgICAgICAgdGhpcy5lbGFwc2VkID0gZWxhcHNlZCB8fCAwO1xyXG4gICAgfVxyXG59OyIsImltcG9ydCBHYW1lIGZyb20gJy4vZ2FtZSc7XHJcbmltcG9ydCAnLi9kYXJrLmNzcyc7XHJcblxyXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7XHJcbmNvbnN0IGdhbWUgPSBuZXcgR2FtZShjYW52YXMpO1xyXG5cclxuY29uc3QgZnBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZwcycpO1xyXG5cclxuZ2FtZS5vblVwZGF0ZSA9ICgpID0+IHtcclxuICAgIGlmIChmcHMpIGZwcy50ZXh0Q29udGVudCA9IGdhbWUuZnBzO1xyXG59O1xyXG5cclxud2luZG93LmdhbWUgPSBnYW1lO1xyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J0blJlc2V0Jykub25jbGljayA9IChlKSA9PiB7XHJcbiAgICBnYW1lLnJlc2V0KCk7XHJcbn07XHJcblxyXG52YXIgaGlkZGVuLCB2aXNpYmlsaXR5Q2hhbmdlOyBcclxuaWYgKHR5cGVvZiBkb2N1bWVudC5oaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHsgLy8gT3BlcmEgMTIuMTAgYW5kIEZpcmVmb3ggMTggYW5kIGxhdGVyIHN1cHBvcnQgXHJcbiAgaGlkZGVuID0gXCJoaWRkZW5cIjtcclxuICB2aXNpYmlsaXR5Q2hhbmdlID0gXCJ2aXNpYmlsaXR5Y2hhbmdlXCI7XHJcbn0gZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50Lm1zSGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgaGlkZGVuID0gXCJtc0hpZGRlblwiO1xyXG4gIHZpc2liaWxpdHlDaGFuZ2UgPSBcIm1zdmlzaWJpbGl0eWNoYW5nZVwiO1xyXG59IGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudC53ZWJraXRIaWRkZW4gIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICBoaWRkZW4gPSBcIndlYmtpdEhpZGRlblwiO1xyXG4gIHZpc2liaWxpdHlDaGFuZ2UgPSBcIndlYmtpdHZpc2liaWxpdHljaGFuZ2VcIjtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSgpIHtcclxuICBpZiAoZG9jdW1lbnRbaGlkZGVuXSkge1xyXG4gICAgZ2FtZS5wYXVzZSgpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBnYW1lLnBsYXkoKTtcclxuICB9XHJcbn1cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIodmlzaWJpbGl0eUNoYW5nZSwgaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSwgZmFsc2UpO1xyXG5cclxuLy8gc3RhcnRcclxuZ2FtZS5yZXNldCgpLnRoZW4oKCkgPT4gZ2FtZS5wbGF5KCkpOyIsIi8vIGltcG9ydCBrZXlldmVudHMgZnJvbSAna2V5LWV2ZW50cyc7XHJcblxyXG4vL2NvbnN0IGtleXMgPSBrZXlldmVudHMoKTtcclxuY29uc3Qga2V5c3RhdGUgPSB7fTtcclxubGV0IGRlYnVnID0gZmFsc2U7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCB7IGtleSwga2V5Q29kZSB9ID0gZXZlbnQ7XHJcbiAgICBpZiAoa2V5c3RhdGVba2V5XSkgcmV0dXJuO1xyXG4gICAga2V5c3RhdGVba2V5XSA9IHRydWU7XHJcbiAgICBpZiAoa2V5ID09PSAnYCcpIGRlYnVnID0gIWRlYnVnO1xyXG4gICAgaWYgKGRlYnVnKSBjb25zb2xlLmxvZyhga2V5ZG93bjogJHtrZXl9YCk7XHJcbn0sIGZhbHNlKTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCB7IGtleSwga2V5Q29kZSB9ID0gZXZlbnQ7XHJcbiAgICBpZiAoa2V5c3RhdGVba2V5XSA9PT0gZmFsc2UpIHJldHVybjtcclxuICAgIGtleXN0YXRlW2tleV0gPSBmYWxzZTtcclxuICAgIGlmIChkZWJ1ZykgY29uc29sZS5sb2coYGtleXVwOiAke2tleX1gKTtcclxufSwgZmFsc2UpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQga2V5c3RhdGU7XHJcbiIsIi8qIDY0IGNvbG9ycyAqL1xyXG5jb25zdCBjb2xvcnMgPSBbXHJcbiAgICAweDdDLCAweDdDLCAweDdDLFxyXG4gICAgMHgwMCwgMHgwMCwgMHhGQyxcclxuICAgIDB4MDAsIDB4MDAsIDB4QkMsXHJcbiAgICAweDQ0LCAweDI4LCAweEJDLFxyXG4gICAgMHg5NCwgMHgwMCwgMHg4NCxcclxuICAgIDB4QTgsIDB4MDAsIDB4MjAsXHJcbiAgICAweEE4LCAweDEwLCAweDAwLFxyXG4gICAgMHg4OCwgMHgxNCwgMHgwMCxcclxuICAgIDB4NTAsIDB4MzAsIDB4MDAsXHJcbiAgICAweDAwLCAweDc4LCAweDAwLFxyXG4gICAgMHgwMCwgMHg2OCwgMHgwMCxcclxuICAgIDB4MDAsIDB4NTgsIDB4MDAsXHJcbiAgICAweDAwLCAweDQwLCAweDU4LFxyXG4gICAgMHgwMCwgMHgwMCwgMHgwMCxcclxuICAgIDB4MDAsIDB4MDAsIDB4MDAsXHJcbiAgICAweDAwLCAweDAwLCAweDAwLFxyXG4gICAgMHhCQywgMHhCQywgMHhCQyxcclxuICAgIDB4MDAsIDB4NzgsIDB4RjgsXHJcbiAgICAweDAwLCAweDU4LCAweEY4LFxyXG4gICAgMHg2OCwgMHg0NCwgMHhGQyxcclxuICAgIDB4RDgsIDB4MDAsIDB4Q0MsXHJcbiAgICAweEU0LCAweDAwLCAweDU4LFxyXG4gICAgMHhGOCwgMHgzOCwgMHgwMCxcclxuICAgIDB4RTQsIDB4NUMsIDB4MTAsXHJcbiAgICAweEFDLCAweDdDLCAweDAwLFxyXG4gICAgMHgwMCwgMHhCOCwgMHgwMCxcclxuICAgIDB4MDAsIDB4QTgsIDB4MDAsXHJcbiAgICAweDAwLCAweEE4LCAweDQ0LFxyXG4gICAgMHgwMCwgMHg4OCwgMHg4OCxcclxuICAgIDB4MDAsIDB4MDAsIDB4MDAsXHJcbiAgICAweDAwLCAweDAwLCAweDAwLFxyXG4gICAgMHgwMCwgMHgwMCwgMHgwMCxcclxuICAgIDB4RjgsIDB4RjgsIDB4RjgsXHJcbiAgICAweDNDLCAweEJDLCAweEZDLFxyXG4gICAgMHg2OCwgMHg4OCwgMHhGQyxcclxuICAgIDB4OTgsIDB4NzgsIDB4RjgsXHJcbiAgICAweEY4LCAweDc4LCAweEY4LFxyXG4gICAgMHhGOCwgMHg1OCwgMHg5OCxcclxuICAgIDB4RjgsIDB4NzgsIDB4NTgsXHJcbiAgICAweEZDLCAweEEwLCAweDQ0LFxyXG4gICAgMHhGOCwgMHhCOCwgMHgwMCxcclxuICAgIDB4QjgsIDB4RjgsIDB4MTgsXHJcbiAgICAweDU4LCAweEQ4LCAweDU0LFxyXG4gICAgMHg1OCwgMHhGOCwgMHg5OCxcclxuICAgIDB4MDAsIDB4RTgsIDB4RDgsXHJcbiAgICAweDc4LCAweDc4LCAweDc4LFxyXG4gICAgMHgwMCwgMHgwMCwgMHgwMCxcclxuICAgIDB4MDAsIDB4MDAsIDB4MDAsXHJcbiAgICAweEZDLCAweEZDLCAweEZDLFxyXG4gICAgMHhBNCwgMHhFNCwgMHhGQyxcclxuICAgIDB4QjgsIDB4QjgsIDB4RjgsXHJcbiAgICAweEQ4LCAweEI4LCAweEY4LFxyXG4gICAgMHhGOCwgMHhCOCwgMHhGOCxcclxuICAgIDB4RjgsIDB4QTQsIDB4QzAsXHJcbiAgICAweEYwLCAweEQwLCAweEIwLFxyXG4gICAgMHhGQywgMHhFMCwgMHhBOCxcclxuICAgIDB4RjgsIDB4RDgsIDB4NzgsXHJcbiAgICAweEQ4LCAweEY4LCAweDc4LFxyXG4gICAgMHhCOCwgMHhGOCwgMHhCOCxcclxuICAgIDB4QjgsIDB4RjgsIDB4RDgsXHJcbiAgICAweDAwLCAweEZDLCAweEZDLFxyXG4gICAgMHhGOCwgMHhEOCwgMHhGOCxcclxuICAgIDB4MDAsIDB4MDAsIDB4MDAsXHJcbiAgICAweDAwLCAweDAwLCAweDAwXHJcbl07XHJcblxyXG4vLyByZXR1cm5zIHJlZCwgYmx1ZSwgb3IgZ3JlZW4gdmFsdWUgZm9yIGEgXHJcbi8vIGNvbG9yIGJldHdlZW4gMHgwMCBhbmQgMHgzZlxyXG4vLyBvZmZzZXRzOiAwLXJlZCwgMS1ncmVlbiwgMi1ibHVlXHJcbmNvbnN0IGdldENvbG9yQnl0ZSA9IChjb2xvciwgb2Zmc2V0KSA9PiB7XHJcbiAgICByZXR1cm4gY29sb3JzW2NvbG9yICogMyArIG9mZnNldF07XHJcbn07XHJcblxyXG5leHBvcnQge1xyXG4gICAgY29sb3JzLFxyXG4gICAgZ2V0Q29sb3JCeXRlXHJcbn07IiwiaW1wb3J0IHtcclxuICAgIGNvbG9ycyxcclxuICAgIGdldENvbG9yQnl0ZVxyXG59IGZyb20gJy4vcGFsZXR0ZSc7XHJcblxyXG4vKipcclxuICogYmdfcGFsZXR0ZV8xOiAwXHJcbiAqIGJnX3BhbGV0dGVfMjogNFxyXG4gKiBiZ19wYWxldHRlXzM6IDhcclxuICogYmdfcGFsZXR0ZV80OiAxMlxyXG4gKiBzcHJpdGVfcGFsXzE6IDE2XHJcbiAqIHNwcml0ZV9wYWxfMjogMjBcclxuICogc3ByaXRlX3BhbF8zOiAyNFxyXG4gKiBzcHJpdGVfcGFsXzQ6IDI4XHJcbiAqL1xyXG5jb25zdCBwYWxldHRlcyA9IG5ldyBVaW50OEFycmF5KDMyKTtcclxuXHJcbi8qXHJcbiAgICAxMjh4MTI4IHBpeGVsc1xyXG4gICAgNCBwaXhlbHMvYnl0ZSxcclxuICAgIDMyeDEyOCA9IDQwOTYgYnl0ZXNcclxuKi9cclxuY29uc3Qgc3ByaXRlVGFibGUgPSBuZXcgVWludDhBcnJheSg0MDk2KTtcclxuY29uc3QgYmFja2dyb3VuZFRhYmxlID0gbmV3IFVpbnQ4QXJyYXkoNDA5Nik7XHJcblxyXG5jb25zdCBuYW1ldGFibGVzID0gbmV3IFVpbnQ4QXJyYXkoMzIqMzAgKiAyKTtcclxuY29uc3QgYXR0cmlidXRlcyA9IG5ldyBVaW50OEFycmF5KDY0ICogMik7XHJcbmNvbnN0IHNwcml0ZVNjYW5saW5lID0gbmV3IFVpbnQ4QXJyYXkoNjQpO1xyXG5cclxuY29uc3QgSE9SSVpPTlRBTCA9IDA7XHJcbmNvbnN0IFZFUlRJQ0FMID0gMTtcclxuXHJcbmNvbnN0IHN0YXRlID0ge1xyXG4gICAgbWlycm9yaW5nOiBIT1JJWk9OVEFMLFxyXG4gICAgc2Nyb2xsOiB7XHJcbiAgICAgICAgeDogMCxcclxuICAgICAgICB5OiAwXHJcbiAgICB9LFxyXG4gICAgY29tbW9uX2JhY2tncm91bmQ6IDB4M2YgLy8gYmxhY2tcclxufTtcclxuXHJcbi8vIDB4MDAtMHgzZlxyXG4vKipcclxuICogU2V0cyB0aGUgY29tbW9uIGJhY2tncm91bmQgTkVTIGNvbG9yXHJcbiAqIEBwYXJhbSB7Kn0gY29sb3IgMHgwMC0weDNmXHJcbiAqL1xyXG5jb25zdCBzZXRDb21tb25CYWNrZ3JvdW5kID0gKGNvbG9yKSA9PiB7XHJcbiAgICBzdGF0ZS5jb21tb25fYmFja2dyb3VuZCA9IGNvbG9yO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0Q29tbW9uQmFja2dyb3VuZCA9ICgpID0+IHN0YXRlLmNvbW1vbl9iYWNrZ3JvdW5kO1xyXG5cclxuLy8gSE9SSVpPTlRBTDowLCBWRVJUSUNBTDoxXHJcbmNvbnN0IHNldE1pcnJvcmluZyA9IChtb2RlKSA9PiB7XHJcbiAgICBzdGF0ZS5taXJyb3JpbmcgPSBtb2RlO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldHMgdGhlIGFtb3VudCBvZiBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBzY3JvbGxpbmcgaW4gcGl4ZWxzXHJcbiAqIEBwYXJhbSB7Kn0geCAwLTUxMlxyXG4gKiBAcGFyYW0geyp9IHkgMC00NzlcclxuICovXHJcbmNvbnN0IHNldFNjcm9sbCA9ICh4LCB5KSA9PiB7XHJcbiAgICBzdGF0ZS5zY3JvbGwueCA9IHggPj0gMCA/IHggOiB4ICsgNTEyO1xyXG4gICAgc3RhdGUuc2Nyb2xsLnkgPSB5ID4gMCA/IHkgOiB5ICsgNDc5O1xyXG59O1xyXG5cclxuLy8gd2l0aCBtaXJyb3JpbmdcclxuLy8gMzIrMzIgeCAzMCszMCA9IDY0eDYwXHJcbi8qKlxyXG4gKiBcclxuICogQHBhcmFtIHsqfSB4IGhvcml6b250YWwgaW5kZXgsIDAtNjNcclxuICogQHBhcmFtIHsqfSB5IHZlcnRpY2FsIGluZGV4LCAwLTU5XHJcbiAqIEBwYXJhbSB7Kn0gdGlsZSB0aWxlIGluZGV4XHJcbiAqL1xyXG5jb25zdCBzZXROYW1ldGFibGUgPSAoeCwgeSwgdGlsZSkgPT4ge1xyXG4gICAgY29uc3QgYWRyID0gZ2V0TmFtZXRhYmxlQWRyKHgsIHkpO1xyXG4gICAgbmFtZXRhYmxlc1thZHJdID0gdGlsZTtcclxufTtcclxuXHJcbi8vIHdpdGggbWlycm9yaW5nXHJcbi8vIDMyKzMyIHggMzArMzAgPSA2NHg2MCB0aWxlc1xyXG4vKipcclxuICogXHJcbiAqIEBwYXJhbSB7Kn0geCBob3Jpem9udGFsIGluZGV4LCAwLTYzXHJcbiAqIEBwYXJhbSB7Kn0geSB2ZXJ0aWNhbCBpbmRleCwgMC01OVxyXG4gKiBAcmV0dXJucyBhIHJlc29sdmVkIG5hbWV0YWJsZSBhZGRyZXNzIG9mZnNldCwgMCAtIDB4MDc4MFxyXG4gKi9cclxuY29uc3QgZ2V0TmFtZXRhYmxlQWRyID0gKHgsIHkpID0+IHtcclxuICAgIGNvbnN0IFggPSB4ICUgMzI7IC8vIHggaXMgZWl0aGVyIDAtMzEgb3IgMC02M1xyXG4gICAgY29uc3QgWSA9IChzdGF0ZS5taXJyb3JpbmcgPT0gSE9SSVpPTlRBTCkgP1xyXG4gICAgICAgIHkgOiAoeSAlIDMwKSA8PCAoeCA+PiA1KTtcclxuXHJcbiAgICAvLyBYLFkgPSAzMng2MFxyXG4gICAgcmV0dXJuIFkgKiAzMiArIFg7XHJcbn07XHJcblxyXG4vLyB3aXRoIG1pcnJvcmluZ1xyXG4vLyAxNisxNiB4IDE1KzE1ID0gMzJ4MzBcclxuLy8gcGFsZXR0ZSAwLTNcclxuLyoqXHJcbiAqIFNldHMgdGhlIHBhbGV0dGUgZm9yIGEgMngyIGFyZWEgb2YgdGlsZXNcclxuICogQHBhcmFtIHsqfSB4IGhvcml6b250YWwgYXR0cmlidXRlIGluZGV4LCAwLTMxXHJcbiAqIEBwYXJhbSB7Kn0geSB2ZXJ0aWNhbCBhdHRyaWJ1dGUgaW5kZXgsIDAtMjlcclxuICogQHBhcmFtIHsqfSBwYWxldHRlIHBhbGV0dGUgbnVtYmVyLCAwLTNcclxuICovXHJcbmNvbnN0IHNldEF0dHJpYnV0ZSA9ICh4LCB5LCBwYWxldHRlKSA9PiB7XHJcbiAgICBjb25zdCBhZHIgPSBnZXRBdHRyaWJ1dGVBZHIoeCwgeSk7XHJcbiAgICBjb25zdCBvZmZzZXQgPSBnZXRBdHRyaWJ1dGVPZmZzZXQoeCwgeSk7XHJcbiAgICBjb25zdCBjdXJyZW50X3ZhbHVlID0gYXR0cmlidXRlc1thZHJdO1xyXG4gICAgY29uc3QgbWFzayA9IH4oMHgwMyA8PCBvZmZzZXQpO1xyXG4gICAgY29uc3QgdmFsdWUgPSAocGFsZXR0ZSAmIDB4MDMpIDw8IG9mZnNldDtcclxuICAgIGF0dHJpYnV0ZXNbYWRyXSA9IChjdXJyZW50X3ZhbHVlICYgbWFzaykgfCB2YWx1ZTtcclxufTtcclxuXHJcbmNvbnN0IGdldEF0dHJpYnV0ZUFkciA9ICh4LCB5KSA9PiB7XHJcbiAgICBjb25zdCBYID0geCAlIDE2O1xyXG4gICAgbGV0IFkgPSAoc3RhdGUubWlycm9yaW5nID09IEhPUklaT05UQUwpID9cclxuICAgICAgICB5IDogKHkgJSAxNSkgPDwgKHggPj4gNCk7XHJcblxyXG4gICAgLy8gdGhlIGJvdHRvbSByb3cgZG9lcyBub3QgaGF2ZSBhdHRyaWJ1dGVzIGMgb3IgZFxyXG4gICAgaWYgKFkgPiAxNCkgWSsrO1xyXG5cclxuICAgIC8vIFgsWSA9IDE2eDMwXHJcbiAgICAvLyBCWCxCWSA9IDh4MTVcclxuICAgIGNvbnN0IEJYID0gWCA+PiAxO1xyXG4gICAgY29uc3QgQlkgPSBZID4+IDE7XHJcbiAgICByZXR1cm4gQlkgKiA4ICsgQlg7XHJcbn07XHJcblxyXG5jb25zdCBnZXRBdHRyaWJ1dGVPZmZzZXQgPSAoeCwgeSkgPT4ge1xyXG4gICAgY29uc3QgWCA9IHggJSAxNjtcclxuICAgIGxldCBZID0gKHN0YXRlLm1pcnJvcmluZyA9PSBIT1JJWk9OVEFMKSA/XHJcbiAgICAgICAgeSA6ICh5ICUgMTUpIDw8ICh4ID4+IDQpO1xyXG5cclxuICAgIC8vIHRoZSBib3R0b20gcm93IGRvZXMgbm90IGhhdmUgYXR0cmlidXRlcyBjIG9yIGRcclxuICAgIGlmIChZID4gMTQpIFkrKztcclxuXHJcbiAgICBjb25zdCBzaGlmdFggPSAoWCAlIDIpIDw8IDE7XHJcbiAgICBjb25zdCBzaGlmdFkgPSAoWSAlIDIpIDw8IDI7XHJcbiAgICByZXR1cm4gc2hpZnRYIDw8IHNoaWZ0WTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBcclxuICogQHBhcmFtIHsqfSBpZHggcGFsZXR0ZSBpbmRleCAwLTNcclxuICogQHBhcmFtIHsqfSBjMCBjb2xvciAwOiBjb21tb24gYmFja2dyb3VuZFxyXG4gKiBAcGFyYW0geyp9IGMxIGNvbG9yIDFcclxuICogQHBhcmFtIHsqfSBjMiBjb2xvciAyXHJcbiAqIEBwYXJhbSB7Kn0gYzMgY29sb3IgM1xyXG4gKi9cclxuY29uc3Qgc2V0QmdQYWxldHRlID0gKGlkeCwgYzAsIGMxLCBjMiwgYzMpID0+IHtcclxuICAgIHBhbGV0dGVzW2lkeCAqIDQgKyAwXSA9IGMwO1xyXG4gICAgcGFsZXR0ZXNbaWR4ICogNCArIDFdID0gYzE7XHJcbiAgICBwYWxldHRlc1tpZHggKiA0ICsgMl0gPSBjMjtcclxuICAgIHBhbGV0dGVzW2lkeCAqIDQgKyAzXSA9IGMzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFxyXG4gKiBAcGFyYW0geyp9IGlkeCAwLTNcclxuICogQHBhcmFtIHsqfSBjb2xvcnMgW2MwLCBjMSwgYzIsIGMzXVxyXG4gKi9cclxuY29uc3Qgc2V0U3ByaXRlUGFsZXR0ZSA9IChpZHgsIGMwLCBjMSwgYzIsIGMzKSA9PiB7XHJcbiAgICBwYWxldHRlc1sxNiArIGlkeCAqIDQgKyAwXSA9IGMwO1xyXG4gICAgcGFsZXR0ZXNbMTYgKyBpZHggKiA0ICsgMV0gPSBjMTtcclxuICAgIHBhbGV0dGVzWzE2ICsgaWR4ICogNCArIDJdID0gYzI7XHJcbiAgICBwYWxldHRlc1sxNiArIGlkeCAqIDQgKyAzXSA9IGMzO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0QmdDb2xvciA9IChpZHgsIGNvbG9ySWR4KSA9PiB7XHJcbiAgICByZXR1cm4gcGFsZXR0ZXNbaWR4ICogNCArIGNvbG9ySWR4XTtcclxufTtcclxuXHJcbmNvbnN0IGdldFNwcml0ZUNvbG9yID0gKGlkeCwgY29sb3JJZHgpID0+IHtcclxuICAgIHJldHVybiBwYWxldHRlc1sxNiArIGlkeCAqIDQgKyBjb2xvcklkeF07XHJcbn07XHJcblxyXG4vKiogU2V0cyBzcHJpdGUgcGl4ZWwgZGF0YSBmb3IgYSBzaW5nbGUgYnl0ZSAqL1xyXG5jb25zdCBzZXRTcHJpdGVEYXRhID0gKGFkciwgdmFsdWUpID0+IHtcclxuICAgIHNwcml0ZVRhYmxlW2Fkcl0gPSB2YWx1ZTtcclxufTtcclxuXHJcbi8qKiBTZXRzIGJhY2tncm91bmQgdGlsZSBwaXhlbCBkYXRhIGZvciBhIHNpbmdsZSBieXRlKi9cclxuY29uc3Qgc2V0QmFja2dyb3VuZERhdGEgPSAoYWRyLCB2YWx1ZSkgPT4ge1xyXG4gICAgYmFja2dyb3VuZFRhYmxlW2Fkcl0gPSB2YWx1ZTtcclxufTtcclxuXHJcbmNvbnN0IGdldEF0dHJpYnV0ZSA9ICh0aWxleCwgdGlsZXkpID0+IHtcclxuICAgIGNvbnN0IHggPSB0aWxleCA+PiAxO1xyXG4gICAgY29uc3QgeSA9IHRpbGV5ID4+IDE7XHJcbiAgICBjb25zdCBhZHIgPSBnZXRBdHRyaWJ1dGVBZHIoeCwgeSk7XHJcbiAgICBjb25zdCBvZmZzZXQgPSBnZXRBdHRyaWJ1dGVPZmZzZXQoeCwgeSk7XHJcbiAgICByZXR1cm4gKGF0dHJpYnV0ZXNbYWRyXSA+PiBvZmZzZXQpICYgMHgwMztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBHZXRzIHRoZSB0aWxlIG51bWJlciBmb3IgYSBzY3JlZW4tc3BhY2UgdGlsZWQgb2Zmc2V0XHJcbiAqIEBwYXJhbSB7Kn0gdGlsZXggMC02M1xyXG4gKiBAcGFyYW0geyp9IHRpbGV5IDAtNTlcclxuICovXHJcbmNvbnN0IGdldFRpbGUgPSAodGlsZXgsIHRpbGV5KSA9PiB7XHJcbiAgICBjb25zdCBhZHIgPSBnZXROYW1ldGFibGVBZHIodGlsZXgsIHRpbGV5KTtcclxuICAgIHJldHVybiBuYW1ldGFibGVzW2Fkcl07XHJcbn07XHJcblxyXG4vLyBpZHg6IDAtMjU1XHJcbi8vIHBpeGVseDogMC03XHJcbi8vIHBpeGVseTogMC03XHJcbi8vIHJldHVybnMgY29sb3IgMC0zXHJcbmNvbnN0IGdldFRpbGVQaXhlbCA9IChpZHgsIHBpeGVseCwgcGl4ZWx5KSA9PiB7XHJcbiAgICAvLyAxMjh4MTI4IHBpeGVsc1xyXG4gICAgLy8gMTYsIDh4OCBwaXhlbCB0aWxlcyBwZXIgcm93XHJcbiAgICAvLyA0IHBpeGVscyBwZXIgYnl0ZS4gMzIgYnl0ZXMgcGVyIHJvd1xyXG4gICAgLy8gMiBieXRlcyBwZXIgcm93IG9mIHBpeGVscyBwZXIgc3ByaXRlXHJcblxyXG4gICAgY29uc3QgdG9wX2xlZnQgPSAoKGlkeCA+PiA0KSAqIDI1NikgKyAoKGlkeCAlIDE2KSAqIDIpO1xyXG4gICAgY29uc3QgYWRyID0gdG9wX2xlZnQgKyAocGl4ZWx5ICogMzIpICsgKHBpeGVseCA+PiAyKTtcclxuICAgIGNvbnN0IGRhdGEgPSBiYWNrZ3JvdW5kVGFibGVbYWRyXTtcclxuICAgIGNvbnN0IG9mZnNldCA9IDYgLSAoKHBpeGVseCAlIDQpICogMik7XHJcbiAgICBjb25zdCBjb2xvciA9IChkYXRhID4+IG9mZnNldCkgJiAweDAzO1xyXG4gICAgcmV0dXJuIGNvbG9yO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEdldHMgdGhlIGJhY2tncm91bmQgcGl4ZWwgY29sb3IgdmFsdWVcclxuICogQHBhcmFtIHsqfSBzY3JlZW54IHBpeGVsIDAtMjU1XHJcbiAqIEBwYXJhbSB7Kn0gc2NyZWVueSBwaXhlbCAwLTIzOVxyXG4gKiBAcmV0dXJucyBORVMgY29sb3JcclxuICovXHJcbmNvbnN0IGdldFBpeGVsID0gKHNjcmVlbngsIHNjcmVlbnkpID0+IHtcclxuICAgIGNvbnN0IHggPSAoc2NyZWVueCArIHN0YXRlLnNjcm9sbC54KSAlIDUxMjtcclxuICAgIGlmICh4IDwgMCkgeCArPSA1MTI7XHJcbiAgICBjb25zdCB5ID0gKHNjcmVlbnkgKyBzdGF0ZS5zY3JvbGwueSkgJSA0ODA7XHJcbiAgICBpZiAoeSA8IDApIHkgKz0gNDgwO1xyXG5cclxuICAgIGNvbnN0IHRpbGV4ID0geCA+PiAzOyAvLyAwLTMxICgwLTYzKVxyXG4gICAgY29uc3QgdGlsZXkgPSB5ID4+IDM7IC8vIDAtMjkgKDAtNTkpXHJcblxyXG4gICAgY29uc3QgdGlsZSA9IGdldFRpbGUodGlsZXgsIHRpbGV5KTtcclxuICAgIGNvbnN0IHBhbGV0dGUgPSBnZXRBdHRyaWJ1dGUodGlsZXgsIHRpbGV5KTtcclxuXHJcbiAgICBjb25zdCB0aWxlX3BpeGVsX3ggPSB4ICUgODtcclxuICAgIGNvbnN0IHRpbGVfcGl4ZWxfeSA9IHkgJSA4O1xyXG4gICAgY29uc3QgY29sb3IgPSBnZXRUaWxlUGl4ZWwodGlsZSwgdGlsZV9waXhlbF94LCB0aWxlX3BpeGVsX3kpXHJcblxyXG4gICAgcmV0dXJuIGNvbG9yID09PSAwID8gXHJcbiAgICAgICAgc3RhdGUuY29tbW9uX2JhY2tncm91bmQgOlxyXG4gICAgICAgIGdldEJnQ29sb3IocGFsZXR0ZSwgY29sb3IpO1xyXG59O1xyXG5cclxuXHJcblxyXG4vLyBpZHg6IDAtMjU1XHJcbi8vIHBpeGVseDogMC03XHJcbi8vIHBpeGVseTogMC03XHJcbi8vIHJldHVybnMgY29sb3IgMC0zXHJcbmNvbnN0IGdldFNwcml0ZVBpeGVsID0gKGlkeCwgcGl4ZWx4LCBwaXhlbHkpID0+IHtcclxuICAgIC8vIDEyOHgxMjggcGl4ZWxzXHJcbiAgICAvLyAxNiwgOHg4IHBpeGVsIHRpbGVzIHBlciByb3dcclxuICAgIC8vIDQgcGl4ZWxzIHBlciBieXRlLiAzMiBieXRlcyBwZXIgcm93XHJcbiAgICAvLyAyIGJ5dGVzIHBlciByb3cgb2YgcGl4ZWxzIHBlciBzcHJpdGVcclxuXHJcbiAgICBjb25zdCB0b3BfbGVmdCA9ICgoaWR4ID4+IDUpICogMjU2KSArICgoaWR4ICUgMTYpICogMik7XHJcbiAgICBjb25zdCBhZHIgPSB0b3BfbGVmdCArIChwaXhlbHkgKiAzMikgKyAocGl4ZWx4ID4+IDIpO1xyXG4gICAgY29uc3QgZGF0YSA9IHNwcml0ZVRhYmxlW2Fkcl07XHJcbiAgICBjb25zdCBvZmZzZXQgPSA2IC0gKChwaXhlbHggJSA0KSAqIDIpO1xyXG4gICAgY29uc3QgY29sb3IgPSAoZGF0YSA+PiBvZmZzZXQpICYgMHgwMztcclxuICAgIHJldHVybiBjb2xvcjtcclxufTtcclxuXHJcbmNvbnN0IGRyYXcgPSAoKSA9PiB7XHJcblxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgSE9SSVpPTlRBTCxcclxuICAgIFZFUlRJQ0FMLFxyXG4gICAgc2V0Q29tbW9uQmFja2dyb3VuZCxcclxuICAgIGdldENvbW1vbkJhY2tncm91bmQsXHJcbiAgICBzZXRNaXJyb3JpbmcsXHJcbiAgICBzZXRTY3JvbGwsXHJcbiAgICBzZXROYW1ldGFibGUsICAgICAgLy8gc2V0cyB0aGUgdGlsZSBpbmRleCBmb3IgYSBuYW1ldGFibGUgZW50cnlcclxuICAgIHNldEF0dHJpYnV0ZSwgICAgICAvLyBzZXRzIHRoZSBwYWxldHRlIGZvciBhbiBhdHRyaWJ1dGUgZW50cnlcclxuICAgIGdldEJnQ29sb3IsXHJcbiAgICBnZXRTcHJpdGVDb2xvcixcclxuICAgIHNldEJnUGFsZXR0ZSxcclxuICAgIHNldFNwcml0ZVBhbGV0dGUsXHJcbiAgICBzZXRTcHJpdGVEYXRhLCAgICAgLy8gd3JpdGVzIHBpeGVsIGRhdGEgdG8gdGhlIHRpbGUgc2hlZXRcclxuICAgIHNldEJhY2tncm91bmREYXRhLCAvLyB3cml0ZXMgcGl4ZWwgZGF0YSB0byB0aGUgdGlsZSBzaGVldFxyXG4gICAgZ2V0UGl4ZWwsXHJcbiAgICBnZXRTcHJpdGVQaXhlbFxyXG59OyIsImV4cG9ydCBjb25zdCBTUFJJVEVfRkxJUF9YID0gMHg4MDtcclxuZXhwb3J0IGNvbnN0IFNQUklURV9GTElQX1kgPSAweDQwO1xyXG5leHBvcnQgY29uc3QgU1BSSVRFX1BSSU9SSVRZID0gMHgyMDtcclxuZXhwb3J0IGNvbnN0IFNQUklURV9QQUxFVFRFID0gMHgwMztcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRBdHRyaWJ1dGVCeXRlID0gKGZsaXB4LCBmbGlweSwgcHJpb3JpdHksIHBhbGV0dGUpID0+IHtcclxuICAgIHJldHVybiAoZmxpcHggPDwgNykgfCAoZmxpcHkgPDwgNikgfCAocHJpb3JpdHkgPDwgNSkgfCAocGFsZXR0ZSAmIDB4MDMpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgU1BSSVRFX0ZMSVBfWCxcclxuICAgIFNQUklURV9GTElQX1ksXHJcbiAgICBTUFJJVEVfUFJJT1JJVFksXHJcbiAgICBTUFJJVEVfUEFMRVRURSxcclxuICAgIGdldEF0dHJpYnV0ZUJ5dGVcclxufTtcclxuIiwiaW1wb3J0IHtcclxuICAgIFNQUklURV9GTElQX1gsXHJcbiAgICBTUFJJVEVfRkxJUF9ZLFxyXG4gICAgU1BSSVRFX1BSSU9SSVRZLFxyXG4gICAgU1BSSVRFX1BBTEVUVEUsXHJcbiAgICBnZXRBdHRyaWJ1dGVCeXRlXHJcbn0gZnJvbSAnLi9zcHJpdGVBdHRyaWJ1dGVzJztcclxuaW1wb3J0IHBwdSBmcm9tICcuL3BwdSc7XHJcblxyXG4vLyA2NCBzcHJpdGVzLCA0IGJ5dGVzIGVhY2hcclxuLypcclxuICAgIDA6IGluZGV4XHJcbiAgICAxOiBzY3JlZW4geFxyXG4gICAgMjogc2NyZWVuIHlcclxuICAgIDM6IGF0dHJpYnV0ZXNcclxuICAgICAgICA3OiAgZmxpcCB4XHJcbiAgICAgICAgNjogIGZsaXAgeVxyXG4gICAgICAgIDU6ICBwcmlvcml0eVxyXG4gICAgICAgIDEwOiBwYWxldHRlXHJcbiovXHJcblxyXG5jbGFzcyBTcHJpdGVNYW5hZ2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKGRpc3BsYXkpIHtcclxuICAgICAgICB0aGlzLmRpc3BsYXkgPSBkaXNwbGF5O1xyXG4gICAgICAgIHRoaXMuc3ByaXRlcyA9IG5ldyBVaW50OEFycmF5KDY0ICogNCk7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyAoKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPDY0OyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgeSA9IHRoaXMuc3ByaXRlc1tpKjQgKyAyXTtcclxuICAgICAgICAgICAgaWYgKHkgPiAyNDApIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5zcHJpdGVzW2kqNCArIDFdO1xyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuc3ByaXRlc1tpKjQgKyAwXTtcclxuICAgICAgICAgICAgY29uc3QgYXR0cnMgPSB0aGlzLnNwcml0ZXNbaSo0ICsgM107XHJcblxyXG4gICAgICAgICAgICBjb25zdCBmbGlwWCA9IChhdHRycyAmIFNQUklURV9GTElQX1gpID4gMDtcclxuICAgICAgICAgICAgY29uc3QgZmxpcFkgPSAoYXR0cnMgJiBTUFJJVEVfRkxJUF9ZKSA+IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHByaW9yaXR5ID0gKGF0dHJzICYgU1BSSVRFX1BSSU9SSVRZKSA+IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhbGV0dGUgPSBhdHRycyAmIFNQUklURV9QQUxFVFRFO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5kcmF3U3ByaXRlKGluZGV4LCB4LCB5LCBmbGlwWCwgZmxpcFksIHByaW9yaXR5LCBwYWxldHRlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGRyYXdTcHJpdGUgKGluZGV4LCB4LCB5LCBmbGlwWCwgZmxpcFksIHByaW9yaXR5LCBwYWxldHRlKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgcGk9MDsgcGk8ODsgcGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBweCA9IGZsaXBYID8gNy1waSA6IHBpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwaj0wOyBwajw4OyBwaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBweSA9IGZsaXBZID8gNy1waiA6IHBqO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwcmlvcml0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJnID0gcHB1LmdldFBpeGVsKHgrcGksIHkrcGopO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChiZyAhPT0gcHB1LmdldENvbW1vbkJhY2tncm91bmQpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIHNwcml0ZSB0YWJsZSBmb3IgcGl4ZWwgdmFsdWVcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gcHB1LmdldFNwcml0ZVBpeGVsKGluZGV4LCBweCwgcHkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbG9yID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpc3BsYXlDb2xvciA9IHBwdS5nZXRTcHJpdGVDb2xvcihwYWxldHRlLCBjb2xvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5LnNldFBpeGVsKHggKyBwaSwgeSArIHBqLCBkaXNwbGF5Q29sb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldFNwcml0ZSAoaSwgaW5kZXgsIHgsIHksIGZsaXBYLCBmbGlwWSwgcHJpb3JpdHksIHBhbGV0dGUpIHtcclxuICAgICAgICB0aGlzLnNwcml0ZXNbaSo0ICsgMF0gPSAweGZmICYgaW5kZXg7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVzW2kqNCArIDFdID0gMHhmZiAmIHg7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVzW2kqNCArIDJdID0gMHhmZiAmIHk7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVzW2kqNCArIDNdID0gZ2V0QXR0cmlidXRlQnl0ZShmbGlwWCwgZmxpcFksIHByaW9yaXR5LCBwYWxldHRlKTtcclxuICAgIH07XHJcblxyXG4gICAgY2xlYXJTcHJpdGUgKGkpIHtcclxuICAgICAgICB0aGlzLnNwcml0ZXNbaSo0ICsgMF0gPSAweGZmO1xyXG4gICAgICAgIHRoaXMuc3ByaXRlc1tpKjQgKyAxXSA9IDB4ZmY7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVzW2kqNCArIDJdID0gMHhmZjtcclxuICAgICAgICB0aGlzLnNwcml0ZXNbaSo0ICsgM10gPSAweGZmO1xyXG4gICAgfTtcclxuXHJcbiAgICBjbGVhclNwcml0ZXMgKCkge1xyXG4gICAgICAgIGZvciAodmFyIGk9MDsgaTw2NDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xlYXJTcHJpdGUoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU3ByaXRlTWFuYWdlcjtcclxuIiwiaW1wb3J0IHBwdSBmcm9tICcuL3BwdSc7XHJcbmNvbnN0IHsgc2V0TmFtZXRhYmxlIH0gPSBwcHU7XHJcblxyXG5jb25zdCBjaGFyYWN0ZXJzPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMDEyMzQ1Njc4OTohJCcuPyBcIjtcclxuY29uc3QgdW5rbm93biA9IGNoYXJhY3RlcnMuaW5kZXhPZignPycpO1xyXG5jb25zdCB0ZXh0ID0gKHRpbGV4LCB0aWxleSwgc3RyKSA9PiB7XHJcbiAgICBjb25zdCB1cHBlciA9IHN0ci50b1VwcGVyQ2FzZSgpO1xyXG4gICAgZm9yIChsZXQgaT0wOyBpPHVwcGVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgY2hhciA9IHVwcGVyLmNoYXJBdChpKTtcclxuICAgICAgICBsZXQgdGlsZSA9IGNoYXJhY3RlcnMuaW5kZXhPZihjaGFyKTtcclxuICAgICAgICBpZiAodGlsZSA8IDApIHRpbGUgPSB1bmtub3duO1xyXG4gICAgICAgIHNldE5hbWV0YWJsZSh0aWxleCArIGksIHRpbGV5LCB0aWxlKTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHRleHQ7Il0sInNvdXJjZVJvb3QiOiIifQ==