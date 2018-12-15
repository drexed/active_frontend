# frozen_string_literal: true

module ActiveFrontendHelper

  # rubocop:disable Metrics/MethodLength
  def colors_base(opacity = 1)
    {
      black: { rgba: "rgba(16,37,51,#{opacity})", hex: '#102533' },
      white: { rgba: "rgba(255,255,255,#{opacity})", hex: '#ffffff' },
      transparent: { rgba: 'rgba(0,0,0,0)', hex: '#ffffff' }
    }
  end

  def colors_brand(opacity = 1)
    {
      lime: { rgba: "rgba(171,189,49,#{opacity})", hex: '#abbd31' },
      green: { rgba: "rgba(67,197,64,#{opacity})", hex: '#43c540' },
      teal: { rgba: "rgba(39,196,144,#{opacity})", hex: '#27c490' },
      sky: { rgba: "rgba(65,176,255,#{opacity})", hex: '#41b0ff' },
      blue: { rgba: "rgba(41,121,254,#{opacity})", hex: '#2979fe' },
      indigo: { rgba: "rgba(134,96,254,#{opacity})", hex: '#8660fe' },
      purple: { rgba: "rgba(187,100,250,#{opacity})", hex: '#bb64fa' },
      brown: { rgba: "rgba(128,88,78,#{opacity})", hex: '#80584e' },
      pink: { rgba: "rgba(245,112,129,#{opacity})", hex: '#f57081' },
      red: { rgba: "rgba(239,56,67,#{opacity})", hex: '#ef3843' },
      orange: { rgba: "rgba(247,115,55,#{opacity})", hex: '#f77337' },
      yellow: { rgba: "rgba(249,202,40,#{opacity})", hex: '#f9ca28' }
    }
  end

  def colors_grayscale(opacity = 1)
    {
      light_slate: { rgba: "rgba(40,63,92,#{opacity})", hex: '#283f5c' },
      slate: { rgba: "rgba(34,54,78,#{opacity})", hex: '#22364e' },
      dark_slate: { rgba: "rgba(28,45,64,#{opacity})", hex: '#1c2d40' },
      light_gray: { rgba: "rgba(178,196,214,#{opacity})", hex: '#b2c4d6' },
      gray: { rgba: "rgba(165,186,207,#{opacity})", hex: '#a5bacf' },
      dark_gray: { rgba: "rgba(152,176,200,#{opacity})", hex: '#98b0c8' },
      light_haze: { rgba: "rgba(246,248,252,#{opacity})", hex: '#f6f8fc' },
      haze: { rgba: "rgba(234,239,250,#{opacity})", hex: '#eaeffa' },
      dark_haze: { rgba: "rgba(223,230,246,#{opacity})", hex: '#dfe6f6' }
    }
  end
  # rubocop:enable Metrics/MethodLength

  def colors_global(opacity = 1)
    available_colors = colors_brand(opacity)

    {
      primary: available_colors[:blue],
      secondary: available_colors[:green],
      tertiary: available_colors[:red],
      quaditiary: available_colors[:yellow]
    }
  end

  def colors(opacity = 1)
    colors_global(opacity).merge(colors_base(opacity))
                          .merge(colors_brand(opacity))
                          .merge(colors_grayscale(opacity))
  end

end
