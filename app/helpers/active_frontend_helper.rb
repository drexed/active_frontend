# frozen_string_literal: true

module ActiveFrontendHelper

  # rubocop:disable Metrics/MethodLength
  def colors_brand(opacity = 1)
    {
      lime: { rgba: "rgba(132,207,71,#{opacity})", hex: '#84CF47' },
      green: { rgba: "rgba(86,198,62,#{opacity})", hex: '#56C63E' },
      teal: { rgba: "rgba(40,215,157,#{opacity})", hex: '#28D79D' },
      sky: { rgba: "rgba(18,174,255,#{opacity})", hex: '#12AEFF' },
      blue: { rgba: "rgba(2,141,255,#{opacity})", hex: '#028DFF' },
      indigo: { rgba: "rgba(132,99,239,#{opacity})", hex: '#8463EF' },
      purple: { rgba: "rgba(177,99,218,#{opacity})", hex: '#B163DA' },
      brown: { rgba: "rgba(160,116,88,#{opacity})", hex: '#A07458' },
      pink: { rgba: "rgba(237,106,123,#{opacity})", hex: '#ED6A7B' },
      red: { rgba: "rgba(236,70,61,#{opacity})", hex: '#EC463D' },
      orange: { rgba: "rgba(252,146,35,#{opacity})", hex: '#FC9223' },
      yellow: { rgba: "rgba(247,208,32,#{opacity})", hex: '#F7D020' }
    }
  end

  def colors_grayscale(opacity = 1)
    {
      light_black: { rgba: "rgba(48,67,85,#{opacity})", hex: '#304355' },
      black: { rgba: "rgba(38,54,70,#{opacity})", hex: '#263646' },
      dark_black: { rgba: "rgba(31,44,60,#{opacity})", hex: '#1F2C3C' },
      light_gray: { rgba: "rgba(143,162,185,#{opacity})", hex: '#8FA2B9' },
      gray: { rgba: "rgba(127,146,170,#{opacity})", hex: '#7F92AA' },
      dark_gray: { rgba: "rgba(110,129,153,#{opacity})", hex: '#6E8199' },
      light_haze: { rgba: "rgba(247,248,253,#{opacity})", hex: '#F7F8FD' },
      haze: { rgba: "rgba(238,241,250,#{opacity})", hex: '#EDF0F9' },
      dark_haze: { rgba: "rgba(237,240,249,#{opacity})", hex: '#E4E9F4' },
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
