(function (f) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = f();
  } else if (typeof define === 'function' && define.amd) {
    define([], f);
  } else {
    var g;

    if (typeof window !== 'undefined') {
      g = window;
    } else if (typeof global !== 'undefined') {
      g = global;
    } else if (typeof self !== 'undefined') {
      g = self;
    } else {
      g = this;
    }

    g.Chart = f();
  }
})
(function () {
  var define;
  var module;
  var exports;

  return (function e(t,n,r) {
    function s(o,u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require === 'function' && require;

          if (!u&&a) return a(o, !0);
          if (i) return i(o, !0);

          var f = new Error('Cannot find module "' + o + '"');

          throw f.code = 'MODULE_NOT_FOUND', f
        }

      var l = n[o] = { exports: {} };

      t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];

        return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }

    return n[o].exports;
  }

  var i = typeof require === 'function' && require;

  for (var o = 0; o < r.length; o++) s(r[o]);

  return s;
})
({
1:[function (require, module, exports) {}, {}],
2:[function (require, module, exports) {

var colorNames = require(6);

module.exports = {
   getRgba: getRgba,
   getHsla: getHsla,
   getRgb: getRgb,
   getHsl: getHsl,
   getHwb: getHwb,
   getAlpha: getAlpha,
   hexString: hexString,
   rgbString: rgbString,
   rgbaString: rgbaString,
   percentString: percentString,
   percentaString: percentaString,
   hslString: hslString,
   hslaString: hslaString,
   hwbString: hwbString,
   keyword: keyword
};

function getRgba (string) {
  if (!string) return;

  var abbr = /^#([a-fA-F0-9]{3})$/;
  var hex = /^#([a-fA-F0-9]{6})$/;
  var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
  var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
  var keyword = /(\w+)/;
  var rgb = [0, 0, 0];
  var a = 1;
  var i = 0;
  var match = string.match(abbr);

  if (match) {
    match = match[1];

    for (i = 0; i < rgb.length; i++) {
      rgb[i] = parseInt(match[i] + match[i], 16);
    }
  } else if (match = string.match(hex)) {
    match = match[1];

    for (i = 0; i < rgb.length; i++) {
      rgb[i] = parseInt(match.slice(i * 2, i * 2 + 2), 16);
    }
  }
  else if (match = string.match(rgba)) {
    for (i = 0; i < rgb.length; i++) {
      rgb[i] = parseInt(match[i + 1]);
    }

    a = parseFloat(match[4]);
  } else if (match = string.match(per)) {
    for (i = 0; i < rgb.length; i++) {
      rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
    }

    a = parseFloat(match[4]);
  } else if (match = string.match(keyword)) {
    if (match[1] === 'transparent') return [0, 0, 0, 0];

    rgb = colorNames[match[1]];

    if (!rgb) return;
  }

  for (i = 0; i < rgb.length; i++) {
    rgb[i] = scale(rgb[i], 0, 255);
  }

  if (!a && a !== 0) {
    a = 1;
  } else {
    a = scale(a, 0, 1);
  }

  rgb[3] = a;
  return rgb;
}

function getHsla(string) {
  if (!string) return;

  var hsl = /^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
  var match = string.match(hsl);

  if (match) {
    var alpha = parseFloat(match[4]);
    var h = scale(parseInt(match[1]), 0, 360);
    var s = scale(parseFloat(match[2]), 0, 100);
    var l = scale(parseFloat(match[3]), 0, 100);
    var a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);

    return [h, s, l, a];
  }
}

function getHwb(string) {
  if (!string) return;

  var hwb = /^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
  var match = string.match(hwb);

  if (match) {
    var alpha = parseFloat(match[4]);
    var h = scale(parseInt(match[1]), 0, 360);
    var w = scale(parseFloat(match[2]), 0, 100);
    var b = scale(parseFloat(match[3]), 0, 100);
    var a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);

    return [h, w, b, a];
  }
}

function getRgb(string) {
   var rgba = getRgba(string);

   return rgba && rgba.slice(0, 3);
}

function getHsl(string) {
  var hsla = getHsla(string);

  return hsla && hsla.slice(0, 3);
}

function getAlpha(string) {
  var vals = getRgba(string);

  if (vals) {
    return vals[3];
  } else if (vals = getHsla(string)) {
    return vals[3];
  } else if (vals = getHwb(string)) {
    return vals[3];
  }
}

function hexString(rgb) {
  return "#" +
    hexDouble(rgb[0]) +
    hexDouble(rgb[1]) +
    hexDouble(rgb[2]);
}

function rgbString(rgba, alpha) {
  if (alpha < 1 || (rgba[3] && rgba[3] < 1)) return rgbaString(rgba, alpha);

  return 'rgb(' + rgba[0] + ', ' + rgba[1] + ', ' + rgba[2] + ')';
}

function rgbaString(rgba, alpha) {
  if (alpha === undefined) {
    alpha = (rgba[3] !== undefined ? rgba[3] : 1);
  }

  return 'rgba(' + rgba[0] + ', ' + rgba[1] + ', ' + rgba[2] + ', ' + alpha + ')';
}

function percentString(rgba, alpha) {
  if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
    return percentaString(rgba, alpha);
  }

  var r = Math.round(rgba[0]/255 * 100);
  var g = Math.round(rgba[1]/255 * 100);
  var b = Math.round(rgba[2]/255 * 100);

  return 'rgb(' + r + '%, ' + g + '%, ' + b + '%)';
}

function percentaString(rgba, alpha) {
  var r = Math.round(rgba[0]/255 * 100);
  var g = Math.round(rgba[1]/255 * 100);
  var b = Math.round(rgba[2]/255 * 100);

  return 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + (alpha || rgba[3] || 1) + ')';
}

function hslString(hsla, alpha) {
  if (alpha < 1 || (hsla[3] && hsla[3] < 1)) {
    return hslaString(hsla, alpha);
  }

  return 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)';
}

function hslaString(hsla, alpha) {
  if (alpha === undefined) {
    alpha = (hsla[3] !== undefined ? hsla[3] : 1);
  }

  return 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + alpha + ')';
}

function hwbString(hwb, alpha) {
  if (alpha === undefined) {
    alpha = (hwb[3] !== undefined ? hwb[3] : 1);
  }

  return 'hwb(' + hwb[0] + ', ' + hwb[1] + '%, ' + hwb[2] + '%' + (alpha !== undefined && alpha !== 1 ? ', ' + alpha : '') + ')';
}

function keyword(rgb) {
  return reverseNames[rgb.slice(0, 3)];
}

function scale(num, min, max) {
   return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
  var str = num.toString(16).toUpperCase();
  return (str.length < 2) ? '0' + str : str;
}

var reverseNames = {};
for (var name in colorNames) {
   reverseNames[colorNames[name]] = name;
}

}, { "6" : 6 }],
3:[function (require, module, exports) {

var convert = require(5);
var string = require(2);

var Color = function (obj) {
  if (obj instanceof Color) return obj;
  if (!(this instanceof Color)) return new Color(obj);

  this.values = {
    rgb: [0, 0, 0],
    hsl: [0, 0, 0],
    hsv: [0, 0, 0],
    hwb: [0, 0, 0],
    cmyk: [0, 0, 0, 0],
    alpha: 1
  };

  var vals;

  if (typeof obj === 'string') {
    vals = string.getRgba(obj);

    if (vals) {
      this.setValues('rgb', vals);
    } else if (vals = string.getHsla(obj)) {
      this.setValues('hsl', vals);
    } else if (vals = string.getHwb(obj)) {
      this.setValues('hwb', vals);
    } else {
      throw new Error('Unable to parse color from string "' + obj + '"');
    }
  } else if (typeof obj === 'object') {
    vals = obj;

    if (vals.r !== undefined || vals.red !== undefined) {
      this.setValues('rgb', vals);
    } else if (vals.l !== undefined || vals.lightness !== undefined) {
      this.setValues('hsl', vals);
    } else if (vals.v !== undefined || vals.value !== undefined) {
      this.setValues('hsv', vals);
    } else if (vals.w !== undefined || vals.whiteness !== undefined) {
      this.setValues('hwb', vals);
    } else if (vals.c !== undefined || vals.cyan !== undefined) {
      this.setValues('cmyk', vals);
    } else {
      throw new Error('Unable to parse color from object ' + JSON.stringify(obj));
    }
  }
};

Color.prototype = {
  rgb: function () {
    return this.setSpace('rgb', arguments);
  },
  hsl: function () {
    return this.setSpace('hsl', arguments);
  },
  hsv: function () {
    return this.setSpace('hsv', arguments);
  },
  hwb: function () {
    return this.setSpace('hwb', arguments);
  },
  cmyk: function () {
    return this.setSpace('cmyk', arguments);
  },
  rgbArray: function () {
    return this.values.rgb;
  },
  hslArray: function () {
    return this.values.hsl;
  },
  hsvArray: function () {
    return this.values.hsv;
  },
  hwbArray: function () {
    var values = this.values;
    if (values.alpha !== 1) {
      return values.hwb.concat([values.alpha]);
    }
    return values.hwb;
  },
  cmykArray: function () {
    return this.values.cmyk;
  },
  rgbaArray: function () {
    var values = this.values;
    return values.rgb.concat([values.alpha]);
  },
  hslaArray: function () {
    var values = this.values;
    return values.hsl.concat([values.alpha]);
  },
  alpha: function (val) {
    if (val === undefined) return this.values.alpha;
    this.setValues('alpha', val);
    return this;
  },
  red: function (val) {
    return this.setChannel('rgb', 0, val);
  },
  green: function (val) {
    return this.setChannel('rgb', 1, val);
  },
  blue: function (val) {
    return this.setChannel('rgb', 2, val);
  },
  hue: function (val) {
    if (val) {
      val %= 360;
      val = val < 0 ? 360 + val : val;
    }

    return this.setChannel('hsl', 0, val);
  },
  saturation: function (val) {
    return this.setChannel('hsl', 1, val);
  },
  lightness: function (val) {
    return this.setChannel('hsl', 2, val);
  },
  saturationv: function (val) {
    return this.setChannel('hsv', 1, val);
  },
  whiteness: function (val) {
    return this.setChannel('hwb', 1, val);
  },
  blackness: function (val) {
    return this.setChannel('hwb', 2, val);
  },
  value: function (val) {
    return this.setChannel('hsv', 2, val);
  },
  cyan: function (val) {
    return this.setChannel('cmyk', 0, val);
  },
  magenta: function (val) {
    return this.setChannel('cmyk', 1, val);
  },
  yellow: function (val) {
    return this.setChannel('cmyk', 2, val);
  },
  black: function (val) {
    return this.setChannel('cmyk', 3, val);
  },
  hexString: function () {
    return string.hexString(this.values.rgb);
  },
  rgbString: function () {
    return string.rgbString(this.values.rgb, this.values.alpha);
  },
  rgbaString: function () {
    return string.rgbaString(this.values.rgb, this.values.alpha);
  },
  percentString: function () {
    return string.percentString(this.values.rgb, this.values.alpha);
  },
  hslString: function () {
    return string.hslString(this.values.hsl, this.values.alpha);
  },
  hslaString: function () {
    return string.hslaString(this.values.hsl, this.values.alpha);
  },
  hwbString: function () {
    return string.hwbString(this.values.hwb, this.values.alpha);
  },
  keyword: function () {
    return string.keyword(this.values.rgb, this.values.alpha);
  },
  rgbNumber: function () {
    var rgb = this.values.rgb;
    return (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
  },
  luminosity: function () {
    var rgb = this.values.rgb;
    var lum = [];

    for (var i = 0; i < rgb.length; i++) {
      var chan = rgb[i] / 255;
      lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4);
    }

    return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
  },
  contrast: function (color2) {
    var lum1 = this.luminosity();
    var lum2 = color2.luminosity();

    if (lum1 > lum2) return (lum1 + 0.05) / (lum2 + 0.05);
    return (lum2 + 0.05) / (lum1 + 0.05);
  },
  level: function (color2) {
    var contrastRatio = this.contrast(color2);

    if (contrastRatio >= 7.1) return 'AAA';
    return (contrastRatio >= 4.5) ? 'AA' : '';
  },
  dark: function () {
    var rgb = this.values.rgb;
    var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return yiq < 128;
  },
  light: function () {
    return !this.dark();
  },
  negate: function () {
    var rgb = [];
    for (var i = 0; i < 3; i++) {
      rgb[i] = 255 - this.values.rgb[i];
    }

    this.setValues('rgb', rgb);
    return this;
  },
  lighten: function (ratio) {
    var hsl = this.values.hsl;
    hsl[2] += hsl[2] * ratio;
    this.setValues('hsl', hsl);
    return this;
  },
  darken: function (ratio) {
    var hsl = this.values.hsl;
    hsl[2] -= hsl[2] * ratio;
    this.setValues('hsl', hsl);
    return this;
  },
  saturate: function (ratio) {
    var hsl = this.values.hsl;
    hsl[1] += hsl[1] * ratio;
    this.setValues('hsl', hsl);
    return this;
  },
  desaturate: function (ratio) {
    var hsl = this.values.hsl;
    hsl[1] -= hsl[1] * ratio;
    this.setValues('hsl', hsl);
    return this;
  },
  whiten: function (ratio) {
    var hwb = this.values.hwb;
    hwb[1] += hwb[1] * ratio;
    this.setValues('hwb', hwb);
    return this;
  },
  blacken: function (ratio) {
    var hwb = this.values.hwb;
    hwb[2] += hwb[2] * ratio;
    this.setValues('hwb', hwb);
    return this;
  },
  greyscale: function () {
    var rgb = this.values.rgb;
    var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
    this.setValues('rgb', [val, val, val]);
    return this;
  },
  clearer: function (ratio) {
    var alpha = this.values.alpha;
    this.setValues('alpha', alpha - (alpha * ratio));
    return this;
  },
  opaquer: function (ratio) {
    var alpha = this.values.alpha;
    this.setValues('alpha', alpha + (alpha * ratio));
    return this;
  },
  rotate: function (degrees) {
    var hsl = this.values.hsl;
    var hue = (hsl[0] + degrees) % 360;
    hsl[0] = hue < 0 ? 360 + hue : hue;
    this.setValues('hsl', hsl);
    return this;
  },
  mix: function (mixinColor, weight) {
    var color1 = this;
    var color2 = mixinColor;
    var p = weight === undefined ? 0.5 : weight;
    var w = 2 * p - 1;
    var a = color1.alpha() - color2.alpha();
    var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
    var w2 = 1 - w1;

    return this
      .rgb(
        w1 * color1.red() + w2 * color2.red(),
        w1 * color1.green() + w2 * color2.green(),
        w1 * color1.blue() + w2 * color2.blue()
      )
      .alpha(color1.alpha() * p + color2.alpha() * (1 - p));
  },
  toJSON: function () {
    return this.rgb();
  },
  clone: function () {
    var result = new Color();
    var source = this.values;
    var target = result.values;
    var value, type;

    for (var prop in source) {
      if (source.hasOwnProperty(prop)) {
        value = source[prop];
        type = ({}).toString.call(value);

        if (type === '[object Array]') {
          target[prop] = value.slice(0);
        } else if (type === '[object Number]') {
          target[prop] = value;
        } else {
          console.error('unexpected color value:', value);
        }
      }
    }

    return result;
  }
};

Color.prototype.spaces = {
  rgb: ['red', 'green', 'blue'],
  hsl: ['hue', 'saturation', 'lightness'],
  hsv: ['hue', 'saturation', 'value'],
  hwb: ['hue', 'whiteness', 'blackness'],
  cmyk: ['cyan', 'magenta', 'yellow', 'black']
};

Color.prototype.maxes = {
  rgb: [255, 255, 255],
  hsl: [360, 100, 100],
  hsv: [360, 100, 100],
  hwb: [360, 100, 100],
  cmyk: [100, 100, 100, 100]
};

Color.prototype.getValues = function (space) {
  var values = this.values;
  var vals = {};

  for (var i = 0; i < space.length; i++) {
    vals[space.charAt(i)] = values[space][i];
  }

  if (values.alpha !== 1) {
    vals.a = values.alpha;
  }

  return vals;
};

Color.prototype.setValues = function (space, vals) {
  var values = this.values;
  var spaces = this.spaces;
  var maxes = this.maxes;
  var alpha = 1;
  var i;

  if (space === 'alpha') {
    alpha = vals;
  } else if (vals.length) {
    values[space] = vals.slice(0, space.length);
    alpha = vals[space.length];
  } else if (vals[space.charAt(0)] !== undefined) {
    for (i = 0; i < space.length; i++) {
      values[space][i] = vals[space.charAt(i)];
    }

    alpha = vals.a;
  } else if (vals[spaces[space][0]] !== undefined) {
    var chans = spaces[space];

    for (i = 0; i < space.length; i++) {
      values[space][i] = vals[chans[i]];
    }

    alpha = vals.alpha;
  }

  values.alpha = Math.max(0, Math.min(1, (alpha === undefined ? values.alpha : alpha)));

  if (space === 'alpha') return false;

  var capped;

  for (i = 0; i < space.length; i++) {
    capped = Math.max(0, Math.min(maxes[space][i], values[space][i]));
    values[space][i] = Math.round(capped);
  }

  for (var sname in spaces) {
    if (sname !== space) {
      values[sname] = convert[space][sname](values[space]);
    }
  }

  return true;
};

Color.prototype.setSpace = function (space, args) {
  var vals = args[0];

  if (vals === undefined) return this.getValues(space);

  if (typeof vals === 'number') {
    vals = Array.prototype.slice.call(args);
  }

  this.setValues(space, vals);
  return this;
};

Color.prototype.setChannel = function (space, index, val) {
  var svalues = this.values[space];
  if (val === undefined) {
    return svalues[index];
  } else if (val === svalues[index]) {
    return this;
  }

  svalues[index] = val;
  this.setValues(space, svalues);

  return this;
};

if (typeof window !== 'undefined') {
  window.Color = Color;
}

module.exports = Color;

},{ "2" : 2, "5" : 5 }],
4:[function (require, module, exports){

module.exports = {
  rgb2hsl: rgb2hsl,
  rgb2hsv: rgb2hsv,
  rgb2hwb: rgb2hwb,
  rgb2cmyk: rgb2cmyk,
  rgb2keyword: rgb2keyword,
  rgb2xyz: rgb2xyz,
  rgb2lab: rgb2lab,
  rgb2lch: rgb2lch,
  hsl2rgb: hsl2rgb,
  hsl2hsv: hsl2hsv,
  hsl2hwb: hsl2hwb,
  hsl2cmyk: hsl2cmyk,
  hsl2keyword: hsl2keyword,
  hsv2rgb: hsv2rgb,
  hsv2hsl: hsv2hsl,
  hsv2hwb: hsv2hwb,
  hsv2cmyk: hsv2cmyk,
  hsv2keyword: hsv2keyword,
  hwb2rgb: hwb2rgb,
  hwb2hsl: hwb2hsl,
  hwb2hsv: hwb2hsv,
  hwb2cmyk: hwb2cmyk,
  hwb2keyword: hwb2keyword,
  cmyk2rgb: cmyk2rgb,
  cmyk2hsl: cmyk2hsl,
  cmyk2hsv: cmyk2hsv,
  cmyk2hwb: cmyk2hwb,
  cmyk2keyword: cmyk2keyword,
  keyword2rgb: keyword2rgb,
  keyword2hsl: keyword2hsl,
  keyword2hsv: keyword2hsv,
  keyword2hwb: keyword2hwb,
  keyword2cmyk: keyword2cmyk,
  keyword2lab: keyword2lab,
  keyword2xyz: keyword2xyz,
  xyz2rgb: xyz2rgb,
  xyz2lab: xyz2lab,
  xyz2lch: xyz2lch,
  lab2xyz: lab2xyz,
  lab2rgb: lab2rgb,
  lab2lch: lab2lch,
  lch2lab: lch2lab,
  lch2xyz: lch2xyz,
  lch2rgb: lch2rgb
};

function rgb2hsl(rgb) {
  var r = rgb[0]/255;
  var g = rgb[1]/255;
  var b = rgb[2]/255;
  var min = Math.min(r, g, b);
  var max = Math.max(r, g, b);
  var delta = max - min;
  var h, s, l;

  if (max === min) {
    h = 0;
  } else if (r === max) {
    h = (g - b) / delta;
  } else if (g === max) {
    h = 2 + (b - r) / delta;
  } else if (b === max) {
    h = 4 + (r - g)/ delta;
  }

  h = Math.min(h * 60, 360);

  if (h < 0) h += 360;

  l = (min + max) / 2;

  if (max === min) {
    s = 0;
  } else if (l <= 0.5) {
    s = delta / (max + min);
  } else {
    s = delta / (2 - max - min);
  }

  return [h, s * 100, l * 100];
}

function rgb2hsv(rgb) {
  var r = rgb[0];
  var g = rgb[1];
  var b = rgb[2];
  var min = Math.min(r, g, b);
  var max = Math.max(r, g, b);
  var delta = max - min;
  var h, s, v;

  if (max === 0) {
    s = 0;
  } else {
    s = (delta/max * 1000)/10;
  }

  if (max === min) {
    h = 0;
  } else if (r === max) {
    h = (g - b) / delta;
  } else if (g === max) {
    h = 2 + (b - r) / delta;
  } else if (b === max) {
    h = 4 + (r - g) / delta;
  }

  h = Math.min(h * 60, 360);

  if (h < 0) h += 360;

  v = ((max / 255) * 1000) / 10;

  return [h, s, v];
}

function rgb2hwb(rgb) {
  var r = rgb[0];
  var g = rgb[1];
  var b = rgb[2];
  var h = rgb2hsl(rgb)[0];
  var w = 1/255 * Math.min(r, Math.min(g, b));

  b = 1 - 1/255 * Math.max(r, Math.max(g, b));

  return [h, w * 100, b * 100];
}

function rgb2cmyk(rgb) {
  var r = rgb[0] / 255;
  var g = rgb[1] / 255;
  var b = rgb[2] / 255;
  var c, m, y, k;

  k = Math.min(1 - r, 1 - g, 1 - b);
  c = (1 - r - k) / (1 - k) || 0;
  m = (1 - g - k) / (1 - k) || 0;
  y = (1 - b - k) / (1 - k) || 0;

  return [c * 100, m * 100, y * 100, k * 100];
}

function rgb2keyword(rgb) {
  return reverseKeywords[JSON.stringify(rgb)];
}

function rgb2xyz(rgb) {
  var r = rgb[0] / 255;
  var g = rgb[1] / 255;
  var b = rgb[2] / 255;

  r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
  g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
  b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

  var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
  var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
  var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

  return [x * 100, y *100, z * 100];
}

function rgb2lab(rgb) {
  var xyz = rgb2xyz(rgb);
  var x = xyz[0];
  var y = xyz[1];
  var z = xyz[2];
  var l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function rgb2lch(args) {
  return lab2lch(rgb2lab(args));
}

function hsl2rgb(hsl) {
  var h = hsl[0] / 360;
  var s = hsl[1] / 100;
  var l = hsl[2] / 100;
  var t1, t2, t3, rgb, val;

  if (s === 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5) {
    t2 = l * (1 + s);
  } else {
    t2 = l + s - l * s;
  }

  t1 = 2 * l - t2;

  rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * - (i - 1);
    t3 < 0 && t3++;
    t3 > 1 && t3--;

    if (6 * t3 < 1) {
      val = t1 + (t2 - t1) * 6 * t3;
    } else if (2 * t3 < 1) {
      val = t2;
    } else if (3 * t3 < 2) {
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    } else {
      val = t1;
    }

    rgb[i] = val * 255;
  }

  return rgb;
}

function hsl2hsv(hsl) {
  var h = hsl[0];
  var s = hsl[1] / 100;
  var l = hsl[2] / 100;
  var sv, v;

  if (l === 0) return [0, 0, 0];

  l *= 2;
  s *= (l <= 1) ? l : 2 - l;
  v = (l + s) / 2;
  sv = (2 * s) / (l + s);

  return [h, sv * 100, v * 100];
}

function hsl2hwb(args) {
  return rgb2hwb(hsl2rgb(args));
}

function hsl2cmyk(args) {
  return rgb2cmyk(hsl2rgb(args));
}

function hsl2keyword(args) {
  return rgb2keyword(hsl2rgb(args));
}

function hsv2rgb(hsv) {
  var h = hsv[0] / 60;
  var s = hsv[1] / 100;
  var v = hsv[2] / 100;
  var hi = Math.floor(h) % 6;

  var f = h - Math.floor(h);
  var p = 255 * v * (1 - s);
  var q = 255 * v * (1 - (s * f));
  var t = 255 * v * (1 - (s * (1 - f)));
  v = 255 * v;

  switch(hi) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    case 5:
      return [v, p, q];
  }
}

function hsv2hsl(hsv) {
  var h = hsv[0];
  var s = hsv[1] / 100;
  var v = hsv[2] / 100;
  var sl, l;

  l = (2 - s) * v;
  sl = s * v;
  sl /= (l <= 1) ? l : 2 - l;
  sl = sl || 0;
  l /= 2;

  return [h, sl * 100, l * 100];
}

function hsv2hwb(args) {
  return rgb2hwb(hsv2rgb(args));
}

function hsv2cmyk(args) {
  return rgb2cmyk(hsv2rgb(args));
}

function hsv2keyword(args) {
  return rgb2keyword(hsv2rgb(args));
}

function hwb2rgb(hwb) {
  var h = hwb[0] / 360;
  var wh = hwb[1] / 100;
  var bl = hwb[2] / 100;
  var ratio = wh + bl;
  var i, v, f, n;

  if (ratio > 1) {
    wh /= ratio;
    bl /= ratio;
  }

  i = Math.floor(6 * h);
  v = 1 - bl;
  f = 6 * h - i;

  if ((i & 0x01) !== 0) {
    f = 1 - f;
  }

  n = wh + f * (v - wh);

  switch (i) {
    default:
    case 6:
    case 0: r = v; g = n; b = wh; break;
    case 1: r = n; g = v; b = wh; break;
    case 2: r = wh; g = v; b = n; break;
    case 3: r = wh; g = n; b = v; break;
    case 4: r = n; g = wh; b = v; break;
    case 5: r = v; g = wh; b = n; break;
  }

  return [r * 255, g * 255, b * 255];
}

function hwb2hsl(args) {
  return rgb2hsl(hwb2rgb(args));
}

function hwb2hsv(args) {
  return rgb2hsv(hwb2rgb(args));
}

function hwb2cmyk(args) {
  return rgb2cmyk(hwb2rgb(args));
}

function hwb2keyword(args) {
  return rgb2keyword(hwb2rgb(args));
}

function cmyk2rgb(cmyk) {
  var c = cmyk[0] / 100;
  var m = cmyk[1] / 100;
  var y = cmyk[2] / 100;
  var k = cmyk[3] / 100;
  var r, g, b;

  r = 1 - Math.min(1, c * (1 - k) + k);
  g = 1 - Math.min(1, m * (1 - k) + k);
  b = 1 - Math.min(1, y * (1 - k) + k);

  return [r * 255, g * 255, b * 255];
}

function cmyk2hsl(args) {
  return rgb2hsl(cmyk2rgb(args));
}

function cmyk2hsv(args) {
  return rgb2hsv(cmyk2rgb(args));
}

function cmyk2hwb(args) {
  return rgb2hwb(cmyk2rgb(args));
}

function cmyk2keyword(args) {
  return rgb2keyword(cmyk2rgb(args));
}

function xyz2rgb(xyz) {
  var x = xyz[0] / 100;
  var y = xyz[1] / 100;
  var z = xyz[2] / 100;
  var r, g, b;

  r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
  g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
  b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

  r = r > 0.0031308 ?
    ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055) :
    (r * 12.92);

  g = g > 0.0031308 ?
    ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055) :
    (g * 12.92);

  b = b > 0.0031308 ?
    ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055) :
    (b * 12.92);

  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);

  return [r * 255, g * 255, b * 255];
}

function xyz2lab(xyz) {
  var x = xyz[0];
  var y = xyz[1];
  var z = xyz[2];
  var l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function xyz2lch(args) {
  return lab2lch(xyz2lab(args));
}

function lab2xyz(lab) {
  var l = lab[0];
  var a = lab[1];
  var b = lab[2];
  var x, y, z, y2;

  if (l <= 8) {
    y = (l * 100) / 903.3;
    y2 = (7.787 * (y / 100)) + (16 / 116);
  } else {
    y = 100 * Math.pow((l + 16) / 116, 3);
    y2 = Math.pow(y / 100, 1/3);
  }

  x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);
  z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);

  return [x, y, z];
}

function lab2lch(lab) {
  var l = lab[0];
  var a = lab[1];
  var b = lab[2];
  var hr, h, c;

  hr = Math.atan2(b, a);
  h = hr * 360 / 2 / Math.PI;

  if (h < 0) h += 360;

  c = Math.sqrt(a * a + b * b);
  return [l, c, h];
}

function lab2rgb(args) {
  return xyz2rgb(lab2xyz(args));
}

function lch2lab(lch) {
  var l = lch[0];
  var c = lch[1];
  var h = lch[2];
  var a, b, hr;

  hr = h / 360 * 2 * Math.PI;
  a = c * Math.cos(hr);
  b = c * Math.sin(hr);
  return [l, a, b];
}

function lch2xyz(args) {
  return lab2xyz(lch2lab(args));
}

function lch2rgb(args) {
  return lab2rgb(lch2lab(args));
}

function keyword2rgb(keyword) {
  return cssKeywords[keyword];
}

function keyword2hsl(args) {
  return rgb2hsl(keyword2rgb(args));
}

function keyword2hsv(args) {
  return rgb2hsv(keyword2rgb(args));
}

function keyword2hwb(args) {
  return rgb2hwb(keyword2rgb(args));
}

function keyword2cmyk(args) {
  return rgb2cmyk(keyword2rgb(args));
}

function keyword2lab(args) {
  return rgb2lab(keyword2rgb(args));
}

function keyword2xyz(args) {
  return rgb2xyz(keyword2rgb(args));
}

var cssKeywords = {
  aliceblue:  [240,248,255],
  antiquewhite: [250,235,215],
  aqua: [0,255,255],
  aquamarine: [127,255,212],
  azure:  [240,255,255],
  beige:  [245,245,220],
  bisque: [255,228,196],
  black:  [0,0,0],
  blanchedalmond: [255,235,205],
  blue: [0,0,255],
  blueviolet: [138,43,226],
  brown:  [165,42,42],
  burlywood:  [222,184,135],
  cadetblue:  [95,158,160],
  chartreuse: [127,255,0],
  chocolate:  [210,105,30],
  coral:  [255,127,80],
  cornflowerblue: [100,149,237],
  cornsilk: [255,248,220],
  crimson:  [220,20,60],
  cyan: [0,255,255],
  darkblue: [0,0,139],
  darkcyan: [0,139,139],
  darkgoldenrod:  [184,134,11],
  darkgray: [169,169,169],
  darkgreen:  [0,100,0],
  darkgrey: [169,169,169],
  darkkhaki:  [189,183,107],
  darkmagenta:  [139,0,139],
  darkolivegreen: [85,107,47],
  darkorange: [255,140,0],
  darkorchid: [153,50,204],
  darkred:  [139,0,0],
  darksalmon: [233,150,122],
  darkseagreen: [143,188,143],
  darkslateblue:  [72,61,139],
  darkslategray:  [47,79,79],
  darkslategrey:  [47,79,79],
  darkturquoise:  [0,206,209],
  darkviolet: [148,0,211],
  deeppink: [255,20,147],
  deepskyblue:  [0,191,255],
  dimgray:  [105,105,105],
  dimgrey:  [105,105,105],
  dodgerblue: [30,144,255],
  firebrick:  [178,34,34],
  floralwhite:  [255,250,240],
  forestgreen:  [34,139,34],
  fuchsia:  [255,0,255],
  gainsboro:  [220,220,220],
  ghostwhite: [248,248,255],
  gold: [255,215,0],
  goldenrod:  [218,165,32],
  gray: [128,128,128],
  green:  [0,128,0],
  greenyellow:  [173,255,47],
  grey: [128,128,128],
  honeydew: [240,255,240],
  hotpink:  [255,105,180],
  indianred:  [205,92,92],
  indigo: [75,0,130],
  ivory:  [255,255,240],
  khaki:  [240,230,140],
  lavender: [230,230,250],
  lavenderblush:  [255,240,245],
  lawngreen:  [124,252,0],
  lemonchiffon: [255,250,205],
  lightblue:  [173,216,230],
  lightcoral: [240,128,128],
  lightcyan:  [224,255,255],
  lightgoldenrodyellow: [250,250,210],
  lightgray:  [211,211,211],
  lightgreen: [144,238,144],
  lightgrey:  [211,211,211],
  lightpink:  [255,182,193],
  lightsalmon:  [255,160,122],
  lightseagreen:  [32,178,170],
  lightskyblue: [135,206,250],
  lightslategray: [145,162,178],
  lightslategrey: [145,162,178],
  lightsteelblue: [176,196,222],
  lightyellow:  [255,255,224],
  lime: [0,255,0],
  limegreen:  [50,205,50],
  linen:  [250,240,230],
  magenta:  [255,0,255],
  maroon: [128,0,0],
  mediumaquamarine: [102,205,170],
  mediumblue: [0,0,205],
  mediumorchid: [186,85,211],
  mediumpurple: [147,112,219],
  mediumseagreen: [60,179,113],
  mediumslateblue:  [123,104,238],
  mediumspringgreen:  [0,250,154],
  mediumturquoise:  [72,209,204],
  mediumvioletred:  [199,21,133],
  midnightblue: [25,25,112],
  mintcream:  [245,255,250],
  mistyrose:  [255,228,225],
  moccasin: [255,228,181],
  navajowhite:  [255,222,173],
  navy: [0,0,128],
  oldlace:  [253,245,230],
  olive:  [128,128,0],
  olivedrab:  [107,142,35],
  orange: [255,165,0],
  orangered:  [255,69,0],
  orchid: [218,112,214],
  palegoldenrod:  [238,232,170],
  palegreen:  [152,251,152],
  paleturquoise:  [175,238,238],
  palevioletred:  [219,112,147],
  papayawhip: [255,239,213],
  peachpuff:  [255,218,185],
  peru: [205,133,63],
  pink: [255,192,203],
  plum: [221,160,221],
  powderblue: [176,224,230],
  purple: [128,0,128],
  rebeccapurple: [102, 51, 153],
  red:  [255,0,0],
  rosybrown:  [188,143,143],
  royalblue:  [65,105,225],
  saddlebrown:  [139,69,19],
  salmon: [250,128,114],
  sandybrown: [244,164,96],
  seagreen: [46,139,87],
  seashell: [255,245,238],
  sienna: [160,82,45],
  silver: [192,192,192],
  skyblue:  [135,206,235],
  slateblue:  [106,90,205],
  slategray:  [112,128,144],
  slategrey:  [112,128,144],
  snow: [255,250,250],
  springgreen:  [0,255,127],
  steelblue:  [70,130,180],
  tan:  [210,180,140],
  teal: [0,128,128],
  thistle:  [216,191,216],
  tomato: [255,99,71],
  turquoise:  [64,224,208],
  violet: [238,130,238],
  wheat:  [245,222,179],
  white:  [255,255,255],
  whitesmoke: [245,245,245],
  yellow: [255,255,0],
  yellowgreen:  [154,205,50]
};

