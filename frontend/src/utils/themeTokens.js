import * as THREE from "three"

const THEME_VAR_MAP = {
  base: "--ca-base",
  text: "--ca-text",
  accent: "--ca-accent",
  background: "--ca-background",
  surface: "--ca-surface",
  surfaceRaised: "--ca-surface-raised",
  surfaceElevated: "--ca-surface-elevated",
  border: "--ca-border",
  borderStrong: "--ca-border-strong",
  textPrimary: "--ca-text-primary",
  textSecondary: "--ca-text-secondary",
  textMuted: "--ca-text-muted",
  textInverse: "--ca-text-inverse",
  interactive: "--ca-interactive",
  interactiveHover: "--ca-interactive-hover",
  chartSeries1: "--ca-chart-series-1",
  chartSeries2: "--ca-chart-series-2",
  chartSeries3: "--ca-chart-series-3",
  chartGrid: "--ca-chart-grid",
  chartAxis: "--ca-chart-axis",
  positive: "--ca-positive",
  negative: "--ca-negative",
  sceneMetal: "--ca-scene-metal",
  sceneRim: "--ca-scene-rim",
  sceneEngraving: "--ca-scene-engraving",
  sceneLabel: "--ca-scene-label",
  sceneLightKey: "--ca-scene-light-key",
  sceneLightFill: "--ca-scene-light-fill",
}

function cssColorToHex(computedColor, canvasCtx) {
  if (!computedColor) return null
  if (canvasCtx) {
    try {
      canvasCtx.clearRect(0, 0, 1, 1)
      canvasCtx.fillStyle = computedColor
      canvasCtx.fillRect(0, 0, 1, 1)
      const [r, g, b] = canvasCtx.getImageData(0, 0, 1, 1).data
      const hex = ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
      return `#${hex}`
    } catch {
      // Fallback to THREE.Color parsing below
    }
  }
  try {
    const color = new THREE.Color(computedColor)
    return `#${color.getHexString()}`
  } catch {
    return null
  }
}

/**
 * Resolves computed CSS custom properties (including color-mix(in oklch, ...))
 * through a temporary probe node outside WebGL frame loops.
 */
export function resolveThemeTokens() {
  if (typeof document === "undefined" || !document.body) {
    return {}
  }

  const probe = document.createElement("span")
  probe.style.position = "absolute"
  probe.style.visibility = "hidden"
  probe.style.pointerEvents = "none"
  document.body.appendChild(probe)

  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1
  const canvasCtx = canvas.getContext("2d", { willReadFrequently: true })

  const resolved = {}
  try {
    for (const [key, cssVar] of Object.entries(THEME_VAR_MAP)) {
      probe.style.color = `var(${cssVar})`
      const computed = getComputedStyle(probe).color
      const hex = cssColorToHex(computed, canvasCtx)
      if (hex) {
        resolved[key] = hex
      }
    }
  } finally {
    probe.remove()
  }

  return resolved
}
