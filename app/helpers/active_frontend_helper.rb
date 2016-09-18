module ActiveFrontendHelper

  def colors(opacity = 1)
    {
      transparent: { rgba: "rgba(0,0,0,0)", hex: '#FFFFFF' },
      dark_black: { rgba: "rgba(44,50,62,#{opacity})", hex: '#2C323E' },
      black: { rgba: "rgba(52,59,74,#{opacity})", hex: '#343B4A' },
      light_black: { rgba: "rgba(60,68,86,#{opacity})", hex: '#3C4456' },
      dark_gray: { rgba: "rgba(143,157,178,#{opacity})",  hex: '#8F9DB2' },
      gray: { rgba: "rgba(155,167,186,#{opacity})", hex: '#9BA7BA' },
      light_gray: { rgba: "rgba(167,177,194,#{opacity})", hex: '#A7B1C2' },
      dark_haze: { rgba: "rgba(227,232,240,#{opacity})", hex: '#E0E5ED' },
      haze: { rgba: "rgba(239,242,248,#{opacity})", hex: '#ECEFF5' },
      light_haze: { rgba: "rgba(249,250,252,#{opacity})", hex: '#F7F8FA' },
      white: { rgba: "rgba(255,255,255,#{opacity})", hex: '#FFFFFF' },
      lime: { rgba: "rgba(221,234,76,#{opacity})", hex: '#DDEA4C' },
      green: { rgba: "rgba(109,202,150,#{opacity})", hex: '#6DCA96' },
      teal: { rgba: "rgba(86,210,238,#{opacity})", hex: '#56D2EE' },
      blue: { rgba: "rgba(31,140,235,#{opacity})", hex: '#1F8CEB' },
      indigo: { rgba: "rgba(126,97,234,#{opacity})", hex: '#7E61EA' },
      purple: { rgba: "rgba(154,111,199,#{opacity})", hex: '#9A6FC7' },
      pink: { rgba: "rgba(255,127,127,#{opacity})", hex: '#FF7F7F' },
      red: { rgba: "rgba(224,78,80,#{opacity})", hex: '#E04E50' },
      orange: { rgba: "rgba(255,144,78,#{opacity})", hex: '#FF904E' },
      yellow: { rgba: "rgba(242,195,48,#{opacity})", hex: '#F2C330' }
    }
  end

end
