module ActiveFrontendHelper

  def colors(opacity = 1)
    {
      transparent: { rgba: "rgba(0,0,0,0)", hex: '#FFFFFF' },
      dark_black: { rgba: "rgba(31,45,61,#{opacity})", hex: '#1F2D3D' },
      black: { rgba: "rgba(39,52,72,#{opacity})", hex: '#273448' },
      light_black: { rgba: "rgba(50,65,86,#{opacity})", hex: '#344358' },
      dark_gray: { rgba: "rgba(104,120,143,#{opacity})",  hex: '#68788F' },
      gray: { rgba: "rgba(132,146,166,#{opacity})", hex: '#8492A6' },
      light_gray: { rgba: "rgba(155,167,186,#{opacity})", hex: '#9BA7BA' },
      dark_haze: { rgba: "rgba(227,232,240,#{opacity})", hex: '#E0E5ED' },
      haze: { rgba: "rgba(239,242,248,#{opacity})", hex: '#ECEFF5' },
      light_haze: { rgba: "rgba(249,250,252,#{opacity})", hex: '#F7F8FA' },
      white: { rgba: "rgba(255,255,255,#{opacity})", hex: '#FFFFFF' },
      lime: { rgba: "rgba(171,208,38,#{opacity})", hex: '#ABD026' },
      green: { rgba: "rgba(114,201,20,#{opacity})", hex: '#72C914' },
      teal: { rgba: "rgba(50,201,234,#{opacity})", hex: '#32C9EA' },
      blue: { rgba: "rgba(0,124,255,#{opacity})", hex: '#007CFF' },
      indigo: { rgba: "rgba(92,92,235,#{opacity})", hex: '#5C5CEB' },
      purple: { rgba: "rgba(140,75,251,#{opacity})", hex: '#8C4BFB' },
      pink: { rgba: "rgba(255,95,132,#{opacity})", hex: '#FF5F84' },
      red: { rgba: "rgba(245,47,46,#{opacity})", hex: '#F52F2E' },
      orange: { rgba: "rgba(254,146,26,#{opacity})", hex: '#FE921A' },
      yellow: { rgba: "rgba(255,214,19,#{opacity})", hex: '#FFD613' }
    }
  end

end
