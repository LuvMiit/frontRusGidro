<script>
import { Chart } from 'chart.js';

export default {
  name: "GraphForecast",
  props: {
    data: Array
  },
  data(){
    return{
      flag:null,
      chart: null
    }

  },
  watch: {
    data: function (){
      this.renderChart();
    }

  },
  methods: {
    renderChart() {
      if (this.chart) {
        this.chart.destroy(); // Уничтожаем существующий график перед созданием нового
      }
      const ctx = this.$refs.canvas.getContext('2d');
      const chartData = this.data.map(item => item.value);
      const chartLabels = this.data.map(item => item.date);
      this.chart =new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartLabels,
          datasets: [{
            label: this.data[0].indexName,
            data: chartData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 3
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                // stepSize: 0.01,
                // Функция обратного вызова для динамического изменения максимального значения оси Y
                callback: function(value, index, values) {
                  // Определение максимального значения в данных
                  let maxDataValue = Math.max(...this.chart.data.datasets[0].data);
                  // Условие для установки максимального значения оси Y
                  if (maxDataValue > 1) {
                    this.chart.options.scales.y.max = 10;
                    // this.chart.options.stepSize = 0.1
                  } else {
                    this.chart.options.scales.y.max = 0.1;
                    this.chart.options.stepSize = 0.01
                  }
                  return value;
                }
              }
            }
          }
        }
      });
    }
  }
}
</script>

<template>
  <div>
    <canvas ref="canvas"  class="graph" id="myChart"></canvas>
  </div>
</template>

<style scoped>
.graph{
  margin:50px;
  max-width: 1600px;
  max-height: 400px;
  min-width: 1600px;
  min-height: 400px;
}
</style>