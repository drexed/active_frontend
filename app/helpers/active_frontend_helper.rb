# frozen_string_literal: true

module ActiveFrontendHelper

  # rubocop:disable Metrics/MethodLength
  def colors_brand(opacity = 1)
    {
      lime: { rgba: "rgba(151,212,91,#{opacity})", hex: '#97D45B' },
      green: { rgba: "rgba(52,208,89,#{opacity})", hex: '#34D059' },
      teal: { rgba: "rgba(66,223,180,#{opacity})", hex: '#42DFB4' },
      sky: { rgba: "rgba(0,179,255,#{opacity})", hex: '#00B3FF' },
      blue: { rgba: "rgba(50,139,255,#{opacity})", hex: '#328BFF' },
      indigo: { rgba: "rgba(141,99,239,#{opacity})", hex: '#8D63EF' },
      purple: { rgba: "rgba(179,104,219,#{opacity})", hex: '#B368DB' },
      pink: { rgba: "rgba(237,106,123,#{opacity})", hex: '#ED6A7B' },
      brown: { rgba: "rgba(198,115,89,#{opacity})", hex: '#C67359' },
      red: { rgba: "rgba(240,74,65#{opacity})", hex: '#F04A41' },
      orange: { rgba: "rgba(252,163,45,#{opacity})", hex: '#FCA32D' },
      yellow: { rgba: "rgba(247,208,47,#{opacity})", hex: '#F7D02F' }
    }
  end

  def colors_grayscale(opacity = 1)
    {
      light_black: { rgba: "rgba(58,63,84,#{opacity})", hex: '#3A3F54' },
      black: { rgba: "rgba(44,49,70,#{opacity})", hex: '#2C3146' },
      dark_black: { rgba: "rgba(30,35,55,#{opacity})", hex: '#1E2337' },
      light_gray: { rgba: "rgba(152,166,184,#{opacity})", hex: '#98A6B8' },
      gray: { rgba: "rgba(138,152,170,#{opacity})", hex: '#8A98AA' },
      dark_gray: { rgba: "rgba(124,138,156,#{opacity})", hex: '#7C8A9C' },
      light_haze: { rgba: "rgba(248,249,253,#{opacity})", hex: '#F8F9FD' },
      haze: { rgba: "rgba(238,241,250,#{opacity})", hex: '#EEF1FA' },
      dark_haze: { rgba: "rgba(229,234,244,#{opacity})", hex: '#E5EAF4' },
      white: { rgba: "rgba(255,255,255,#{opacity})", hex: '#FFFFFF' },
      transparent: { rgba: 'rgba(0,0,0,0)', hex: '#FFFFFF' }
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
