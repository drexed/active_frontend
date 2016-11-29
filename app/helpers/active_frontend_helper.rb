module ActiveFrontendHelper

  def colors(opacity = 1)
    {
      transparent: { rgba: "rgba(0,0,0,0)", hex: '#FFFFFF' },
      dark_black: { rgba: "rgba(30,40,52,#{opacity})", hex: '#1E2834' },
      black: { rgba: "rgba(39,52,68,#{opacity})", hex: '#273444' },
      light_black: { rgba: "rgba(48,64,84,#{opacity})", hex: '#304054' },
      dark_gray: { rgba: "rgba(143,157,178,#{opacity})",  hex: '#8F9DB2' },
      gray: { rgba: "rgba(155,167,186,#{opacity})", hex: '#9BA7BA' },
      light_gray: { rgba: "rgba(167,177,194,#{opacity})", hex: '#A7B1C2' },
      dark_haze: { rgba: "rgba(227,232,240,#{opacity})", hex: '#E0E5ED' },
      haze: { rgba: "rgba(240,243,249,#{opacity})", hex: '#F0F3F9' },
      light_haze: { rgba: "rgba(249,250,252,#{opacity})", hex: '#F9FAFC' },
      white: { rgba: "rgba(255,255,255,#{opacity})", hex: '#FFFFFF' },
      lime: { rgba: "rgba(148,226,84,#{opacity})", hex: '#94E254' },
      green: { rgba: "rgba(19,206,86,#{opacity})", hex: '#13CE56' },
      teal: { rgba: "rgba(51,201,235,#{opacity})", hex: '#33C9EB' },
      blue: { rgba: "rgba(20,141,255,#{opacity})", hex: '#148DFF' },
      indigo: { rgba: "rgba(126,91,239,#{opacity})", hex: '#7E5BEF' },
      purple: { rgba: "rgba(152,97,194,#{opacity})", hex: '#9861C2' },
      pink: { rgba: "rgba(255,93,196,#{opacity})", hex: '#FF5DC4' },
      red: { rgba: "rgba(255,59,59,#{opacity})", hex: '#FF3B3B' },
      orange: { rgba: "rgba(255,105,53,#{opacity})", hex: '#FF6935' },
      yellow: { rgba: "rgba(255,215,24,#{opacity})", hex: '#FFD718' }
    }
  end

end
