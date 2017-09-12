module ActiveFrontendHelper

  # rubocop:disable Metrics/MethodLength
  def colors_brand(opacity = 1)
    {
      lime: { rgba: "rgba(151,212,91,#{opacity})", hex: '#97D45B' },
      green: { rgba: "rgba(52,208,76,#{opacity})", hex: '#34D059' },
      teal: { rgba: "rgba(44,219,186,#{opacity})", hex: '#2CDBBA' },
      sky: { rgba: "rgba(31,182,255,#{opacity})", hex: '#1FB6FF' },
      blue: { rgba: "rgba(25,144,255,#{opacity})", hex: '#1990ff' },
      indigo: { rgba: "rgba(130,91,222,#{opacity})", hex: '#825BDE' },
      purple: { rgba: "rgba(186,91,206,#{opacity})", hex: '#BA5BCE' },
      pink: { rgba: "rgba(237,106,123,#{opacity})", hex: '#ED6A7B' },
      red: { rgba: "rgba(239,69,59,#{opacity})", hex: '#EF453B' },
      brown: { rgba: "rgba(217,139,82,#{opacity})", hex: '#D98B52' },
      orange: { rgba: "rgba(252,163,45,#{opacity})", hex: '#FCA32D' },
      yellow: { rgba: "rgba(247,208,47,#{opacity})", hex: '#F7D02F' }
    }
  end

  def colors_grayscale(opacity = 1)
    {
      transparent: { rgba: 'rgba(0,0,0,0)', hex: '#FFFFFF' },
      dark_black: { rgba: "rgba(37,49,62,#{opacity})", hex: '#25313E' },
      black: { rgba: "rgba(44,58,73,#{opacity})", hex: '#2C3A49' },
      light_black: { rgba: "rgba(51,67,83,#{opacity})", hex: '#334353' },
      dark_gray: { rgba: "rgba(99,125,144,#{opacity})", hex: '#637D90' },
      gray: { rgba: "rgba(120,144,162,#{opacity})", hex: '#7890A2' },
      light_gray: { rgba: "rgba(143,163,178,#{opacity})", hex: '#8FA3B2' },
      dark_haze: { rgba: "rgba(229,234,244,#{opacity})", hex: '#E5EAF4' },
      haze: { rgba: "rgba(238,241,250,#{opacity})", hex: '#EEF1FA' },
      light_haze: { rgba: "rgba(248,249,253,#{opacity})", hex: '#F8F9FD' },
      white: { rgba: "rgba(255,255,255,#{opacity})", hex: '#FFFFFF' }
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
    colors_global(opacity).merge(colors_brand(opacity))
                          .merge(colors_grayscale(opacity))
  end

end
