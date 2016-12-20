module ActiveFrontendHelper

  def colors(opacity = 1)
    {
      transparent: { rgba: "rgba(0,0,0,0)", hex: '#FFFFFF' },
      dark_black: { rgba: "rgba(47,59,72,#{opacity})", hex: '#2F3B48' },
      black: { rgba: "rgba(54,68,83,#{opacity})", hex: '#364453' },
      light_black: { rgba: "rgba(61,77,93,#{opacity})", hex: '#3D4D5D' },
      dark_gray: { rgba: "rgba(110,128,150,#{opacity})",  hex: '#6E8096' },
      gray: { rgba: "rgba(130,146,164,#{opacity})", hex: '#8292A4' },
      light_gray: { rgba: "rgba(153,166,183,#{opacity})", hex: '#99A6B7' },
      dark_haze: { rgba: "rgba(229,232,241,#{opacity})", hex: '#E5E8F1' },
      haze: { rgba: "rgba(238,240,246,#{opacity})", hex: '#EEF0F6' },
      light_haze: { rgba: "rgba(249,250,252,#{opacity})", hex: '#F9FAFC' },
      white: { rgba: "rgba(255,255,255,#{opacity})", hex: '#FFFFFF' },
      lime: { rgba: "rgba(161,215,77,#{opacity})", hex: '#A1D74D' },
      green: { rgba: "rgba(46,204,64,#{opacity})", hex: '#2ECC40' },
      teal: { rgba: "rgba(46,207,221,#{opacity})", hex: '#2ECFDD' },
      blue: { rgba: "rgba(13,134,246,#{opacity})", hex: '#0D86F6' },
      indigo: { rgba: "rgba(126,99,226,#{opacity})", hex: '#7E63E2' },
      purple: { rgba: "rgba(186,91,206,#{opacity})", hex: '#BA5BCE' },
      pink: { rgba: "rgba(239,76,136,#{opacity})", hex: '#EA4C88' },
      red: { rgba: "rgba(235,70,34,#{opacity})", hex: '#EB4622' },
      orange: { rgba: "rgba(253,163,13,#{opacity})", hex: '#FDA30D' },
      yellow: { rgba: "rgba(246,209,35,#{opacity})", hex: '#F6D123' }
    }
  end

end
