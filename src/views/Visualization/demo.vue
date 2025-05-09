<template>
  <div class="chart-container">
    <div id="pisaChart" style="width: 100%; height: 600px"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'PisaChart',
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      const chartDom = document.getElementById('pisaChart')
      const myChart = echarts.init(chartDom)

      const option = {
        title: {
          text: 'PISA mean scores for reading, maths and science (2022)',
          left: 'center',
          top: '20px',
          textStyle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#333'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            let result = `${params[0].name}<br/>`
            params.forEach((item) => {
              result += `${item.seriesName}: ${item.value}<br/>`
            })
            return result
          }
        },
        legend: {
          data: ['Reading', 'Mathematics', 'Science'],
          top: '10%',
          textStyle: {
            color: '#666'
          }
        },
        grid: {
          left: '15%',
          right: '4%',
          bottom: '10%', // 增加底部间距，为来源文字留出空间
          top: '15%', // 适当减小顶部间距
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [
            'Singapore',
            'China (B-S-J-Z)',
            'Japan',
            'Korea',
            'United States',
            'United Kingdom',
            'Germany',
            'OECD average'
          ],
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: '#666',
            fontSize: 12
          },
          axisLine: {
            lineStyle: {
              color: '#ccc'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: 'Score',
          min: 450, // 设置最小值为 450
          max: 600, // 保持最大值 600
          interval: 25, // 设置刻度间隔为 25
          nameTextStyle: {
            color: '#666',
            padding: [0, 30, 0, 0] // 为了避免标签重叠，增加右边距
          },
          axisLabel: {
            color: '#666',
            formatter: '{value}'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#eee'
            }
          }
        },
        series: [
          {
            name: 'Reading',
            type: 'bar',
            data: [543, 555, 520, 528, 497, 494, 498, 476],
            itemStyle: {
              color: '#FF4B4B' // 红色
            },
            barGap: '5%', // 调整柱形间距
            markLine: {
              silent: true,
              lineStyle: {
                color: '#FF4B4B',
                type: 'dashed',
                opacity: 0.5
              },
              data: [
                {
                  yAxis: 476,
                  label: {
                    formatter: 'OECD (Reading): 476',
                    position: 'insideEndTop'
                  }
                }
              ]
            }
          },
          {
            name: 'Mathematics',
            type: 'bar',
            data: [575, 591, 547, 554, 465, 489, 475, 472],
            itemStyle: {
              color: '#4B7BFF' // 蓝色
            },
            markLine: {
              silent: true,
              lineStyle: {
                color: '#4B7BFF',
                type: 'dashed',
                opacity: 0.5
              },
              data: [
                {
                  yAxis: 472,
                  label: {
                    formatter: 'OECD (Mathematics): 472',
                    position: 'insideEndTop'
                  }
                }
              ]
            }
          },
          {
            name: 'Science',
            type: 'bar',
            data: [561, 582, 539, 543, 499, 500, 503, 485],
            itemStyle: {
              color: '#FFD93D' // 黄色
            },
            markLine: {
              silent: true,
              lineStyle: {
                color: '#FFD93D',
                type: 'dashed',
                opacity: 0.5
              },
              data: [
                {
                  yAxis: 485,
                  label: {
                    formatter: 'OECD (Science): 485',
                    position: 'insideEndTop'
                  }
                }
              ]
            }
          }
        ],
        graphic: [
          {
            type: 'text',
            left: '15%', // 与图表左边界对齐
            bottom: '2%', // 距离底部更近
            style: {
              text: 'Source: OECD',
              textAlign: 'left',
              fill: '#999',
              fontSize: 12,
              fontFamily: 'Arial'
            }
          }
        ]
      }

      myChart.setOption(option)

      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', () => {
      myChart.resize()
    })
  }
}
</script>

<style scoped>
.chart-container {
  padding: 20px 30px 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 20px;
  height: calc(100% - 40px);
}
</style>
