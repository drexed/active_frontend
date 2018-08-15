# frozen_string_literal: true

module ActiveFrontendHelper

  # rubocop:disable Metrics/MethodLength
  def colors_brand(opacity = 1)
    {
      lime: { rgba: "rgba(115,211,37,#{opacity})", hex: '#73d325' },
      green: { rgba: "rgba(59,201,29,#{opacity})", hex: '#3bc91d' },
      teal: { rgba: "rgba(21,214,150,#{opacity})", hex: '#15d696' },
      sky: { rgba: "rgba(0,160,255,#{opacity})", hex: '#00a0ff' },
      blue: { rgba: "rgba(3,94,255,#{opacity})", hex: '#035eff' },
      indigo: { rgba: "rgba(94,64,255,#{opacity})", hex: '#5e40ff' },
      purple: { rgba: "rgba(156,60,241,#{opacity})", hex: '#9c3cf1' },
      brown: { rgba: "rgba(130,65,36,#{opacity})", hex: '#824124' },
      pink: { rgba: "rgba(252,81,103,#{opacity})", hex: '#fc5167' },
      red: { rgba: "rgba(243,29,44,#{opacity})", hex: '#f31d2c' },
      orange: { rgba: "rgba(255,115,25,#{opacity})", hex: '#ff7319' },
      yellow: { rgba: "rgba(255,205,0,#{opacity})", hex: '#ffcd00' }
    }
  end

  def colors_grayscale(opacity = 1)
    {
      light_black: { rgba: "rgba(21,48,66,#{opacity})", hex: '#153042' },
      black: { rgba: "rgba(16,37,51,#{opacity})", hex: '#102533' },
      dark_black: { rgba: "rgba(12,26,36,#{opacity})", hex: '#0c1a24' },
      light_slate: { rgba: "rgba(43,67,88,#{opacity})", hex: '#2b4358' },
      slate: { rgba: "rgba(34,54,72,#{opacity})", hex: '#223648' },
      dark_slate: { rgba: "rgba(27,41,55,#{opacity})", hex: '#1b2937' },
      light_gray: { rgba: "rgba(158,177,201,#{opacity})", hex: '#9eb1c9' },
      gray: { rgba: "rgba(142,161,187,#{opacity})", hex: '#8ea1bc' },
      dark_gray: { rgba: "rgba(127,146,170,#{opacity})", hex: '#7f92aa' },
      light_haze: { rgba: "rgba(244,245,250,#{opacity})", hex: '#f4f5fa' },
      haze: { rgba: "rgba(234,237,248,#{opacity})", hex: '#eaedf8' },
      dark_haze: { rgba: "rgba(222,227,241,#{opacity})", hex: '#dee3f1' },
      white: { rgba: "rgba(255,255,255,#{opacity})", hex: '#ffffff' },
      transparent: { rgba: 'rgba(0,0,0,0)', hex: '#ffffff' }
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
    colors_global(opacity).merge(colors_brand(opacity)).merge(colors_grayscale(opacity))
  end

end
