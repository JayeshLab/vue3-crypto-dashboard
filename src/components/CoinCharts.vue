<template>
  <div class="info-card">
    <div class="row">
      <div class="chart-panel col-12" ref="chartdiv" id="chartdiv"></div>
      <div class="col-12 p-2 text-right">
        <div class="controls" ref="chartcontrols"></div>
      </div>
    </div>
    <div class="spinner" v-if="chartLoading">
      <div class="circle-spinner"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import * as am5stock from '@amcharts/amcharts5/stock'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import { ref, onMounted, useTemplateRef } from 'vue'
import type { StockData } from '@/types'

const { symbol } = defineProps<{ symbol: string }>()

const chartLoading = ref(true)
let root: am5.Root
let stockChart: am5stock.StockChart
let mainPanel: am5stock.StockPanel
let valueLegend: am5stock.StockLegend

const chartdiv = useTemplateRef('chartdiv')
const chartcontrols = useTemplateRef('chartcontrols')

const getNewSettings = (series: am5xy.XYSeries): Record<string, any> => {
  const newSettings: Record<string, any> = {}
  am5.array.each(
    [
      'name',
      'valueYField',
      'highValueYField',
      'lowValueYField',
      'openValueYField',
      'calculateAggregates',
      'valueXField',
      'xAxis',
      'yAxis',
      'legendValueText',
      'legendRangeValueText',
      'stroke',
      'fill'
    ] as Array<keyof am5xy.IXYSeriesSettings>,
    function (setting) {
      newSettings[setting] = series.get(setting)
    }
  )
  return newSettings
}

const setSeriesType = (seriesType: string) => {
  // Get current series and its settings
  let currentSeries: any = stockChart.get('stockSeries')
  let newSettings: Record<string, any> = getNewSettings(currentSeries)

  // Remove previous series
  let data = currentSeries.data.values
  mainPanel.series.removeValue(currentSeries)

  // Create new series
  let series
  switch (seriesType) {
    case 'line':
      series = mainPanel.series.push(
        am5xy.LineSeries.new(root, newSettings as am5xy.ILineSeriesSettings)
      )
      break
    case 'candlestick':
    case 'procandlestick':
      newSettings.clustered = false
      series = mainPanel.series.push(
        am5xy.CandlestickSeries.new(root, newSettings as am5xy.ICandlestickSeriesSettings)
      )
      if (seriesType == 'procandlestick') {
        series.columns.template.get('themeTags')!.push('pro')
      }
      break
    case 'ohlc':
      newSettings.clustered = false
      series = mainPanel.series.push(
        am5xy.OHLCSeries.new(root, newSettings as am5xy.IOHLCSeriesSettings)
      )
      break
  }

  // Set new series as stockSeries
  if (series) {
    valueLegend.data.removeValue(currentSeries)
    series.data.setAll(data)
    stockChart.set('stockSeries', series)
    let cursor = mainPanel.get('cursor')
    if (cursor) {
      cursor.set('snapToSeries', [series])
    }
    valueLegend.data.insertIndex(0, series)
  }
}