var reverseKeywords = {};
for (var key in cssKeywords) {
  reverseKeywords[JSON.stringify(cssKeywords[key])] = key;
}

}, {}],
5:[function (require, module, exports){
var conversions = require(4);
var convert = function () {
  return new Converter();
};

for (var func in conversions) {
  convert[func + 'Raw'] = (function (func) {
    return function (arg) {
      if (typeof arg === 'number') {
        arg = Array.prototype.slice.call(arguments);
      }
      return conversions[func](arg);
    };
  })(func);

  var pair = /(\w+)2(\w+)/.exec(func);
  var from = pair[1];
  var to = pair[2];

  convert[from] = convert[from] || {};

  convert[from][to] = convert[func] = (function (func) {
    return function (arg) {
      if (typeof arg === 'number') {
        arg = Array.prototype.slice.call(arguments);
      }

      var val = conversions[func](arg);
      if (typeof val === 'string' || val === undefined) return val;

      for (var i = 0; i < val.length; i++) {
        val[i] = Math.round(val[i]);
      }

      return val;
    };
  })(func);
}

var Converter = function () {
  this.convs = {};
};

Converter.prototype.routeSpace = function (space, args) {
  var values = args[0];
  if (values === undefined) return this.getValues(space);

  if (typeof values === 'number') {
    values = Array.prototype.slice.call(args);
  }

  return this.setValues(space, values);
};

Converter.prototype.setValues = function (space, values) {
  this.space = space;
  this.convs = {};
  this.convs[space] = values;
  return this;
};

Converter.prototype.getValues = function (space) {
  var vals = this.convs[space];

  if (!vals) {
    var fspace = this.space;
    var from = this.convs[fspace];

    vals = convert[fspace][space](from);

    this.convs[space] = vals;
  }

  return vals;
};

['rgb', 'hsl', 'hsv', 'cmyk', 'keyword'].forEach(function (space) {
  Converter.prototype[space] = function (vals) {
    return this.routeSpace(space, arguments);
  };
});

module.exports = convert;
}, { '4' : 4 }],
6:[function (require, module, exports){
module.exports = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
};
}, {}],
7:[function (require, module, exports){
var Chart = require(27)();

require(26)(Chart);
require(22)(Chart);
require(25)(Chart);
require(21)(Chart);
require(23)(Chart);
require(24)(Chart);
require(28)(Chart);
require(32)(Chart);
require(30)(Chart);
require(31)(Chart);
require(33)(Chart);
require(29)(Chart);
require(34)(Chart);
require(35)(Chart);
require(36)(Chart);
require(37)(Chart);
require(38)(Chart);
require(41)(Chart);
require(39)(Chart);
require(40)(Chart);
require(42)(Chart);
require(43)(Chart);
require(44)(Chart);
require(15)(Chart);
require(16)(Chart);
require(17)(Chart);
require(18)(Chart);
require(19)(Chart);
require(20)(Chart);
require(8)(Chart);
require(9)(Chart);
require(10)(Chart);
require(11)(Chart);
require(12)(Chart);
require(13)(Chart);
require(14)(Chart);

window.Chart = module.exports = Chart;

},{"10":10,"11":11,"12":12,"13":13,"14":14,"15":15,"16":16,"17":17,"18":18,"19":19,"20":20,"21":21,"22":22,"23":23,"24":24,"25":25,"26":26,"27":27,"28":28,"29":29,"30":30,"31":31,"32":32,"33":33,"34":34,"35":35,"36":36,"37":37,"38":38,"39":39,"40":40,"41":41,"42":42,"43":43,"44":44,"8":8,"9":9}],8:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  Chart.Bar = function (context, config) {
    config.type = 'bar';

    return new Chart(context, config);
  };

};
}, {}],
9:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  Chart.Bubble = function (context, config) {
    config.type = 'bubble';
    return new Chart(context, config);
  };

};
}, {}],
10:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  Chart.Doughnut = function (context, config) {
    config.type = 'doughnut';

    return new Chart(context, config);
  };

};
}, {}],
11:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  Chart.Line = function (context, config) {
    config.type = 'line';

    return new Chart(context, config);
  };

};
}, {}],
12:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  Chart.PolarArea = function (context, config) {
    config.type = 'polarArea';

    return new Chart(context, config);
  };

};
}, {}],
13:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  Chart.Radar = function (context, config) {
    config.options = Chart.helpers.configMerge({ aspectRatio: 1 }, config.options);
    config.type = 'radar';

    return new Chart(context, config);
  };

};
}, {}],
14:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var defaultConfig = {
    hover: {
      mode: 'single'
    },
    scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom',
        id: 'x-axis-1'
      }],
      yAxes: [{
        type: 'linear',
        position: 'left',
        id: 'y-axis-1'
      }]
    },

    tooltips: {
      callbacks: {
        title: function () {
          return '';
        },
        label: function (tooltipItem) {
          return '(' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
        }
      }
    }
  };

  Chart.defaults.scatter = defaultConfig;

  Chart.controllers.scatter = Chart.controllers.line;

  Chart.Scatter = function (context, config) {
    config.type = 'scatter';
    return new Chart(context, config);
  };

};
}, {}],
15:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;

  Chart.defaults.bar = {
    hover: {
      mode: 'label'
    },
    scales: {
      xAxes: [{
        type: 'category',
        categoryPercentage: 0.8,
        barPercentage: 0.9,
        gridLines: {
          offsetGridLines: true
        }
      }],
      yAxes: [{
        type: 'linear'
      }]
    }
  };

  Chart.controllers.bar = Chart.DatasetController.extend({

    dataElementType: Chart.elements.Rectangle,

    initialize: function (chart, datasetIndex) {
      Chart.DatasetController.prototype.initialize.call(this, chart, datasetIndex);
      this.getMeta().bar = true;
    },

    getBarCount: function () {
      var me = this;
      var barCount = 0;

      helpers.each(me.chart.data.datasets, function (dataset, datasetIndex) {
        var meta = me.chart.getDatasetMeta(datasetIndex);

        if (meta.bar && me.chart.isDatasetVisible(datasetIndex)) ++barCount;
      }, me);
      return barCount;
    },

    update: function (reset) {
      var me = this;
      helpers.each(me.getMeta().data, function (rectangle, index) {
        me.updateElement(rectangle, index, reset);
      }, me);
    },

    updateElement: function (rectangle, index, reset) {
      var me = this;
      var meta = me.getMeta();
      var xScale = me.getScaleForId(meta.xAxisID);
      var yScale = me.getScaleForId(meta.yAxisID);
      var scaleBase = yScale.getBasePixel();
      var rectangleElementOptions = me.chart.options.elements.rectangle;
      var custom = rectangle.custom || {};
      var dataset = me.getDataset();

      helpers.extend(rectangle, {
        _xScale: xScale,
        _yScale: yScale,
        _datasetIndex: me.index,
        _index: index,
        _model: {
          x: me.calculateBarX(index, me.index),
          y: reset ? scaleBase : me.calculateBarY(index, me.index),
          label: me.chart.data.labels[index],
          datasetLabel: dataset.label,
          base: reset ? scaleBase : me.calculateBarBase(me.index, index),
          width: me.calculateBarWidth(index),
          backgroundColor: custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.backgroundColor, index, rectangleElementOptions.backgroundColor),
          borderSkipped: custom.borderSkipped ? custom.borderSkipped : rectangleElementOptions.borderSkipped,
          borderColor: custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.borderColor, index, rectangleElementOptions.borderColor),
          borderWidth: custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.borderWidth, index, rectangleElementOptions.borderWidth)
        }
      });
      rectangle.pivot();
    },

    calculateBarBase: function (datasetIndex, index) {
      var me = this;
      var meta = me.getMeta();
      var yScale = me.getScaleForId(meta.yAxisID);
      var base = 0;

      if (yScale.options.stacked) {
        var chart = me.chart;
        var datasets = chart.data.datasets;
        var value = Number(datasets[datasetIndex].data[index]);

        for (var i = 0; i < datasetIndex; i++) {
          var currentDs = datasets[i];
          var currentDsMeta = chart.getDatasetMeta(i);

          if (currentDsMeta.bar && currentDsMeta.yAxisID === yScale.id && chart.isDatasetVisible(i)) {
            var currentVal = Number(currentDs.data[index]);
            base += value < 0 ? Math.min(currentVal, 0) : Math.max(currentVal, 0);
          }
        }

        return yScale.getPixelForValue(base);
      }

      return yScale.getBasePixel();
    },

    getRuler: function (index) {
      var me = this;
      var meta = me.getMeta();
      var xScale = me.getScaleForId(meta.xAxisID);
      var datasetCount = me.getBarCount();

      var tickWidth;

      if (xScale.options.type === 'category') {
        tickWidth = xScale.getPixelForTick(index + 1) - xScale.getPixelForTick(index);
      } else {
        tickWidth = xScale.width / xScale.ticks.length;
      }

      var categoryWidth = tickWidth * xScale.options.categoryPercentage;
      var categorySpacing = (tickWidth - (tickWidth * xScale.options.categoryPercentage)) / 2;
      var fullBarWidth = categoryWidth / datasetCount;

      if (xScale.ticks.length !== me.chart.data.labels.length) {
        var perc = xScale.ticks.length / me.chart.data.labels.length;
        fullBarWidth = fullBarWidth * perc;
      }

      var barWidth = fullBarWidth * xScale.options.barPercentage;
      var barSpacing = fullBarWidth - (fullBarWidth * xScale.options.barPercentage);

      return {
        datasetCount: datasetCount,
        tickWidth: tickWidth,
        categoryWidth: categoryWidth,
        categorySpacing: categorySpacing,
        fullBarWidth: fullBarWidth,
        barWidth: barWidth,
        barSpacing: barSpacing
      };
    },

    calculateBarWidth: function (index) {
      var xScale = this.getScaleForId(this.getMeta().xAxisID);
      if (xScale.options.barThickness) return xScale.options.barThickness;

      var ruler = this.getRuler(index);
      return xScale.options.stacked ? ruler.categoryWidth : ruler.barWidth;
    },

    getBarIndex: function (datasetIndex) {
      var barIndex = 0;
      var meta, j;

      for (j = 0; j < datasetIndex; ++j) {
        meta = this.chart.getDatasetMeta(j);
        if (meta.bar && this.chart.isDatasetVisible(j)) ++barIndex;
      }

      return barIndex;
    },

    calculateBarX: function (index, datasetIndex) {
      var me = this;
      var meta = me.getMeta();
      var xScale = me.getScaleForId(meta.xAxisID);
      var barIndex = me.getBarIndex(datasetIndex);

      var ruler = me.getRuler(index);
      var leftTick = xScale.getPixelForValue(null, index, datasetIndex, me.chart.isCombo);
      leftTick -= me.chart.isCombo ? (ruler.tickWidth / 2) : 0;

      if (xScale.options.stacked) {
        return leftTick + (ruler.categoryWidth / 2) + ruler.categorySpacing;
      }

      return leftTick +
        (ruler.barWidth / 2) +
        ruler.categorySpacing +
        (ruler.barWidth * barIndex) +
        (ruler.barSpacing / 2) +
        (ruler.barSpacing * barIndex);
    },

    calculateBarY: function (index, datasetIndex) {
      var me = this;
      var meta = me.getMeta();
      var yScale = me.getScaleForId(meta.yAxisID);
      var value = Number(me.getDataset().data[index]);

      if (yScale.options.stacked) {

        var sumPos = 0;
        var sumNeg = 0;

        for (var i = 0; i < datasetIndex; i++) {
          var ds = me.chart.data.datasets[i];
          var dsMeta = me.chart.getDatasetMeta(i);

          if (dsMeta.bar && dsMeta.yAxisID === yScale.id && me.chart.isDatasetVisible(i)) {
            var stackedVal = Number(ds.data[index]);

            if (stackedVal < 0) {
              sumNeg += stackedVal || 0;
            } else {
              sumPos += stackedVal || 0;
            }
          }
        }

        if (value < 0) {
          return yScale.getPixelForValue(sumNeg + value);
        } else {
          return yScale.getPixelForValue(sumPos + value);
        }
      }

      return yScale.getPixelForValue(value);
    },

    draw: function (ease) {
      var me = this;
      var easingDecimal = ease || 1;

      helpers.each(me.getMeta().data, function (rectangle, index) {
        var d = me.getDataset().data[index];

        if (d !== null && d !== undefined && !isNaN(d)) {
          rectangle.transition(easingDecimal).draw();
        }
      }, me);
    },

    setHoverStyle: function (rectangle) {
      var dataset = this.chart.data.datasets[rectangle._datasetIndex];
      var index = rectangle._index;
      var custom = rectangle.custom || {};
      var model = rectangle._model;

      model.backgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : helpers.getValueAtIndexOrDefault(dataset.hoverBackgroundColor, index, helpers.getHoverColor(model.backgroundColor));
      model.borderColor = custom.hoverBorderColor ? custom.hoverBorderColor : helpers.getValueAtIndexOrDefault(dataset.hoverBorderColor, index, helpers.getHoverColor(model.borderColor));
      model.borderWidth = custom.hoverBorderWidth ? custom.hoverBorderWidth : helpers.getValueAtIndexOrDefault(dataset.hoverBorderWidth, index, model.borderWidth);
    },

    removeHoverStyle: function (rectangle) {
      var dataset = this.chart.data.datasets[rectangle._datasetIndex];
      var index = rectangle._index;
      var custom = rectangle.custom || {};
      var model = rectangle._model;
      var rectangleElementOptions = this.chart.options.elements.rectangle;

      model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.backgroundColor, index, rectangleElementOptions.backgroundColor);
      model.borderColor = custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.borderColor, index, rectangleElementOptions.borderColor);
      model.borderWidth = custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.borderWidth, index, rectangleElementOptions.borderWidth);
    }

  });

  Chart.defaults.horizontalBar = {
    hover: {
      mode: 'label'
    },
    scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom'
      }],
      yAxes: [{
        position: 'left',
        type: 'category',
        categoryPercentage: 0.8,
        barPercentage: 0.9,
        gridLines: {
          offsetGridLines: true
        }
      }]
    },
    elements: {
      rectangle: {
        borderSkipped: 'left'
      }
    },
    tooltips: {
      callbacks: {
        title: function (tooltipItems, data) {
          var title = '';

          if (tooltipItems.length > 0) {
            if (tooltipItems[0].yLabel) {
              title = tooltipItems[0].yLabel;
            } else if (data.labels.length > 0 && tooltipItems[0].index < data.labels.length) {
              title = data.labels[tooltipItems[0].index];
            }
          }

          return title;
        },
        label: function (tooltipItem, data) {
          var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': ' + tooltipItem.xLabel;
        }
      }
    }
  };

  Chart.controllers.horizontalBar = Chart.controllers.bar.extend({
    updateElement: function (rectangle, index, reset) {
      var me = this;
      var meta = me.getMeta();
      var xScale = me.getScaleForId(meta.xAxisID);
      var yScale = me.getScaleForId(meta.yAxisID);
      var scaleBase = xScale.getBasePixel();
      var custom = rectangle.custom || {};
      var dataset = me.getDataset();
      var rectangleElementOptions = me.chart.options.elements.rectangle;

      helpers.extend(rectangle, {
        _xScale: xScale,
        _yScale: yScale,
        _datasetIndex: me.index,
        _index: index,
        _model: {
          x: reset ? scaleBase : me.calculateBarX(index, me.index),
          y: me.calculateBarY(index, me.index),
          label: me.chart.data.labels[index],
          datasetLabel: dataset.label,
          base: reset ? scaleBase : me.calculateBarBase(me.index, index),
          height: me.calculateBarHeight(index),
          backgroundColor: custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.backgroundColor, index, rectangleElementOptions.backgroundColor),
          borderSkipped: custom.borderSkipped ? custom.borderSkipped : rectangleElementOptions.borderSkipped,
          borderColor: custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.borderColor, index, rectangleElementOptions.borderColor),
          borderWidth: custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.borderWidth, index, rectangleElementOptions.borderWidth)
        },

        draw: function () {
          var ctx = this._chart.ctx;
          var vm = this._view;
          var halfHeight = vm.height / 2;
          var topY = vm.y - halfHeight;
          var bottomY = vm.y + halfHeight;
          var right = vm.base - (vm.base - vm.x);
          var halfStroke = vm.borderWidth / 2;

          if (vm.borderWidth) {
            topY += halfStroke;
            bottomY -= halfStroke;
            right += halfStroke;
          }

          ctx.beginPath();
          ctx.fillStyle = vm.backgroundColor;
          ctx.strokeStyle = vm.borderColor;
          ctx.lineWidth = vm.borderWidth;

          var corners = [
            [vm.base, bottomY],
            [vm.base, topY],
            [right, topY],
            [right, bottomY]
          ];

          var borders = ['bottom', 'left', 'top', 'right'];
          var startCorner = borders.indexOf(vm.borderSkipped, 0);

          if (startCorner === -1) startCorner = 0;

          function cornerAt(index) {
            return corners[(startCorner + index) % 4];
          }

          ctx.moveTo.apply(ctx, cornerAt(0));
          for (var i = 1; i < 4; i++) ctx.lineTo.apply(ctx, cornerAt(i));

          ctx.fill();

          if (vm.borderWidth) ctx.stroke();
        },

        inRange: function (mouseX, mouseY) {
          var vm = this._view;
          var inRange = false;

          if (vm) {
            if (vm.x < vm.base) {
              inRange = (mouseY >= vm.y - vm.height / 2 && mouseY <= vm.y + vm.height / 2) && (mouseX >= vm.x && mouseX <= vm.base);
            } else {
              inRange = (mouseY >= vm.y - vm.height / 2 && mouseY <= vm.y + vm.height / 2) && (mouseX >= vm.base && mouseX <= vm.x);
            }
          }

          return inRange;
        }
      });

      rectangle.pivot();
    },

    calculateBarBase: function (datasetIndex, index) {
      var me = this;
      var meta = me.getMeta();
      var xScale = me.getScaleForId(meta.xAxisID);
      var base = 0;

      if (xScale.options.stacked) {
        var chart = me.chart;
        var datasets = chart.data.datasets;
        var value = Number(datasets[datasetIndex].data[index]);

        for (var i = 0; i < datasetIndex; i++) {
          var currentDs = datasets[i];
          var currentDsMeta = chart.getDatasetMeta(i);
          if (currentDsMeta.bar && currentDsMeta.xAxisID === xScale.id && chart.isDatasetVisible(i)) {
            var currentVal = Number(currentDs.data[index]);
            base += value < 0 ? Math.min(currentVal, 0) : Math.max(currentVal, 0);
          }
        }

        return xScale.getPixelForValue(base);
      }

      return xScale.getBasePixel();
    },

    getRuler: function (index) {
      var me = this;
      var meta = me.getMeta();
      var yScale = me.getScaleForId(meta.yAxisID);
      var datasetCount = me.getBarCount();
      var tickHeight;

      if (yScale.options.type === 'category') {
        tickHeight = yScale.getPixelForTick(index + 1) - yScale.getPixelForTick(index);
      } else {
        tickHeight = yScale.width / yScale.ticks.length;
      }

      var categoryHeight = tickHeight * yScale.options.categoryPercentage;
      var categorySpacing = (tickHeight - (tickHeight * yScale.options.categoryPercentage)) / 2;
      var fullBarHeight = categoryHeight / datasetCount;

      if (yScale.ticks.length !== me.chart.data.labels.length) {
        var perc = yScale.ticks.length / me.chart.data.labels.length;
        fullBarHeight = fullBarHeight * perc;
      }

      var barHeight = fullBarHeight * yScale.options.barPercentage;
      var barSpacing = fullBarHeight - (fullBarHeight * yScale.options.barPercentage);

      return {
        datasetCount: datasetCount,
        tickHeight: tickHeight,
        categoryHeight: categoryHeight,
        categorySpacing: categorySpacing,
        fullBarHeight: fullBarHeight,
        barHeight: barHeight,
        barSpacing: barSpacing,
      };
    },

    calculateBarHeight: function (index) {
      var me = this;
      var yScale = me.getScaleForId(me.getMeta().yAxisID);

      if (yScale.options.barThickness) return yScale.options.barThickness;

      var ruler = me.getRuler(index);

      return yScale.options.stacked ? ruler.categoryHeight : ruler.barHeight;
    },

    calculateBarX: function (index, datasetIndex) {
      var me = this;
      var meta = me.getMeta();
      var xScale = me.getScaleForId(meta.xAxisID);
      var value = Number(me.getDataset().data[index]);

      if (xScale.options.stacked) {
        var sumPos = 0;
        var sumNeg = 0;

        for (var i = 0; i < datasetIndex; i++) {
          var ds = me.chart.data.datasets[i];
          var dsMeta = me.chart.getDatasetMeta(i);

          if (dsMeta.bar && dsMeta.xAxisID === xScale.id && me.chart.isDatasetVisible(i)) {
            var stackedVal = Number(ds.data[index]);

            if (stackedVal < 0) {
              sumNeg += stackedVal || 0;
            } else {
              sumPos += stackedVal || 0;
            }
          }
        }

        if (value < 0) {
          return xScale.getPixelForValue(sumNeg + value);
        } else {
          return xScale.getPixelForValue(sumPos + value);
        }
      }

      return xScale.getPixelForValue(value);
    },

    calculateBarY: function (index, datasetIndex) {
      var me = this;
      var meta = me.getMeta();
      var yScale = me.getScaleForId(meta.yAxisID);
      var barIndex = me.getBarIndex(datasetIndex);

      var ruler = me.getRuler(index);
      var topTick = yScale.getPixelForValue(null, index, datasetIndex, me.chart.isCombo);
      topTick -= me.chart.isCombo ? (ruler.tickHeight / 2) : 0;

      if (yScale.options.stacked) {
        return topTick + (ruler.categoryHeight / 2) + ruler.categorySpacing;
      }

      return topTick +
        (ruler.barHeight / 2) +
        ruler.categorySpacing +
        (ruler.barHeight * barIndex) +
        (ruler.barSpacing / 2) +
        (ruler.barSpacing * barIndex);
    }
  });
};
}, {}],
16:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;

  Chart.defaults.bubble = {
    hover: {
      mode: "single"
    },
    scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom',
        id: 'x-axis-0'
      }],
      yAxes: [{
        type: 'linear',
        position: 'left',
        id: 'y-axis-0'
      }]
    },
    tooltips: {
      callbacks: {
        title: function () {
          return '';
        },
        label: function (tooltipItem, data) {
          var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
          var dataPoint = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return datasetLabel + ': (' + dataPoint.x + ', ' + dataPoint.y + ', ' + dataPoint.r + ')';
        }
      }
    }
  };

  Chart.controllers.bubble = Chart.DatasetController.extend({

    dataElementType: Chart.elements.Point,

    update: function (reset) {
      var me = this;
      var meta = me.getMeta();
      var points = meta.data;

      helpers.each(points, function (point, index) {
        me.updateElement(point, index, reset);
      });
    },

    updateElement: function (point, index, reset) {
      var me = this;
      var meta = me.getMeta();
      var xScale = me.getScaleForId(meta.xAxisID);
      var yScale = me.getScaleForId(meta.yAxisID);
      var custom = point.custom || {};
      var dataset = me.getDataset();
      var data = dataset.data[index];
      var pointElementOptions = me.chart.options.elements.point;
      var dsIndex = me.index;

      helpers.extend(point, {
        _xScale: xScale,
        _yScale: yScale,
        _datasetIndex: dsIndex,
        _index: index,
        _model: {
          x: reset ? xScale.getPixelForDecimal(0.5) : xScale.getPixelForValue(typeof data === 'object' ? data : NaN, index, dsIndex, me.chart.isCombo),
          y: reset ? yScale.getBasePixel() : yScale.getPixelForValue(data, index, dsIndex),
          radius: reset ? 0 : custom.radius ? custom.radius : me.getRadius(data),
          hitRadius: custom.hitRadius ? custom.hitRadius : helpers.getValueAtIndexOrDefault(dataset.hitRadius, index, pointElementOptions.hitRadius)
        }
      });

      Chart.DatasetController.prototype.removeHoverStyle.call(me, point, pointElementOptions);

      var model = point._model;
      model.skip = custom.skip ? custom.skip : (isNaN(model.x) || isNaN(model.y));

      point.pivot();
    },

    getRadius: function (value) {
      return value.r || this.chart.options.elements.point.radius;
    },

    setHoverStyle: function (point) {
      var me = this;
      Chart.DatasetController.prototype.setHoverStyle.call(me, point);

      var dataset = me.chart.data.datasets[point._datasetIndex];
      var index = point._index;
      var custom = point.custom || {};
      var model = point._model;

      model.radius = custom.hoverRadius ?
        custom.hoverRadius :
        (helpers.getValueAtIndexOrDefault(dataset.hoverRadius, index, me.chart.options.elements.point.hoverRadius)) + me.getRadius(dataset.data[index]);
    },

    removeHoverStyle: function (point) {
      var me = this;
      Chart.DatasetController.prototype.removeHoverStyle.call(me, point, me.chart.options.elements.point);

      var dataVal = me.chart.data.datasets[point._datasetIndex].data[point._index];
      var custom = point.custom || {};
      var model = point._model;

      model.radius = custom.radius ?
        custom.radius :
        me.getRadius(dataVal);
    }
  });
};
}, {}],
17:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;
  var defaults = Chart.defaults;

  defaults.doughnut = {
    animation: {
      animateRotate: true,
      animateScale: false
    },
    aspectRatio: 1,
    hover: {
      mode: 'single'
    },
    legendCallback: function (chart) {
      var text = [];
      text.push('<ul class="' + chart.id + '-legend">');

      var data = chart.data;
      var datasets = data.datasets;
      var labels = data.labels;

      if (datasets.length) {
        for (var i = 0; i < datasets[0].data.length; ++i) {
          text.push('<li><span style="background-color:' + datasets[0].backgroundColor[i] + '"></span>');

          if (labels[i]) text.push(labels[i]);

          text.push('</li>');
        }
      }

      text.push('</ul>');
      return text.join("");
    },
    legend: {
      labels: {
        generateLabels: function (chart) {
          var data = chart.data;

          if (data.labels.length && data.datasets.length) {
            return data.labels.map(function (label, i) {
              var meta = chart.getDatasetMeta(0);
              var ds = data.datasets[0];
              var arc = meta.data[i];
              var custom = arc && arc.custom || {};
              var getValueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;
              var arcOpts = chart.options.elements.arc;
              var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
              var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
              var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);

              return {
                text: label,
                fillStyle: fill,
                strokeStyle: stroke,
                lineWidth: bw,
                hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                index: i
              };
            });
          } else {
            return [];
          }
        }
      },

      onClick: function (e, legendItem) {
        var index = legendItem.index;
        var chart = this.chart;
        var i, ilen, meta;

        for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
          meta = chart.getDatasetMeta(i);
          meta.data[index].hidden = !meta.data[index].hidden;
        }

        chart.update();
      }
    },

    cutoutPercentage: 50,
    rotation: Math.PI * -0.5,
    circumference: Math.PI * 2.0,
    tooltips: {
      callbacks: {
        title: function () {
          return '';
        },
        label: function (tooltipItem, data) {
          return data.labels[tooltipItem.index] + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
        }
      }
    }
  };

  defaults.pie = helpers.clone(defaults.doughnut);
  helpers.extend(defaults.pie, {
    cutoutPercentage: 0
  });

  Chart.controllers.doughnut = Chart.controllers.pie = Chart.DatasetController.extend({

    dataElementType: Chart.elements.Arc,

    linkScales: helpers.noop,

    getRingIndex: function (datasetIndex) {
      var ringIndex = 0;

      for (var j = 0; j < datasetIndex; ++j) {
        if (this.chart.isDatasetVisible(j)) ++ringIndex;
      }

      return ringIndex;
    },

    update: function (reset) {
      var me = this;
      var chart = me.chart;
      var chartArea = chart.chartArea;
      var opts = chart.options;
      var arcOpts = opts.elements.arc;
      var availableWidth = chartArea.right - chartArea.left - arcOpts.borderWidth;
      var availableHeight = chartArea.bottom - chartArea.top - arcOpts.borderWidth;
      var minSize = Math.min(availableWidth, availableHeight);
      var offset = {
          x: 0,
          y: 0
        };
      var meta = me.getMeta();
      var cutoutPercentage = opts.cutoutPercentage;
      var circumference = opts.circumference;

      if (circumference < Math.PI * 2.0) {
        var startAngle = opts.rotation % (Math.PI * 2.0);

        startAngle += Math.PI * 2.0 * (startAngle >= Math.PI ? -1 : startAngle < -Math.PI ? 1 : 0);

        var endAngle = startAngle + circumference;
        var start = {x: Math.cos(startAngle), y: Math.sin(startAngle)};
        var end = {x: Math.cos(endAngle), y: Math.sin(endAngle)};
        var contains0 = (startAngle <= 0 && 0 <= endAngle) || (startAngle <= Math.PI * 2.0 && Math.PI * 2.0 <= endAngle);
        var contains90 = (startAngle <= Math.PI * 0.5 && Math.PI * 0.5 <= endAngle) || (startAngle <= Math.PI * 2.5 && Math.PI * 2.5 <= endAngle);
        var contains180 = (startAngle <= -Math.PI && -Math.PI <= endAngle) || (startAngle <= Math.PI && Math.PI <= endAngle);
        var contains270 = (startAngle <= -Math.PI * 0.5 && -Math.PI * 0.5 <= endAngle) || (startAngle <= Math.PI * 1.5 && Math.PI * 1.5 <= endAngle);
        var cutout = cutoutPercentage / 100.0;
        var min = {x: contains180 ? -1 : Math.min(start.x * (start.x < 0 ? 1 : cutout), end.x * (end.x < 0 ? 1 : cutout)), y: contains270 ? -1 : Math.min(start.y * (start.y < 0 ? 1 : cutout), end.y * (end.y < 0 ? 1 : cutout))};
        var max = {x: contains0 ? 1 : Math.max(start.x * (start.x > 0 ? 1 : cutout), end.x * (end.x > 0 ? 1 : cutout)), y: contains90 ? 1 : Math.max(start.y * (start.y > 0 ? 1 : cutout), end.y * (end.y > 0 ? 1 : cutout))};
        var size = {width: (max.x - min.x) * 0.5, height: (max.y - min.y) * 0.5};

        minSize = Math.min(availableWidth / size.width, availableHeight / size.height);
        offset = {x: (max.x + min.x) * -0.5, y: (max.y + min.y) * -0.5};
      }

      chart.borderWidth = me.getMaxBorderWidth(meta.data);
      chart.outerRadius = Math.max((minSize - chart.borderWidth) / 2, 0);
      chart.innerRadius = Math.max(cutoutPercentage ? (chart.outerRadius / 100) * (cutoutPercentage) : 1, 0);
      chart.radiusLength = (chart.outerRadius - chart.innerRadius) / chart.getVisibleDatasetCount();
      chart.offsetX = offset.x * chart.outerRadius;
      chart.offsetY = offset.y * chart.outerRadius;

      meta.total = me.calculateTotal();

      me.outerRadius = chart.outerRadius - (chart.radiusLength * me.getRingIndex(me.index));
      me.innerRadius = me.outerRadius - chart.radiusLength;

      helpers.each(meta.data, function (arc, index) {
        me.updateElement(arc, index, reset);
      });
    },

    updateElement: function (arc, index, reset) {
      var me = this;
      var chart = me.chart;
      var chartArea = chart.chartArea;
      var opts = chart.options;
      var animationOpts = opts.animation;
      var centerX = (chartArea.left + chartArea.right) / 2;
      var centerY = (chartArea.top + chartArea.bottom) / 2;
      var startAngle = opts.rotation;
      var endAngle = opts.rotation;
      var dataset = me.getDataset();
      var circumference = reset && animationOpts.animateRotate ? 0 : arc.hidden ? 0 : me.calculateCircumference(dataset.data[index]) * (opts.circumference / (2.0 * Math.PI));
      var innerRadius = reset && animationOpts.animateScale ? 0 : me.innerRadius;
      var outerRadius = reset && animationOpts.animateScale ? 0 : me.outerRadius;
      var valueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;

      helpers.extend(arc, {
        _datasetIndex: me.index,
        _index: index,
        _model: {
          x: centerX + chart.offsetX,
          y: centerY + chart.offsetY,
          startAngle: startAngle,
          endAngle: endAngle,
          circumference: circumference,
          outerRadius: outerRadius,
          innerRadius: innerRadius,
          label: valueAtIndexOrDefault(dataset.label, index, chart.data.labels[index])
        }
      });

      var model = arc._model;
      this.removeHoverStyle(arc);

      if (!reset || !animationOpts.animateRotate) {
        if (index === 0) {
          model.startAngle = opts.rotation;
        } else {
          model.startAngle = me.getMeta().data[index - 1]._model.endAngle;
        }

        model.endAngle = model.startAngle + model.circumference;
      }

      arc.pivot();
    },

    removeHoverStyle: function (arc) {
      Chart.DatasetController.prototype.removeHoverStyle.call(this, arc, this.chart.options.elements.arc);
    },

    calculateTotal: function () {
      var dataset = this.getDataset();
      var meta = this.getMeta();
      var total = 0;
      var value;

      helpers.each(meta.data, function (element, index) {
        value = dataset.data[index];

        if (!isNaN(value) && !element.hidden) {
          total += Math.abs(value);
        }
      });

      return total;
    },

    calculateCircumference: function (value) {
      var total = this.getMeta().total;

      if (total > 0 && !isNaN(value)) {
        return (Math.PI * 2.0) * (value / total);
      } else {
        return 0;
      }
    },

    getMaxBorderWidth: function (elements) {
      var max = 0;
      var index = this.index;
      var length = elements.length;
      var borderWidth, hoverWidth;

      for (var i = 0; i < length; i++) {
        borderWidth = elements[i]._model ? elements[i]._model.borderWidth : 0;
        hoverWidth = elements[i]._chart ? elements[i]._chart.config.data.datasets[index].hoverBorderWidth : 0;

        max = borderWidth > max ? borderWidth : max;
        max = hoverWidth > max ? hoverWidth : max;
      }

      return max;
    }
  });
};
}, {}],
18:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;

  Chart.defaults.line = {
    showLines: true,
    spanGaps: false,
    hover: {
      mode: 'label'
    },
    scales: {
      xAxes: [{
        type: 'category',
        id: 'x-axis-0'
      }],
      yAxes: [{
        type: 'linear',
        id: 'y-axis-0'
      }]
    }
  };

  function lineEnabled(dataset, options) {
    return helpers.getValueOrDefault(dataset.showLine, options.showLines);
  }

  Chart.controllers.line = Chart.DatasetController.extend({

    datasetElementType: Chart.elements.Line,

    dataElementType: Chart.elements.Point,

    addElementAndReset: function (index) {
      var me = this;
      var options = me.chart.options;
      var meta = me.getMeta();

      Chart.DatasetController.prototype.addElementAndReset.call(me, index);

      if (lineEnabled(me.getDataset(), options) && meta.dataset._model.tension !== 0) {
        me.updateBezierControlPoints();
      }
    },

    update: function (reset) {
      var me = this;
      var meta = me.getMeta();
      var line = meta.dataset;
      var points = meta.data || [];
      var options = me.chart.options;
      var lineElementOptions = options.elements.line;
      var scale = me.getScaleForId(meta.yAxisID);
      var i, ilen, custom;
      var dataset = me.getDataset();
      var showLine = lineEnabled(dataset, options);

      if (showLine) {
        custom = line.custom || {};

        if ((dataset.tension !== undefined) && (dataset.lineTension === undefined)) {
          dataset.lineTension = dataset.tension;
        }

        line._scale = scale;
        line._datasetIndex = me.index;
        line._children = points;
        line._model = {
          spanGaps: dataset.spanGaps ? dataset.spanGaps : options.spanGaps,
          tension: custom.tension ? custom.tension : helpers.getValueOrDefault(dataset.lineTension, lineElementOptions.tension),
          backgroundColor: custom.backgroundColor ? custom.backgroundColor : (dataset.backgroundColor || lineElementOptions.backgroundColor),
          borderWidth: custom.borderWidth ? custom.borderWidth : (dataset.borderWidth || lineElementOptions.borderWidth),
          borderColor: custom.borderColor ? custom.borderColor : (dataset.borderColor || lineElementOptions.borderColor),
          borderCapStyle: custom.borderCapStyle ? custom.borderCapStyle : (dataset.borderCapStyle || lineElementOptions.borderCapStyle),
          borderDash: custom.borderDash ? custom.borderDash : (dataset.borderDash || lineElementOptions.borderDash),
          borderDashOffset: custom.borderDashOffset ? custom.borderDashOffset : (dataset.borderDashOffset || lineElementOptions.borderDashOffset),
          borderJoinStyle: custom.borderJoinStyle ? custom.borderJoinStyle : (dataset.borderJoinStyle || lineElementOptions.borderJoinStyle),
          fill: custom.fill ? custom.fill : (dataset.fill !== undefined ? dataset.fill : lineElementOptions.fill),
          steppedLine: custom.steppedLine ? custom.steppedLine : helpers.getValueOrDefault(dataset.steppedLine, lineElementOptions.stepped),
          scaleTop: scale.top,
          scaleBottom: scale.bottom,
          scaleZero: scale.getBasePixel()
        };

        line.pivot();
      }

      for (i=0, ilen=points.length; i<ilen; ++i) me.updateElement(points[i], i, reset);

      if (showLine && line._model.tension !== 0) me.updateBezierControlPoints();

      for (i=0, ilen=points.length; i<ilen; ++i) points[i].pivot();
    },

    getPointBackgroundColor: function (point, index) {
      var backgroundColor = this.chart.options.elements.point.backgroundColor;
      var dataset = this.getDataset();
      var custom = point.custom || {};

      if (custom.backgroundColor) {
        backgroundColor = custom.backgroundColor;
      } else if (dataset.pointBackgroundColor) {
        backgroundColor = helpers.getValueAtIndexOrDefault(dataset.pointBackgroundColor, index, backgroundColor);
      } else if (dataset.backgroundColor) {
        backgroundColor = dataset.backgroundColor;
      }

      return backgroundColor;
    },

    getPointBorderColor: function (point, index) {
      var borderColor = this.chart.options.elements.point.borderColor;
      var dataset = this.getDataset();
      var custom = point.custom || {};

      if (custom.borderColor) {
        borderColor = custom.borderColor;
      } else if (dataset.pointBorderColor) {
        borderColor = helpers.getValueAtIndexOrDefault(dataset.pointBorderColor, index, borderColor);
      } else if (dataset.borderColor) {
        borderColor = dataset.borderColor;
      }

      return borderColor;
    },

    getPointBorderWidth: function (point, index) {
      var borderWidth = this.chart.options.elements.point.borderWidth;
      var dataset = this.getDataset();
      var custom = point.custom || {};

      if (custom.borderWidth) {
        borderWidth = custom.borderWidth;
      } else if (dataset.pointBorderWidth) {
        borderWidth = helpers.getValueAtIndexOrDefault(dataset.pointBorderWidth, index, borderWidth);
      } else if (dataset.borderWidth) {
        borderWidth = dataset.borderWidth;
      }

      return borderWidth;
    },

    updateElement: function (point, index, reset) {
      var me = this;
      var meta = me.getMeta();
      var custom = point.custom || {};
      var dataset = me.getDataset();
      var datasetIndex = me.index;
      var value = dataset.data[index];
      var yScale = me.getScaleForId(meta.yAxisID);
      var xScale = me.getScaleForId(meta.xAxisID);
      var pointOptions = me.chart.options.elements.point;
      var x, y;

      if ((dataset.radius !== undefined) && (dataset.pointRadius === undefined)) {
        dataset.pointRadius = dataset.radius;
      }
      if ((dataset.hitRadius !== undefined) && (dataset.pointHitRadius === undefined)) {
        dataset.pointHitRadius = dataset.hitRadius;
      }

      x = xScale.getPixelForValue(typeof value === 'object' ? value : NaN, index, datasetIndex, me.chart.isCombo);
      y = reset ? yScale.getBasePixel() : me.calculatePointY(value, index, datasetIndex);

      point._xScale = xScale;
      point._yScale = yScale;
      point._datasetIndex = datasetIndex;
      point._index = index;
      point._model = {
        x: x,
        y: y,
        skip: custom.skip || isNaN(x) || isNaN(y),
        radius: custom.radius || helpers.getValueAtIndexOrDefault(dataset.pointRadius, index, pointOptions.radius),
        pointStyle: custom.pointStyle || helpers.getValueAtIndexOrDefault(dataset.pointStyle, index, pointOptions.pointStyle),
        backgroundColor: me.getPointBackgroundColor(point, index),
        borderColor: me.getPointBorderColor(point, index),
        borderWidth: me.getPointBorderWidth(point, index),
        tension: meta.dataset._model ? meta.dataset._model.tension : 0,
        steppedLine: meta.dataset._model ? meta.dataset._model.steppedLine : false,
        hitRadius: custom.hitRadius || helpers.getValueAtIndexOrDefault(dataset.pointHitRadius, index, pointOptions.hitRadius)
      };
    },

    calculatePointY: function (value, index, datasetIndex) {
      var me = this;
      var chart = me.chart;
      var meta = me.getMeta();
      var yScale = me.getScaleForId(meta.yAxisID);
      var sumPos = 0;
      var sumNeg = 0;
      var i, ds, dsMeta;

      if (yScale.options.stacked) {
        for (i = 0; i < datasetIndex; i++) {
          ds = chart.data.datasets[i];
          dsMeta = chart.getDatasetMeta(i);
          if (dsMeta.type === 'line' && dsMeta.yAxisID === yScale.id && chart.isDatasetVisible(i)) {
            var stackedRightValue = Number(yScale.getRightValue(ds.data[index]));
            if (stackedRightValue < 0) {
              sumNeg += stackedRightValue || 0;
            } else {
              sumPos += stackedRightValue || 0;
            }
          }
        }

        var rightValue = Number(yScale.getRightValue(value));
        if (rightValue < 0) {
          return yScale.getPixelForValue(sumNeg + rightValue);
        } else {
          return yScale.getPixelForValue(sumPos + rightValue);
        }
      }

      return yScale.getPixelForValue(value);
    },

    updateBezierControlPoints: function () {
      var me = this;
      var meta = me.getMeta();
      var area = me.chart.chartArea;
      var points = (meta.data || []).filter(function (pt) { return !pt._model.skip; });
      var i, ilen, point, model, controlPoints;

      var needToCap = me.chart.options.elements.line.capBezierPoints;
      function capIfNecessary(pt, min, max) {
        return needToCap ? Math.max(Math.min(pt, max), min) : pt;
      }

      for (i=0, ilen=points.length; i<ilen; ++i) {
        point = points[i];
        model = point._model;
        controlPoints = helpers.splineCurve(
          helpers.previousItem(points, i)._model,
          model,
          helpers.nextItem(points, i)._model,
          meta.dataset._model.tension
        );

        model.controlPointPreviousX = capIfNecessary(controlPoints.previous.x, area.left, area.right);
        model.controlPointPreviousY = capIfNecessary(controlPoints.previous.y, area.top, area.bottom);
        model.controlPointNextX = capIfNecessary(controlPoints.next.x, area.left, area.right);
        model.controlPointNextY = capIfNecessary(controlPoints.next.y, area.top, area.bottom);
      }
    },

    draw: function (ease) {
      var me = this;
      var meta = me.getMeta();
      var points = meta.data || [];
      var easingDecimal = ease || 1;
      var i, ilen;

      for (i=0, ilen=points.length; i<ilen; ++i) {
        points[i].transition(easingDecimal);
      }

      if (lineEnabled(me.getDataset(), me.chart.options)) {
        meta.dataset.transition(easingDecimal).draw();
      }

      for (i=0, ilen=points.length; i<ilen; ++i) {
        points[i].draw();
      }
    },

    setHoverStyle: function (point) {
      var dataset = this.chart.data.datasets[point._datasetIndex];
      var index = point._index;
      var custom = point.custom || {};
      var model = point._model;

      model.radius = custom.hoverRadius || helpers.getValueAtIndexOrDefault(dataset.pointHoverRadius, index, this.chart.options.elements.point.hoverRadius);
      model.backgroundColor = custom.hoverBackgroundColor || helpers.getValueAtIndexOrDefault(dataset.pointHoverBackgroundColor, index, helpers.getHoverColor(model.backgroundColor));
      model.borderColor = custom.hoverBorderColor || helpers.getValueAtIndexOrDefault(dataset.pointHoverBorderColor, index, helpers.getHoverColor(model.borderColor));
      model.borderWidth = custom.hoverBorderWidth || helpers.getValueAtIndexOrDefault(dataset.pointHoverBorderWidth, index, model.borderWidth);
    },

    removeHoverStyle: function (point) {
      var me = this;
      var dataset = me.chart.data.datasets[point._datasetIndex];
      var index = point._index;
      var custom = point.custom || {};
      var model = point._model;

      if ((dataset.radius !== undefined) && (dataset.pointRadius === undefined)) {
        dataset.pointRadius = dataset.radius;
      }

      model.radius = custom.radius || helpers.getValueAtIndexOrDefault(dataset.pointRadius, index, me.chart.options.elements.point.radius);
      model.backgroundColor = me.getPointBackgroundColor(point, index);
      model.borderColor = me.getPointBorderColor(point, index);
      model.borderWidth = me.getPointBorderWidth(point, index);
    }
  });
};
}, {}],
19:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;

  Chart.defaults.polarArea = {
    scale: {
      type: 'radialLinear',
      lineArc: true,
      ticks: {
        beginAtZero: true
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true
    },
    startAngle: -0.5 * Math.PI,
    aspectRatio: 1,
    legendCallback: function (chart) {
      var text = [];
      text.push('<ul class="' + chart.id + '-legend">');

      var data = chart.data;
      var datasets = data.datasets;
      var labels = data.labels;

      if (datasets.length) {
        for (var i = 0; i < datasets[0].data.length; ++i) {
          text.push('<li><span style="background-color:' + datasets[0].backgroundColor[i] + '">');

          if (labels[i]) text.push(labels[i]);

          text.push('</span></li>');
        }
      }

      text.push('</ul>');
      return text.join("");
    },
    legend: {
      labels: {
        generateLabels: function (chart) {
          var data = chart.data;
          if (data.labels.length && data.datasets.length) {
            return data.labels.map(function (label, i) {
              var meta = chart.getDatasetMeta(0);
              var ds = data.datasets[0];
              var arc = meta.data[i];
              var custom = arc.custom || {};
              var getValueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;
              var arcOpts = chart.options.elements.arc;
              var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
              var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
              var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);

              return {
                text: label,
                fillStyle: fill,
                strokeStyle: stroke,
                lineWidth: bw,
                hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                index: i
              };
            });
          } else {
            return [];
          }
        }
      },

      onClick: function (e, legendItem) {
        var index = legendItem.index;
        var chart = this.chart;
        var i, ilen, meta;

        for (i = 0, ilen = (chart.data.datasets || []).length; i < ilen; ++i) {
          meta = chart.getDatasetMeta(i);
          meta.data[index].hidden = !meta.data[index].hidden;
        }

        chart.update();
      }
    },

    tooltips: {
      callbacks: {
        title: function () {
          return '';
        },
        label: function (tooltipItem, data) {
          return data.labels[tooltipItem.index] + ': ' + tooltipItem.yLabel;
        }
      }
    }
  };

  Chart.controllers.polarArea = Chart.DatasetController.extend({

    dataElementType: Chart.elements.Arc,

    linkScales: helpers.noop,

    update: function (reset) {
      var me = this;
      var chart = me.chart;
      var chartArea = chart.chartArea;
      var meta = me.getMeta();
      var opts = chart.options;
      var arcOpts = opts.elements.arc;
      var minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);

      chart.outerRadius = Math.max((minSize - arcOpts.borderWidth / 2) / 2, 0);
      chart.innerRadius = Math.max(opts.cutoutPercentage ? (chart.outerRadius / 100) * (opts.cutoutPercentage) : 1, 0);
      chart.radiusLength = (chart.outerRadius - chart.innerRadius) / chart.getVisibleDatasetCount();
      me.outerRadius = chart.outerRadius - (chart.radiusLength * me.index);
      me.innerRadius = me.outerRadius - chart.radiusLength;
      meta.count = me.countVisibleElements();

      helpers.each(meta.data, function (arc, index) {
        me.updateElement(arc, index, reset);
      });
    },

    updateElement: function (arc, index, reset) {
      var me = this;
      var chart = me.chart;
      var dataset = me.getDataset();
      var opts = chart.options;
      var animationOpts = opts.animation;
      var scale = chart.scale;
      var getValueAtIndexOrDefault = helpers.getValueAtIndexOrDefault;
      var labels = chart.data.labels;
      var circumference = me.calculateCircumference(dataset.data[index]);
      var centerX = scale.xCenter;
      var centerY = scale.yCenter;
      var visibleCount = 0;
      var meta = me.getMeta();

      for (var i = 0; i < index; ++i) {
        if (!isNaN(dataset.data[i]) && !meta.data[i].hidden) {
          ++visibleCount;
        }
      }

      var datasetStartAngle = opts.startAngle;
      var distance = arc.hidden ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);
      var startAngle = datasetStartAngle + (circumference * visibleCount);
      var endAngle = startAngle + (arc.hidden ? 0 : circumference);
      var resetRadius = animationOpts.animateScale ? 0 : scale.getDistanceFromCenterForValue(dataset.data[index]);

      helpers.extend(arc, {
        _datasetIndex: me.index,
        _index: index,
        _scale: scale,
        _model: {
          x: centerX,
          y: centerY,
          innerRadius: 0,
          outerRadius: reset ? resetRadius : distance,
          startAngle: reset && animationOpts.animateRotate ? datasetStartAngle : startAngle,
          endAngle: reset && animationOpts.animateRotate ? datasetStartAngle : endAngle,
          label: getValueAtIndexOrDefault(labels, index, labels[index])
        }
      });

      me.removeHoverStyle(arc);
      arc.pivot();
    },

    removeHoverStyle: function (arc) {
      Chart.DatasetController.prototype.removeHoverStyle.call(this, arc, this.chart.options.elements.arc);
    },

    countVisibleElements: function () {
      var dataset = this.getDataset();
      var meta = this.getMeta();
      var count = 0;

      helpers.each(meta.data, function (element, index) {
        if (!isNaN(dataset.data[index]) && !element.hidden) count++;
      });

      return count;
    },

    calculateCircumference: function (value) {
      var count = this.getMeta().count;

      if (count > 0 && !isNaN(value)) {
        return (2 * Math.PI) / count;
      } else {
        return 0;
      }
    }
  });
};
}, {}],
20:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;

  Chart.defaults.radar = {
    scale: {
      type: 'radialLinear'
    },
    elements: {
      line: {
        tension: 0
      }
    }
  };

  Chart.controllers.radar = Chart.DatasetController.extend({

    datasetElementType: Chart.elements.Line,

    dataElementType: Chart.elements.Point,

    linkScales: helpers.noop,

    addElementAndReset: function (index) {
      Chart.DatasetController.prototype.addElementAndReset.call(this, index);
      this.updateBezierControlPoints();
    },

    update: function (reset) {
      var me = this;
      var meta = me.getMeta();
      var line = meta.dataset;
      var points = meta.data;
      var custom = line.custom || {};
      var dataset = me.getDataset();
      var lineElementOptions = me.chart.options.elements.line;
      var scale = me.chart.scale;

      if ((dataset.tension !== undefined) && (dataset.lineTension === undefined)) {
        dataset.lineTension = dataset.tension;
      }

      helpers.extend(meta.dataset, {
        _datasetIndex: me.index,
        _children: points,
        _loop: true,
        _model: {
          tension: custom.tension ? custom.tension : helpers.getValueOrDefault(dataset.lineTension, lineElementOptions.tension),
          backgroundColor: custom.backgroundColor ? custom.backgroundColor : (dataset.backgroundColor || lineElementOptions.backgroundColor),
          borderWidth: custom.borderWidth ? custom.borderWidth : (dataset.borderWidth || lineElementOptions.borderWidth),
          borderColor: custom.borderColor ? custom.borderColor : (dataset.borderColor || lineElementOptions.borderColor),
          fill: custom.fill ? custom.fill : (dataset.fill !== undefined ? dataset.fill : lineElementOptions.fill),
          borderCapStyle: custom.borderCapStyle ? custom.borderCapStyle : (dataset.borderCapStyle || lineElementOptions.borderCapStyle),
          borderDash: custom.borderDash ? custom.borderDash : (dataset.borderDash || lineElementOptions.borderDash),
          borderDashOffset: custom.borderDashOffset ? custom.borderDashOffset : (dataset.borderDashOffset || lineElementOptions.borderDashOffset),
          borderJoinStyle: custom.borderJoinStyle ? custom.borderJoinStyle : (dataset.borderJoinStyle || lineElementOptions.borderJoinStyle),
          scaleTop: scale.top,
          scaleBottom: scale.bottom,
          scaleZero: scale.getBasePosition()
        }
      });

      meta.dataset.pivot();

      helpers.each(points, function (point, index) {
        me.updateElement(point, index, reset);
      }, me);

      me.updateBezierControlPoints();
    },
    updateElement: function (point, index, reset) {
      var me = this;
      var custom = point.custom || {};
      var dataset = me.getDataset();
      var scale = me.chart.scale;
      var pointElementOptions = me.chart.options.elements.point;
      var pointPosition = scale.getPointPositionForValue(index, dataset.data[index]);

      helpers.extend(point, {
        _datasetIndex: me.index,
        _index: index,
        _scale: scale,
        _model: {
          x: reset ? scale.xCenter : pointPosition.x,
          y: reset ? scale.yCenter : pointPosition.y,
          tension: custom.tension ? custom.tension : helpers.getValueOrDefault(dataset.tension, me.chart.options.elements.line.tension),
          radius: custom.radius ? custom.radius : helpers.getValueAtIndexOrDefault(dataset.pointRadius, index, pointElementOptions.radius),
          backgroundColor: custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.pointBackgroundColor, index, pointElementOptions.backgroundColor),
          borderColor: custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.pointBorderColor, index, pointElementOptions.borderColor),
          borderWidth: custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.pointBorderWidth, index, pointElementOptions.borderWidth),
          pointStyle: custom.pointStyle ? custom.pointStyle : helpers.getValueAtIndexOrDefault(dataset.pointStyle, index, pointElementOptions.pointStyle),
          hitRadius: custom.hitRadius ? custom.hitRadius : helpers.getValueAtIndexOrDefault(dataset.hitRadius, index, pointElementOptions.hitRadius)
        }
      });

      point._model.skip = custom.skip ? custom.skip : (isNaN(point._model.x) || isNaN(point._model.y));
    },
    updateBezierControlPoints: function () {
      var chartArea = this.chart.chartArea;
      var meta = this.getMeta();

      helpers.each(meta.data, function (point, index) {
        var model = point._model;
        var controlPoints = helpers.splineCurve(
          helpers.previousItem(meta.data, index, true)._model,
          model,
          helpers.nextItem(meta.data, index, true)._model,
          model.tension
        );

        model.controlPointPreviousX = Math.max(Math.min(controlPoints.previous.x, chartArea.right), chartArea.left);
        model.controlPointPreviousY = Math.max(Math.min(controlPoints.previous.y, chartArea.bottom), chartArea.top);
        model.controlPointNextX = Math.max(Math.min(controlPoints.next.x, chartArea.right), chartArea.left);
        model.controlPointNextY = Math.max(Math.min(controlPoints.next.y, chartArea.bottom), chartArea.top);

        point.pivot();
      });
    },

    draw: function (ease) {
      var meta = this.getMeta();
      var easingDecimal = ease || 1;

      helpers.each(meta.data, function (point) {
        point.transition(easingDecimal);
      });

      meta.dataset.transition(easingDecimal).draw();

      helpers.each(meta.data, function (point) {
        point.draw();
      });
    },

    setHoverStyle: function (point) {
      var dataset = this.chart.data.datasets[point._datasetIndex];
      var custom = point.custom || {};
      var index = point._index;
      var model = point._model;

      model.radius = custom.hoverRadius ? custom.hoverRadius : helpers.getValueAtIndexOrDefault(dataset.pointHoverRadius, index, this.chart.options.elements.point.hoverRadius);
      model.backgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : helpers.getValueAtIndexOrDefault(dataset.pointHoverBackgroundColor, index, helpers.getHoverColor(model.backgroundColor));
      model.borderColor = custom.hoverBorderColor ? custom.hoverBorderColor : helpers.getValueAtIndexOrDefault(dataset.pointHoverBorderColor, index, helpers.getHoverColor(model.borderColor));
      model.borderWidth = custom.hoverBorderWidth ? custom.hoverBorderWidth : helpers.getValueAtIndexOrDefault(dataset.pointHoverBorderWidth, index, model.borderWidth);
    },

    removeHoverStyle: function (point) {
      var dataset = this.chart.data.datasets[point._datasetIndex];
      var custom = point.custom || {};
      var index = point._index;
      var model = point._model;
      var pointElementOptions = this.chart.options.elements.point;

      model.radius = custom.radius ? custom.radius : helpers.getValueAtIndexOrDefault(dataset.radius, index, pointElementOptions.radius);
      model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : helpers.getValueAtIndexOrDefault(dataset.pointBackgroundColor, index, pointElementOptions.backgroundColor);
      model.borderColor = custom.borderColor ? custom.borderColor : helpers.getValueAtIndexOrDefault(dataset.pointBorderColor, index, pointElementOptions.borderColor);
      model.borderWidth = custom.borderWidth ? custom.borderWidth : helpers.getValueAtIndexOrDefault(dataset.pointBorderWidth, index, pointElementOptions.borderWidth);
    }
  });
};
}, {}],
21:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;

  Chart.defaults.global.animation = {
    duration: 1000,
    easing: 'easeOutQuart',
    onProgress: helpers.noop,
    onComplete: helpers.noop
  };

  Chart.Animation = Chart.Element.extend({
    currentStep: null,
    numSteps: 60,
    easing: '',
    render: null,
    onAnimationProgress: null,
    onAnimationComplete: null
  });

  Chart.animationService = {
    frameDuration: 17,
    animations: [],
    dropFrames: 0,
    request: null,
    addAnimation: function (chartInstance, animationObject, duration, lazy) {
      var me = this;

      if (!lazy) chartInstance.animating = true;

      for (var index = 0; index < me.animations.length; ++index) {
        if (me.animations[index].chartInstance === chartInstance) {
          me.animations[index].animationObject = animationObject;
          return;
        }
      }

      me.animations.push({
        chartInstance: chartInstance,
        animationObject: animationObject
      });

      if (me.animations.length === 1) me.requestAnimationFrame();
    },
    cancelAnimation: function (chartInstance) {
      var index = helpers.findIndex(this.animations, function (animationWrapper) {
        return animationWrapper.chartInstance === chartInstance;
      });

      if (index !== -1) {
        this.animations.splice(index, 1);
        chartInstance.animating = false;
      }
    },
    requestAnimationFrame: function () {
      var me = this;

      if (me.request === null) {
        me.request = helpers.requestAnimFrame.call(window, function () {
          me.request = null;
          me.startDigest();
        });
      }
    },
    startDigest: function () {
      var me = this;
      var startTime = Date.now();
      var framesToDrop = 0;

      if (me.dropFrames > 1) {
        framesToDrop = Math.floor(me.dropFrames);
        me.dropFrames = me.dropFrames % 1;
      }

      var i = 0;
      while (i < me.animations.length) {
        if (me.animations[i].animationObject.currentStep === null) {
          me.animations[i].animationObject.currentStep = 0;
        }

        me.animations[i].animationObject.currentStep += 1 + framesToDrop;

        if (me.animations[i].animationObject.currentStep > me.animations[i].animationObject.numSteps) {
          me.animations[i].animationObject.currentStep = me.animations[i].animationObject.numSteps;
        }

        me.animations[i].animationObject.render(me.animations[i].chartInstance, me.animations[i].animationObject);

        if (me.animations[i].animationObject.onAnimationProgress && me.animations[i].animationObject.onAnimationProgress.call) {
          me.animations[i].animationObject.onAnimationProgress.call(me.animations[i].chartInstance, me.animations[i]);
        }

        if (me.animations[i].animationObject.currentStep === me.animations[i].animationObject.numSteps) {
          if (me.animations[i].animationObject.onAnimationComplete && me.animations[i].animationObject.onAnimationComplete.call) {
            me.animations[i].animationObject.onAnimationComplete.call(me.animations[i].chartInstance, me.animations[i]);
          }

          me.animations[i].chartInstance.animating = false;
          me.animations.splice(i, 1);
        } else {
          ++i;
        }
      }

      var endTime = Date.now();
      var dropFrames = (endTime - startTime) / me.frameDuration;

      me.dropFrames += dropFrames;

      if (me.animations.length > 0) me.requestAnimationFrame();
    }
  };
};
}, {}],
22:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {
  var helpers = Chart.canvasHelpers = {};

  helpers.drawPoint = function (ctx, pointStyle, radius, x, y) {
    var type, edgeLength, xOffset, yOffset, height, size;

    if (typeof pointStyle === 'object') {
      type = pointStyle.toString();
      if (type === '[object HTMLImageElement]' || type === '[object HTMLCanvasElement]') {
        ctx.drawImage(pointStyle, x - pointStyle.width / 2, y - pointStyle.height / 2);
        return;
      }
    }

    if (isNaN(radius) || radius <= 0) return;

    switch (pointStyle) {
      case 'triangle':
        ctx.beginPath();
        edgeLength = 3 * radius / Math.sqrt(3);
        height = edgeLength * Math.sqrt(3) / 2;
        ctx.moveTo(x - edgeLength / 2, y + height / 3);
        ctx.lineTo(x + edgeLength / 2, y + height / 3);
        ctx.lineTo(x, y - 2 * height / 3);
        ctx.closePath();
        ctx.fill();

        break;
      case 'rect':
        size = 1 / Math.SQRT2 * radius;
        ctx.beginPath();
        ctx.fillRect(x - size, y - size, 2 * size,  2 * size);
        ctx.strokeRect(x - size, y - size, 2 * size, 2 * size);

        break;
      case 'rectRot':
        size = 1 / Math.SQRT2 * radius;
        ctx.beginPath();
        ctx.moveTo(x - size, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x, y - size);
        ctx.closePath();
        ctx.fill();

        break;
      case 'cross':
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y - radius);
        ctx.moveTo(x - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.closePath();

        break;
      case 'crossRot':
        ctx.beginPath();
        xOffset = Math.cos(Math.PI / 4) * radius;
        yOffset = Math.sin(Math.PI / 4) * radius;
        ctx.moveTo(x - xOffset, y - yOffset);
        ctx.lineTo(x + xOffset, y + yOffset);
        ctx.moveTo(x - xOffset, y + yOffset);
        ctx.lineTo(x + xOffset, y - yOffset);
        ctx.closePath();

        break;
      case 'star':
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y - radius);
        ctx.moveTo(x - radius, y);
        ctx.lineTo(x + radius, y);
        xOffset = Math.cos(Math.PI / 4) * radius;
        yOffset = Math.sin(Math.PI / 4) * radius;
        ctx.moveTo(x - xOffset, y - yOffset);
        ctx.lineTo(x + xOffset, y + yOffset);
        ctx.moveTo(x - xOffset, y + yOffset);
        ctx.lineTo(x + xOffset, y - yOffset);
        ctx.closePath();

        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(x - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.closePath();

        break;
      case 'dash':
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + radius, y);
        ctx.closePath();

        break;
      default:
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        break;
    }

    ctx.stroke();
  };
};
}, {}],
23:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;
  Chart.types = {};
  Chart.instances = {};
  Chart.controllers = {};

  Chart.Controller = function (instance) {
    this.chart = instance;
    this.config = instance.config;
    this.options = this.config.options = helpers.configMerge(Chart.defaults.global, Chart.defaults[this.config.type], this.config.options || {});
    this.id = helpers.uid();

    Object.defineProperty(this, 'data', {
      get: function () {
        return this.config.data;
      }
    });

    Chart.instances[this.id] = this;

    if (this.options.responsive) this.resize(true);

    this.initialize();
    return this;
  };

  helpers.extend(Chart.Controller.prototype, {

    initialize: function () {
      var me = this;
      Chart.plugins.notify('beforeInit', [me]);

      me.bindEvents();
      me.ensureScalesHaveIDs();
      me.buildOrUpdateControllers();
      me.buildScales();
      me.updateLayout();
      me.resetElements();
      me.initToolTip();
      me.update();

      Chart.plugins.notify('afterInit', [me]);

      return me;
    },

    clear: function () {
      helpers.clear(this.chart);
      return this;
    },

    stop: function () {
      Chart.animationService.cancelAnimation(this);
      return this;
    },

    resize: function resize(silent) {
      var me = this;
      var chart = me.chart;
      var canvas = chart.canvas;
      var newWidth = helpers.getMaximumWidth(canvas);
      var aspectRatio = chart.aspectRatio;
      var newHeight = (me.options.maintainAspectRatio && isNaN(aspectRatio) === false && isFinite(aspectRatio) && aspectRatio !== 0) ? newWidth / aspectRatio : helpers.getMaximumHeight(canvas);

      var sizeChanged = chart.width !== newWidth || chart.height !== newHeight;

      if (!sizeChanged) return me;

      canvas.width = chart.width = newWidth;
      canvas.height = chart.height = newHeight;

      helpers.retinaScale(chart);

      var newSize = { width: newWidth, height: newHeight };
      Chart.plugins.notify('resize', [me, newSize]);

      if (me.options.onResize) me.options.onResize(me, newSize);

      if (!silent) {
        me.stop();
        me.update(me.options.responsiveAnimationDuration);
      }

      return me;
    },

    ensureScalesHaveIDs: function () {
      var options = this.options;
      var scalesOptions = options.scales || {};
      var scaleOptions = options.scale;

      helpers.each(scalesOptions.xAxes, function (xAxisOptions, index) {
        xAxisOptions.id = xAxisOptions.id || ('x-axis-' + index);
      });

      helpers.each(scalesOptions.yAxes, function (yAxisOptions, index) {
        yAxisOptions.id = yAxisOptions.id || ('y-axis-' + index);
      });

      if (scaleOptions) {
        scaleOptions.id = scaleOptions.id || 'scale';
      }
    },

    buildScales: function () {
      var me = this;
      var options = me.options;
      var scales = me.scales = {};
      var items = [];

      if (options.scales) {
        items = items.concat(
          (options.scales.xAxes || []).map(function (xAxisOptions) {
            return { options: xAxisOptions, dtype: 'category' }; }),
          (options.scales.yAxes || []).map(function (yAxisOptions) {
            return { options: yAxisOptions, dtype: 'linear' }; }));
      }

      if (options.scale) {
        items.push({ options: options.scale, dtype: 'radialLinear', isDefault: true });
      }

      helpers.each(items, function (item) {
        var scaleOptions = item.options;
        var scaleType = helpers.getValueOrDefault(scaleOptions.type, item.dtype);
        var scaleClass = Chart.scaleService.getScaleConstructor(scaleType);

        if (!scaleClass) return;

        var scale = new scaleClass({
          id: scaleOptions.id,
          options: scaleOptions,
          ctx: me.chart.ctx,
          chart: me
        });

        scales[scale.id] = scale;

        if (item.isDefault) {
          me.scale = scale;
        }
      });

      Chart.scaleService.addScalesToLayout(this);
    },

    updateLayout: function () {
      Chart.layoutService.update(this, this.chart.width, this.chart.height);
    },

    buildOrUpdateControllers: function () {
      var me = this;
      var types = [];
      var newControllers = [];

      helpers.each(me.data.datasets, function (dataset, datasetIndex) {
        var meta = me.getDatasetMeta(datasetIndex);

        if (!meta.type) {
          meta.type = dataset.type || me.config.type;
        }

        types.push(meta.type);

        if (meta.controller) {
          meta.controller.updateIndex(datasetIndex);
        } else {
          meta.controller = new Chart.controllers[meta.type](me, datasetIndex);
          newControllers.push(meta.controller);
        }
      }, me);

      if (types.length > 1) {
        for (var i = 1; i < types.length; i++) {
          if (types[i] !== types[i - 1]) {
            me.isCombo = true;
            break;
          }
        }
      }

      return newControllers;
    },

    resetElements: function () {
      var me = this;
      helpers.each(me.data.datasets, function (dataset, datasetIndex) {
        me.getDatasetMeta(datasetIndex).controller.reset();
      }, me);
    },

    update: function update(animationDuration, lazy) {
      var me = this;
      Chart.plugins.notify('beforeUpdate', [me]);

      me.tooltip._data = me.data;

      var newControllers = me.buildOrUpdateControllers();

      helpers.each(me.data.datasets, function (dataset, datasetIndex) {
        me.getDatasetMeta(datasetIndex).controller.buildOrUpdateElements();
      }, me);

      Chart.layoutService.update(me, me.chart.width, me.chart.height);
      Chart.plugins.notify('afterScaleUpdate', [me]);

      helpers.each(newControllers, function (controller) {
        controller.reset();
      });

      me.updateDatasets();

      Chart.plugins.notify('afterUpdate', [me]);

      me.render(animationDuration, lazy);
    },

    updateDatasets: function () {
      var me = this;
      var i, ilen;

      if (Chart.plugins.notify('beforeDatasetsUpdate', [ me ])) {
        for (i = 0, ilen = me.data.datasets.length; i < ilen; ++i) {
          me.getDatasetMeta(i).controller.update();
        }

        Chart.plugins.notify('afterDatasetsUpdate', [ me ]);
      }
    },

    render: function render(duration, lazy) {
      var me = this;
      Chart.plugins.notify('beforeRender', [me]);

      var animationOptions = me.options.animation;
      if (animationOptions && ((typeof duration !== 'undefined' && duration !== 0) || (typeof duration === 'undefined' && animationOptions.duration !== 0))) {
        var animation = new Chart.Animation();

        animation.numSteps = (duration || animationOptions.duration) / 16.66;
        animation.easing = animationOptions.easing;
        animation.render = function (chartInstance, animationObject) {
          var easingFunction = helpers.easingEffects[animationObject.easing];
          var stepDecimal = animationObject.currentStep / animationObject.numSteps;
          var easeDecimal = easingFunction(stepDecimal);

          chartInstance.draw(easeDecimal, stepDecimal, animationObject.currentStep);
        };
        animation.onAnimationProgress = animationOptions.onProgress;
        animation.onAnimationComplete = animationOptions.onComplete;

        Chart.animationService.addAnimation(me, animation, duration, lazy);
      } else {
        me.draw();

        if (animationOptions && animationOptions.onComplete && animationOptions.onComplete.call) {
          animationOptions.onComplete.call(me);
        }
      }
      return me;
    },

    draw: function (ease) {
      var me = this;
      var easingDecimal = ease || 1;
      me.clear();

      Chart.plugins.notify('beforeDraw', [me, easingDecimal]);

      helpers.each(me.boxes, function (box) {
        box.draw(me.chartArea);
      }, me);

      if (me.scale) me.scale.draw();

      Chart.plugins.notify('beforeDatasetsDraw', [me, easingDecimal]);

      helpers.each(me.data.datasets, function (dataset, datasetIndex) {
        if (me.isDatasetVisible(datasetIndex)) {
          me.getDatasetMeta(datasetIndex).controller.draw(ease);
        }
      }, me, true);

      Chart.plugins.notify('afterDatasetsDraw', [me, easingDecimal]);

      me.tooltip.transition(easingDecimal).draw();

      Chart.plugins.notify('afterDraw', [me, easingDecimal]);
    },

    getElementAtEvent: function (e) {
      var me = this;
      var eventPosition = helpers.getRelativePosition(e, me.chart);
      var elementsArray = [];

      helpers.each(me.data.datasets, function (dataset, datasetIndex) {
        if (me.isDatasetVisible(datasetIndex)) {
          var meta = me.getDatasetMeta(datasetIndex);

          helpers.each(meta.data, function (element) {
            if (element.inRange(eventPosition.x, eventPosition.y)) {
              elementsArray.push(element);
              return elementsArray;
            }
          });
        }
      });

      return elementsArray.slice(0, 1);
    },

    getElementsAtEvent: function (e) {
      var me = this;
      var eventPosition = helpers.getRelativePosition(e, me.chart);
      var elementsArray = [];

      var found = (function () {
        if (me.data.datasets) {
          for (var i = 0; i < me.data.datasets.length; i++) {
            var meta = me.getDatasetMeta(i);
            if (me.isDatasetVisible(i)) {
              for (var j = 0; j < meta.data.length; j++) {
                if (meta.data[j].inRange(eventPosition.x, eventPosition.y)) {
                  return meta.data[j];
                }
              }
            }
          }
        }
      }).call(me);

      if (!found) return elementsArray;

      helpers.each(me.data.datasets, function (dataset, datasetIndex) {
        if (me.isDatasetVisible(datasetIndex)) {
          var meta = me.getDatasetMeta(datasetIndex);
          var element = meta.data[found._index];

          if (element && !element._view.skip) elementsArray.push(element);
        }
      }, me);

      return elementsArray;
    },

    getElementsAtXAxis: function (e) {
      var me = this;
      var eventPosition = helpers.getRelativePosition(e, me.chart);
      var elementsArray = [];

      var found = (function () {
        if (me.data.datasets) {
          for (var i = 0; i < me.data.datasets.length; i++) {
            var meta = me.getDatasetMeta(i);
            if (me.isDatasetVisible(i)) {
              for (var j = 0; j < meta.data.length; j++) {
                if (meta.data[j].inLabelRange(eventPosition.x, eventPosition.y)) {
                  return meta.data[j];
                }
              }
            }
          }
        }
      }).call(me);

      if (!found) return elementsArray;

      helpers.each(me.data.datasets, function (dataset, datasetIndex) {
        if (me.isDatasetVisible(datasetIndex)) {
          var meta = me.getDatasetMeta(datasetIndex);
          var index = helpers.findIndex(meta.data, function (it) {
            return found._model.x === it._model.x;
          });

          if (index !== -1 && !meta.data[index]._view.skip) elementsArray.push(meta.data[index]);
        }
      }, me);

      return elementsArray;
    },

    getElementsAtEventForMode: function (e, mode) {
      var me = this;
        switch (mode) {
        case 'single':
          return me.getElementAtEvent(e);
        case 'label':
          return me.getElementsAtEvent(e);
        case 'dataset':
          return me.getDatasetAtEvent(e);
              case 'x-axis':
                  return me.getElementsAtXAxis(e);
        default:
          return e;
      }
    },

    getDatasetAtEvent: function (e) {
      var elementsArray = this.getElementAtEvent(e);

      if (elementsArray.length > 0) {
        elementsArray = this.getDatasetMeta(elementsArray[0]._datasetIndex).data;
      }

      return elementsArray;
    },

    getDatasetMeta: function (datasetIndex) {
      var me = this;
      var dataset = me.data.datasets[datasetIndex];

      if (!dataset._meta) {
        dataset._meta = {};
      }

      var meta = dataset._meta[me.id];
      if (!meta) {
        meta = dataset._meta[me.id] = {
          type: null,
          data: [],
          dataset: null,
          controller: null,
          hidden: null,
          xAxisID: null,
          yAxisID: null
        };
      }

      return meta;
    },

    getVisibleDatasetCount: function () {
      var count = 0;

      for (var i = 0, ilen = this.data.datasets.length; i<ilen; ++i) {
         if (this.isDatasetVisible(i)) count++;
      }

      return count;
    },

    isDatasetVisible: function (datasetIndex) {
      var meta = this.getDatasetMeta(datasetIndex);
      return typeof meta.hidden === 'boolean'? !meta.hidden : !this.data.datasets[datasetIndex].hidden;
    },

    generateLegend: function () {
      return this.options.legendCallback(this);
    },

    destroy: function () {
      var me = this;
      me.stop();
      me.clear();
      helpers.unbindEvents(me, me.events);
      helpers.removeResizeListener(me.chart.canvas.parentNode);

      var canvas = me.chart.canvas;
      canvas.width = me.chart.width;
      canvas.height = me.chart.height;

      if (me.chart.originalDevicePixelRatio !== undefined) {
        me.chart.ctx.scale(1 / me.chart.originalDevicePixelRatio, 1 / me.chart.originalDevicePixelRatio);
      }

      canvas.style.width = me.chart.originalCanvasStyleWidth;
      canvas.style.height = me.chart.originalCanvasStyleHeight;

      Chart.plugins.notify('destroy', [me]);

      delete Chart.instances[me.id];
    },

    toBase64Image: function () {
      return this.chart.canvas.toDataURL.apply(this.chart.canvas, arguments);
    },

    initToolTip: function () {
      var me = this;
      me.tooltip = new Chart.Tooltip({
        _chart: me.chart,
        _chartInstance: me,
        _data: me.data,
        _options: me.options.tooltips
      }, me);
    },

    bindEvents: function () {
      var me = this;
      helpers.bindEvents(me, me.options.events, function (evt) {
        me.eventHandler(evt);
      });
    },

    updateHoverStyle: function (elements, mode, enabled) {
      var method = enabled? 'setHoverStyle' : 'removeHoverStyle';
      var element, i, ilen;

      switch (mode) {
        case 'single':
          elements = [ elements[0] ];
          break;

        case 'label':
        case 'dataset':
        case 'x-axis':
          break;

        default:
          return;
      }

      for (i=0, ilen=elements.length; i<ilen; ++i) {
        element = elements[i];

        if (element) this.getDatasetMeta(element._datasetIndex).controller[method](element);
      }
    },

    eventHandler: function eventHandler(e) {
      var me = this;
      var tooltip = me.tooltip;
      var options = me.options || {};
      var hoverOptions = options.hover;
      var tooltipsOptions = options.tooltips;

      me.lastActive = me.lastActive || [];
      me.lastTooltipActive = me.lastTooltipActive || [];

      if (e.type === 'mouseout') {
        me.active = [];
        me.tooltipActive = [];
      } else {
        me.active = me.getElementsAtEventForMode(e, hoverOptions.mode);
        me.tooltipActive =  me.getElementsAtEventForMode(e, tooltipsOptions.mode);
      }

      if (hoverOptions.onHover) hoverOptions.onHover.call(me, me.active);

      if (e.type === 'mouseup' || e.type === 'click') {
        if (options.onClick) options.onClick.call(me, e, me.active);
        if (me.legend && me.legend.handleEvent) me.legend.handleEvent(e);
      }

      if (me.lastActive.length) me.updateHoverStyle(me.lastActive, hoverOptions.mode, false);
      if (me.active.length && hoverOptions.mode) me.updateHoverStyle(me.active, hoverOptions.mode, true);

      if (tooltipsOptions.enabled || tooltipsOptions.custom) {
        tooltip.initialize();
        tooltip._active = me.tooltipActive;
        tooltip.update(true);
      }

      tooltip.pivot();

      if (!me.animating) {
        if (!helpers.arrayEquals(me.active, me.lastActive) ||
          !helpers.arrayEquals(me.tooltipActive, me.lastTooltipActive)) {

          me.stop();

          if (tooltipsOptions.enabled || tooltipsOptions.custom) tooltip.update(true);

          me.render(hoverOptions.animationDuration, true);
        }
      }

      me.lastActive = me.active;
      me.lastTooltipActive = me.tooltipActive;

      return me;
    }
  });
};
}, {}],
24:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;
  var noop = helpers.noop;

  Chart.DatasetController = function (chart, datasetIndex) {
    this.initialize.call(this, chart, datasetIndex);
  };

  helpers.extend(Chart.DatasetController.prototype, {

    datasetElementType: null,

    dataElementType: null,

    initialize: function (chart, datasetIndex) {
      var me = this;
      me.chart = chart;
      me.index = datasetIndex;
      me.linkScales();
      me.addElements();
    },

    updateIndex: function (datasetIndex) {
      this.index = datasetIndex;
    },

    linkScales: function () {
      var me = this;
      var meta = me.getMeta();
      var dataset = me.getDataset();

      if (meta.xAxisID === null) {
        meta.xAxisID = dataset.xAxisID || me.chart.options.scales.xAxes[0].id;
      }
      if (meta.yAxisID === null) {
        meta.yAxisID = dataset.yAxisID || me.chart.options.scales.yAxes[0].id;
      }
    },

    getDataset: function () {
      return this.chart.data.datasets[this.index];
    },

    getMeta: function () {
      return this.chart.getDatasetMeta(this.index);
    },

    getScaleForId: function (scaleID) {
      return this.chart.scales[scaleID];
    },

    reset: function () {
      this.update(true);
    },

    createMetaDataset: function () {
      var me = this;
      var type = me.datasetElementType;

      return type && new type({
        _chart: me.chart.chart,
        _datasetIndex: me.index
      });
    },

    createMetaData: function (index) {
      var me = this;
      var type = me.dataElementType;

      return type && new type({
        _chart: me.chart.chart,
        _datasetIndex: me.index,
        _index: index
      });
    },

    addElements: function () {
      var me = this;
      var meta = me.getMeta();
      var data = me.getDataset().data || [];
      var metaData = meta.data;
      var i, ilen;

      for (i=0, ilen=data.length; i<ilen; ++i) {
        metaData[i] = metaData[i] || me.createMetaData(meta, i);
      }

      meta.dataset = meta.dataset || me.createMetaDataset();
    },

    addElementAndReset: function (index) {
      var me = this;
      var element = me.createMetaData(index);
      me.getMeta().data.splice(index, 0, element);
      me.updateElement(element, index, true);
    },

    buildOrUpdateElements: function () {
      var meta = this.getMeta();
      var md = meta.data;
      var numData = this.getDataset().data.length;
      var numMetaData = md.length;

      if (numData < numMetaData) {
        md.splice(numData, numMetaData - numData);
      } else if (numData > numMetaData) {
        for (var index = numMetaData; index < numData; ++index) {
          this.addElementAndReset(index);
        }
      }
    },

    update: noop,

    draw: function (ease) {
      var easingDecimal = ease || 1;

      helpers.each(this.getMeta().data, function (element) {
        element.transition(easingDecimal).draw();
      });
    },

    removeHoverStyle: function (element, elementOpts) {
      var dataset = this.chart.data.datasets[element._datasetIndex];
      var index = element._index;
      var custom = element.custom || {};
      var valueOrDefault = helpers.getValueAtIndexOrDefault;
      var model = element._model;

      model.backgroundColor = custom.backgroundColor ? custom.backgroundColor : valueOrDefault(dataset.backgroundColor, index, elementOpts.backgroundColor);
      model.borderColor = custom.borderColor ? custom.borderColor : valueOrDefault(dataset.borderColor, index, elementOpts.borderColor);
      model.borderWidth = custom.borderWidth ? custom.borderWidth : valueOrDefault(dataset.borderWidth, index, elementOpts.borderWidth);
    },

    setHoverStyle: function (element) {
      var dataset = this.chart.data.datasets[element._datasetIndex];
      var index = element._index;
      var custom = element.custom || {};
      var valueOrDefault = helpers.getValueAtIndexOrDefault;
      var getHoverColor = helpers.getHoverColor;
      var model = element._model;

      model.backgroundColor = custom.hoverBackgroundColor ? custom.hoverBackgroundColor : valueOrDefault(dataset.hoverBackgroundColor, index, getHoverColor(model.backgroundColor));
      model.borderColor = custom.hoverBorderColor ? custom.hoverBorderColor : valueOrDefault(dataset.hoverBorderColor, index, getHoverColor(model.borderColor));
      model.borderWidth = custom.hoverBorderWidth ? custom.hoverBorderWidth : valueOrDefault(dataset.hoverBorderWidth, index, model.borderWidth);
    }

    });


  Chart.DatasetController.extend = helpers.inherits;
};
}, {}],
25:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;

  Chart.elements = {};

  Chart.Element = function (configuration) {
    helpers.extend(this, configuration);
    this.initialize.apply(this, arguments);
  };

  helpers.extend(Chart.Element.prototype, {

    initialize: function () {
      this.hidden = false;
    },

    pivot: function () {
      var me = this;

      if (!me._view) {
        me._view = helpers.clone(me._model);
      }

      me._start = helpers.clone(me._view);
      return me;
    },

    transition: function (ease) {
      var me = this;

      if (!me._view) {
        me._view = helpers.clone(me._model);
      }
      if (ease === 1) {
        me._view = me._model;
        me._start = null;
        return me;
      }
      if (!me._start) me.pivot();

      helpers.each(me._model, function (value, key) {

        if (key[0] === '_') {
          // Only non-underscored properties
        } else if (!me._view.hasOwnProperty(key)) {
          if (typeof value === 'number' && !isNaN(me._view[key])) {
            me._view[key] = value * ease;
          } else {
            me._view[key] = value;
          }
        } else if (value === me._view[key]) {
          // It's the same! Woohoo!
        } else if (typeof value === 'string') {
          try {
            var color = helpers.color(me._model[key]).mix(helpers.color(me._start[key]), ease);
            me._view[key] = color.rgbString();
          } catch (err) {
            me._view[key] = value;
          }
        } else if (typeof value === 'number') {
          var startVal = me._start[key] !== undefined && isNaN(me._start[key]) === false ? me._start[key] : 0;
          me._view[key] = ((me._model[key] - startVal) * ease) + startVal;
        } else {
          me._view[key] = value;
        }
      }, me);

      return me;
    },

    tooltipPosition: function () {
      return {
        x: this._model.x,
        y: this._model.y
      };
    },

    hasValue: function () {
      return helpers.isNumber(this._model.x) && helpers.isNumber(this._model.y);
    }
  });

  Chart.Element.extend = helpers.inherits;

};
}, {}],
26:[function (require, module, exports){
'use strict';

var color = require(3);

module.exports = function (Chart) {

  var helpers = Chart.helpers = {};

  helpers.each = function (loopable, callback, self, reverse) {
    var i, len;

    if (helpers.isArray(loopable)) {
      len = loopable.length;

      if (reverse) {
        for (i = len - 1; i >= 0; i--) callback.call(self, loopable[i], i);
      } else {
        for (i = 0; i < len; i++) callback.call(self, loopable[i], i);
      }
    } else if (typeof loopable === 'object') {
      var keys = Object.keys(loopable);

      len = keys.length;

      for (i = 0; i < len; i++) callback.call(self, loopable[keys[i]], keys[i]);
    }
  };

  helpers.clone = function (obj) {
    var objClone = {};

    helpers.each(obj, function (value, key) {
      if (helpers.isArray(value)) {
        objClone[key] = value.slice(0);
      } else if (typeof value === 'object' && value !== null) {
        objClone[key] = helpers.clone(value);
      } else {
        objClone[key] = value;
      }
    });

    return objClone;
  };

  helpers.extend = function (base) {
    var setFn = function (value, key) { base[key] = value; };

    for (var i = 1, ilen = arguments.length; i < ilen; i++) {
      helpers.each(arguments[i], setFn);
    }

    return base;
  };

  helpers.configMerge = function (_base) {
    var base = helpers.clone(_base);
    helpers.each(Array.prototype.slice.call(arguments, 1), function (extension) {
      helpers.each(extension, function (value, key) {
        if (key === 'scales') {
          base[key] = helpers.scaleMerge(base.hasOwnProperty(key) ? base[key] : {}, value);
        } else if (key === 'scale') {
          base[key] = helpers.configMerge(base.hasOwnProperty(key) ? base[key] : {}, Chart.scaleService.getScaleDefaults(value.type), value);
        } else if (base.hasOwnProperty(key) && helpers.isArray(base[key]) && helpers.isArray(value)) {
          var baseArray = base[key];

          helpers.each(value, function (valueObj, index) {
            if (index < baseArray.length) {
              if (typeof baseArray[index] === 'object' && baseArray[index] !== null && typeof valueObj === 'object' && valueObj !== null) {
                baseArray[index] = helpers.configMerge(baseArray[index], valueObj);
              } else {
                baseArray[index] = valueObj;
              }
            } else {
              baseArray.push(valueObj);
            }
          });
        } else if (base.hasOwnProperty(key) && typeof base[key] === 'object' && base[key] !== null && typeof value === 'object') {
          base[key] = helpers.configMerge(base[key], value);
        } else {
          base[key] = value;
        }
      });
    });

    return base;
  };

  helpers.scaleMerge = function (_base, extension) {
    var base = helpers.clone(_base);

    helpers.each(extension, function (value, key) {
      if (key === 'xAxes' || key === 'yAxes') {
        if (base.hasOwnProperty(key)) {
          helpers.each(value, function (valueObj, index) {
            var axisType = helpers.getValueOrDefault(valueObj.type, key === 'xAxes' ? 'category' : 'linear');
            var axisDefaults = Chart.scaleService.getScaleDefaults(axisType);

            if (index >= base[key].length || !base[key][index].type) {
              base[key].push(helpers.configMerge(axisDefaults, valueObj));
            } else if (valueObj.type && valueObj.type !== base[key][index].type) {
              base[key][index] = helpers.configMerge(base[key][index], axisDefaults, valueObj);
            } else {
              base[key][index] = helpers.configMerge(base[key][index], valueObj);
            }
          });
        } else {
          base[key] = [];
          helpers.each(value, function (valueObj) {
            var axisType = helpers.getValueOrDefault(valueObj.type, key === 'xAxes' ? 'category' : 'linear');
            base[key].push(helpers.configMerge(Chart.scaleService.getScaleDefaults(axisType), valueObj));
          });
        }
      } else if (base.hasOwnProperty(key) && typeof base[key] === 'object' && base[key] !== null && typeof value === 'object') {
        base[key] = helpers.configMerge(base[key], value);
      } else {
        base[key] = value;
      }
    });

    return base;
  };

  helpers.getValueAtIndexOrDefault = function (value, index, defaultValue) {
    if (value === undefined || value === null) return defaultValue;

    if (helpers.isArray(value)) {
      return index < value.length ? value[index] : defaultValue;
    }

    return value;
  };

  helpers.getValueOrDefault = function (value, defaultValue) {
    return value === undefined ? defaultValue : value;
  };

  helpers.indexOf = Array.prototype.indexOf ?
    function (array, item) { return array.indexOf(item); } :
    function (array, item) {
      for (var i = 0, ilen = array.length; i < ilen; ++i) {
        if (array[i] === item) return i;
      }
      return -1;
    };

  helpers.where = function (collection, filterCallback) {
    if (helpers.isArray(collection) && Array.prototype.filter) {
      return collection.filter(filterCallback);
    } else {
      var filtered = [];

      helpers.each(collection, function (item) {
        if (filterCallback(item)) filtered.push(item);
      });

      return filtered;
    }
  };

  helpers.findIndex = Array.prototype.findIndex ?
    function (array, callback, scope) { return array.findIndex(callback, scope); } :
    function (array, callback, scope) {
      scope = scope === undefined? array : scope;
      for (var i = 0, ilen = array.length; i < ilen; ++i) {
        if (callback.call(scope, array[i], i, array)) return i;
      }
      return -1;
    };

  helpers.findNextWhere = function (arrayToSearch, filterCallback, startIndex) {
    if (startIndex === undefined || startIndex === null) {
      startIndex = -1;
    }

    for (var i = startIndex + 1; i < arrayToSearch.length; i++) {
      var currentItem = arrayToSearch[i];

      if (filterCallback(currentItem)) return currentItem;
    }
  };

  helpers.findPreviousWhere = function (arrayToSearch, filterCallback, startIndex) {
    if (startIndex === undefined || startIndex === null) {
      startIndex = arrayToSearch.length;
    }

    for (var i = startIndex - 1; i >= 0; i--) {
      var currentItem = arrayToSearch[i];
      if (filterCallback(currentItem)) return currentItem;
    }
  };

  helpers.inherits = function (extensions) {
    var parent = this;
    var ChartElement = (extensions && extensions.hasOwnProperty("constructor")) ? extensions.constructor : function () {
      return parent.apply(this, arguments);
    };

    var Surrogate = function () {
      this.constructor = ChartElement;
    };

    Surrogate.prototype = parent.prototype;
    ChartElement.prototype = new Surrogate();
    ChartElement.extend = helpers.inherits;

    if (extensions) helpers.extend(ChartElement.prototype, extensions);

    ChartElement.__super__ = parent.prototype;

    return ChartElement;
  };

  helpers.noop = function () {};

  helpers.uid = (function () {
    var id = 0;
    return function () {
      return id++;
    };
  })();

  helpers.isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  helpers.almostEquals = function (x, y, epsilon) {
    return Math.abs(x - y) < epsilon;
  };

  helpers.max = function (array) {
    return array.reduce(function (max, value) {
      if (!isNaN(value)) {
        return Math.max(max, value);
      } else {
        return max;
      }
    }, Number.NEGATIVE_INFINITY);
  };

  helpers.min = function (array) {
    return array.reduce(function (min, value) {
      if (!isNaN(value)) {
        return Math.min(min, value);
      } else {
        return min;
      }
    }, Number.POSITIVE_INFINITY);
  };

  helpers.sign = Math.sign ?
    function (x) { return Math.sign(x); } :
    function (x) {
      x = +x;

      if (x === 0 || isNaN(x)) return x;

      return x > 0 ? 1 : -1;
    };

  helpers.log10 = Math.log10 ?
    function (x) { return Math.log10(x); } :
    function (x) {
      return Math.log(x) / Math.LN10;
    };

  helpers.toRadians = function (degrees) {
    return degrees * (Math.PI / 180);
  };

  helpers.toDegrees = function (radians) {
    return radians * (180 / Math.PI);
  };

  helpers.getAngleFromPoint = function (centrePoint, anglePoint) {
    var distanceFromXCenter = anglePoint.x - centrePoint.x;
    var distanceFromYCenter = anglePoint.y - centrePoint.y;
    var radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);
    var angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);

    if (angle < (-0.5 * Math.PI)) {
      angle += 2.0 * Math.PI;
    }

    return {
      angle: angle,
      distance: radialDistanceFromCenter
    };
  };

  helpers.aliasPixel = function (pixelWidth) {
    return (pixelWidth % 2 === 0) ? 0 : 0.5;
  };

  helpers.splineCurve = function (firstPoint, middlePoint, afterPoint, t) {
    var previous = firstPoint.skip ? middlePoint : firstPoint;
    var current = middlePoint;
    var next = afterPoint.skip ? middlePoint : afterPoint;
    var d01 = Math.sqrt(Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2));
    var d12 = Math.sqrt(Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2));
    var s01 = d01 / (d01 + d12);
    var s12 = d12 / (d01 + d12);

    s01 = isNaN(s01) ? 0 : s01;
    s12 = isNaN(s12) ? 0 : s12;

    var fa = t * s01;
    var fb = t * s12;

    return {
      previous: {
        x: current.x - fa * (next.x - previous.x),
        y: current.y - fa * (next.y - previous.y)
      },
      next: {
        x: current.x + fb * (next.x - previous.x),
        y: current.y + fb * (next.y - previous.y)
      }
    };
  };

  helpers.nextItem = function (collection, index, loop) {
    if (loop) {
      return index >= collection.length - 1 ? collection[0] : collection[index + 1];
    }

    return index >= collection.length - 1 ? collection[collection.length - 1] : collection[index + 1];
  };

  helpers.previousItem = function (collection, index, loop) {
    if (loop) {
      return index <= 0 ? collection[collection.length - 1] : collection[index - 1];
    }

    return index <= 0 ? collection[0] : collection[index - 1];
  };

  helpers.niceNum = function (range, round) {
    var exponent = Math.floor(helpers.log10(range));
    var fraction = range / Math.pow(10, exponent);
    var niceFraction;

    if (round) {
      if (fraction < 1.5) {
        niceFraction = 1;
      } else if (fraction < 3) {
        niceFraction = 2;
      } else if (fraction < 7) {
        niceFraction = 5;
      } else {
        niceFraction = 10;
      }
    } else {
      if (fraction <= 1.0) {
        niceFraction = 1;
      } else if (fraction <= 2) {
        niceFraction = 2;
      } else if (fraction <= 5) {
        niceFraction = 5;
      } else {
        niceFraction = 10;
      }
    }

    return niceFraction * Math.pow(10, exponent);
  };

  var easingEffects = helpers.easingEffects = {
    linear: function (t) {
      return t;
    },
    easeInQuad: function (t) {
      return t * t;
    },
    easeOutQuad: function (t) {
      return -1 * t * (t - 2);
    },
    easeInOutQuad: function (t) {
      if ((t /= 1 / 2) < 1) {
        return 1 / 2 * t * t;
      }
      return -1 / 2 * ((--t) * (t - 2) - 1);
    },
    easeInCubic: function (t) {
      return t * t * t;
    },
    easeOutCubic: function (t) {
      return 1 * ((t = t / 1 - 1) * t * t + 1);
    },
    easeInOutCubic: function (t) {
      if ((t /= 1 / 2) < 1) {
        return 1 / 2 * t * t * t;
      }
      return 1 / 2 * ((t -= 2) * t * t + 2);
    },
    easeInQuart: function (t) {
      return t * t * t * t;
    },
    easeOutQuart: function (t) {
      return -1 * ((t = t / 1 - 1) * t * t * t - 1);
    },
    easeInOutQuart: function (t) {
      if ((t /= 1 / 2) < 1) {
        return 1 / 2 * t * t * t * t;
      }
      return -1 / 2 * ((t -= 2) * t * t * t - 2);
    },
    easeInQuint: function (t) {
      return 1 * (t /= 1) * t * t * t * t;
    },
    easeOutQuint: function (t) {
      return 1 * ((t = t / 1 - 1) * t * t * t * t + 1);
    },
    easeInOutQuint: function (t) {
      if ((t /= 1 / 2) < 1) {
        return 1 / 2 * t * t * t * t * t;
      }
      return 1 / 2 * ((t -= 2) * t * t * t * t + 2);
    },
    easeInSine: function (t) {
      return -1 * Math.cos(t / 1 * (Math.PI / 2)) + 1;
    },
    easeOutSine: function (t) {
      return 1 * Math.sin(t / 1 * (Math.PI / 2));
    },
    easeInOutSine: function (t) {
      return -1 / 2 * (Math.cos(Math.PI * t / 1) - 1);
    },
    easeInExpo: function (t) {
      return (t === 0) ? 1 : 1 * Math.pow(2, 10 * (t / 1 - 1));
    },
    easeOutExpo: function (t) {
      return (t === 1) ? 1 : 1 * (-Math.pow(2, -10 * t / 1) + 1);
    },
    easeInOutExpo: function (t) {
      if (t === 0) return 0;
      if (t === 1) return 1;
      if ((t /= 1 / 2) < 1) {
        return 1 / 2 * Math.pow(2, 10 * (t - 1));
      }
      return 1 / 2 * (-Math.pow(2, -10 * --t) + 2);
    },
    easeInCirc: function (t) {
      if (t >= 1) return t;
      return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1);
    },
    easeOutCirc: function (t) {
      return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t);
    },
    easeInOutCirc: function (t) {
      if ((t /= 1 / 2) < 1) {
        return -1 / 2 * (Math.sqrt(1 - t * t) - 1);
      }
      return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    },
    easeInElastic: function (t) {
      var s = 1.70158;
      var p = 0;
      var a = 1;

      if (t === 0) return 0;
      if ((t /= 1) === 1) return 1;

      if (!p) {
        p = 1 * 0.3;
      }

      if (a < Math.abs(1)) {
        a = 1;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(1 / a);
      }

      return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
    },
    easeOutElastic: function (t) {
      var s = 1.70158;
      var p = 0;
      var a = 1;

      if (t === 0) return 0;
      if ((t /= 1) === 1) return 1;

      if (!p) {
        p = 1 * 0.3;
      }

      if (a < Math.abs(1)) {
        a = 1;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(1 / a);
      }

      return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1;
    },
    easeInOutElastic: function (t) {
      var s = 1.70158;
      var p = 0;
      var a = 1;

      if (t === 0) return 0;
      if ((t /= 1 / 2) === 2) return 1;

      if (!p) {
        p = 1 * (0.3 * 1.5);
      }

      if (a < Math.abs(1)) {
        a = 1;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(1 / a);
      }

      if (t < 1) {
        return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
      }

      return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * 0.5 + 1;
    },
    easeInBack: function (t) {
      var s = 1.70158;
      return 1 * (t /= 1) * t * ((s + 1) * t - s);
    },
    easeOutBack: function (t) {
      var s = 1.70158;
      return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1);
    },
    easeInOutBack: function (t) {
      var s = 1.70158;
      if ((t /= 1 / 2) < 1) {
        return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));
      }
      return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
    },
    easeInBounce: function (t) {
      return 1 - easingEffects.easeOutBounce(1 - t);
    },
    easeOutBounce: function (t) {
      if ((t /= 1) < (1 / 2.75)) {
        return 1 * (7.5625 * t * t);
      } else if (t < (2 / 2.75)) {
        return 1 * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75);
      } else if (t < (2.5 / 2.75)) {
        return 1 * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375);
      } else {
        return 1 * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375);
      }
    },
    easeInOutBounce: function (t) {
      if (t < 1 / 2) {
        return easingEffects.easeInBounce(t * 2) * 0.5;
      }
      return easingEffects.easeOutBounce(t * 2 - 1) * 0.5 + 1 * 0.5;
    }
  };

  helpers.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
  })();

  helpers.cancelAnimFrame = (function () {
    return window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.oCancelAnimationFrame ||
      window.msCancelAnimationFrame ||
      function (callback) {
        return window.clearTimeout(callback, 1000 / 60);
      };
  })();

  helpers.getRelativePosition = function (evt, chart) {
    var e = evt.originalEvent || evt;
    var canvas = evt.currentTarget || evt.srcElement;
    var boundingRect = canvas.getBoundingClientRect();
    var mouseX, mouseY;

    var touches = e.touches;
    if (touches && touches.length > 0) {
      mouseX = touches[0].clientX;
      mouseY = touches[0].clientY;
    } else {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    var paddingLeft = parseFloat(helpers.getStyle(canvas, 'padding-left'));
    var paddingTop = parseFloat(helpers.getStyle(canvas, 'padding-top'));
    var paddingRight = parseFloat(helpers.getStyle(canvas, 'padding-right'));
    var paddingBottom = parseFloat(helpers.getStyle(canvas, 'padding-bottom'));
    var width = boundingRect.right - boundingRect.left - paddingLeft - paddingRight;
    var height = boundingRect.bottom - boundingRect.top - paddingTop - paddingBottom;

    mouseX = Math.round((mouseX - boundingRect.left - paddingLeft) / (width) * canvas.width / chart.currentDevicePixelRatio);
    mouseY = Math.round((mouseY - boundingRect.top - paddingTop) / (height) * canvas.height / chart.currentDevicePixelRatio);

    return {
      x: mouseX,
      y: mouseY
    };

  };

  helpers.addEvent = function (node, eventType, method) {
    if (node.addEventListener) {
      node.addEventListener(eventType, method);
    } else if (node.attachEvent) {
      node.attachEvent('on' + eventType, method);
    } else {
      node['on' + eventType] = method;
    }
  };

  helpers.removeEvent = function (node, eventType, handler) {
    if (node.removeEventListener) {
      node.removeEventListener(eventType, handler, false);
    } else if (node.detachEvent) {
      node.detachEvent('on' + eventType, handler);
    } else {
      node['on' + eventType] = helpers.noop;
    }
  };

  helpers.bindEvents = function (chartInstance, arrayOfEvents, handler) {
    var events = chartInstance.events = chartInstance.events || {};

    helpers.each(arrayOfEvents, function (eventName) {
      events[eventName] = function () {
        handler.apply(chartInstance, arguments);
      };
      helpers.addEvent(chartInstance.chart.canvas, eventName, events[eventName]);
    });
  };

  helpers.unbindEvents = function (chartInstance, arrayOfEvents) {
    var canvas = chartInstance.chart.canvas;
    helpers.each(arrayOfEvents, function (handler, eventName) {
      helpers.removeEvent(canvas, eventName, handler);
    });
  };

  function parseMaxStyle(styleValue, node, parentProperty) {
    var valueInPixels;

    if (typeof(styleValue) === 'string') {
      valueInPixels = parseInt(styleValue, 10);

      if (styleValue.indexOf('%') !== -1) {
        valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
      }
    } else {
      valueInPixels = styleValue;
    }

    return valueInPixels;
  }

  function isConstrainedValue(value) {
    return value !== undefined &&  value !== null && value !== 'none';
  }

  function getConstraintDimension(domNode, maxStyle, percentageProperty) {
    var view = document.defaultView;
    var parentNode = domNode.parentNode;
    var constrainedNode = view.getComputedStyle(domNode)[maxStyle];
    var constrainedContainer = view.getComputedStyle(parentNode)[maxStyle];
    var hasCNode = isConstrainedValue(constrainedNode);
    var hasCContainer = isConstrainedValue(constrainedContainer);
    var infinity = Number.POSITIVE_INFINITY;

    if (hasCNode || hasCContainer) {
      return Math.min(
        hasCNode? parseMaxStyle(constrainedNode, domNode, percentageProperty) : infinity,
        hasCContainer? parseMaxStyle(constrainedContainer, parentNode, percentageProperty) : infinity);
    }

    return 'none';
  }

  helpers.getConstraintWidth = function (domNode) {
    return getConstraintDimension(domNode, 'max-width', 'clientWidth');
  };

  helpers.getConstraintHeight = function (domNode) {
    return getConstraintDimension(domNode, 'max-height', 'clientHeight');
  };

  helpers.getMaximumWidth = function (domNode) {
    var container = domNode.parentNode;
    var padding = parseInt(helpers.getStyle(container, 'padding-left')) + parseInt(helpers.getStyle(container, 'padding-right'));
    var w = container.clientWidth - padding;
    var cw = helpers.getConstraintWidth(domNode);
    return isNaN(cw)? w : Math.min(w, cw);
  };

  helpers.getMaximumHeight = function (domNode) {
    var container = domNode.parentNode;
    var padding = parseInt(helpers.getStyle(container, 'padding-top')) + parseInt(helpers.getStyle(container, 'padding-bottom'));
    var h = container.clientHeight - padding;
    var ch = helpers.getConstraintHeight(domNode);
    return isNaN(ch)? h : Math.min(h, ch);
  };

  helpers.getStyle = function (el, property) {
    return el.currentStyle ?
      el.currentStyle[property] :
      document.defaultView.getComputedStyle(el, null).getPropertyValue(property);
  };

  helpers.retinaScale = function (chart) {
    var ctx = chart.ctx;
    var canvas = chart.canvas;
    var width = canvas.width;
    var height = canvas.height;
    var pixelRatio = chart.currentDevicePixelRatio = window.devicePixelRatio || 1;

    if (pixelRatio !== 1) {
      canvas.height = height * pixelRatio;
      canvas.width = width * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);
      chart.originalDevicePixelRatio = chart.originalDevicePixelRatio || pixelRatio;
    }

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  };

  helpers.clear = function (chart) {
    chart.ctx.clearRect(0, 0, chart.width, chart.height);
  };

  helpers.fontString = function (pixelSize, fontStyle, fontFamily) {
    return fontStyle + ' ' + pixelSize + 'px ' + fontFamily;
  };

  helpers.longestText = function (ctx, font, arrayOfThings, cache) {
    cache = cache || {};

    var data = cache.data = cache.data || {};
    var gc = cache.garbageCollect = cache.garbageCollect || [];

    if (cache.font !== font) {
      data = cache.data = {};
      gc = cache.garbageCollect = [];
      cache.font = font;
    }

    ctx.font = font;
    var longest = 0;
    helpers.each(arrayOfThings, function (thing) {
      if (thing !== undefined && thing !== null && helpers.isArray(thing) !== true) {
        longest = helpers.measureText(ctx, data, gc, longest, thing);
      } else if (helpers.isArray(thing)) {
        helpers.each(thing, function (nestedThing) {
          if (nestedThing !== undefined && nestedThing !== null && !helpers.isArray(nestedThing)) {
            longest = helpers.measureText(ctx, data, gc, longest, nestedThing);
          }
        });
      }
    });

    var gcLen = gc.length / 2;
    if (gcLen > arrayOfThings.length) {
      for (var i = 0; i < gcLen; i++) delete data[gc[i]];
      gc.splice(0, gcLen);
    }

    return longest;
  };

  helpers.measureText = function (ctx, data, gc, longest, string) {
    var textWidth = data[string];
    if (!textWidth) {
      textWidth = data[string] = ctx.measureText(string).width;
      gc.push(string);
    }
    if (textWidth > longest) {
      longest = textWidth;
    }
    return longest;
  };

  helpers.numberOfLabelLines = function (arrayOfThings) {
    var numberOfLines = 1;
    helpers.each(arrayOfThings, function (thing) {
      if (helpers.isArray(thing)) {
        if (thing.length > numberOfLines) {
          numberOfLines = thing.length;
        }
      }
    });
    return numberOfLines;
  };

  helpers.drawRoundedRectangle = function (ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  helpers.color = function (c) {
    if (!color) {
      console.log('Color.js not found!');
      return c;
    }

    if (c instanceof CanvasGradient) return color(Chart.defaults.global.defaultColor);

    return color(c);
  };
  helpers.addResizeListener = function (node, callback) {
    var hiddenIframe = document.createElement('iframe');
    var hiddenIframeClass = 'chartjs-hidden-iframe';

    if (hiddenIframe.classlist) {
      hiddenIframe.classlist.add(hiddenIframeClass);
    } else {
      hiddenIframe.setAttribute('class', hiddenIframeClass);
    }

    var style = hiddenIframe.style;
    style.width = '100%';
    style.display = 'block';
    style.border = 0;
    style.height = 0;
    style.margin = 0;
    style.position = 'absolute';
    style.left = 0;
    style.right = 0;
    style.top = 0;
    style.bottom = 0;

    node.insertBefore(hiddenIframe, node.firstChild);

    (hiddenIframe.contentWindow || hiddenIframe).onresize = function () {
      if (callback) callback();
    };
  };

  helpers.removeResizeListener = function (node) {
    var hiddenIframe = node.querySelector('.chartjs-hidden-iframe');

    if (hiddenIframe) hiddenIframe.parentNode.removeChild(hiddenIframe);
  };

  helpers.isArray = Array.isArray ?
    function (obj) { return Array.isArray(obj); } :
    function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };

  helpers.arrayEquals = function (a0, a1) {
    var i, ilen, v0, v1;

    if (!a0 || !a1 || a0.length !== a1.length) return false;

    for (i = 0, ilen=a0.length; i < ilen; ++i) {
      v0 = a0[i];
      v1 = a1[i];

      if (v0 instanceof Array && v1 instanceof Array) {
        if (!helpers.arrayEquals(v0, v1)) return false;
      } else if (v0 !== v1) {
        return false;
      }
    }

    return true;
  };

  helpers.callCallback = function (fn, args, _tArg) {
    if (fn && typeof fn.call === 'function') fn.apply(_tArg, args);
  };

  helpers.getHoverColor = function (color) {
    return (color instanceof CanvasPattern) ?
      color :
      helpers.color(color).saturate(0.5).darken(0.1).rgbString();
  };
};

},{ "3" : 3 }],
27:[function (require, module, exports){
'use strict';

module.exports = function () {

  var Chart = function (context, config) {
    var me = this;
    var helpers = Chart.helpers;

    me.config = config || {
      data: {
        datasets: []
      }
    };

    if (context.length && context[0].getContext) {
      context = context[0];
    }

    if (context.getContext) {
      context = context.getContext("2d");
    }

    me.ctx = context;
    me.canvas = context.canvas;

    context.canvas.style.display = context.canvas.style.display || 'block';

    me.width = context.canvas.width || parseInt(helpers.getStyle(context.canvas, 'width'), 10) || helpers.getMaximumWidth(context.canvas);
    me.height = context.canvas.height || parseInt(helpers.getStyle(context.canvas, 'height'), 10) || helpers.getMaximumHeight(context.canvas);

    me.aspectRatio = me.width / me.height;

    if (isNaN(me.aspectRatio) || isFinite(me.aspectRatio) === false) {
      me.aspectRatio = config.aspectRatio !== undefined ? config.aspectRatio : 2;
    }

    me.originalCanvasStyleWidth = context.canvas.style.width;
    me.originalCanvasStyleHeight = context.canvas.style.height;

    helpers.retinaScale(me);
    me.controller = new Chart.Controller(me);

    helpers.addResizeListener(context.canvas.parentNode, function () {
      if (me.controller && me.controller.config.options.responsive) me.controller.resize();
    });

    return me.controller ? me.controller : me;

  };

  Chart.defaults = {
    global: {
      responsive: true,
      responsiveAnimationDuration: 0,
      maintainAspectRatio: true,
      events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
      hover: {
        onHover: null,
        mode: 'single',
        animationDuration: 400
      },
      onClick: null,
      defaultColor: 'rgba(60,71,88,0.1)',
      defaultFontColor: 'rgba(60,71,88,1)',
      defaultFontFamily: "'Fakt Soft Pro', Verdana, Tahoma, sans-serif",
      defaultFontSize: 16,
      defaultFontStyle: 'normal',
      showLines: true,
      elements: {},
      legendCallback: function (chart) {
        var text = [];
        text.push('<ul class="' + chart.id + '-legend">');

        for (var i = 0; i < chart.data.datasets.length; i++) {
          text.push('<li><span style="background-color:' + chart.data.datasets[i].backgroundColor + '"></span>');
          if (chart.data.datasets[i].label) text.push(chart.data.datasets[i].label);
          text.push('</li>');
        }

        text.push('</ul>');

        return text.join('');
      }
    }
  };

  Chart.Chart = Chart;

  return Chart;

};
}, {}],
28:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;

  Chart.layoutService = {
    defaults: {},

    addBox: function (chartInstance, box) {
      if (!chartInstance.boxes) {
        chartInstance.boxes = [];
      }
      chartInstance.boxes.push(box);
    },

    removeBox: function (chartInstance, box) {
      if (!chartInstance.boxes) return;
      chartInstance.boxes.splice(chartInstance.boxes.indexOf(box), 1);
    },

    update: function (chartInstance, width, height) {
      if (!chartInstance) return;

      var xPadding = 0;
      var yPadding = 0;

      var leftBoxes = helpers.where(chartInstance.boxes, function (box) {
        return box.options.position === 'left';
      });
      var rightBoxes = helpers.where(chartInstance.boxes, function (box) {
        return box.options.position === 'right';
      });
      var topBoxes = helpers.where(chartInstance.boxes, function (box) {
        return box.options.position === 'top';
      });
      var bottomBoxes = helpers.where(chartInstance.boxes, function (box) {
        return box.options.position === 'bottom';
      });
      var chartAreaBoxes = helpers.where(chartInstance.boxes, function (box) {
        return box.options.position === 'chartArea';
      });

      topBoxes.sort(function (a, b) {
        return (b.options.fullWidth ? 1 : 0) - (a.options.fullWidth ? 1 : 0);
      });
      bottomBoxes.sort(function (a, b) {
        return (a.options.fullWidth ? 1 : 0) - (b.options.fullWidth ? 1 : 0);
      });

      var chartWidth = width - (2 * xPadding);
      var chartHeight = height - (2 * yPadding);
      var chartAreaWidth = chartWidth / 2;
      var chartAreaHeight = chartHeight / 2;
      var verticalBoxWidth = (width - chartAreaWidth) / (leftBoxes.length + rightBoxes.length);
      var horizontalBoxHeight = (height - chartAreaHeight) / (topBoxes.length + bottomBoxes.length);
      var maxChartAreaWidth = chartWidth;
      var maxChartAreaHeight = chartHeight;
      var minBoxSizes = [];

      helpers.each(leftBoxes.concat(rightBoxes, topBoxes, bottomBoxes), getMinimumBoxSize);

      function getMinimumBoxSize(box) {
        var minSize;
        var isHorizontal = box.isHorizontal();

        if (isHorizontal) {
          minSize = box.update(box.options.fullWidth ? chartWidth : maxChartAreaWidth, horizontalBoxHeight);
          maxChartAreaHeight -= minSize.height;
        } else {
          minSize = box.update(verticalBoxWidth, chartAreaHeight);
          maxChartAreaWidth -= minSize.width;
        }

        minBoxSizes.push({
          horizontal: isHorizontal,
          minSize: minSize,
          box: box
        });
      }

      var totalLeftBoxesWidth = xPadding;
      var totalRightBoxesWidth = xPadding;
      var totalTopBoxesHeight = yPadding;
      var totalBottomBoxesHeight = yPadding;

      helpers.each(leftBoxes.concat(rightBoxes), fitBox);
      helpers.each(leftBoxes, function (box) {
        totalLeftBoxesWidth += box.width;
      });
      helpers.each(rightBoxes, function (box) {
        totalRightBoxesWidth += box.width;
      });
      helpers.each(topBoxes.concat(bottomBoxes), fitBox);

      function fitBox(box) {
        var minBoxSize = helpers.findNextWhere(minBoxSizes, function (minBoxSize) {
          return minBoxSize.box === box;
        });

        if (minBoxSize) {
          if (box.isHorizontal()) {
            var scaleMargin = {
              left: totalLeftBoxesWidth,
              right: totalRightBoxesWidth,
              top: 0,
              bottom: 0
            };
            box.update(box.options.fullWidth ? chartWidth : maxChartAreaWidth, chartHeight / 2, scaleMargin);
          } else {
            box.update(minBoxSize.minSize.width, maxChartAreaHeight);
          }
        }
      }

      helpers.each(topBoxes, function (box) {
        totalTopBoxesHeight += box.height;
      });
      helpers.each(bottomBoxes, function (box) {
        totalBottomBoxesHeight += box.height;
      });
      helpers.each(leftBoxes.concat(rightBoxes), finalFitVerticalBox);

      function finalFitVerticalBox(box) {
        var minBoxSize = helpers.findNextWhere(minBoxSizes, function (minBoxSize) {
          return minBoxSize.box === box;
        });

        var scaleMargin = {
          left: 0,
          right: 0,
          top: totalTopBoxesHeight,
          bottom: totalBottomBoxesHeight
        };

        if (minBoxSize) box.update(minBoxSize.minSize.width, maxChartAreaHeight, scaleMargin);
      }

      totalLeftBoxesWidth = xPadding;
      totalRightBoxesWidth = xPadding;
      totalTopBoxesHeight = yPadding;
      totalBottomBoxesHeight = yPadding;

      helpers.each(leftBoxes, function (box) {
        totalLeftBoxesWidth += box.width;
      });
      helpers.each(rightBoxes, function (box) {
        totalRightBoxesWidth += box.width;
      });
      helpers.each(topBoxes, function (box) {
        totalTopBoxesHeight += box.height;
      });
      helpers.each(bottomBoxes, function (box) {
        totalBottomBoxesHeight += box.height;
      });

      var newMaxChartAreaHeight = height - totalTopBoxesHeight - totalBottomBoxesHeight;
      var newMaxChartAreaWidth = width - totalLeftBoxesWidth - totalRightBoxesWidth;

      if (newMaxChartAreaWidth !== maxChartAreaWidth || newMaxChartAreaHeight !== maxChartAreaHeight) {
        helpers.each(leftBoxes, function (box) {
          box.height = newMaxChartAreaHeight;
        });
        helpers.each(rightBoxes, function (box) {
          box.height = newMaxChartAreaHeight;
        });
        helpers.each(topBoxes, function (box) {
          if (!box.options.fullWidth) {
            box.width = newMaxChartAreaWidth;
          }
        });
        helpers.each(bottomBoxes, function (box) {
          if (!box.options.fullWidth) {
            box.width = newMaxChartAreaWidth;
          }
        });

        maxChartAreaHeight = newMaxChartAreaHeight;
        maxChartAreaWidth = newMaxChartAreaWidth;
      }

      var left = xPadding;
      var top = yPadding;

      helpers.each(leftBoxes.concat(topBoxes), placeBox);

      left += maxChartAreaWidth;
      top += maxChartAreaHeight;

      helpers.each(rightBoxes, placeBox);
      helpers.each(bottomBoxes, placeBox);

      function placeBox(box) {
        if (box.isHorizontal()) {
          box.left = box.options.fullWidth ? xPadding : totalLeftBoxesWidth;
          box.right = box.options.fullWidth ? width - xPadding : totalLeftBoxesWidth + maxChartAreaWidth;
          box.top = top;
          box.bottom = top + box.height;

          top = box.bottom;
        } else {
          box.left = left;
          box.right = left + box.width;
          box.top = totalTopBoxesHeight;
          box.bottom = totalTopBoxesHeight + maxChartAreaHeight;

          left = box.right;
        }
      }

      chartInstance.chartArea = {
        left: totalLeftBoxesWidth,
        top: totalTopBoxesHeight,
        right: totalLeftBoxesWidth + maxChartAreaWidth,
        bottom: totalTopBoxesHeight + maxChartAreaHeight
      };

      helpers.each(chartAreaBoxes, function (box) {
        box.left = chartInstance.chartArea.left;
        box.top = chartInstance.chartArea.top;
        box.right = chartInstance.chartArea.right;
        box.bottom = chartInstance.chartArea.bottom;

        box.update(maxChartAreaWidth, maxChartAreaHeight);
      });
    }
  };
};
}, {}],
29:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;
  var noop = helpers.noop;

  Chart.defaults.global.legend = {
    display: true,
    position: 'top',
    fullWidth: true,
    reverse: false,
    onClick: function (e, legendItem) {
      var index = legendItem.datasetIndex;
      var ci = this.chart;
      var meta = ci.getDatasetMeta(index);
      meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
      ci.update();
    },
    labels: {
      boxWidth: 16,
      padding: 10,
      generateLabels: function (chart) {
        var data = chart.data;
        return helpers.isArray(data.datasets) ? data.datasets.map(function (dataset, i) {
          return {
            text: dataset.label,
            fillStyle: (!helpers.isArray(dataset.backgroundColor) ? dataset.backgroundColor : dataset.backgroundColor[0]),
            hidden: !chart.isDatasetVisible(i),
            lineCap: dataset.borderCapStyle,
            lineDash: dataset.borderDash,
            lineDashOffset: dataset.borderDashOffset,
            lineJoin: dataset.borderJoinStyle,
            lineWidth: dataset.borderWidth,
            strokeStyle: dataset.borderColor,
            pointStyle: dataset.pointStyle,
            datasetIndex: i
          };
        }, this) : [];
      }
    }
  };

  Chart.Legend = Chart.Element.extend({
    initialize: function (config) {
      helpers.extend(this, config);
      this.legendHitBoxes = [];
      this.doughnutMode = false;
    },

    beforeUpdate: noop,

    update: function (maxWidth, maxHeight, margins) {
      var me = this;

      me.beforeUpdate();
      me.maxWidth = maxWidth;
      me.maxHeight = maxHeight;
      me.margins = margins;
      me.beforeSetDimensions();
      me.setDimensions();
      me.afterSetDimensions();
      me.beforeBuildLabels();
      me.buildLabels();
      me.afterBuildLabels();
      me.beforeFit();
      me.fit();
      me.afterFit();
      me.afterUpdate();

      return me.minSize;
    },

    afterUpdate: noop,

    beforeSetDimensions: noop,
    setDimensions: function () {
      var me = this;

      if (me.isHorizontal()) {
        me.width = me.maxWidth;
        me.left = 0;
        me.right = me.width;
      } else {
        me.height = me.maxHeight;
        me.top = 0;
        me.bottom = me.height;
      }

      me.paddingLeft = 0;
      me.paddingTop = 0;
      me.paddingRight = 0;
      me.paddingBottom = 0;

      me.minSize = {
        width: 0,
        height: 0
      };
    },

    afterSetDimensions: noop,

    beforeBuildLabels: noop,

    buildLabels: function () {
      var me = this;
      me.legendItems = me.options.labels.generateLabels.call(me, me.chart);
      if (me.options.reverse) me.legendItems.reverse();
    },

    afterBuildLabels: noop,

    beforeFit: noop,

    fit: function () {
      var me = this;
      var opts = me.options;
      var labelOpts = opts.labels;
      var display = opts.display;
      var ctx = me.ctx;

      var globalDefault = Chart.defaults.global;
      var itemOrDefault = helpers.getValueOrDefault;
      var fontSize = itemOrDefault(labelOpts.fontSize, globalDefault.defaultFontSize);
      var fontStyle = itemOrDefault(labelOpts.fontStyle, globalDefault.defaultFontStyle);
      var fontFamily = itemOrDefault(labelOpts.fontFamily, globalDefault.defaultFontFamily);
      var labelFont = helpers.fontString(fontSize, fontStyle, fontFamily);
      var hitboxes = me.legendHitBoxes = [];
      var minSize = me.minSize;
      var isHorizontal = me.isHorizontal();

      if (isHorizontal) {
        minSize.width = me.maxWidth;
        minSize.height = display ? 10 : 0;
      } else {
        minSize.width = display ? 10 : 0;
        minSize.height = me.maxHeight;
      }

      if (display) {
        ctx.font = labelFont;

        if (isHorizontal) {
          var lineWidths = me.lineWidths = [0];
          var totalHeight = me.legendItems.length ? fontSize + (labelOpts.padding) : 0;

          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';

          helpers.each(me.legendItems, function (legendItem, i) {
            var boxWidth = labelOpts.usePointStyle ?
              fontSize * Math.sqrt(2) :
              labelOpts.boxWidth;

            var width = boxWidth + (fontSize / 2) + ctx.measureText(legendItem.text).width;
            if (lineWidths[lineWidths.length - 1] + width + labelOpts.padding >= me.width) {
              totalHeight += fontSize + (labelOpts.padding);
              lineWidths[lineWidths.length] = me.left;
            }

            hitboxes[i] = {
              left: 0,
              top: 0,
              width: width,
              height: fontSize
            };

            lineWidths[lineWidths.length - 1] += width + labelOpts.padding;
          });

          minSize.height += totalHeight;
        } else {
          var vPadding = labelOpts.padding;
          var columnWidths = me.columnWidths = [];
          var totalWidth = labelOpts.padding;
          var currentColWidth = 0;
          var currentColHeight = 0;
          var itemHeight = fontSize + vPadding;

          helpers.each(me.legendItems, function (legendItem, i) {
            var boxWidth = labelOpts.usePointStyle ? 2 * labelOpts.boxWidth : labelOpts.boxWidth;
            var itemWidth = boxWidth + (fontSize / 2) + ctx.measureText(legendItem.text).width;

            if (currentColHeight + itemHeight > minSize.height) {
              totalWidth += currentColWidth + labelOpts.padding;

              columnWidths.push(currentColWidth);

              currentColWidth = 0;
              currentColHeight = 0;
            }

            currentColWidth = Math.max(currentColWidth, itemWidth);
            currentColHeight += itemHeight;

            hitboxes[i] = {
              left: 0,
              top: 0,
              width: itemWidth,
              height: fontSize
            };
          });

          totalWidth += currentColWidth;
          columnWidths.push(currentColWidth);
          minSize.width += totalWidth;
        }
      }

      me.width = minSize.width;
      me.height = minSize.height;
    },

    afterFit: noop,

    isHorizontal: function () {
      return this.options.position === 'top' || this.options.position === 'bottom';
    },

    draw: function () {
      var me = this;
      var opts = me.options;
      var labelOpts = opts.labels;
      var globalDefault = Chart.defaults.global;
      var lineDefault = globalDefault.elements.line;
      var legendWidth = me.width;
      var lineWidths = me.lineWidths;

      if (opts.display) {
        var ctx = me.ctx;
        var cursor;
        var itemOrDefault = helpers.getValueOrDefault;
        var fontColor = itemOrDefault(labelOpts.fontColor, globalDefault.defaultFontColor);
        var fontSize = itemOrDefault(labelOpts.fontSize, globalDefault.defaultFontSize);
        var fontStyle = itemOrDefault(labelOpts.fontStyle, globalDefault.defaultFontStyle);
        var fontFamily = itemOrDefault(labelOpts.fontFamily, globalDefault.defaultFontFamily);
        var labelFont = helpers.fontString(fontSize, fontStyle, fontFamily);

        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = fontColor;
        ctx.fillStyle = fontColor;
        ctx.font = labelFont;

        var boxWidth = labelOpts.boxWidth;
        var hitboxes = me.legendHitBoxes;

        var drawLegendBox = function (x, y, legendItem) {
          if (isNaN(boxWidth) || boxWidth <= 0) return;

          ctx.save();
          ctx.fillStyle = itemOrDefault(legendItem.fillStyle, globalDefault.defaultColor);
          ctx.lineCap = itemOrDefault(legendItem.lineCap, lineDefault.borderCapStyle);
          ctx.lineDashOffset = itemOrDefault(legendItem.lineDashOffset, lineDefault.borderDashOffset);
          ctx.lineJoin = itemOrDefault(legendItem.lineJoin, lineDefault.borderJoinStyle);
          ctx.lineWidth = itemOrDefault(legendItem.lineWidth, lineDefault.borderWidth);
          ctx.strokeStyle = itemOrDefault(legendItem.strokeStyle, globalDefault.defaultColor);

          if (ctx.setLineDash) {
            ctx.setLineDash(itemOrDefault(legendItem.lineDash, lineDefault.borderDash));
          }

          if (opts.labels && opts.labels.usePointStyle) {
            var radius = fontSize * Math.SQRT2 / 2;
            var offSet = radius / Math.SQRT2;
            var centerX = x + offSet;
            var centerY = y + offSet;

            Chart.canvasHelpers.drawPoint(ctx, legendItem.pointStyle, radius, centerX, centerY);
          } else {
            ctx.strokeRect(x, y, boxWidth, fontSize);
            ctx.fillRect(x, y, boxWidth, fontSize);
          }

          ctx.restore();
        };

        var fillText = function (x, y, legendItem, textWidth) {
          ctx.fillText(legendItem.text, boxWidth + (fontSize / 2) + x, y);

          if (legendItem.hidden) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.moveTo(boxWidth + (fontSize / 2) + x, y + (fontSize / 2));
            ctx.lineTo(boxWidth + (fontSize / 2) + x + textWidth, y + (fontSize / 2));
            ctx.stroke();
          }
        };
        var isHorizontal = me.isHorizontal();

        if (isHorizontal) {
          cursor = {
            x: me.left + ((legendWidth - lineWidths[0]) / 2),
            y: me.top + labelOpts.padding,
            line: 0
          };
        } else {
          cursor = {
            x: me.left + labelOpts.padding,
            y: me.top + labelOpts.padding,
            line: 0
          };
        }

        var itemHeight = fontSize + labelOpts.padding;
        helpers.each(me.legendItems, function (legendItem, i) {
          var textWidth = ctx.measureText(legendItem.text).width;
          var width = labelOpts.usePointStyle ?
              fontSize + (fontSize / 2) + textWidth :
              boxWidth + (fontSize / 2) + textWidth;
          var x = cursor.x;
          var y = cursor.y;

          if (isHorizontal) {
            if (x + width >= legendWidth) {
              y = cursor.y += itemHeight;
              cursor.line++;
              x = cursor.x = me.left + ((legendWidth - lineWidths[cursor.line]) / 2);
            }
          } else {
            if (y + itemHeight > me.bottom) {
              x = cursor.x = x + me.columnWidths[cursor.line] + labelOpts.padding;
              y = cursor.y = me.top;
              cursor.line++;
            }
          }

          drawLegendBox(x, y, legendItem);

          hitboxes[i].left = x;
          hitboxes[i].top = y;

          fillText(x, y, legendItem, textWidth);

          if (isHorizontal) {
            cursor.x += width + (labelOpts.padding);
          } else {
            cursor.y += itemHeight;
          }
        });
      }
    },

    handleEvent: function (e) {
      var me = this;
      var position = helpers.getRelativePosition(e, me.chart.chart);
      var x = position.x;
      var y = position.y;
      var opts = me.options;

      if (x >= me.left && x <= me.right && y >= me.top && y <= me.bottom) {
        var lh = me.legendHitBoxes;

        for (var i = 0; i < lh.length; ++i) {
          var hitBox = lh[i];

          if (x >= hitBox.left && x <= hitBox.left + hitBox.width && y >= hitBox.top && y <= hitBox.top + hitBox.height) {
            if (opts.onClick) opts.onClick.call(me, e, me.legendItems[i]);
            break;
          }
        }
      }
    }
  });

  Chart.plugins.register({
    beforeInit: function (chartInstance) {
      var opts = chartInstance.options;
      var legendOpts = opts.legend;

      if (legendOpts) {
        chartInstance.legend = new Chart.Legend({
          ctx: chartInstance.chart.ctx,
          options: legendOpts,
          chart: chartInstance
        });

        Chart.layoutService.addBox(chartInstance, chartInstance.legend);
      }
    }
  });
};
}, {}],
30:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var noop = Chart.helpers.noop;

  Chart.plugins = {
    _plugins: [],

    register: function (plugins) {
      var p = this._plugins;
      ([]).concat(plugins).forEach(function (plugin) {
        if (p.indexOf(plugin) === -1) p.push(plugin);
      });
    },

    unregister: function (plugins) {
      var p = this._plugins;
      ([]).concat(plugins).forEach(function (plugin) {
        var idx = p.indexOf(plugin);
        if (idx !== -1) p.splice(idx, 1);
      });
    },

    clear: function () {
      this._plugins = [];
    },

    count: function () {
      return this._plugins.length;
    },

    getAll: function () {
      return this._plugins;
    },

    notify: function (extension, args) {
      var plugins = this._plugins;
      var ilen = plugins.length;
      var i, plugin;

      for (i=0; i<ilen; ++i) {
        plugin = plugins[i];
        if (typeof plugin[extension] === 'function') {
          if (plugin[extension].apply(plugin, args || []) === false) return false;
        }
      }

      return true;
    }
  };

  Chart.PluginBase = Chart.Element.extend({
    beforeInit: noop,
    afterInit: noop,
    beforeUpdate: noop,
    afterUpdate: noop,
    beforeDraw: noop,
    afterDraw: noop,
    destroy: noop
  });

  Chart.pluginService = Chart.plugins;
};
}, {}],
31:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;

  Chart.defaults.scale = {
    display: true,
    position: 'left',
    gridLines: {
      display: true,
      color: 'rgba(229,234,244,1)',
      lineWidth: 1,
      drawBorder: true,
      drawOnChartArea: true,
      drawTicks: true,
      tickMarkLength: 10,
      zeroLineWidth: 1,
      zeroLineColor: 'rgba(229,234,244,1)',
      offsetGridLines: false
    },
    scaleLabel: {
      labelString: '',
      display: false
    },
    ticks: {
      beginAtZero: false,
      minRotation: 0,
      maxRotation: 50,
      mirror: false,
      padding: 10,
      reverse: false,
      display: true,
      autoSkip: true,
      autoSkipPadding: 0,
      labelOffset: 0,
      callback: function (value) {
        return helpers.isArray(value) ? value : '' + value;
      }
    }
  };

  Chart.Scale = Chart.Element.extend({
    beforeUpdate: function () {
      helpers.callCallback(this.options.beforeUpdate, [this]);
    },
    update: function (maxWidth, maxHeight, margins) {
      var me = this;

      me.beforeUpdate();
      me.maxWidth = maxWidth;
      me.maxHeight = maxHeight;
      me.margins = helpers.extend({
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }, margins);

      me.beforeSetDimensions();
      me.setDimensions();
      me.afterSetDimensions();
      me.beforeDataLimits();
      me.determineDataLimits();
      me.afterDataLimits();
      me.beforeBuildTicks();
      me.buildTicks();
      me.afterBuildTicks();
      me.beforeTickToLabelConversion();
      me.convertTicksToLabels();
      me.afterTickToLabelConversion();
      me.beforeCalculateTickRotation();
      me.calculateTickRotation();
      me.afterCalculateTickRotation();
      me.beforeFit();
      me.fit();
      me.afterFit();
      me.afterUpdate();

      return me.minSize;

    },

    afterUpdate: function () {
      helpers.callCallback(this.options.afterUpdate, [this]);
    },

    beforeSetDimensions: function () {
      helpers.callCallback(this.options.beforeSetDimensions, [this]);
    },

    setDimensions: function () {
      var me = this;

      if (me.isHorizontal()) {
        me.width = me.maxWidth;
        me.left = 0;
        me.right = me.width;
      } else {
        me.height = me.maxHeight;
        me.top = 0;
        me.bottom = me.height;
      }

      me.paddingLeft = 0;
      me.paddingTop = 0;
      me.paddingRight = 0;
      me.paddingBottom = 0;
    },

    afterSetDimensions: function () {
      helpers.callCallback(this.options.afterSetDimensions, [this]);
    },

    beforeDataLimits: function () {
      helpers.callCallback(this.options.beforeDataLimits, [this]);
    },

    determineDataLimits: helpers.noop,

    afterDataLimits: function () {
      helpers.callCallback(this.options.afterDataLimits, [this]);
    },

    beforeBuildTicks: function () {
      helpers.callCallback(this.options.beforeBuildTicks, [this]);
    },

    buildTicks: helpers.noop,

    afterBuildTicks: function () {
      helpers.callCallback(this.options.afterBuildTicks, [this]);
    },

    beforeTickToLabelConversion: function () {
      helpers.callCallback(this.options.beforeTickToLabelConversion, [this]);
    },

    convertTicksToLabels: function () {
      var me = this;
      me.ticks = me.ticks.map(function (numericalTick, index, ticks) {
          if (me.options.ticks.userCallback) {
            return me.options.ticks.userCallback(numericalTick, index, ticks);
          }
          return me.options.ticks.callback(numericalTick, index, ticks);
        },
        me);
    },

    afterTickToLabelConversion: function () {
      helpers.callCallback(this.options.afterTickToLabelConversion, [this]);
    },

    beforeCalculateTickRotation: function () {
      helpers.callCallback(this.options.beforeCalculateTickRotation, [this]);
    },

    calculateTickRotation: function () {
      var me = this;
      var context = me.ctx;
      var globalDefaults = Chart.defaults.global;
      var optionTicks = me.options.ticks;
      var tickFontSize = helpers.getValueOrDefault(optionTicks.fontSize, globalDefaults.defaultFontSize);
      var tickFontStyle = helpers.getValueOrDefault(optionTicks.fontStyle, globalDefaults.defaultFontStyle);
      var tickFontFamily = helpers.getValueOrDefault(optionTicks.fontFamily, globalDefaults.defaultFontFamily);
      var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);

      context.font = tickLabelFont;

      var firstWidth = context.measureText(me.ticks[0]).width;
      var lastWidth = context.measureText(me.ticks[me.ticks.length - 1]).width;
      var firstRotated;

      me.labelRotation = optionTicks.minRotation || 0;
      me.paddingRight = 0;
      me.paddingLeft = 0;

      if (me.options.display) {
        if (me.isHorizontal()) {
          me.paddingRight = lastWidth / 2 + 3;
          me.paddingLeft = firstWidth / 2 + 3;

          if (!me.longestTextCache) {
            me.longestTextCache = {};
          }

          var originalLabelWidth = helpers.longestText(context, tickLabelFont, me.ticks, me.longestTextCache);
          var labelWidth = originalLabelWidth;
          var cosRotation;
          var sinRotation;

          var tickWidth = me.getPixelForTick(1) - me.getPixelForTick(0) - 6;

          while (labelWidth > tickWidth && me.labelRotation < optionTicks.maxRotation) {
            cosRotation = Math.cos(helpers.toRadians(me.labelRotation));
            sinRotation = Math.sin(helpers.toRadians(me.labelRotation));
            firstRotated = cosRotation * firstWidth;

            if (firstRotated + tickFontSize / 2 > me.yLabelWidth) {
              me.paddingLeft = firstRotated + tickFontSize / 2;
            }

            me.paddingRight = tickFontSize / 2;

            if (sinRotation * originalLabelWidth > me.maxHeight) {
              me.labelRotation--;
              break;
            }

            me.labelRotation++;
            labelWidth = cosRotation * originalLabelWidth;
          }
        }
      }

      if (me.margins) {
        me.paddingLeft = Math.max(me.paddingLeft - me.margins.left, 0);
        me.paddingRight = Math.max(me.paddingRight - me.margins.right, 0);
      }
    },

    afterCalculateTickRotation: function () {
      helpers.callCallback(this.options.afterCalculateTickRotation, [this]);
    },

    beforeFit: function () {
      helpers.callCallback(this.options.beforeFit, [this]);
    },

    fit: function () {
      var me = this;
      var minSize = me.minSize = {
        width: 0,
        height: 0
      };
      var opts = me.options;
      var globalDefaults = Chart.defaults.global;
      var tickOpts = opts.ticks;
      var scaleLabelOpts = opts.scaleLabel;
      var display = opts.display;
      var isHorizontal = me.isHorizontal();
      var tickFontSize = helpers.getValueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);
      var tickFontStyle = helpers.getValueOrDefault(tickOpts.fontStyle, globalDefaults.defaultFontStyle);
      var tickFontFamily = helpers.getValueOrDefault(tickOpts.fontFamily, globalDefaults.defaultFontFamily);
      var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);
      var scaleLabelFontSize = helpers.getValueOrDefault(scaleLabelOpts.fontSize, globalDefaults.defaultFontSize);
      var tickMarkLength = opts.gridLines.tickMarkLength;

      if (isHorizontal) {
        minSize.width = me.isFullWidth() ? me.maxWidth - me.margins.left - me.margins.right : me.maxWidth;
      } else {
        minSize.width = display ? tickMarkLength : 0;
      }

      if (isHorizontal) {
        minSize.height = display ? tickMarkLength : 0;
      } else {
        minSize.height = me.maxHeight;
      }

      if (scaleLabelOpts.display && display) {
        if (isHorizontal) {
          minSize.height += (scaleLabelFontSize * 1.5);
        } else {
          minSize.width += (scaleLabelFontSize * 1.5);
        }
      }

      if (tickOpts.display && display) {
        if (!me.longestTextCache) {
          me.longestTextCache = {};
        }

        var largestTextWidth = helpers.longestText(me.ctx, tickLabelFont, me.ticks, me.longestTextCache);
        var tallestLabelHeightInLines = helpers.numberOfLabelLines(me.ticks);
        var lineSpace = tickFontSize * 0.5;

        if (isHorizontal) {
          me.longestLabelWidth = largestTextWidth;
          var labelHeight = (Math.sin(helpers.toRadians(me.labelRotation)) * me.longestLabelWidth) + (tickFontSize * tallestLabelHeightInLines) + (lineSpace * tallestLabelHeightInLines);

          minSize.height = Math.min(me.maxHeight, minSize.height + labelHeight);
          me.ctx.font = tickLabelFont;

          var firstLabelWidth = me.ctx.measureText(me.ticks[0]).width;
          var lastLabelWidth = me.ctx.measureText(me.ticks[me.ticks.length - 1]).width;
          var cosRotation = Math.cos(helpers.toRadians(me.labelRotation));
          var sinRotation = Math.sin(helpers.toRadians(me.labelRotation));
          me.paddingLeft = me.labelRotation !== 0 ? (cosRotation * firstLabelWidth) + 3 : firstLabelWidth / 2 + 3; // add 3 px to move away from canvas edges
          me.paddingRight = me.labelRotation !== 0 ? (sinRotation * (tickFontSize / 2)) + 3 : lastLabelWidth / 2 + 3; // when rotated
        } else {
          var maxLabelWidth = me.maxWidth - minSize.width;
          var mirror = tickOpts.mirror;

          if (!mirror) {
            largestTextWidth += me.options.ticks.padding;
          } else {
            largestTextWidth = 0;
          }

          if (largestTextWidth < maxLabelWidth) {
            minSize.width += largestTextWidth;
          } else {
            minSize.width = me.maxWidth;
          }

          me.paddingTop = tickFontSize / 2;
          me.paddingBottom = tickFontSize / 2;
        }
      }

      if (me.margins) {
        me.paddingLeft = Math.max(me.paddingLeft - me.margins.left, 0);
        me.paddingTop = Math.max(me.paddingTop - me.margins.top, 0);
        me.paddingRight = Math.max(me.paddingRight - me.margins.right, 0);
        me.paddingBottom = Math.max(me.paddingBottom - me.margins.bottom, 0);
      }

      me.width = minSize.width;
      me.height = minSize.height;
    },

    afterFit: function () {
      helpers.callCallback(this.options.afterFit, [this]);
    },

    isHorizontal: function () {
      return this.options.position === 'top' || this.options.position === 'bottom';
    },

    isFullWidth: function () {
      return (this.options.fullWidth);
    },

    getRightValue: function (rawValue) {
      if (rawValue === null || typeof(rawValue) === 'undefined') return NaN;
      if (typeof(rawValue) === 'number' && isNaN(rawValue)) return NaN;

      if (typeof(rawValue) === 'object') {
        if ((rawValue instanceof Date) || (rawValue.isValid)) {
          return rawValue;
        } else {
          return this.getRightValue(this.isHorizontal() ? rawValue.x : rawValue.y);
        }
      }

      return rawValue;
    },

    getLabelForIndex: helpers.noop,

    getPixelForValue: helpers.noop,

    getValueForPixel: helpers.noop,

    getPixelForTick: function (index, includeOffset) {
      var me = this;

      if (me.isHorizontal()) {
        var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
        var tickWidth = innerWidth / Math.max((me.ticks.length - ((me.options.gridLines.offsetGridLines) ? 0 : 1)), 1);
        var pixel = (tickWidth * index) + me.paddingLeft;

        if (includeOffset) {
          pixel += tickWidth / 2;
        }

        var finalVal = me.left + Math.round(pixel);
        finalVal += me.isFullWidth() ? me.margins.left : 0;
        return finalVal;
      } else {
        var innerHeight = me.height - (me.paddingTop + me.paddingBottom);
        return me.top + (index * (innerHeight / (me.ticks.length - 1)));
      }
    },

    getPixelForDecimal: function (decimal) {
      var me = this;

      if (me.isHorizontal()) {
        var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
        var valueOffset = (innerWidth * decimal) + me.paddingLeft;
        var finalVal = me.left + Math.round(valueOffset);
        finalVal += me.isFullWidth() ? me.margins.left : 0;
        return finalVal;
      } else {
        return me.top + (decimal * me.height);
      }
    },

    getBasePixel: function () {
      var me = this;
      var min = me.min;
      var max = me.max;

      return me.getPixelForValue(
        me.beginAtZero? 0:
        min < 0 && max < 0? max :
        min > 0 && max > 0? min :
        0);
    },

    draw: function (chartArea) {
      var me = this;
      var options = me.options;

      if (!options.display) return;

      var context = me.ctx;
      var globalDefaults = Chart.defaults.global;
      var optionTicks = options.ticks;
      var gridLines = options.gridLines;
      var scaleLabel = options.scaleLabel;
      var isRotated = me.labelRotation !== 0;
      var skipRatio;
      var useAutoskipper = optionTicks.autoSkip;
      var isHorizontal = me.isHorizontal();

      var maxTicks;
      if (optionTicks.maxTicksLimit) {
        maxTicks = optionTicks.maxTicksLimit;
      }

      var tickFontColor = helpers.getValueOrDefault(optionTicks.fontColor, globalDefaults.defaultFontColor);
      var tickFontSize = helpers.getValueOrDefault(optionTicks.fontSize, globalDefaults.defaultFontSize);
      var tickFontStyle = helpers.getValueOrDefault(optionTicks.fontStyle, globalDefaults.defaultFontStyle);
      var tickFontFamily = helpers.getValueOrDefault(optionTicks.fontFamily, globalDefaults.defaultFontFamily);
      var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);
      var tl = gridLines.tickMarkLength;
      var scaleLabelFontColor = helpers.getValueOrDefault(scaleLabel.fontColor, globalDefaults.defaultFontColor);
      var scaleLabelFontSize = helpers.getValueOrDefault(scaleLabel.fontSize, globalDefaults.defaultFontSize);
      var scaleLabelFontStyle = helpers.getValueOrDefault(scaleLabel.fontStyle, globalDefaults.defaultFontStyle);
      var scaleLabelFontFamily = helpers.getValueOrDefault(scaleLabel.fontFamily, globalDefaults.defaultFontFamily);
      var scaleLabelFont = helpers.fontString(scaleLabelFontSize, scaleLabelFontStyle, scaleLabelFontFamily);
      var labelRotationRadians = helpers.toRadians(me.labelRotation);
      var cosRotation = Math.cos(labelRotationRadians);
      var longestRotatedLabel = me.longestLabelWidth * cosRotation;

      context.fillStyle = tickFontColor;

      var itemsToDraw = [];

      if (isHorizontal) {
        skipRatio = false;

        if (isRotated) {
          longestRotatedLabel /= 2;
        }

        if ((longestRotatedLabel + optionTicks.autoSkipPadding) * me.ticks.length > (me.width - (me.paddingLeft + me.paddingRight))) {
          skipRatio = 1 + Math.floor(((longestRotatedLabel + optionTicks.autoSkipPadding) * me.ticks.length) / (me.width - (me.paddingLeft + me.paddingRight)));
        }

        if (maxTicks && me.ticks.length > maxTicks) {
          while (!skipRatio || me.ticks.length / (skipRatio || 1) > maxTicks) {
            if (!skipRatio) {
              skipRatio = 1;
            }
            skipRatio += 1;
          }
        }

        if (!useAutoskipper) {
          skipRatio = false;
        }
      }

      var xTickStart = options.position === 'right' ? me.left : me.right - tl;
      var xTickEnd = options.position === 'right' ? me.left + tl : me.right;
      var yTickStart = options.position === 'bottom' ? me.top : me.bottom - tl;
      var yTickEnd = options.position === 'bottom' ? me.top + tl : me.bottom;

      helpers.each(me.ticks, function (label, index) {
        if (label === undefined || label === null) return;

        var isLastTick = me.ticks.length === index + 1;
        var shouldSkip = (skipRatio > 1 && index % skipRatio > 0) || (index % skipRatio === 0 && index + skipRatio >= me.ticks.length);
        if (shouldSkip && !isLastTick || (label === undefined || label === null)) return;

        var lineWidth, lineColor;
        if (index === (typeof me.zeroLineIndex !== 'undefined' ? me.zeroLineIndex : 0)) {
          lineWidth = gridLines.zeroLineWidth;
          lineColor = gridLines.zeroLineColor;
        } else  {
          lineWidth = helpers.getValueAtIndexOrDefault(gridLines.lineWidth, index);
          lineColor = helpers.getValueAtIndexOrDefault(gridLines.color, index);
        }

        var tx1, ty1, tx2, ty2, x1, y1, x2, y2, labelX, labelY;
        var textAlign, textBaseline = 'middle';

        if (isHorizontal) {
          if (!isRotated) {
            textBaseline = options.position === 'top' ? 'bottom' : 'top';
          }

          textAlign = isRotated ? 'right' : 'center';

          var xLineValue = me.getPixelForTick(index) + helpers.aliasPixel(lineWidth);
          labelX = me.getPixelForTick(index, gridLines.offsetGridLines) + optionTicks.labelOffset;
          labelY = (isRotated) ? me.top + 12 : options.position === 'top' ? me.bottom - tl : me.top + tl;

          tx1 = tx2 = x1 = x2 = xLineValue;
          ty1 = yTickStart;
          ty2 = yTickEnd;
          y1 = chartArea.top;
          y2 = chartArea.bottom;
        } else {
          if (options.position === 'left') {
            if (optionTicks.mirror) {
              labelX = me.right + optionTicks.padding;
              textAlign = 'left';
            } else {
              labelX = me.right - optionTicks.padding;
              textAlign = 'right';
            }
          } else {
            if (optionTicks.mirror) {
              labelX = me.left - optionTicks.padding;
              textAlign = 'right';
            } else {
              labelX = me.left + optionTicks.padding;
              textAlign = 'left';
            }
          }

          var yLineValue = me.getPixelForTick(index);
          yLineValue += helpers.aliasPixel(lineWidth);
          labelY = me.getPixelForTick(index, gridLines.offsetGridLines);

          tx1 = xTickStart;
          tx2 = xTickEnd;
          x1 = chartArea.left;
          x2 = chartArea.right;
          ty1 = ty2 = y1 = y2 = yLineValue;
        }

        itemsToDraw.push({
          tx1: tx1,
          ty1: ty1,
          tx2: tx2,
          ty2: ty2,
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          labelX: labelX,
          labelY: labelY,
          glWidth: lineWidth,
          glColor: lineColor,
          rotation: -1 * labelRotationRadians,
          label: label,
          textBaseline: textBaseline,
          textAlign: textAlign
        });
      });

      helpers.each(itemsToDraw, function (itemToDraw) {
        if (gridLines.display) {
          context.lineWidth = itemToDraw.glWidth;
          context.strokeStyle = itemToDraw.glColor;
          context.beginPath();

          if (gridLines.drawTicks) {
            context.moveTo(itemToDraw.tx1, itemToDraw.ty1);
            context.lineTo(itemToDraw.tx2, itemToDraw.ty2);
          }

          if (gridLines.drawOnChartArea) {
            context.moveTo(itemToDraw.x1, itemToDraw.y1);
            context.lineTo(itemToDraw.x2, itemToDraw.y2);
          }

          context.stroke();
        }

        if (optionTicks.display) {
          context.save();
          context.translate(itemToDraw.labelX, itemToDraw.labelY);
          context.rotate(itemToDraw.rotation);
          context.font = tickLabelFont;
          context.textBaseline = itemToDraw.textBaseline;
          context.textAlign = itemToDraw.textAlign;

          var label = itemToDraw.label;
          if (helpers.isArray(label)) {
            for (var i = 0, y = 0; i < label.length; ++i) {
              context.fillText('' + label[i], 0, y);
              y += (tickFontSize * 1.5);
            }
          } else {
            context.fillText(label, 0, 0);
          }
          context.restore();
        }
      });

      if (scaleLabel.display) {
        var scaleLabelX;
        var scaleLabelY;
        var rotation = 0;

        if (isHorizontal) {
          scaleLabelX = me.left + ((me.right - me.left) / 2);
          scaleLabelY = options.position === 'bottom' ? me.bottom - (scaleLabelFontSize / 2) : me.top + (scaleLabelFontSize / 2);
        } else {
          var isLeft = options.position === 'left';
          scaleLabelX = isLeft ? me.left + (scaleLabelFontSize / 2) : me.right - (scaleLabelFontSize / 2);
          scaleLabelY = me.top + ((me.bottom - me.top) / 2);
          rotation = isLeft ? -0.5 * Math.PI : 0.5 * Math.PI;
        }

        context.save();
        context.translate(scaleLabelX, scaleLabelY);
        context.rotate(rotation);
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = scaleLabelFontColor;
        context.font = scaleLabelFont;
        context.fillText(scaleLabel.labelString, 0, 0);
        context.restore();
      }

      if (gridLines.drawBorder) {
        context.lineWidth = helpers.getValueAtIndexOrDefault(gridLines.lineWidth, 0);
        context.strokeStyle = helpers.getValueAtIndexOrDefault(gridLines.color, 0);

        var x1 = me.left;
        var x2 = me.right;
        var y1 = me.top;
        var y2 = me.bottom;
        var aliasPixel = helpers.aliasPixel(context.lineWidth);

        if (isHorizontal) {
          y1 = y2 = options.position === 'top' ? me.bottom : me.top;
          y1 += aliasPixel;
          y2 += aliasPixel;
        } else {
          x1 = x2 = options.position === 'left' ? me.right : me.left;
          x1 += aliasPixel;
          x2 += aliasPixel;
        }

        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
      }
    }
  });
};
}, {}],
32:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;

  Chart.scaleService = {
    constructors: {},
    defaults: {},
    registerScaleType: function (type, scaleConstructor, defaults) {
      this.constructors[type] = scaleConstructor;
      this.defaults[type] = helpers.clone(defaults);
    },
    getScaleConstructor: function (type) {
      return this.constructors.hasOwnProperty(type) ? this.constructors[type] : undefined;
    },
    getScaleDefaults: function (type) {
      return this.defaults.hasOwnProperty(type) ? helpers.scaleMerge(Chart.defaults.scale, this.defaults[type]) : {};
    },
    updateScaleDefaults: function (type, additions) {
      var defaults = this.defaults;
      if (defaults.hasOwnProperty(type)) {
        defaults[type] = helpers.extend(defaults[type], additions);
      }
    },
    addScalesToLayout: function (chartInstance) {
      helpers.each(chartInstance.scales, function (scale) {
        Chart.layoutService.addBox(chartInstance, scale);
      });
    }
  };
};
}, {}],
33:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;

  Chart.defaults.global.title = {
    display: false,
    position: 'top',
    fullWidth: true,
    fontStyle: '500',
    padding: 10,
    text: ''
  };

  var noop = helpers.noop;
  Chart.Title = Chart.Element.extend({
    initialize: function (config) {
      var me = this;
      helpers.extend(me, config);
      me.options = helpers.configMerge(Chart.defaults.global.title, config.options);
      me.legendHitBoxes = [];
    },

    beforeUpdate: function () {
      var chartOpts = this.chart.options;
      if (chartOpts && chartOpts.title) {
        this.options = helpers.configMerge(Chart.defaults.global.title, chartOpts.title);
      }
    },

    update: function (maxWidth, maxHeight, margins) {
      var me = this;

      me.beforeUpdate();

      me.maxWidth = maxWidth;
      me.maxHeight = maxHeight;
      me.margins = margins;

      me.beforeSetDimensions();
      me.setDimensions();
      me.afterSetDimensions();
      me.beforeBuildLabels();
      me.buildLabels();
      me.afterBuildLabels();
      me.beforeFit();
      me.fit();
      me.afterFit();
      me.afterUpdate();

      return me.minSize;

    },

    afterUpdate: noop,

    beforeSetDimensions: noop,

    setDimensions: function () {
      var me = this;

      if (me.isHorizontal()) {
        me.width = me.maxWidth;
        me.left = 0;
        me.right = me.width;
      } else {
        me.height = me.maxHeight;
        me.top = 0;
        me.bottom = me.height;
      }

      me.paddingLeft = 0;
      me.paddingTop = 0;
      me.paddingRight = 0;
      me.paddingBottom = 0;

      me.minSize = {
        width: 0,
        height: 0
      };
    },
    afterSetDimensions: noop,

    beforeBuildLabels: noop,

    buildLabels: noop,

    afterBuildLabels: noop,

    beforeFit: noop,

    fit: function () {
      var me = this;
      var valueOrDefault = helpers.getValueOrDefault;
      var opts = me.options;
      var globalDefaults = Chart.defaults.global;
      var display = opts.display;
      var fontSize = valueOrDefault(opts.fontSize, globalDefaults.defaultFontSize);
      var minSize = me.minSize;

      if (me.isHorizontal()) {
        minSize.width = me.maxWidth;
        minSize.height = display ? fontSize + (opts.padding * 2) : 0;
      } else {
        minSize.width = display ? fontSize + (opts.padding * 2) : 0;
        minSize.height = me.maxHeight;
      }

      me.width = minSize.width;
      me.height = minSize.height;
    },

    afterFit: noop,

    isHorizontal: function () {
      var pos = this.options.position;
      return pos === 'top' || pos === 'bottom';
    },

    draw: function () {
      var me = this;
      var ctx = me.ctx;
      var valueOrDefault = helpers.getValueOrDefault;
      var opts = me.options;
      var globalDefaults = Chart.defaults.global;

      if (opts.display) {
        var fontSize = valueOrDefault(opts.fontSize, globalDefaults.defaultFontSize);
        var fontStyle = valueOrDefault(opts.fontStyle, globalDefaults.defaultFontStyle);
        var fontFamily = valueOrDefault(opts.fontFamily, globalDefaults.defaultFontFamily);
        var titleFont = helpers.fontString(fontSize, fontStyle, fontFamily);
        var rotation = 0;
        var titleX;
        var titleY;
        var top = me.top;
        var left = me.left;
        var bottom = me.bottom;
        var right = me.right;

        ctx.fillStyle = valueOrDefault(opts.fontColor, globalDefaults.defaultFontColor);
        ctx.font = titleFont;

        if (me.isHorizontal()) {
          titleX = left + ((right - left) / 2);
          titleY = top + ((bottom - top) / 2);
        } else {
          titleX = opts.position === 'left' ? left + (fontSize / 2) : right - (fontSize / 2);
          titleY = top + ((bottom - top) / 2);
          rotation = Math.PI * (opts.position === 'left' ? -0.5 : 0.5);
        }

        ctx.save();
        ctx.translate(titleX, titleY);
        ctx.rotate(rotation);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(opts.text, 0, 0);
        ctx.restore();
      }
    }
  });

  Chart.plugins.register({
    beforeInit: function (chartInstance) {
      var opts = chartInstance.options;
      var titleOpts = opts.title;

      if (titleOpts) {
        chartInstance.titleBlock = new Chart.Title({
          ctx: chartInstance.chart.ctx,
          options: titleOpts,
          chart: chartInstance
        });

        Chart.layoutService.addBox(chartInstance, chartInstance.titleBlock);
      }
    }
  });
};
}, {}],
34:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;

  Chart.defaults.global.tooltips = {
    enabled: true,
    custom: null,
    mode: 'single',
    backgroundColor: 'rgba(60,71,88,1)',
    titleFontStyle: '500',
    titleSpacing: 0,
    titleMarginBottom: 3,
    titleFontSize: 12,
    titleFontColor: 'rgba(255,255,255,1)',
    titleAlign: 'left',
    bodySpacing: 0,
    bodyFontSize: 12,
    bodyFontColor: 'rgba(255,255,255,1)',
    bodyAlign: 'left',
    footerFontSize: 12,
    footerFontStyle: '500',
    footerSpacing: 0,
    footerMarginTop: 3,
    footerFontColor: 'rgba(255,255,255,1)',
    footerAlign: 'left',
    yPadding: 10,
    xPadding: 15,
    yAlign : 'center',
    xAlign : 'center',
    caretSize: 5,
    cornerRadius: 3,
    multiKeyBackground: 'rgba(255,255,255,1)',
    callbacks: {
      beforeTitle: helpers.noop,
      title: function (tooltipItems, data) {
        var title = '';
        var labels = data.labels;
        var labelCount = labels ? labels.length : 0;

        if (tooltipItems.length > 0) {
          var item = tooltipItems[0];

          if (item.xLabel) {
            title = item.xLabel;
          } else if (labelCount > 0 && item.index < labelCount) {
            title = labels[item.index];
          }
        }

        return title;
      },
      afterTitle: helpers.noop,
      beforeBody: helpers.noop,
      beforeLabel: helpers.noop,
      label: function (tooltipItem, data) {
        var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
        return datasetLabel + ': ' + tooltipItem.yLabel;
      },
      labelColor: function (tooltipItem, chartInstance) {
        var meta = chartInstance.getDatasetMeta(tooltipItem.datasetIndex);
        var activeElement = meta.data[tooltipItem.index];
        var view = activeElement._view;
        return {
          borderColor: view.borderColor,
          backgroundColor: view.backgroundColor
        };
      },
      afterLabel: helpers.noop,
      afterBody: helpers.noop,
      beforeFooter: helpers.noop,
      footer: helpers.noop,
      afterFooter: helpers.noop
    }
  };

  function pushOrConcat(base, toPush) {
    if (toPush) {
      if (helpers.isArray(toPush)) {
        Array.prototype.push.apply(base, toPush);
      } else {
        base.push(toPush);
      }
    }

    return base;
  }

  function getAveragePosition(elements) {
    if (!elements.length) return false;

    var xPositions = [];
    var yPositions = [];
    var i, len;

    for (i = 0, len = elements.length; i < len; ++i) {
      var el = elements[i];

      if (el && el.hasValue()){
        var pos = el.tooltipPosition();
        xPositions.push(pos.x);
        yPositions.push(pos.y);
      }
    }

    var x = 0;
    var y = 0;
    for (i = 0; i < xPositions.length; ++i) {
      if (xPositions[ i ]) {
        x += xPositions[i];
        y += yPositions[i];
      }
    }

    return {
      x: Math.round(x / xPositions.length),
      y: Math.round(y / xPositions.length)
    };
  }

  function createTooltipItem(element) {
    var xScale = element._xScale;
    var yScale = element._yScale || element._scale;
    var index = element._index;
    var datasetIndex = element._datasetIndex;

    return {
      xLabel: xScale ? xScale.getLabelForIndex(index, datasetIndex) : '',
      yLabel: yScale ? yScale.getLabelForIndex(index, datasetIndex) : '',
      index: index,
      datasetIndex: datasetIndex
    };
  }

  Chart.Tooltip = Chart.Element.extend({
    initialize: function () {
      var me = this;
      var globalDefaults = Chart.defaults.global;
      var tooltipOpts = me._options;
      var getValueOrDefault = helpers.getValueOrDefault;

      helpers.extend(me, {
        _model: {
          xPadding: tooltipOpts.xPadding,
          yPadding: tooltipOpts.yPadding,
          xAlign : tooltipOpts.xAlign,
          yAlign : tooltipOpts.yAlign,
          bodyFontColor: tooltipOpts.bodyFontColor,
          _bodyFontFamily: getValueOrDefault(tooltipOpts.bodyFontFamily, globalDefaults.defaultFontFamily),
          _bodyFontStyle: getValueOrDefault(tooltipOpts.bodyFontStyle, globalDefaults.defaultFontStyle),
          _bodyAlign: tooltipOpts.bodyAlign,
          bodyFontSize: getValueOrDefault(tooltipOpts.bodyFontSize, globalDefaults.defaultFontSize),
          bodySpacing: tooltipOpts.bodySpacing,
          titleFontColor: tooltipOpts.titleFontColor,
          _titleFontFamily: getValueOrDefault(tooltipOpts.titleFontFamily, globalDefaults.defaultFontFamily),
          _titleFontStyle: getValueOrDefault(tooltipOpts.titleFontStyle, globalDefaults.defaultFontStyle),
          titleFontSize: getValueOrDefault(tooltipOpts.titleFontSize, globalDefaults.defaultFontSize),
          _titleAlign: tooltipOpts.titleAlign,
          titleSpacing: tooltipOpts.titleSpacing,
          titleMarginBottom: tooltipOpts.titleMarginBottom,
          footerFontColor: tooltipOpts.footerFontColor,
          _footerFontFamily: getValueOrDefault(tooltipOpts.footerFontFamily, globalDefaults.defaultFontFamily),
          _footerFontStyle: getValueOrDefault(tooltipOpts.footerFontStyle, globalDefaults.defaultFontStyle),
          footerFontSize: getValueOrDefault(tooltipOpts.footerFontSize, globalDefaults.defaultFontSize),
          _footerAlign: tooltipOpts.footerAlign,
          footerSpacing: tooltipOpts.footerSpacing,
          footerMarginTop: tooltipOpts.footerMarginTop,
          caretSize: tooltipOpts.caretSize,
          cornerRadius: tooltipOpts.cornerRadius,
          backgroundColor: tooltipOpts.backgroundColor,
          opacity: 0,
          legendColorBackground: tooltipOpts.multiKeyBackground
        }
      });
    },

    getTitle: function () {
      var me = this;
      var opts = me._options;
      var callbacks = opts.callbacks;
      var beforeTitle = callbacks.beforeTitle.apply(me, arguments);
      var title = callbacks.title.apply(me, arguments);
      var afterTitle = callbacks.afterTitle.apply(me, arguments);
      var lines = [];

      lines = pushOrConcat(lines, beforeTitle);
      lines = pushOrConcat(lines, title);
      lines = pushOrConcat(lines, afterTitle);

      return lines;
    },

    getBeforeBody: function () {
      var lines = this._options.callbacks.beforeBody.apply(this, arguments);
      return helpers.isArray(lines) ? lines : lines !== undefined ? [lines] : [];
    },

    getBody: function (tooltipItems, data) {
      var me = this;
      var callbacks = me._options.callbacks;
      var bodyItems = [];

      helpers.each(tooltipItems, function (tooltipItem) {
        var bodyItem = {
          before: [],
          lines: [],
          after: []
        };
        pushOrConcat(bodyItem.before, callbacks.beforeLabel.call(me, tooltipItem, data));
        pushOrConcat(bodyItem.lines, callbacks.label.call(me, tooltipItem, data));
        pushOrConcat(bodyItem.after, callbacks.afterLabel.call(me, tooltipItem, data));

        bodyItems.push(bodyItem);
      });

      return bodyItems;
    },

    getAfterBody: function () {
      var lines = this._options.callbacks.afterBody.apply(this, arguments);
      return helpers.isArray(lines) ? lines : lines !== undefined ? [lines] : [];
    },

    getFooter: function () {
      var me = this;
      var callbacks = me._options.callbacks;
      var beforeFooter = callbacks.beforeFooter.apply(me, arguments);
      var footer = callbacks.footer.apply(me, arguments);
      var afterFooter = callbacks.afterFooter.apply(me, arguments);
      var lines = [];

      lines = pushOrConcat(lines, beforeFooter);
      lines = pushOrConcat(lines, footer);
      lines = pushOrConcat(lines, afterFooter);

      return lines;
    },

    update: function (changed) {
      var me = this;
      var opts = me._options;
      var model = me._model;
      var active = me._active;
      var data = me._data;
      var chartInstance = me._chartInstance;
      var i, len;

      if (active.length) {
        model.opacity = 1;

        var labelColors = [];
        var tooltipPosition = getAveragePosition(active);
        var tooltipItems = [];

        for (i = 0, len = active.length; i < len; ++i) {
          tooltipItems.push(createTooltipItem(active[i]));
        }

        if (opts.itemSort) {
          tooltipItems = tooltipItems.sort(opts.itemSort);
        }

        if (active.length > 1) {
          helpers.each(tooltipItems, function (tooltipItem) {
            labelColors.push(opts.callbacks.labelColor.call(me, tooltipItem, chartInstance));
          });
        }

        helpers.extend(model, {
          title: me.getTitle(tooltipItems, data),
          beforeBody: me.getBeforeBody(tooltipItems, data),
          body: me.getBody(tooltipItems, data),
          afterBody: me.getAfterBody(tooltipItems, data),
          footer: me.getFooter(tooltipItems, data),
          x: Math.round(tooltipPosition.x),
          y: Math.round(tooltipPosition.y),
          caretPadding: helpers.getValueOrDefault(tooltipPosition.padding, 2),
          labelColors: labelColors
        });

        var tooltipSize = me.getTooltipSize(model);
        me.determineAlignment(tooltipSize);
        helpers.extend(model, me.getBackgroundPoint(model, tooltipSize));
      } else {
        me._model.opacity = 0;
      }

      if (changed && opts.custom) opts.custom.call(me, model);

      return me;
    },

    getTooltipSize: function (vm) {
      var ctx = this._chart.ctx;
      var size = {
        height: vm.yPadding * 2,
        width: 0
      };
      var body = vm.body;
      var combinedBodyLength = body.reduce(function (count, bodyItem) {
        return count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length;
      }, 0);

      combinedBodyLength += vm.beforeBody.length + vm.afterBody.length;

      var titleLineCount = vm.title.length;
      var footerLineCount = vm.footer.length;
      var titleFontSize = vm.titleFontSize;
      var bodyFontSize = vm.bodyFontSize;
      var footerFontSize = vm.footerFontSize;

      size.height += titleLineCount * titleFontSize;
      size.height += (titleLineCount - 1) * vm.titleSpacing;
      size.height += titleLineCount ? vm.titleMarginBottom : 0;
      size.height += combinedBodyLength * bodyFontSize;
      size.height += combinedBodyLength ? (combinedBodyLength - 1) * vm.bodySpacing : 0;
      size.height += footerLineCount ? vm.footerMarginTop : 0;
      size.height += footerLineCount * (footerFontSize);
      size.height += footerLineCount ? (footerLineCount - 1) * vm.footerSpacing : 0;

      var widthPadding = 0;
      var maxLineWidth = function (line) {
        size.width = Math.max(size.width, ctx.measureText(line).width + widthPadding);
      };

      ctx.font = helpers.fontString(titleFontSize, vm._titleFontStyle, vm._titleFontFamily);
      helpers.each(vm.title, maxLineWidth);

      ctx.font = helpers.fontString(bodyFontSize, vm._bodyFontStyle, vm._bodyFontFamily);
      helpers.each(vm.beforeBody.concat(vm.afterBody), maxLineWidth);

      widthPadding = body.length > 1 ? (bodyFontSize + 2) : 0;
      helpers.each(body, function (bodyItem) {
        helpers.each(bodyItem.before, maxLineWidth);
        helpers.each(bodyItem.lines, maxLineWidth);
        helpers.each(bodyItem.after, maxLineWidth);
      });

      widthPadding = 0;

      ctx.font = helpers.fontString(footerFontSize, vm._footerFontStyle, vm._footerFontFamily);
      helpers.each(vm.footer, maxLineWidth);
      size.width += 2 * vm.xPadding;

      return size;
    },

    determineAlignment: function (size) {
      var me = this;
      var model = me._model;
      var chart = me._chart;
      var chartArea = me._chartInstance.chartArea;

      if (model.y < size.height) {
        model.yAlign = 'top';
      } else if (model.y > (chart.height - size.height)) {
        model.yAlign = 'bottom';
      }

      var lf, rf;
      var olf, orf;
      var yf;
      var midX = (chartArea.left + chartArea.right) / 2;
      var midY = (chartArea.top + chartArea.bottom) / 2;

      if (model.yAlign === 'center') {
        lf = function (x) {
          return x <= midX;
        };
        rf = function (x) {
          return x > midX;
        };
      } else {
        lf = function (x) {
          return x <= (size.width / 2);
        };
        rf = function (x) {
          return x >= (chart.width - (size.width / 2));
        };
      }

      olf = function (x) {
        return x + size.width > chart.width;
      };
      orf = function (x) {
        return x - size.width < 0;
      };
      yf = function (y) {
        return y <= midY ? 'top' : 'bottom';
      };

      if (lf(model.x)) {
        model.xAlign = 'left';

        if (olf(model.x)) {
          model.xAlign = 'center';
          model.yAlign = yf(model.y);
        }
      } else if (rf(model.x)) {
        model.xAlign = 'right';

        if (orf(model.x)) {
          model.xAlign = 'center';
          model.yAlign = yf(model.y);
        }
      }
    },

    getBackgroundPoint: function (vm, size) {
      // Background Position
      var pt = {
        x: vm.x,
        y: vm.y
      };

      var caretSize = vm.caretSize;
      var caretPadding = vm.caretPadding;
      var cornerRadius = vm.cornerRadius;
      var xAlign = vm.xAlign;
      var yAlign = vm.yAlign;
      var paddingAndSize = caretSize + caretPadding;
      var radiusAndPadding = cornerRadius + caretPadding;

      if (xAlign === 'right') {
        pt.x -= size.width;
      } else if (xAlign === 'center') {
        pt.x -= (size.width / 2);
      }

      if (yAlign === 'top') {
        pt.y += paddingAndSize;
      } else if (yAlign === 'bottom') {
        pt.y -= size.height + paddingAndSize;
      } else {
        pt.y -= (size.height / 2);
      }

      if (yAlign === 'center') {
        if (xAlign === 'left') {
          pt.x += paddingAndSize;
        } else if (xAlign === 'right') {
          pt.x -= paddingAndSize;
        }
      } else {
        if (xAlign === 'left') {
          pt.x -= radiusAndPadding;
        } else if (xAlign === 'right') {
          pt.x += radiusAndPadding;
        }
      }

      return pt;
    },

    drawCaret: function (tooltipPoint, size, opacity) {
      var vm = this._view;
      var ctx = this._chart.ctx;
      var x1, x2, x3;
      var y1, y2, y3;
      var caretSize = vm.caretSize;
      var cornerRadius = vm.cornerRadius;
      var xAlign = vm.xAlign;
      var yAlign = vm.yAlign;
      var ptX = tooltipPoint.x;
      var ptY = tooltipPoint.y;
      var width = size.width;
      var height = size.height;

      if (yAlign === 'center') {
        if (xAlign === 'left') {
          x1 = ptX;
          x2 = x1 - caretSize;
          x3 = x1;
        } else {
          x1 = ptX + width;
          x2 = x1 + caretSize;
          x3 = x1;
        }

        y2 = ptY + (height / 2);
        y1 = y2 - caretSize;
        y3 = y2 + caretSize;
      } else {
        if (xAlign === 'left') {
          x1 = ptX + cornerRadius;
          x2 = x1 + caretSize;
          x3 = x2 + caretSize;
        } else if (xAlign === 'right') {
          x1 = ptX + width - cornerRadius;
          x2 = x1 - caretSize;
          x3 = x2 - caretSize;
        } else {
          x2 = ptX + (width / 2);
          x1 = x2 - caretSize;
          x3 = x2 + caretSize;
        }

        if (yAlign === 'top') {
          y1 = ptY;
          y2 = y1 - caretSize;
          y3 = y1;
        } else {
          y1 = ptY + height;
          y2 = y1 + caretSize;
          y3 = y1;
        }
      }

      var bgColor = helpers.color(vm.backgroundColor);

      ctx.fillStyle = bgColor.alpha(opacity * bgColor.alpha()).rgbString();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.closePath();
      ctx.fill();
    },

    drawTitle: function (pt, vm, ctx, opacity) {
      var title = vm.title;

      if (title.length) {
        ctx.textAlign = vm._titleAlign;
        ctx.textBaseline = 'top';

        var titleFontSize = vm.titleFontSize;
        var titleSpacing = vm.titleSpacing;
        var titleFontColor = helpers.color(vm.titleFontColor);

        ctx.fillStyle = titleFontColor.alpha(opacity * titleFontColor.alpha()).rgbString();
        ctx.font = helpers.fontString(titleFontSize, vm._titleFontStyle, vm._titleFontFamily);

        var i, len;
        for (i = 0, len = title.length; i < len; ++i) {
          ctx.fillText(title[i], pt.x, pt.y);
          pt.y += titleFontSize + titleSpacing;

          if (i + 1 === title.length) {
            pt.y += vm.titleMarginBottom - titleSpacing;
          }
        }
      }
    },

    drawBody: function (pt, vm, ctx, opacity) {
      var bodyFontSize = vm.bodyFontSize;
      var bodySpacing = vm.bodySpacing;
      var body = vm.body;

      ctx.textAlign = vm._bodyAlign;
      ctx.textBaseline = 'top';

      var bodyFontColor = helpers.color(vm.bodyFontColor);
      var textColor = bodyFontColor.alpha(opacity * bodyFontColor.alpha()).rgbString();

      ctx.fillStyle = textColor;
      ctx.font = helpers.fontString(bodyFontSize, vm._bodyFontStyle, vm._bodyFontFamily);

      var xLinePadding = 0;
      var fillLineOfText = function (line) {
        ctx.fillText(line, pt.x + xLinePadding, pt.y);
        pt.y += bodyFontSize + bodySpacing;
      };

      helpers.each(vm.beforeBody, fillLineOfText);

      var drawColorBoxes = body.length > 1;

      xLinePadding = drawColorBoxes ? (bodyFontSize + 2) : 0;

      helpers.each(body, function (bodyItem, i) {
        helpers.each(bodyItem.before, fillLineOfText);
        helpers.each(bodyItem.lines, function (line) {
          if (drawColorBoxes) {
            ctx.fillStyle = helpers.color(vm.legendColorBackground).alpha(opacity).rgbaString();
            ctx.fillRect(pt.x, pt.y, bodyFontSize, bodyFontSize);
            ctx.strokeStyle = helpers.color(vm.labelColors[i].borderColor).alpha(opacity).rgbaString();
            ctx.strokeRect(pt.x, pt.y, bodyFontSize, bodyFontSize);
            ctx.fillStyle = helpers.color(vm.labelColors[i].backgroundColor).alpha(opacity).rgbaString();
            ctx.fillRect(pt.x + 1, pt.y + 1, bodyFontSize - 2, bodyFontSize - 2);
            ctx.fillStyle = textColor;
          }

          fillLineOfText(line);
        });

        helpers.each(bodyItem.after, fillLineOfText);
      });

      xLinePadding = 0;

      helpers.each(vm.afterBody, fillLineOfText);
      pt.y -= bodySpacing;
    },

    drawFooter: function (pt, vm, ctx, opacity) {
      var footer = vm.footer;

      if (footer.length) {
        pt.y += vm.footerMarginTop;
        ctx.textAlign = vm._footerAlign;
        ctx.textBaseline = 'top';

        var footerFontColor = helpers.color(vm.footerFontColor);
        ctx.fillStyle = footerFontColor.alpha(opacity * footerFontColor.alpha()).rgbString();
        ctx.font = helpers.fontString(vm.footerFontSize, vm._footerFontStyle, vm._footerFontFamily);

        helpers.each(footer, function (line) {
          ctx.fillText(line, pt.x, pt.y);
          pt.y += vm.footerFontSize + vm.footerSpacing;
        });
      }
    },

    draw: function () {
      var ctx = this._chart.ctx;
      var vm = this._view;

      if (vm.opacity === 0) return;

      var tooltipSize = this.getTooltipSize(vm);
      var pt = {
        x: vm.x,
        y: vm.y
      };

      var opacity = Math.abs(vm.opacity < 1e-3) ? 0 : vm.opacity;

      if (this._options.enabled) {
        var bgColor = helpers.color(vm.backgroundColor);

        ctx.fillStyle = bgColor.alpha(opacity * bgColor.alpha()).rgbString();
        helpers.drawRoundedRectangle(ctx, pt.x, pt.y, tooltipSize.width, tooltipSize.height, vm.cornerRadius);
        ctx.fill();
        this.drawCaret(pt, tooltipSize, opacity);
        pt.x += vm.xPadding;
        pt.y += vm.yPadding;
        this.drawTitle(pt, vm, ctx, opacity);
        this.drawBody(pt, vm, ctx, opacity);
        this.drawFooter(pt, vm, ctx, opacity);
      }
    }
  });
};
}, {}],
35:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;
  var globalOpts = Chart.defaults.global;

  globalOpts.elements.arc = {
    backgroundColor: globalOpts.defaultColor,
    borderColor: 'rgba(255,255,255,1)',
    borderWidth: 2
  };

  Chart.elements.Arc = Chart.Element.extend({
    inLabelRange: function (mouseX) {
      var vm = this._view;

      if (vm) {
        return (Math.pow(mouseX - vm.x, 2) < Math.pow(vm.radius + vm.hoverRadius, 2));
      } else {
        return false;
      }
    },

    inRange: function (chartX, chartY) {
      var vm = this._view;

      if (vm) {
        var pointRelativePosition = helpers.getAngleFromPoint(vm, {
            x: chartX,
            y: chartY
          }),
          angle = pointRelativePosition.angle,
          distance = pointRelativePosition.distance;

        var startAngle = vm.startAngle;
        var endAngle = vm.endAngle;

        while (endAngle < startAngle) {
          endAngle += 2.0 * Math.PI;
        }
        while (angle > endAngle) {
          angle -= 2.0 * Math.PI;
        }
        while (angle < startAngle) {
          angle += 2.0 * Math.PI;
        }

        var betweenAngles = (angle >= startAngle && angle <= endAngle);
        var withinRadius = (distance >= vm.innerRadius && distance <= vm.outerRadius);

        return (betweenAngles && withinRadius);
      } else {
        return false;
      }
    },

    tooltipPosition: function () {
      var vm = this._view;
      var centreAngle = vm.startAngle + ((vm.endAngle - vm.startAngle) / 2);
      var rangeFromCentre = (vm.outerRadius - vm.innerRadius) / 2 + vm.innerRadius;

      return {
        x: vm.x + (Math.cos(centreAngle) * rangeFromCentre),
        y: vm.y + (Math.sin(centreAngle) * rangeFromCentre)
      };
    },

    draw: function () {
      var ctx = this._chart.ctx;
      var vm = this._view;
      var sA = vm.startAngle;
      var eA = vm.endAngle;

      ctx.beginPath();
      ctx.arc(vm.x, vm.y, vm.outerRadius, sA, eA);
      ctx.arc(vm.x, vm.y, vm.innerRadius, eA, sA, true);
      ctx.closePath();
      ctx.strokeStyle = vm.borderColor;
      ctx.lineWidth = vm.borderWidth;
      ctx.fillStyle = vm.backgroundColor;
      ctx.fill();
      ctx.lineJoin = 'bevel';

      if (vm.borderWidth) ctx.stroke();
    }
  });
};
}, {}],
36:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;
  var globalDefaults = Chart.defaults.global;

  Chart.defaults.global.elements.line = {
    tension: 0.0,
    backgroundColor: globalDefaults.defaultColor,
    borderWidth: 2,
    borderColor: globalDefaults.defaultColor,
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    capBezierPoints: true,
    fill: true
  };

  Chart.elements.Line = Chart.Element.extend({
    draw: function () {
      var me = this;
      var vm = me._view;
      var spanGaps = vm.spanGaps;
      var scaleZero = vm.scaleZero;
      var loop = me._loop;
      var ctx = me._chart.ctx;

      ctx.save();

      function lineToPoint(previousPoint, point) {
        var vm = point._view;
        if (point._view.steppedLine === true) {
          ctx.lineTo(point._view.x, previousPoint._view.y);
          ctx.lineTo(point._view.x, point._view.y);
        } else if (point._view.tension === 0) {
          ctx.lineTo(vm.x, vm.y);
        } else {
          ctx.bezierCurveTo(
            previousPoint._view.controlPointNextX,
            previousPoint._view.controlPointNextY,
            vm.controlPointPreviousX,
            vm.controlPointPreviousY,
            vm.x,
            vm.y
          );
        }
      }

      var points = me._children.slice();
      var lastDrawnIndex = -1;

      if (loop && points.length) points.push(points[0]);

      var index, current, previous, currentVM;

      if (points.length && vm.fill) {
        ctx.beginPath();

        for (index = 0; index < points.length; ++index) {
          current = points[index];
          previous = helpers.previousItem(points, index);
          currentVM = current._view;

          if (index === 0) {
            if (loop) {
              ctx.moveTo(scaleZero.x, scaleZero.y);
            } else {
              ctx.moveTo(currentVM.x, scaleZero);
            }

            if (!currentVM.skip) {
              lastDrawnIndex = index;
              ctx.lineTo(currentVM.x, currentVM.y);
            }
          } else {
            previous = lastDrawnIndex === -1 ? previous : points[lastDrawnIndex];

            if (currentVM.skip) {
              if (!spanGaps && lastDrawnIndex === (index - 1)) {
                if (loop) {
                  ctx.lineTo(scaleZero.x, scaleZero.y);
                } else {
                  ctx.lineTo(previous._view.x, scaleZero);
                }
              }
            } else {
              if (lastDrawnIndex !== (index - 1)) {
                if (spanGaps && lastDrawnIndex !== -1) {
                  lineToPoint(previous, current);
                } else {
                  if (loop) {
                    ctx.lineTo(currentVM.x, currentVM.y);
                  } else {
                    ctx.lineTo(currentVM.x, scaleZero);
                    ctx.lineTo(currentVM.x, currentVM.y);
                  }
                }
              } else {
                lineToPoint(previous, current);
              }
              lastDrawnIndex = index;
            }
          }
        }

        if (!loop) ctx.lineTo(points[lastDrawnIndex]._view.x, scaleZero);

        ctx.fillStyle = vm.backgroundColor || globalDefaults.defaultColor;
        ctx.closePath();
        ctx.fill();
      }

      var globalOptionLineElements = globalDefaults.elements.line;
      ctx.lineCap = vm.borderCapStyle || globalOptionLineElements.borderCapStyle;

      if (ctx.setLineDash) {
        ctx.setLineDash(vm.borderDash || globalOptionLineElements.borderDash);
      }

      ctx.lineDashOffset = vm.borderDashOffset || globalOptionLineElements.borderDashOffset;
      ctx.lineJoin = vm.borderJoinStyle || globalOptionLineElements.borderJoinStyle;
      ctx.lineWidth = vm.borderWidth || globalOptionLineElements.borderWidth;
      ctx.strokeStyle = vm.borderColor || globalDefaults.defaultColor;

      ctx.beginPath();
      lastDrawnIndex = -1;

      for (index = 0; index < points.length; ++index) {
        current = points[index];
        previous = helpers.previousItem(points, index);
        currentVM = current._view;

        if (index === 0) {
          if (currentVM.skip) {
            // Null
          } else {
            ctx.moveTo(currentVM.x, currentVM.y);
            lastDrawnIndex = index;
          }
        } else {
          previous = lastDrawnIndex === -1 ? previous : points[lastDrawnIndex];

          if (!currentVM.skip) {
            if ((lastDrawnIndex !== (index - 1) && !spanGaps) || lastDrawnIndex === -1) {
              ctx.moveTo(currentVM.x, currentVM.y);
            } else {
              lineToPoint(previous, current);
            }

            lastDrawnIndex = index;
          }
        }
      }

      ctx.stroke();
      ctx.restore();
    }
  });
};
}, {}],
37:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;
  var globalOpts = Chart.defaults.global;
  var defaultColor = globalOpts.defaultColor;

  globalOpts.elements.point = {
    radius: 3,
    pointStyle: 'circle',
    backgroundColor: defaultColor,
    borderWidth: 1,
    borderColor: defaultColor,
    hitRadius: 5,
    hoverRadius: 4,
    hoverBorderWidth: 1
  };

  Chart.elements.Point = Chart.Element.extend({
    inRange: function (mouseX, mouseY) {
      var vm = this._view;
      return vm ? ((Math.pow(mouseX - vm.x, 2) + Math.pow(mouseY - vm.y, 2)) < Math.pow(vm.hitRadius + vm.radius, 2)) : false;
    },

    inLabelRange: function (mouseX) {
      var vm = this._view;
      return vm ? (Math.pow(mouseX - vm.x, 2) < Math.pow(vm.radius + vm.hitRadius, 2)) : false;
    },

    tooltipPosition: function () {
      var vm = this._view;
      return {
        x: vm.x,
        y: vm.y,
        padding: vm.radius + vm.borderWidth
      };
    },

    draw: function () {
      var vm = this._view;
      var ctx = this._chart.ctx;
      var pointStyle = vm.pointStyle;
      var radius = vm.radius;
      var x = vm.x;
      var y = vm.y;

      if (vm.skip) return;

      ctx.strokeStyle = vm.borderColor || defaultColor;
      ctx.lineWidth = helpers.getValueOrDefault(vm.borderWidth, globalOpts.elements.point.borderWidth);
      ctx.fillStyle = vm.backgroundColor || defaultColor;
      Chart.canvasHelpers.drawPoint(ctx, pointStyle, radius, x, y);
    }
  });
};
}, {}],
38:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var globalOpts = Chart.defaults.global;

  globalOpts.elements.rectangle = {
    backgroundColor: globalOpts.defaultColor,
    borderWidth: 0,
    borderColor: globalOpts.defaultColor,
    borderSkipped: 'bottom'
  };

  Chart.elements.Rectangle = Chart.Element.extend({
    draw: function () {
      var ctx = this._chart.ctx;
      var vm = this._view;
      var halfWidth = vm.width / 2;
      var leftX = vm.x - halfWidth;
      var rightX = vm.x + halfWidth;
      var top = vm.base - (vm.base - vm.y);
      var halfStroke = vm.borderWidth / 2;

      if (vm.borderWidth) {
        leftX += halfStroke;
        rightX -= halfStroke;
        top += halfStroke;
      }

      ctx.beginPath();
      ctx.fillStyle = vm.backgroundColor;
      ctx.strokeStyle = vm.borderColor;
      ctx.lineWidth = vm.borderWidth;

      var corners = [
        [leftX, vm.base],
        [leftX, top],
        [rightX, top],
        [rightX, vm.base]
      ];

      var borders = ['bottom', 'left', 'top', 'right'];
      var startCorner = borders.indexOf(vm.borderSkipped, 0);

      if (startCorner === -1){
        startCorner = 0;
      }

      function cornerAt(index) {
        return corners[(startCorner + index) % 4];
      }

      ctx.moveTo.apply(ctx, cornerAt(0));
      for (var i = 1; i < 4; i++) ctx.lineTo.apply(ctx, cornerAt(i));

      ctx.fill();

      if (vm.borderWidth) ctx.stroke();
    },

    height: function () {
      var vm = this._view;
      return vm.base - vm.y;
    },

    inRange: function (mouseX, mouseY) {
      var vm = this._view;
      return vm ?
          (vm.y < vm.base ?
            (mouseX >= vm.x - vm.width / 2 && mouseX <= vm.x + vm.width / 2) && (mouseY >= vm.y && mouseY <= vm.base) :
            (mouseX >= vm.x - vm.width / 2 && mouseX <= vm.x + vm.width / 2) && (mouseY >= vm.base && mouseY <= vm.y)) :
          false;
    },

    inLabelRange: function (mouseX) {
      var vm = this._view;
      return vm ? (mouseX >= vm.x - vm.width / 2 && mouseX <= vm.x + vm.width / 2) : false;
    },

    tooltipPosition: function () {
      var vm = this._view;
      return {
        x: vm.x,
        y: vm.y
      };
    }
  });

};
}, {}],
39:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;
  var defaultConfig = {
    position: 'bottom'
  };

  var DatasetScale = Chart.Scale.extend({
    getLabels: function () {
      var data = this.chart.data;
      return (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels;
    },

    determineDataLimits: function () {
      var me = this;
      var labels = me.getLabels();

      me.minIndex = 0;
      me.maxIndex = labels.length - 1;

      var findIndex;

      if (me.options.ticks.min !== undefined) {
        findIndex = helpers.indexOf(labels, me.options.ticks.min);
        me.minIndex = findIndex !== -1 ? findIndex : me.minIndex;
      }

      if (me.options.ticks.max !== undefined) {
        findIndex = helpers.indexOf(labels, me.options.ticks.max);
        me.maxIndex = findIndex !== -1 ? findIndex : me.maxIndex;
      }

      me.min = labels[me.minIndex];
      me.max = labels[me.maxIndex];
    },

    buildTicks: function () {
      var me = this;
      var labels = me.getLabels();
      me.ticks = (me.minIndex === 0 && me.maxIndex === labels.length - 1) ? labels : labels.slice(me.minIndex, me.maxIndex + 1);
    },

    getLabelForIndex: function (index) {
      return this.ticks[index];
    },

    getPixelForValue: function (value, index, datasetIndex, includeOffset) {
      var me = this;
      var offsetAmt = Math.max((me.maxIndex + 1 - me.minIndex - ((me.options.gridLines.offsetGridLines) ? 0 : 1)), 1);

      if (value !== undefined) {
        var labels = me.getLabels();
        var idx = labels.indexOf(value);
        index = idx !== -1 ? idx : index;
      }

      if (me.isHorizontal()) {
        var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
        var valueWidth = innerWidth / offsetAmt;
        var widthOffset = (valueWidth * (index - me.minIndex)) + me.paddingLeft;

        if (me.options.gridLines.offsetGridLines && includeOffset) {
          widthOffset += (valueWidth / 2);
        }

        return me.left + Math.round(widthOffset);
      } else {
        var innerHeight = me.height - (me.paddingTop + me.paddingBottom);
        var valueHeight = innerHeight / offsetAmt;
        var heightOffset = (valueHeight * (index - me.minIndex)) + me.paddingTop;

        if (me.options.gridLines.offsetGridLines && includeOffset) {
          heightOffset += (valueHeight / 2);
        }

        return me.top + Math.round(heightOffset);
      }
    },

    getPixelForTick: function (index, includeOffset) {
      return this.getPixelForValue(this.ticks[index], index + this.minIndex, null, includeOffset);
    },

    getValueForPixel: function (pixel) {
      var me = this;
      var value;
      var offsetAmt = Math.max((me.ticks.length - ((me.options.gridLines.offsetGridLines) ? 0 : 1)), 1);
      var horz = me.isHorizontal();
      var innerDimension = horz ? me.width - (me.paddingLeft + me.paddingRight) : me.height - (me.paddingTop + me.paddingBottom);
      var valueDimension = innerDimension / offsetAmt;

      pixel -= horz ? me.left : me.top;

      if (me.options.gridLines.offsetGridLines) {
        pixel -= (valueDimension / 2);
      }

      pixel -= horz ? me.paddingLeft : me.paddingTop;

      if (pixel <= 0) {
        value = 0;
      } else {
        value = Math.round(pixel / valueDimension);
      }

      return value;
    },
    getBasePixel: function () {
      return this.bottom;
    }
  });

  Chart.scaleService.registerScaleType('category', DatasetScale, defaultConfig);

};
}, {}],
40:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;
  var defaultConfig = {
    position: 'left',
    ticks: {
      callback: function (tickValue, index, ticks) {
        var delta = ticks.length > 3 ? ticks[2] - ticks[1] : ticks[1] - ticks[0];

        if (Math.abs(delta) > 1) {
          if (tickValue !== Math.floor(tickValue)) {
            delta = tickValue - Math.floor(tickValue);
          }
        }

        var logDelta = helpers.log10(Math.abs(delta));
        var tickString = '';

        if (tickValue !== 0) {
          var numDecimal = -1 * Math.floor(logDelta);
          numDecimal = Math.max(Math.min(numDecimal, 20), 0);
          tickString = tickValue.toFixed(numDecimal);
        } else {
          tickString = '0';
        }

        return tickString;
      }
    }
  };

  var LinearScale = Chart.LinearScaleBase.extend({
    determineDataLimits: function () {
      var me = this;
      var opts = me.options;
      var chart = me.chart;
      var data = chart.data;
      var datasets = data.datasets;
      var isHorizontal = me.isHorizontal();

      function IDMatches(meta) {
        return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id;
      }

      me.min = null;
      me.max = null;

      if (opts.stacked) {
        var valuesPerType = {};
        var hasPositiveValues = false;
        var hasNegativeValues = false;

        helpers.each(datasets, function (dataset, datasetIndex) {
          var meta = chart.getDatasetMeta(datasetIndex);
          if (valuesPerType[meta.type] === undefined) {
            valuesPerType[meta.type] = {
              positiveValues: [],
              negativeValues: []
            };
          }

          var positiveValues = valuesPerType[meta.type].positiveValues;
          var negativeValues = valuesPerType[meta.type].negativeValues;

          if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
            helpers.each(dataset.data, function (rawValue, index) {
              var value = +me.getRightValue(rawValue);
              if (isNaN(value) || meta.data[index].hidden) return;

              positiveValues[index] = positiveValues[index] || 0;
              negativeValues[index] = negativeValues[index] || 0;

              if (opts.relativePoints) {
                positiveValues[index] = 100;
              } else {
                if (value < 0) {
                  hasNegativeValues = true;
                  negativeValues[index] += value;
                } else {
                  hasPositiveValues = true;
                  positiveValues[index] += value;
                }
              }
            });
          }
        });

        helpers.each(valuesPerType, function (valuesForType) {
          var values = valuesForType.positiveValues.concat(valuesForType.negativeValues);
          var minVal = helpers.min(values);
          var maxVal = helpers.max(values);
          me.min = me.min === null ? minVal : Math.min(me.min, minVal);
          me.max = me.max === null ? maxVal : Math.max(me.max, maxVal);
        });
      } else {
        helpers.each(datasets, function (dataset, datasetIndex) {
          var meta = chart.getDatasetMeta(datasetIndex);
          if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
            helpers.each(dataset.data, function (rawValue, index) {
              var value = +me.getRightValue(rawValue);
              if (isNaN(value) || meta.data[index].hidden) return;

              if (me.min === null) {
                me.min = value;
              } else if (value < me.min) {
                me.min = value;
              }

              if (me.max === null) {
                me.max = value;
              } else if (value > me.max) {
                me.max = value;
              }
            });
          }
        });
      }

      this.handleTickRangeOptions();
    },

    getTickLimit: function () {
      var maxTicks;
      var me = this;
      var tickOpts = me.options.ticks;

      if (me.isHorizontal()) {
        maxTicks = Math.min(tickOpts.maxTicksLimit ? tickOpts.maxTicksLimit : 11, Math.ceil(me.width / 50));
      } else {
        var tickFontSize = helpers.getValueOrDefault(tickOpts.fontSize, Chart.defaults.global.defaultFontSize);
        maxTicks = Math.min(tickOpts.maxTicksLimit ? tickOpts.maxTicksLimit : 11, Math.ceil(me.height / (2 * tickFontSize)));
      }

      return maxTicks;
    },

    handleDirectionalChanges: function () {
      if (!this.isHorizontal()) this.ticks.reverse();
    },

    getLabelForIndex: function (index, datasetIndex) {
      return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
    },

    getPixelForValue: function (value) {
      var me = this;
      var paddingLeft = me.paddingLeft;
      var paddingBottom = me.paddingBottom;
      var start = me.start;
      var rightValue = +me.getRightValue(value);
      var pixel;
      var innerDimension;
      var range = me.end - start;

      if (me.isHorizontal()) {
        innerDimension = me.width - (paddingLeft + me.paddingRight);
        pixel = me.left + (innerDimension / range * (rightValue - start));
        return Math.round(pixel + paddingLeft);
      } else {
        innerDimension = me.height - (me.paddingTop + paddingBottom);
        pixel = (me.bottom - paddingBottom) - (innerDimension / range * (rightValue - start));
        return Math.round(pixel);
      }
    },

    getValueForPixel: function (pixel) {
      var me = this;
      var isHorizontal = me.isHorizontal();
      var paddingLeft = me.paddingLeft;
      var paddingBottom = me.paddingBottom;
      var innerDimension = isHorizontal ? me.width - (paddingLeft + me.paddingRight) : me.height - (me.paddingTop + paddingBottom);
      var offset = (isHorizontal ? pixel - me.left - paddingLeft : me.bottom - paddingBottom - pixel) / innerDimension;
      return me.start + ((me.end - me.start) * offset);
    },

    getPixelForTick: function (index) {
      return this.getPixelForValue(this.ticksAsNumbers[index]);
    }
  });
  Chart.scaleService.registerScaleType('linear', LinearScale, defaultConfig);

};
}, {}],
41:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;
  var noop = helpers.noop;

  Chart.LinearScaleBase = Chart.Scale.extend({
    handleTickRangeOptions: function () {
      var me = this;
      var opts = me.options;
      var tickOpts = opts.ticks;

      if (tickOpts.beginAtZero) {
        var minSign = helpers.sign(me.min);
        var maxSign = helpers.sign(me.max);

        if (minSign < 0 && maxSign < 0) {
          me.max = 0;
        } else if (minSign > 0 && maxSign > 0) {
          me.min = 0;
        }
      }

      if (tickOpts.min !== undefined) {
        me.min = tickOpts.min;
      } else if (tickOpts.suggestedMin !== undefined) {
        me.min = Math.min(me.min, tickOpts.suggestedMin);
      }

      if (tickOpts.max !== undefined) {
        me.max = tickOpts.max;
      } else if (tickOpts.suggestedMax !== undefined) {
        me.max = Math.max(me.max, tickOpts.suggestedMax);
      }

      if (me.min === me.max) {
        me.max++;
        if (!tickOpts.beginAtZero) me.min--;
      }
    },

    getTickLimit: noop,

    handleDirectionalChanges: noop,

    buildTicks: function () {
      var me = this;
      var opts = me.options;
      var ticks = me.ticks = [];
      var tickOpts = opts.ticks;
      var getValueOrDefault = helpers.getValueOrDefault;
      var maxTicks = me.getTickLimit();

      maxTicks = Math.max(2, maxTicks);

      var spacing;
      var fixedStepSizeSet = (tickOpts.fixedStepSize && tickOpts.fixedStepSize > 0) || (tickOpts.stepSize && tickOpts.stepSize > 0);

      if (fixedStepSizeSet) {
        spacing = getValueOrDefault(tickOpts.fixedStepSize, tickOpts.stepSize);
      } else {
        var niceRange = helpers.niceNum(me.max - me.min, false);
        spacing = helpers.niceNum(niceRange / (maxTicks - 1), true);
      }

      var niceMin = Math.floor(me.min / spacing) * spacing;
      var niceMax = Math.ceil(me.max / spacing) * spacing;
      var numSpaces = (niceMax - niceMin) / spacing;

      if (helpers.almostEquals(numSpaces, Math.round(numSpaces), spacing / 1000)) {
        numSpaces = Math.round(numSpaces);
      } else {
        numSpaces = Math.ceil(numSpaces);
      }

      ticks.push(tickOpts.min !== undefined ? tickOpts.min : niceMin);

      for (var j = 1; j < numSpaces; ++j)   ticks.push(niceMin + (j * spacing));

      ticks.push(tickOpts.max !== undefined ? tickOpts.max : niceMax);

      me.handleDirectionalChanges();
      me.max = helpers.max(ticks);
      me.min = helpers.min(ticks);

      if (tickOpts.reverse) {
        ticks.reverse();
        me.start = me.max;
        me.end = me.min;
      } else {
        me.start = me.min;
        me.end = me.max;
      }
    },

    convertTicksToLabels: function () {
      var me = this;
      me.ticksAsNumbers = me.ticks.slice();
      me.zeroLineIndex = me.ticks.indexOf(0);
      Chart.Scale.prototype.convertTicksToLabels.call(me);
    },
  });
};
}, {}],
42:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;
  var defaultConfig = {
    position: 'left',
    ticks: {
      callback: function (value, index, arr) {
        var remain = value / (Math.pow(10, Math.floor(helpers.log10(value))));

        if (remain === 1 || remain === 2 || remain === 5 || index === 0 || index === arr.length - 1) {
          return value.toExponential();
        } else {
          return '';
        }
      }
    }
  };
  var LogarithmicScale = Chart.Scale.extend({
    determineDataLimits: function () {
      var me = this;
      var opts = me.options;
      var tickOpts = opts.ticks;
      var chart = me.chart;
      var data = chart.data;
      var datasets = data.datasets;
      var getValueOrDefault = helpers.getValueOrDefault;
      var isHorizontal = me.isHorizontal();
      function IDMatches(meta) {
        return isHorizontal ? meta.xAxisID === me.id : meta.yAxisID === me.id;
      }

      me.min = null;
      me.max = null;

      if (opts.stacked) {
        var valuesPerType = {};

        helpers.each(datasets, function (dataset, datasetIndex) {
          var meta = chart.getDatasetMeta(datasetIndex);
          if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
            if (valuesPerType[meta.type] === undefined) {
              valuesPerType[meta.type] = [];
            }

            helpers.each(dataset.data, function (rawValue, index) {
              var values = valuesPerType[meta.type];
              var value = +me.getRightValue(rawValue);
              if (isNaN(value) || meta.data[index].hidden) return;

              values[index] = values[index] || 0;

              if (opts.relativePoints) {
                values[index] = 100;
              } else {
                values[index] += value;
              }
            });
          }
        });

        helpers.each(valuesPerType, function (valuesForType) {
          var minVal = helpers.min(valuesForType);
          var maxVal = helpers.max(valuesForType);
          me.min = me.min === null ? minVal : Math.min(me.min, minVal);
          me.max = me.max === null ? maxVal : Math.max(me.max, maxVal);
        });
      } else {
        helpers.each(datasets, function (dataset, datasetIndex) {
          var meta = chart.getDatasetMeta(datasetIndex);
          if (chart.isDatasetVisible(datasetIndex) && IDMatches(meta)) {
            helpers.each(dataset.data, function (rawValue, index) {
              var value = +me.getRightValue(rawValue);
              if (isNaN(value) || meta.data[index].hidden) return;

              if (me.min === null) {
                me.min = value;
              } else if (value < me.min) {
                me.min = value;
              }

              if (me.max === null) {
                me.max = value;
              } else if (value > me.max) {
                me.max = value;
              }
            });
          }
        });
      }

      me.min = getValueOrDefault(tickOpts.min, me.min);
      me.max = getValueOrDefault(tickOpts.max, me.max);

      if (me.min === me.max) {
        if (me.min !== 0 && me.min !== null) {
          me.min = Math.pow(10, Math.floor(helpers.log10(me.min)) - 1);
          me.max = Math.pow(10, Math.floor(helpers.log10(me.max)) + 1);
        } else {
          me.min = 1;
          me.max = 10;
        }
      }
    },

    buildTicks: function () {
      var me = this;
      var opts = me.options;
      var tickOpts = opts.ticks;
      var getValueOrDefault = helpers.getValueOrDefault;
      var ticks = me.ticks = [];
      var tickVal = getValueOrDefault(tickOpts.min, Math.pow(10, Math.floor(helpers.log10(me.min))));

      while (tickVal < me.max) {
        ticks.push(tickVal);

        var exp = Math.floor(helpers.log10(tickVal));
        var significand = Math.floor(tickVal / Math.pow(10, exp)) + 1;

        if (significand === 10) {
          significand = 1;
          ++exp;
        }

        tickVal = significand * Math.pow(10, exp);
      }

      var lastTick = getValueOrDefault(tickOpts.max, tickVal);
      ticks.push(lastTick);

      if (!me.isHorizontal()) ticks.reverse();

      me.max = helpers.max(ticks);
      me.min = helpers.min(ticks);

      if (tickOpts.reverse) {
        ticks.reverse();
        me.start = me.max;
        me.end = me.min;
      } else {
        me.start = me.min;
        me.end = me.max;
      }
    },

    convertTicksToLabels: function () {
      this.tickValues = this.ticks.slice();
      Chart.Scale.prototype.convertTicksToLabels.call(this);
    },

    getLabelForIndex: function (index, datasetIndex) {
      return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
    },

    getPixelForTick: function (index) {
      return this.getPixelForValue(this.tickValues[index]);
    },

    getPixelForValue: function (value) {
      var me = this;
      var innerDimension;
      var pixel;
      var start = me.start;
      var newVal = +me.getRightValue(value);
      var range = helpers.log10(me.end) - helpers.log10(start);
      var paddingTop = me.paddingTop;
      var paddingBottom = me.paddingBottom;
      var paddingLeft = me.paddingLeft;

      if (me.isHorizontal()) {
        if (newVal === 0) {
          pixel = me.left + paddingLeft;
        } else {
          innerDimension = me.width - (paddingLeft + me.paddingRight);
          pixel = me.left + (innerDimension / range * (helpers.log10(newVal) - helpers.log10(start)));
          pixel += paddingLeft;
        }
      } else {
        if (newVal === 0) {
          pixel = me.top + paddingTop;
        } else {
          innerDimension = me.height - (paddingTop + paddingBottom);
          pixel = (me.bottom - paddingBottom) - (innerDimension / range * (helpers.log10(newVal) - helpers.log10(start)));
        }
      }

      return pixel;
    },

    getValueForPixel: function (pixel) {
      var me = this;
      var range = helpers.log10(me.end) - helpers.log10(me.start);
      var value, innerDimension;

      if (me.isHorizontal()) {
        innerDimension = me.width - (me.paddingLeft + me.paddingRight);
        value = me.start * Math.pow(10, (pixel - me.left - me.paddingLeft) * range / innerDimension);
      } else {
        innerDimension = me.height - (me.paddingTop + me.paddingBottom);
        value = Math.pow(10, (me.bottom - me.paddingBottom - pixel) * range / innerDimension) / me.start;
      }

      return value;
    }
  });
  Chart.scaleService.registerScaleType("logarithmic", LogarithmicScale, defaultConfig);

};
}, {}],
43:[function (require, module, exports){
'use strict';

module.exports = function (Chart) {

  var helpers = Chart.helpers;
  var globalDefaults = Chart.defaults.global;
  var defaultConfig = {
    display: true,
    animate: true,
    lineArc: false,
    position: 'chartArea',
    angleLines: {
      display: true,
      color: 'rgba(229,234,244,1)',
      lineWidth: 1
    },
    ticks: {
      showLabelBackdrop: true,
      backdropColor: 'rgba(255,255,255,0.75)',
      backdropPaddingY: 2,
      backdropPaddingX: 2
    },
    pointLabels: {
      fontSize: 10,
      callback: function (label) {
        return label;
      }
    }
  };
  var LinearRadialScale = Chart.LinearScaleBase.extend({
    getValueCount: function () {
      return this.chart.data.labels.length;
    },

    setDimensions: function () {
      var me = this;
      var opts = me.options;
      var tickOpts = opts.ticks;

      me.width = me.maxWidth;
      me.height = me.maxHeight;
      me.xCenter = Math.round(me.width / 2);
      me.yCenter = Math.round(me.height / 2);

      var minSize = helpers.min([me.height, me.width]);
      var tickFontSize = helpers.getValueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);

      me.drawingArea = opts.display ? (minSize / 2) - (tickFontSize / 2 + tickOpts.backdropPaddingY) : (minSize / 2);
    },

    determineDataLimits: function () {
      var me = this;
      var chart = me.chart;

      me.min = null;
      me.max = null;

      helpers.each(chart.data.datasets, function (dataset, datasetIndex) {
        if (chart.isDatasetVisible(datasetIndex)) {
          var meta = chart.getDatasetMeta(datasetIndex);

          helpers.each(dataset.data, function (rawValue, index) {
            var value = +me.getRightValue(rawValue);
            if (isNaN(value) || meta.data[index].hidden) return;

            if (me.min === null) {
              me.min = value;
            } else if (value < me.min) {
              me.min = value;
            }

            if (me.max === null) {
              me.max = value;
            } else if (value > me.max) {
              me.max = value;
            }
          });
        }
      });

      me.handleTickRangeOptions();
    },

    getTickLimit: function () {
      var tickOpts = this.options.ticks;
      var tickFontSize = helpers.getValueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);
      return Math.min(tickOpts.maxTicksLimit ? tickOpts.maxTicksLimit : 11, Math.ceil(this.drawingArea / (1.5 * tickFontSize)));
    },

    convertTicksToLabels: function () {
      var me = this;
      Chart.LinearScaleBase.prototype.convertTicksToLabels.call(me);
      me.pointLabels = me.chart.data.labels.map(me.options.pointLabels.callback, me);
    },

    getLabelForIndex: function (index, datasetIndex) {
      return +this.getRightValue(this.chart.data.datasets[datasetIndex].data[index]);
    },

    fit: function () {
      var pointLabels = this.options.pointLabels;
      var pointLabelFontSize = helpers.getValueOrDefault(pointLabels.fontSize, globalDefaults.defaultFontSize);
      var pointLabeFontStyle = helpers.getValueOrDefault(pointLabels.fontStyle, globalDefaults.defaultFontStyle);
      var pointLabeFontFamily = helpers.getValueOrDefault(pointLabels.fontFamily, globalDefaults.defaultFontFamily);
      var pointLabeFont = helpers.fontString(pointLabelFontSize, pointLabeFontStyle, pointLabeFontFamily);
      var largestPossibleRadius = helpers.min([(this.height / 2 - pointLabelFontSize - 5), this.width / 2]);
      var furthestRight = this.width;
      var furthestLeft = 0;
      var pointPosition, i, textWidth, halfTextWidth, furthestRightIndex, furthestRightAngle, furthestLeftIndex, furthestLeftAngle, xProtrusionLeft, xProtrusionRight, radiusReductionRight, radiusReductionLeft;

      this.ctx.font = pointLabeFont;

      for (i = 0; i < this.getValueCount(); i++) {
        pointPosition = this.getPointPosition(i, largestPossibleRadius);
        textWidth = this.ctx.measureText(this.pointLabels[i] ? this.pointLabels[i] : '').width + 5;

        var angleRadians = this.getIndexAngle(i) + (Math.PI / 2);
        var angle = (angleRadians * 360 / (2 * Math.PI)) % 360;

        if (angle === 0 || angle === 180) {
          halfTextWidth = textWidth / 2;

          if (pointPosition.x + halfTextWidth > furthestRight) {
            furthestRight = pointPosition.x + halfTextWidth;
            furthestRightIndex = i;
          }

          if (pointPosition.x - halfTextWidth < furthestLeft) {
            furthestLeft = pointPosition.x - halfTextWidth;
            furthestLeftIndex = i;
          }
        } else if (angle < 180) {
          if (pointPosition.x + textWidth > furthestRight) {
            furthestRight = pointPosition.x + textWidth;
            furthestRightIndex = i;
          }
        } else {
          if (pointPosition.x - textWidth < furthestLeft) {
            furthestLeft = pointPosition.x - textWidth;
            furthestLeftIndex = i;
          }
        }
      }

      xProtrusionLeft = furthestLeft;
      xProtrusionRight = Math.ceil(furthestRight - this.width);
      furthestRightAngle = this.getIndexAngle(furthestRightIndex);
      furthestLeftAngle = this.getIndexAngle(furthestLeftIndex);
      radiusReductionRight = xProtrusionRight / Math.sin(furthestRightAngle + Math.PI / 2);
      radiusReductionLeft = xProtrusionLeft / Math.sin(furthestLeftAngle + Math.PI / 2);
      radiusReductionRight = (helpers.isNumber(radiusReductionRight)) ? radiusReductionRight : 0;
      radiusReductionLeft = (helpers.isNumber(radiusReductionLeft)) ? radiusReductionLeft : 0;

      this.drawingArea = Math.round(largestPossibleRadius - (radiusReductionLeft + radiusReductionRight) / 2);
      this.setCenterPoint(radiusReductionLeft, radiusReductionRight);
    },

    setCenterPoint: function (leftMovement, rightMovement) {
      var me = this;
      var maxRight = me.width - rightMovement - me.drawingArea;
      var maxLeft = leftMovement + me.drawingArea;

      me.xCenter = Math.round(((maxLeft + maxRight) / 2) + me.left);
      me.yCenter = Math.round((me.height / 2) + me.top);
    },

    getIndexAngle: function (index) {
      var angleMultiplier = (Math.PI * 2) / this.getValueCount();
      var startAngle = this.chart.options && this.chart.options.startAngle ?
        this.chart.options.startAngle :
        0;

      var startAngleRadians = startAngle * Math.PI * 2 / 360;

      return index * angleMultiplier - (Math.PI / 2) + startAngleRadians;
    },

    getDistanceFromCenterForValue: function (value) {
      var me = this;

      if (value === null) return 0;

      var scalingFactor = me.drawingArea / (me.max - me.min);

      if (me.options.reverse) {
        return (me.max - value) * scalingFactor;
      } else {
        return (value - me.min) * scalingFactor;
      }
    },

    getPointPosition: function (index, distanceFromCenter) {
      var me = this;
      var thisAngle = me.getIndexAngle(index);

      return {
        x: Math.round(Math.cos(thisAngle) * distanceFromCenter) + me.xCenter,
        y: Math.round(Math.sin(thisAngle) * distanceFromCenter) + me.yCenter
      };
    },

    getPointPositionForValue: function (index, value) {
      return this.getPointPosition(index, this.getDistanceFromCenterForValue(value));
    },

    getBasePosition: function () {
      var me = this;
      var min = me.min;
      var max = me.max;

      return me.getPointPositionForValue(0,
        me.beginAtZero? 0:
        min < 0 && max < 0? max :
        min > 0 && max > 0? min :
        0);
    },

    draw: function () {
      var me = this;
      var opts = me.options;
      var gridLineOpts = opts.gridLines;
      var tickOpts = opts.ticks;
      var angleLineOpts = opts.angleLines;
      var pointLabelOpts = opts.pointLabels;
      var getValueOrDefault = helpers.getValueOrDefault;

      if (opts.display) {
        var ctx = me.ctx;
        var tickFontSize = getValueOrDefault(tickOpts.fontSize, globalDefaults.defaultFontSize);
        var tickFontStyle = getValueOrDefault(tickOpts.fontStyle, globalDefaults.defaultFontStyle);
        var tickFontFamily = getValueOrDefault(tickOpts.fontFamily, globalDefaults.defaultFontFamily);
        var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);

        helpers.each(me.ticks, function (label, index) {
          if (index > 0 || opts.reverse) {
            var yCenterOffset = me.getDistanceFromCenterForValue(me.ticksAsNumbers[index]);
            var yHeight = me.yCenter - yCenterOffset;

            if (gridLineOpts.display && index !== 0) {
              ctx.strokeStyle = helpers.getValueAtIndexOrDefault(gridLineOpts.color, index - 1);
              ctx.lineWidth = helpers.getValueAtIndexOrDefault(gridLineOpts.lineWidth, index - 1);

              if (opts.lineArc) {
                ctx.beginPath();
                ctx.arc(me.xCenter, me.yCenter, yCenterOffset, 0, Math.PI * 2);
                ctx.closePath();
                ctx.stroke();
              } else {
                ctx.beginPath();

                for (var i = 0; i < me.getValueCount(); i++) {
                  var pointPosition = me.getPointPosition(i, yCenterOffset);
                  if (i === 0) {
                    ctx.moveTo(pointPosition.x, pointPosition.y);
                  } else {
                    ctx.lineTo(pointPosition.x, pointPosition.y);
                  }
                }

                ctx.closePath();
                ctx.stroke();
              }
            }

            if (tickOpts.display) {
              var tickFontColor = getValueOrDefault(tickOpts.fontColor, globalDefaults.defaultFontColor);
              ctx.font = tickLabelFont;

              if (tickOpts.showLabelBackdrop) {
                var labelWidth = ctx.measureText(label).width;
                ctx.fillStyle = tickOpts.backdropColor;
                ctx.fillRect(
                  me.xCenter - labelWidth / 2 - tickOpts.backdropPaddingX,
                  yHeight - tickFontSize / 2 - tickOpts.backdropPaddingY,
                  labelWidth + tickOpts.backdropPaddingX * 2,
                  tickFontSize + tickOpts.backdropPaddingY * 2
                );
              }

              ctx.textAlign = 'center';
              ctx.textBaseline = "middle";
              ctx.fillStyle = tickFontColor;
              ctx.fillText(label, me.xCenter, yHeight);
            }
          }
        });

        if (!opts.lineArc) {
          ctx.lineWidth = angleLineOpts.lineWidth;
          ctx.strokeStyle = angleLineOpts.color;

          var outerDistance = me.getDistanceFromCenterForValue(opts.reverse ? me.min : me.max);
          var pointLabelFontSize = getValueOrDefault(pointLabelOpts.fontSize, globalDefaults.defaultFontSize);
          var pointLabeFontStyle = getValueOrDefault(pointLabelOpts.fontStyle, globalDefaults.defaultFontStyle);
          var pointLabeFontFamily = getValueOrDefault(pointLabelOpts.fontFamily, globalDefaults.defaultFontFamily);
          var pointLabeFont = helpers.fontString(pointLabelFontSize, pointLabeFontStyle, pointLabeFontFamily);

          for (var i = me.getValueCount() - 1; i >= 0; i--) {
            if (angleLineOpts.display) {
              var outerPosition = me.getPointPosition(i, outerDistance);
              ctx.beginPath();
              ctx.moveTo(me.xCenter, me.yCenter);
              ctx.lineTo(outerPosition.x, outerPosition.y);
              ctx.stroke();
              ctx.closePath();
            }

            var pointLabelPosition = me.getPointPosition(i, outerDistance + 5);
            var pointLabelFontColor = getValueOrDefault(pointLabelOpts.fontColor, globalDefaults.defaultFontColor);

            ctx.font = pointLabeFont;
            ctx.fillStyle = pointLabelFontColor;

            var pointLabels = me.pointLabels;
            var angleRadians = this.getIndexAngle(i) + (Math.PI / 2);
            var angle = (angleRadians * 360 / (2 * Math.PI)) % 360;

            if (angle === 0 || angle === 180) {
              ctx.textAlign = 'center';
            } else if (angle < 180) {
              ctx.textAlign = 'left';
            } else {
              ctx.textAlign = 'right';
            }

            if (angle === 90 || angle === 270) {
              ctx.textBaseline = 'middle';
            } else if (angle > 270 || angle < 90) {
              ctx.textBaseline = 'bottom';
            } else {
              ctx.textBaseline = 'top';
            }

            ctx.fillText(pointLabels[i] ? pointLabels[i] : '', pointLabelPosition.x, pointLabelPosition.y);
          }
        }
      }
    }
  });
  Chart.scaleService.registerScaleType('radialLinear', LinearRadialScale, defaultConfig);

};
}, {}],
44:[function (require, module, exports){
'use strict';

var moment = require(1);
moment = typeof(moment) === 'function' ? moment : window.moment;

module.exports = function (Chart) {

  var helpers = Chart.helpers;
  var time = {
    units: [{
      name: 'millisecond',
      steps: [1, 2, 5, 10, 20, 50, 100, 250, 500]
    }, {
      name: 'second',
      steps: [1, 2, 5, 10, 30]
    }, {
      name: 'minute',
      steps: [1, 2, 5, 10, 30]
    }, {
      name: 'hour',
      steps: [1, 2, 3, 6, 12]
    }, {
      name: 'day',
      steps: [1, 2, 5]
    }, {
      name: 'week',
      maxStep: 4
    }, {
      name: 'month',
      maxStep: 3
    }, {
      name: 'quarter',
      maxStep: 4
    }, {
      name: 'year',
      maxStep: false
    }]
  };
  var defaultConfig = {
    position: 'bottom',
    time: {
      parser: false,
      format: false,
      unit: false,
      round: false,
      displayFormat: false,
      isoWeekday: false,
      displayFormats: {
        'millisecond': 'h:mm:ss.SSS a',
        'second': 'h:mm:ss a',
        'minute': 'h:mm:ss a',
        'hour': 'MMM D, hA',
        'day': 'll',
        'week': 'll',
        'month': 'MMM YYYY',
        'quarter': '[Q]Q - YYYY',
        'year': 'YYYY'
      }
    },
    ticks: {
      autoSkip: false
    }
  };
  var TimeScale = Chart.Scale.extend({
    initialize: function () {
      if (!moment) {
        throw new Error('Chart.js - Moment.js could not be found! You must include it before Chart.js to use the time scale. Download at https://momentjs.com');
      }

      Chart.Scale.prototype.initialize.call(this);
    },

    getLabelMoment: function (datasetIndex, index) {
      if (typeof this.labelMoments[datasetIndex] !== 'undefined') {
        return this.labelMoments[datasetIndex][index];
      }

      return null;
    },

    getMomentStartOf: function (tick) {
      var me = this;
      if (me.options.time.unit === 'week' && me.options.time.isoWeekday !== false) {
        return tick.clone().startOf('isoWeek').isoWeekday(me.options.time.isoWeekday);
      } else {
        return tick.clone().startOf(me.tickUnit);
      }
    },

    determineDataLimits: function () {
      var me = this;
      me.labelMoments = [];

      var scaleLabelMoments = [];
      if (me.chart.data.labels && me.chart.data.labels.length > 0) {
        helpers.each(me.chart.data.labels, function (label) {
          var labelMoment = me.parseTime(label);

          if (labelMoment.isValid()) {
            if (me.options.time.round) labelMoment.startOf(me.options.time.round);
            scaleLabelMoments.push(labelMoment);
          }
        }, me);

        me.firstTick = moment.min.call(me, scaleLabelMoments);
        me.lastTick = moment.max.call(me, scaleLabelMoments);
      } else {
        me.firstTick = null;
        me.lastTick = null;
      }

      helpers.each(me.chart.data.datasets, function (dataset, datasetIndex) {
        var momentsForDataset = [];
        var datasetVisible = me.chart.isDatasetVisible(datasetIndex);

        if (typeof dataset.data[0] === 'object' && dataset.data[0] !== null) {
          helpers.each(dataset.data, function (value) {
            var labelMoment = me.parseTime(me.getRightValue(value));

            if (labelMoment.isValid()) {
              if (me.options.time.round) labelMoment.startOf(me.options.time.round);
              momentsForDataset.push(labelMoment);

              if (datasetVisible) {
                me.firstTick = me.firstTick !== null ? moment.min(me.firstTick, labelMoment) : labelMoment;
                me.lastTick = me.lastTick !== null ? moment.max(me.lastTick, labelMoment) : labelMoment;
              }
            }
          }, me);
        } else {
          momentsForDataset = scaleLabelMoments;
        }

        me.labelMoments.push(momentsForDataset);
      }, me);

      if (me.options.time.min) {
        me.firstTick = me.parseTime(me.options.time.min);
      }
      if (me.options.time.max) {
        me.lastTick = me.parseTime(me.options.time.max);
      }

      me.firstTick = (me.firstTick || moment()).clone();
      me.lastTick = (me.lastTick || moment()).clone();
    },
    buildTicks: function () {
      var me = this;

      me.ctx.save();

      var tickFontSize = helpers.getValueOrDefault(me.options.ticks.fontSize, Chart.defaults.global.defaultFontSize);
      var tickFontStyle = helpers.getValueOrDefault(me.options.ticks.fontStyle, Chart.defaults.global.defaultFontStyle);
      var tickFontFamily = helpers.getValueOrDefault(me.options.ticks.fontFamily, Chart.defaults.global.defaultFontFamily);
      var tickLabelFont = helpers.fontString(tickFontSize, tickFontStyle, tickFontFamily);

      me.ctx.font = tickLabelFont;

      me.ticks = [];
      me.unitScale = 1;
      me.scaleSizeInUnits = 0;

      if (me.options.time.unit) {
        me.tickUnit = me.options.time.unit || 'day';
        me.displayFormat = me.options.time.displayFormats[me.tickUnit];
        me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true);
        me.unitScale = helpers.getValueOrDefault(me.options.time.unitStepSize, 1);
      } else {
        var innerWidth = me.isHorizontal() ? me.width - (me.paddingLeft + me.paddingRight) : me.height - (me.paddingTop + me.paddingBottom);
        var tempFirstLabel = me.tickFormatFunction(me.firstTick, 0, []);
        var tickLabelWidth = me.ctx.measureText(tempFirstLabel).width;
        var cosRotation = Math.cos(helpers.toRadians(me.options.ticks.maxRotation));
        var sinRotation = Math.sin(helpers.toRadians(me.options.ticks.maxRotation));
        tickLabelWidth = (tickLabelWidth * cosRotation) + (tickFontSize * sinRotation);
        var labelCapacity = innerWidth / (tickLabelWidth);

        me.tickUnit = 'millisecond';
        me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true);
        me.displayFormat = me.options.time.displayFormats[me.tickUnit];

        var unitDefinitionIndex = 0;
        var unitDefinition = time.units[unitDefinitionIndex];

        while (unitDefinitionIndex < time.units.length) {
          me.unitScale = 1;

          if (helpers.isArray(unitDefinition.steps) && Math.ceil(me.scaleSizeInUnits / labelCapacity) < helpers.max(unitDefinition.steps)) {
            for (var idx = 0; idx < unitDefinition.steps.length; ++idx) {
              if (unitDefinition.steps[idx] >= Math.ceil(me.scaleSizeInUnits / labelCapacity)) {
                me.unitScale = helpers.getValueOrDefault(me.options.time.unitStepSize, unitDefinition.steps[idx]);
                break;
              }
            }

            break;
          } else if ((unitDefinition.maxStep === false) || (Math.ceil(me.scaleSizeInUnits / labelCapacity) < unitDefinition.maxStep)) {
            me.unitScale = helpers.getValueOrDefault(me.options.time.unitStepSize, Math.ceil(me.scaleSizeInUnits / labelCapacity));
            break;
          } else {
            ++unitDefinitionIndex;
            unitDefinition = time.units[unitDefinitionIndex];

            me.tickUnit = unitDefinition.name;
            var leadingUnitBuffer = me.firstTick.diff(me.getMomentStartOf(me.firstTick), me.tickUnit, true);
            var trailingUnitBuffer = me.getMomentStartOf(me.lastTick.clone().add(1, me.tickUnit)).diff(me.lastTick, me.tickUnit, true);
            me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true) + leadingUnitBuffer + trailingUnitBuffer;
            me.displayFormat = me.options.time.displayFormats[unitDefinition.name];
          }
        }
      }

      var roundedStart;

      if (!me.options.time.min) {
        me.firstTick = me.getMomentStartOf(me.firstTick);
        roundedStart = me.firstTick;
      } else {
        roundedStart = me.getMomentStartOf(me.firstTick);
      }

      if (!me.options.time.max) {
        var roundedEnd = me.getMomentStartOf(me.lastTick);
        var delta = roundedEnd.diff(me.lastTick, me.tickUnit, true);

        if (delta < 0) {
          me.lastTick = me.getMomentStartOf(me.lastTick.add(1, me.tickUnit));
        } else if (delta >= 0) {
          me.lastTick = roundedEnd;
        }

        me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true);
      }

      me.smallestLabelSeparation = me.width;

      helpers.each(me.chart.data.datasets, function (dataset, datasetIndex) {
        for (var i = 1; i < me.labelMoments[datasetIndex].length; i++) {
          me.smallestLabelSeparation = Math.min(me.smallestLabelSeparation, me.labelMoments[datasetIndex][i].diff(me.labelMoments[datasetIndex][i - 1], me.tickUnit, true));
        }
      }, me);

      if (me.options.time.displayFormat) {
        me.displayFormat = me.options.time.displayFormat;
      }

      me.ticks.push(me.firstTick.clone());

      for (var i = 1; i <= me.scaleSizeInUnits; ++i) {
        var newTick = roundedStart.clone().add(i, me.tickUnit);

        if (me.options.time.max && newTick.diff(me.lastTick, me.tickUnit, true) >= 0) break;
        if (i % me.unitScale === 0) me.ticks.push(newTick);
      }

      var diff = me.ticks[me.ticks.length - 1].diff(me.lastTick, me.tickUnit);
      if (diff !== 0 || me.scaleSizeInUnits === 0) {
        if (me.options.time.max) {
          me.ticks.push(me.lastTick.clone());
          me.scaleSizeInUnits = me.lastTick.diff(me.ticks[0], me.tickUnit, true);
        } else {
          me.ticks.push(me.lastTick.clone());
          me.scaleSizeInUnits = me.lastTick.diff(me.firstTick, me.tickUnit, true);
        }
      }

      me.ctx.restore();
    },

    getLabelForIndex: function (index, datasetIndex) {
      var me = this;
      var label = me.chart.data.labels && index < me.chart.data.labels.length ? me.chart.data.labels[index] : '';

      if (typeof me.chart.data.datasets[datasetIndex].data[0] === 'object') {
        label = me.getRightValue(me.chart.data.datasets[datasetIndex].data[index]);
      }

      if (me.options.time.tooltipFormat) {
        label = me.parseTime(label).format(me.options.time.tooltipFormat);
      }

      return label;
    },

    tickFormatFunction: function (tick, index, ticks) {
      var formattedTick = tick.format(this.displayFormat);
      var tickOpts = this.options.ticks;
      var callback = helpers.getValueOrDefault(tickOpts.callback, tickOpts.userCallback);

      if (callback) {
        return callback(formattedTick, index, ticks);
      } else {
        return formattedTick;
      }
    },

    convertTicksToLabels: function () {
      var me = this;
      me.tickMoments = me.ticks;
      me.ticks = me.ticks.map(me.tickFormatFunction, me);
    },

    getPixelForValue: function (value, index, datasetIndex) {
      var me = this;

      if (!value || !value.isValid) {
        value = moment(me.getRightValue(value));
      }

      var labelMoment = value && value.isValid && value.isValid() ? value : me.getLabelMoment(datasetIndex, index);

      if (labelMoment) {
        var offset = labelMoment.diff(me.firstTick, me.tickUnit, true);
        var decimal = offset !== 0 ? offset / me.scaleSizeInUnits : offset;

        if (me.isHorizontal()) {
          var innerWidth = me.width - (me.paddingLeft + me.paddingRight);
          var valueOffset = (innerWidth * decimal) + me.paddingLeft;

          return me.left + Math.round(valueOffset);
        } else {
          var innerHeight = me.height - (me.paddingTop + me.paddingBottom);
          var heightOffset = (innerHeight * decimal) + me.paddingTop;

          return me.top + Math.round(heightOffset);
        }
      }
    },

    getPixelForTick: function (index) {
      return this.getPixelForValue(this.tickMoments[index], null, null);
    },

    getValueForPixel: function (pixel) {
      var me = this;
      var innerDimension = me.isHorizontal() ? me.width - (me.paddingLeft + me.paddingRight) : me.height - (me.paddingTop + me.paddingBottom);
      var offset = (pixel - (me.isHorizontal() ? me.left + me.paddingLeft : me.top + me.paddingTop)) / innerDimension;
      offset *= me.scaleSizeInUnits;
      return me.firstTick.clone().add(moment.duration(offset, me.tickUnit).asSeconds(), 'seconds');
    },

    parseTime: function (label) {
      var me = this;
      if (typeof me.options.time.parser === 'string') return moment(label, me.options.time.parser);
      if (typeof me.options.time.parser === 'function') return me.options.time.parser(label);
      if (typeof label.getMonth === 'function' || typeof label === 'number') return moment(label);
      if (label.isValid && label.isValid()) return label;
      if (typeof me.options.time.format !== 'string' && me.options.time.format.call) {
        console.warn('options.time.format is deprecated and replaced by options.time.parser. See http://nnnick.github.io/Chart.js/docs-v2/#scales-time-scale');
        return me.options.time.format(label);
      }
      return moment(label, me.options.time.format);
    }
  });
  Chart.scaleService.registerScaleType('time', TimeScale, defaultConfig);
};
},{ "1" : 1 }]}, {}, [7])(7)
});
