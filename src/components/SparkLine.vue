<template>
  <div>
    <svg :viewBox="`0 0 ${width} ${height}`" :preserveAspectRatio="preserveAspectRatio">
      <defs>
        <defs>
          <filter
            id="glow"
            x="-100%"
            y="-100%"
            width="350%"
            height="350%"
            color-interpolation-filters="sRGB"
          >
            <feGaussianBlur stdDeviation="1.8" result="coloredBlur" />
            <feOffset dx="-1" dy="-1" result="offsetblur"></feOffset>
            <feFlood id="glowAlpha" flood-color="#666" flood-opacity="0.8"></feFlood>
            <feComposite in2="offsetblur" operator="in"></feComposite>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
          </filter>
        </defs>
      </defs>
      <g>
        <path
          :d="`${linePath} ${endPath}`"
          class="sfill"
          style="
            stroke: none;
            stroke-width: 0;
            fill-opacity: 0.2;
            fill: #007fff;
            pointer-events: auto;
          "
        />
        <path
          :d="linePath"
          class="sline"
          style="
            stroke: slategray;
            stroke-width: 2;
            stroke-linejoin: round;
            stroke-linecap: round;
            fill: none;
          "
        />
      </g>
      <g>
        <circle :cx="pt[pt.length - 1].x - 2" :cy="pt[pt.length - 1].y" :r="3" style="fill: red" />
      </g>
    </svg>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

interface Props {
  width?: number
  height?: number
  preserveAspectRatio?: string
  cdata?: number
  limit?: number
  margin?: number
  smooth?: number
}

interface Point {
  x: number
  y: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 170,
  height: 60,
  preserveAspectRatio: 'none',
  cdata: 0,
  limit: 20,
  margin: 4,
  smooth: 0.2
})

const lineData = reactive<number[]>([])
const linePath = ref<string>('')
const endPath = ref<string>('')
const prev = ref<Point | null>(null)
const pt = ref<Point[]>([])

// SVG curve path
const curve = (p: Point) => {
  let res
  if (!prev.value) {
    res = [p.x, p.y]
  } else {
    const len = (p.x - prev.value.x) * props.smooth
    res = ['C', prev.value.x + len, prev.value.y, p.x - len, p.y, p.x, p.y]
  }
  prev.value = p
  return res
}
// Generate SVG path to draw sparkline chart
const getDataPoints = () => {
  const len = lineData.length
  const max = Math.max(...lineData)
  const min = Math.min(...lineData)
  const vfactor = (props.height - props.margin * 2) / (max - min || 2)
  const hfactor = (props.width - props.margin * 2) / ((props.limit || len) - (len > 1 ? 1 : 0))
  pt.value = lineData.map((d, i) => ({
    x: i * hfactor,
    y: max === min ? 1 : (max - d) * vfactor + props.margin
  }))
  linePath.value = `M${pt.value
    .map((p) => curve(p))
    .reduce((a, b) => a.concat(b))
    .join(' ')}`

  endPath.value = [
    ' L' + pt.value[pt.value.length - 1].x,
    props.height - 0,
    0,
    props.height - 0,
    0,
    pt.value[0].y
  ].join(' ')
}
// Watch realtime price and update lineData array
watch(
  () => props.cdata,
  (value: number) => {
    prev.value = null
    const l = lineData.length
    if (l === 0) {
      lineData.push(0)
    } else {
      if (l === 1 && lineData[0] === 0) {
        lineData.pop()
      }
      lineData.push(value)
      if (l > props.limit - 1) {
        lineData.shift()
      }
    }
    getDataPoints()
  },
  { immediate: true }
)
</script>
