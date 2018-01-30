# frozen_string_literal: true

module ActiveFrontendHelper

  # rubocop:disable Metrics/MethodLength
  def colors_brand(opacity = 1)
    {
      lime: { rgba: "rgba(122,197,61,#{opacity})", hex: '#7ac53d' },
      green: { rgba: "rgba(76,188,52,#{opacity})", hex: '#4cbc34' },
      teal: { rgba: "rgba(30,205,147,#{opacity})", hex: '#1ecd93' },
      sky: { rgba: "rgba(0,165,255,#{opacity})", hex: '#00a5ff' },
      blue: { rgba: "rgba(22,126,255,#{opacity})", hex: '#167eff' },
      indigo: { rgba: "rgba(128,95,235,#{opacity})", hex: '#805feb' },
      purple: { rgba: "rgba(157,94,213,#{opacity})", hex: '#9d5ed5' },
      brown: { rgba: "rgba(145,101,73,#{opacity})", hex: '#916549' },
      pink: { rgba: "rgba(232,101,118,#{opacity})", hex: '#e86576' },
      red: { rgba: "rgba(244,53,67,#{opacity})", hex: '#f43543' },
      orange: { rgba: "rgba(252,131,35,#{opacity})", hex: '#fc8323' },
      yellow: { rgba: "rgba(245,202,9,#{opacity})", hex: '#f5ca09' }
    }
  end

  def colors_grayscale(opacity = 1)
    {
      light_black: { rgba: "rgba(17,42,62,#{opacity})", hex: '#112a3e' },
      black: { rgba: "rgba(13,32,47,#{opacity})", hex: '#0d202f' },
      dark_black: { rgba: "rgba(9,22,32,#{opacity})", hex: '#091620' },
      light_slate: { rgba: "rgba(55,78,98,#{opacity})", hex: '#374e62' },
      slate: { rgba: "rgba(48,68,85,#{opacity})", hex: '#304455' },
      dark_slate: { rgba: "rgba(41,58,72,#{opacity})", hex: '#293a48' },
      light_gray: { rgba: "rgba(113,129,142,#{opacity})", hex: '#71818e' },
      gray: { rgba: "rgba(105,119,131,#{opacity})", hex: '#697783' },
      dark_gray: { rgba: "rgba(96,109,120,#{opacity})", hex: '#606d78' },
      light_haze: { rgba: "rgba(247,248,253,#{opacity})", hex: '#f7f8fd' },
      haze: { rgba: "rgba(238,241,250,#{opacity})", hex: '#edf0f9' },
      dark_haze: { rgba: "rgba(237,240,249,#{opacity})", hex: '#e4e9f4' },
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