const loadChart = (data: StockData[]) => {
  if (!chartdiv.value || !chartcontrols.value) return

  root = am5.Root.new(chartdiv.value)
  const myTheme = am5.Theme.new(root)

  myTheme.rule('Grid', ['scrollbar', 'minor']).setAll({
    visible: false
  })

  root.setThemes([am5themes_Animated.new(root), myTheme])

  stockChart = root.container.children.push(am5stock.StockChart.new(root, { paddingRight: 0 }))

  mainPanel = stockChart.panels.push(
    am5stock.StockPanel.new(root, {
      wheelY: 'zoomX',
      panX: true,
      panY: true
    })
  )

  let valueAxis = mainPanel.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        pan: 'zoom'
      }),
      extraMin: 0.1, // adds some space for for main series
      tooltip: am5.Tooltip.new(root, {}),
      numberFormat: '#,###.00',
      extraTooltipPrecision: 2
    })
  )

  let dateAxis = mainPanel.xAxes.push(
    am5xy.GaplessDateAxis.new(root, {
      baseInterval: {
        timeUnit: 'day',
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minorGridEnabled: true
      }),
      tooltip: am5.Tooltip.new(root, {})
    })
  )

  let valueSeries = mainPanel.series.push(
    am5xy.CandlestickSeries.new(root, {
      name: `${symbol}`,
      clustered: false,
      valueXField: 'Date',
      valueYField: 'Close',
      highValueYField: 'High',
      lowValueYField: 'Low',
      openValueYField: 'Open',
      calculateAggregates: true,
      xAxis: dateAxis,
      yAxis: valueAxis,
      legendValueText:
        'open: [bold]{openValueY}[/] high: [bold]{highValueY}[/] low: [bold]{lowValueY}[/] close: [bold]{valueY}[/]',
      legendRangeValueText: ''
    })
  )
  stockChart.set('stockSeries', valueSeries)

  valueLegend = mainPanel.plotContainer.children.push(
    am5stock.StockLegend.new(root, {
      stockChart: stockChart
    })
  )

  let volumeAxisRenderer = am5xy.AxisRendererY.new(root, {
    inside: true,
    pan: 'zoom'
  })

  volumeAxisRenderer.labels.template.set('forceHidden', true)
  volumeAxisRenderer.grid.template.set('forceHidden', true)

  let volumeValueAxis = mainPanel.yAxes.push(
    am5xy.ValueAxis.new(root, {
      numberFormat: '#.#a',
      height: am5.percent(20),
      y: am5.percent(100),
      centerY: am5.percent(100),
      renderer: volumeAxisRenderer
    })
  )

  // Add series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  let volumeSeries = mainPanel.series.push(
    am5xy.ColumnSeries.new(root, {
      name: 'Volume',
      clustered: false,
      valueXField: 'Date',
      valueYField: 'Volume',
      xAxis: dateAxis,
      yAxis: volumeValueAxis,
      legendValueText: "[bold]{valueY.formatNumber('#,###.0a')}[/]"
    })
  )

  volumeSeries.columns.template.setAll({
    strokeOpacity: 0,
    fillOpacity: 0.5
  })
  volumeSeries.columns.template.adapters.add('fill', function (fill, target) {
    let dataItem = target.dataItem
    if (dataItem) {
      return stockChart.getVolumeColor(dataItem)
    }
    return fill
  })

  stockChart.set('volumeSeries', volumeSeries)
  valueLegend.data.setAll([valueSeries, volumeSeries])
  let scrollbar = mainPanel.set(
    'scrollbarX',
    am5xy.XYChartScrollbar.new(root, {
      orientation: 'horizontal',
      height: 50
    })
  )
  stockChart.toolsContainer.children.push(scrollbar)

  mainPanel.set(
    'cursor',
    am5xy.XYCursor.new(root, {
      yAxis: valueAxis,
      xAxis: dateAxis,
      snapToSeries: [valueSeries],
      snapToSeriesBy: 'y!'
    })
  )
  let sbDateAxis = scrollbar.chart.xAxes.push(
    am5xy.GaplessDateAxis.new(root, {
      baseInterval: {
        timeUnit: 'day',
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minorGridEnabled: true
      })
    })
  )

  let sbValueAxis = scrollbar.chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    })
  )

  let sbSeries = scrollbar.chart.series.push(
    am5xy.LineSeries.new(root, {
      valueYField: 'Close',
      valueXField: 'Date',
      xAxis: sbDateAxis,
      yAxis: sbValueAxis
    })
  )

  sbSeries.fills.template.setAll({
    visible: true,
    fillOpacity: 0.3
  })

  let seriesSwitcher = am5stock.SeriesTypeControl.new(root, {
    stockChart: stockChart
  })

  seriesSwitcher.events.on('selected', function (ev) {
    setSeriesType(typeof ev.item === 'string' ? ev.item : ev.item.id)
  })

  am5stock.StockToolbar.new(root, {
    container: chartcontrols.value,
    stockChart: stockChart,
    controls: [
      am5stock.IndicatorControl.new(root, {
        stockChart: stockChart,
        legend: valueLegend
      }),
      am5stock.DateRangeSelector.new(root, {
        stockChart: stockChart
      }),
      am5stock.PeriodSelector.new(root, {
        stockChart: stockChart,
        periods: [
          { timeUnit: 'day', count: 1, name: '1D' },
          { timeUnit: 'day', count: 5, name: '5D' },
          { timeUnit: 'month', count: 1, name: '1M' },
          { timeUnit: 'month', count: 3, name: '3M' },
          { timeUnit: 'month', count: 6, name: '6M' },
          { timeUnit: 'ytd', name: 'YTD' },
          { timeUnit: 'year', count: 1, name: '1Y' },
          { timeUnit: 'max', name: 'Max' }
        ]
      }),
      seriesSwitcher,
      am5stock.DrawingControl.new(root, {
        stockChart: stockChart
      }),
      am5stock.DataSaveControl.new(root, {
        stockChart: stockChart
      }),
      am5stock.ResetControl.new(root, {
        stockChart: stockChart
      }),
      am5stock.SettingsControl.new(root, {
        stockChart: stockChart
      })
    ]
  })
  let tooltip: any = am5.Tooltip.new(root, {
    getStrokeFromSprite: false,
    getFillFromSprite: false
  })

  tooltip.get('background').setAll({
    strokeOpacity: 1,
    stroke: am5.color(0x000000),
    fillOpacity: 1,
    fill: am5.color(0xffffff)
  })
  valueSeries.data.setAll(data)
  volumeSeries.data.setAll(data)
  sbSeries.data.setAll(data)
}

onMounted(async () => {
  // Fetch the kline chart data for the symbol
  const response = await fetch(
    `https://data-api.binance.vision/api/v3/klines?symbol=${symbol}&interval=1d`
  )
  if (response.ok && response.status == 200) {
    const res = await response.json()
    const data: StockData[] = res.map((val: any) => {
      return {
        Date: val[0],
        Open: parseFloat(val[1]),
        High: parseFloat(val[2]),
        Low: parseFloat(val[3]),
        Close: parseFloat(val[4]),
        Volume: parseFloat(val[5])
      }
    })
    loadChart(data)
    chartLoading.value = false
  } else {
    console.error('Error in fetching data')
    alert('Error in fetching chart data')
    chartLoading.value = false
  }
})
</script>
