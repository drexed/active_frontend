# frozen_string_literal: true

module ActiveFrontendHelper

  # rubocop:disable Metrics/MethodLength
  def colors_brand(opacity = 1)
    {
      lime: { rgba: "rgba(164,217,111,#{opacity})", hex: '#A4D96F' },
      green: { rgba: "rgba(52,208,102,#{opacity})", hex: '#34D066' },
      teal: { rgba: "rgba(66,223,193,#{opacity})", hex: '#42DFC1' },
      sky: { rgba: "rgba(19,190,255,#{opacity})", hex: '#13BEFF' },
      blue: { rgba: "rgba(50,156,255,#{opacity})", hex: '#329CFF' },
      indigo: { rgba: "rgba(146,112,226,#{opacity})", hex: '#9270E2' },
      purple: { rgba: "rgba(194,111,212,#{opacity})", hex: '#C26FD4' },
      pink: { rgba: "rgba(240,129,143,#{opacity})", hex: '#F0818F' },
      red: { rgba: "rgba(241,91,83,#{opacity})", hex: '#F15B53' },
      brown: { rgba: "rgba(211,143,95,#{opacity})", hex: '#D38F5F' },
      orange: { rgba: "rgba(252,174,70,#{opacity})", hex: '#FCAE46' },
      yellow: { rgba: "rgba(248,214,72,#{opacity})", hex: '#F8D648' }
    }
  end

  def colors_grayscale(opacity = 1)
    {
      transparent: { rgba: 'rgba(0,0,0,0)', hex: '#FFFFFF' },
      dark_black: { rgba: "rgba(37,49,62,#{opacity})", hex: '#25313E' },
      black: { rgba: "rgba(44,58,73,#{opacity})", hex: '#2C3A49' },
      light_black: { rgba: "rgba(51,67,83,#{opacity})", hex: '#334353' },
      dark_gray: { rgba: "rgba(130,149,167,#{opacity})", hex: '#8295A7' },
      gray: { rgba: "rgba(145,162,178,#{opacity})", hex: '#91A2B2' },
      light_gray: { rgba: "rgba(160,174,188,#{opacity})", hex: '#A0AEBC' },
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
