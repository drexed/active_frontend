module ActiveFrontendHelper

  def colors(opacity = 1)
    {
      transparent: { rgba: "rgba(0,0,0,0)", hex: '#FFFFFF' },
      dark_black: { rgba: "rgba(30,40,52,#{opacity})", hex: '#1E2834' },
      black: { rgba: "rgba(39,52,68,#{opacity})", hex: '#273444' },
      light_black: { rgba: "rgba(48,64,84,#{opacity})", hex: '#304054' },
      dark_gray: { rgba: "rgba(109,126,150,#{opacity})",  hex: '#6D7E96' },
      gray: { rgba: "rgba(132,146,166,#{opacity})", hex: '#8492A6' },
      light_gray: { rgba: "rgba(155,166,182,#{opacity})", hex: '#9BA6B6' },
      dark_haze: { rgba: "rgba(227,232,240,#{opacity})", hex: '#E0E5ED' },
      haze: { rgba: "rgba(238,240,246,#{opacity})", hex: '#EEF0F6' },
      light_haze: { rgba: "rgba(249,250,252,#{opacity})", hex: '#F9FAFC' },
      white: { rgba: "rgba(255,255,255,#{opacity})", hex: '#FFFFFF' },
      lime: { rgba: "rgba(154,191,91,#{opacity})", hex: '#9ABF5B' },
      green: { rgba: "rgba(50,194,81,#{opacity})", hex: '#32C251' },
      teal: { rgba: "rgba(55,186,212,#{opacity})", hex: '#37BAD4' },
      blue: { rgba: "rgba(36,126,236,#{opacity})", hex: '#247EEC' },
      indigo: { rgba: "rgba(126,97,234,#{opacity})", hex: '#7E61EA' },
      purple: { rgba: "rgba(173,101,228,#{opacity})", hex: '#AD65E4' },
      pink: { rgba: "rgba(241,93,121,#{opacity})", hex: '#F15D79' },
      red: { rgba: "rgba(221,61,63,#{opacity})", hex: '#DD3D3F' },
      orange: { rgba: "rgba(234,133,50,#{opacity})", hex: '#EA8532' },
      yellow: { rgba: "rgba(242,203,36,#{opacity})", hex: '#F2CB24' }
    }
  end

end
