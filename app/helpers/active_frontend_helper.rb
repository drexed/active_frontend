module ActiveFrontendHelper

  def colors(opacity = 1)
    {
      dark_black: { rgba: "rgba(27,30,34,#{opacity})", hex: '#1B1E22' },
      black: { rgba: "rgba(45,50,57,#{opacity})", hex: '#2D3239' },
      light_black: { rgba: "rgba(63,70,80,#{opacity})", hex: '#3F4650' },
      dark_gray: { rgba: "rgba(99,111,126,#{opacity})",  hex: '#636F7E' },
      gray: { rgba: "rgba(126,137,150,#{opacity})", hex: '#7E8996' },
      light_gray: { rgba: "rgba(152,162,174,#{opacity})", hex: '#98A2AE' },
      dark_haze: { rgba: "rgba(224,226,228,#{opacity})", hex: '#E0E2E4' },
      haze: { rgba: "rgba(235,237,239,#{opacity})", hex: '#EBEDEF' },
      light_haze: { rgba: "rgba(245,247,249,#{opacity})", hex: '#F5F7F9' },
      white: { rgba: "rgba(255,255,255,#{opacity})", hex: '#FFFFFF' },
      lime: { rgba: "rgba(151,212,19,#{opacity})", hex: '#97D413' },
      green: { rgba: "rgba(75,173,8,#{opacity})", hex: '#4BAD08' },
      teal: { rgba: "rgba(30,196,214,#{opacity})", hex: '#1EC4D6' },
      blue: { rgba: "rgba(0,102,255,#{opacity})", hex: '#0066FF' },
      indigo: { rgba: "rgba(86,21,237,#{opacity})", hex: '#5615ED' },
      purple: { rgba: "rgba(124,39,243,#{opacity})", hex: '#7C27F3' },
      pink: { rgba: "rgba(255,0,102,#{opacity})", hex: '#FF0066' },
      red: { rgba: "rgba(240,35,17,#{opacity})", hex: '#F02311' },
      orange: { rgba: "rgba(248,122,9,#{opacity})", hex: '#F87A09' },
      yellow: { rgba: "rgba(245,200,0,#{opacity})", hex: '#F5C800' }
    }
  end

end
