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
      lime: { rgba: "rgba(169,195,67,#{opacity})", hex: '#A9C343' },
      green: { rgba: "rgba(50,194,117,#{opacity})", hex: '#32C275' },
      teal: { rgba: "rgba(73,194,193,#{opacity})", hex: '#49C2C1' },
      blue: { rgba: "rgba(31,140,235,#{opacity})", hex: '#1F8CEB' },
      indigo: { rgba: "rgba(126,97,234,#{opacity})", hex: '#7E61EA' },
      purple: { rgba: "rgba(161,108,202,#{opacity})", hex: '#A16CCA' },
      pink: { rgba: "rgba(225,96,120,#{opacity})", hex: '#E16078' },
      red: { rgba: "rgba(224,78,80,#{opacity})", hex: '#E04E50' },
      orange: { rgba: "rgba(226,147,58,#{opacity})", hex: '#E2933A' },
      yellow: { rgba: "rgba(233,194,31,#{opacity})", hex: '#E9C21F' }
    }
  end

end
