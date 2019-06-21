(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FunnelChart = factory();
  }
}(this, function() {
  function extend(out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i]) continue;

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          out[key] = arguments[i][key];
        }
      }
    }

    return out;
  }

  function FunnelChart(canvas, settings) {
    if (!(this instanceof FunnelChart)) {
      return new FunnelChart(canvas, settings);
    }

    this.canvas = (typeof canvas === 'string') ? document.getElementById(canvas) : canvas;

    if (!settings.values || !settings.values.length) {
      throw('A values setting must be provided');
    }

    this.settings = extend(this.settings, settings);
    this.initialize();
  }

  FunnelChart.prototype = extend(FunnelChart.prototype, {
    settings: {
      displayPercentageChange: false,
      pPrecision: 1,
      labelLineColor: '#eaeffa',
      labelFontColor: '#2e4261',
      sectionColor: ['#17438c', '#1d55b2', '#2367d8', '#007bff', '#498dfe', '#69a1fe', '#89b5fe'],
      pSectionColor: '#f6f8fc',
      font: "'Circular', '-apple-system', BlinkMacSystemFont, 'Segoe UI', Verdana, Tahoma, sans-serif",
      maxFontSize: 12,
      fontWeight: '700',
      sectionFontColor: '#ffffff',
      pSectionFontColor: '#ffffff',
      pSectionHeightPercent: 50,
      labelWidthPercent: 30,
      funnelReductionPercent: 50,
      labelOffset: 0,
      lineHeight: 0
    },
    initialize: function() {
      this.calculateDimensions();
      this.draw();
    },
    calculateDimensions: function() {
      var settings = this.settings;
      var labelWidth, sectionTotalHeight, multiplier;

      this.width = this.canvas.offsetWidth;
      this.height = this.canvas.offsetHeight;

      this.createHiDPICanvas();

      labelWidth = this.hasLabels() ? this.width * (settings.labelWidthPercent / 100) : 0;
      this.labelMaxWidth = labelWidth - settings.labelOffset;
      this.startWidth = this.width - labelWidth;
      this.endWidth = this.startWidth * (settings.funnelReductionPercent / 100);

      sectionTotalHeight = (this.height / (settings.values.length));

      if (settings.displayPercentageChange) {
        multiplier = this.height / (this.height - (sectionTotalHeight / (100 + settings.pSectionHeightPercent)) * settings.pSectionHeightPercent);
        this.sectionHeight = (multiplier * ((sectionTotalHeight / (100 + settings.pSectionHeightPercent)) * 100));
        this.pSectionHeight = (multiplier * ((sectionTotalHeight / (100 + settings.pSectionHeightPercent)) * settings.pSectionHeightPercent));
      } else {
        this.sectionHeight = sectionTotalHeight;
        this.pSectionHeight = 0;
      }
    },
    pixelRatio: function(){
      var ctx = this.canvas.getContext('2d');
      var dpr = window.devicePixelRatio || 1;
      var bsr = ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;

      return dpr / bsr;
    },
    createHiDPICanvas: function() {
      var canvas = this.canvas;
      var ratio = this.pixelRatio();
      var w = this.width;
      var h = this.height;

      canvas.width = w * ratio;
      canvas.height = h * ratio;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
    },
    draw: function() {
      var canvas = this.canvas;
      var settings = this.settings;

      if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var maxAvailFontSize = ((settings.displayPercentageChange) ? this.pSectionHeight : this.sectionHeight) - 2;

        if (settings.maxFontSize >= maxAvailFontSize) {
          settings.maxFontSize = maxAvailFontSize;
        }

        ctx.font = settings.fontWeight + ' ' + settings.maxFontSize + 'px ' + settings.font;

        if (this.hasLabels()) this.drawLabels(ctx);

        this.drawClippingArea(ctx, settings);

        ctx.fillStyle = '#dfe6f6';
        ctx.fill();
        ctx.clip();

        this.drawSections(ctx);
        this.drawClippingArea(ctx, settings, true);

        ctx.lineWidth = 0;
        ctx.strokeStyle = '#dfe6f6';
        ctx.stroke();
      }
    },
    drawLabels: function(ctx) {
      var i;
      var yPos;
      var settings = this.settings;

      ctx.textAlign = 'left';
      ctx.strokeStyle = settings.labelLineColor;
      ctx.lineWidth = settings.lineHeight;

      for (i = 0; i < settings.values.length; i++) {
        yPos = this.calculateYPos(i) - 1;

        ctx.fillStyle = this.sequentialValue(settings.labelFontColor, i);
        ctx.fillText(
          settings.labels[i] || '',
          this.startWidth + settings.labelOffset,
          yPos + (this.sectionHeight / 2) + (settings.maxFontSize / 2) - 2,
          this.labelMaxWidth
        );

        if (i > 0) {
          ctx.beginPath();
          ctx.moveTo(i, yPos);
          ctx.lineTo(this.width, yPos);
          ctx.stroke();
        }

        if (i < (settings.values.length - 1) && settings.displayPercentageChange) {
          ctx.beginPath();
          ctx.moveTo(i, yPos + this.sectionHeight);
          ctx.lineTo(this.width, yPos + this.sectionHeight);
          ctx.stroke();
        }
      }
    },
    drawClippingArea: function(ctx, settings, curvesOnly) {
      var inset = (this.startWidth - this.endWidth) / 2;
      var height = (settings.values.length * this.sectionHeight) +
                     ((settings.values.length - 1) * this.pSectionHeight) +
                     (settings.values.length + 1);
      var lineOrMove = curvesOnly ? 'moveTo' : 'lineTo';

      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx[lineOrMove](this.startWidth,0);
      ctx.quadraticCurveTo(
        (this.startWidth - inset),
        (height / 3),
        (this.startWidth - inset),
        height
      );
      ctx[lineOrMove](inset,height);
      ctx.quadraticCurveTo(inset, (height / 3), 0, 0);
    },
    drawSections: function(ctx) {
      var i;
      var yPos;
      var settings = this.settings;

      ctx.textAlign = 'center';

      for (i = 0; i < settings.values.length; i++) {
        yPos = this.calculateYPos(i);

        ctx.fillStyle = this.sequentialValue(settings.sectionColor, i);
        ctx.fillRect(0, yPos, this.startWidth, this.sectionHeight - settings.lineHeight);
        ctx.fillStyle = this.sequentialValue(settings.sectionFontColor, i);
        ctx.fillText(
          settings.values[i],
          this.startWidth / 2,
          yPos + ((this.sectionHeight - settings.lineHeight) / 2) + (settings.maxFontSize / 2) - 2
        );

        if (i < (settings.values.length - 1) && settings.displayPercentageChange) {
          ctx.fillStyle = this.sequentialValue(settings.pSectionColor, i);
          ctx.fillRect(
            0,
            (yPos + this.sectionHeight),
            this.startWidth,
            this.pSectionHeight - settings.lineHeight
          );
          ctx.fillStyle = this.sequentialValue(settings.pSectionFontColor, i);
          ctx.fillText(
            (settings.values[i] === 0) ? '' : ((settings.values[i + 1] / settings.values[i]) * 100).toFixed(settings.pPrecision) + '%',
            this.startWidth / 2,
            yPos + this.sectionHeight + ((this.pSectionHeight - settings.lineHeight) / 2) + (settings.maxFontSize / 2) - 1
          );
        }
      }
    },
    hasLabels: function() {
      var labels = this.settings.labels;
      return labels && !!labels.length;
    },
    calculateYPos: function(i) {
      var sectionHeight = this.sectionHeight;

      if(this.settings.displayPercentageChange) {
        sectionHeight += this.pSectionHeight;
      }

      return sectionHeight * i;
    },
    sequentialValue: function(arr, i) {
      if (typeof arr === 'string') return arr;
      return arr[i % arr.length];
    }
  });

  return FunnelChart;
}));
