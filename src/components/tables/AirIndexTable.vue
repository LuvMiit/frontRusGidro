  <script>
  import CitySelector from "@/components/selectors/CitySelector.vue";
  import TypeIndexSelector from "@/components/selectors/TypeIndexSelector.vue";
  import {
    nullCity,
    nullEndDate,
    nullIndexType,
    nullStartDate,
    selectedCity,
    selectedEndDate,
    selectedIndexType,
    selectedStartDate, userToken
  } from "@/Storage.js";
  import Calendar from "@/components/selectors/Calendar.vue";
  import ExcelJS from 'exceljs';
  import { Chart, registerables } from 'chart.js';
  import axios from "axios";
  Chart.register(...registerables);

  export default {
    name: 'AirIndexTable',
    components: {Calendar, TypeIndexSelector, CitySelector},
    props:{
      data:""
    },
    data(){
      return{
        itemsPerPage: 12,
        currentPage: 1,
        selectedCity: null,
        selectedType: null,
        startDate: null,
        endDate: null,
        name: null,
        city: null,
        date: null,
        newValue:null,
        responseData: null
      }
    },
    computed: {
      totalPages() {
        return Math.ceil(this.filteredData.length / this.itemsPerPage);
      },
      paginatedData() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredData.slice(start, end);
      },
      filteredData() {
        return this.data.filter(item => {
          // Фильтрация по городу
          if (this.selectedCity && item.city !== this.selectedCity) {
            return false;
          }
          // Фильтрация по типу
          if (this.selectedType && item.indexName !== this.selectedType) {
            return false;
          }
          // Фильтрация по дате
          const itemDate = new Date(item.date);
          const startDate = this.startDate ? new Date(this.startDate) : null;
          const endDate = this.endDate ? new Date(this.endDate) : null;
          // Проверка входит ли дата элемента в выбранный интервал
          if (startDate && itemDate < startDate) {
            return false;
          }
          if (endDate && itemDate > endDate) {
            return false;
          }
          return true;
        });
      }
    },
    methods: {
      updateData(){
        this.responseData = null
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
        axios.post('http://localhost:8080/airIndex/update', {
          city: this.city,
          date:this.date,
          typeIndex:this.name,
          newValue:this.newValue
        })
            .then(response=> this.responseData = response)
            .catch(error=>alert(error))
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;

        }
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
      loadFilters() {
        if (selectedIndexType !== null) {
        this.selectedType = selectedIndexType
        }
        if (selectedCity !== null) {
          this.selectedCity = selectedCity
        }
      },
      clearFilters(){
        this.selectedType = null
        this.selectedCity = null
        this.startDate = null
        this.endDate = null
        nullIndexType()
        nullStartDate()
        nullEndDate()
        nullCity()
      },
      parseDate(dateString) {
        // Функция для преобразования строки даты в объект Date
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
      },
      loadDates(){
        if(selectedStartDate!==null){
          // Загрузка дат из хранилища и преобразование их в объекты Date
          this.startDate = selectedStartDate ? this.parseDate(selectedStartDate) : null;
          this.endDate = selectedEndDate ? this.parseDate(selectedEndDate) : null;
        }
      },
      exportToExcel(){
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet('AirIndexData');

        // Заголовки столбцов
        worksheet.addRow(['Показатель', 'Значение, мг/м3', 'Дата', 'Город', 'Суточная ПДК, мг/м3', 'Класс опасности', 'ИЗА', 'PI']);

        // Заполнение данными
        this.filteredData.forEach(item => {
          worksheet.addRow([item.indexName, item.value, item.date, item.city, item.standart, item.dangerClass, item.isa, item.pi]);
        });

        // Сохранение файла
        workbook.xlsx.writeBuffer().then(buffer => {
          let blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = 'AirIndexData.xlsx';
          a.click();
        });
      },



      buildChart() {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';

        const chartContainer = document.createElement('div');
        chartContainer.style.width = '80%';
        chartContainer.style.height = '80%';
        chartContainer.style.maxWidth = '1500px';
        chartContainer.style.maxHeight = '1000px';
        chartContainer.style.backgroundColor = '#fff';
        chartContainer.style.borderRadius = '10px';
        chartContainer.style.padding = '20px';
        chartContainer.innerHTML = '<canvas id="myChart"></canvas>';
        modal.appendChild(chartContainer);

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Закрыть';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.onclick = function() {
          modal.remove();
        };
        chartContainer.appendChild(closeButton);

        document.body.appendChild(modal);

        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.filteredData.map(item => item.date), // Ваши даты
            datasets: [{
              label: 'Суточная ПДК',
              data: this.filteredData.map(item => item.standart), // Значения Суточная ПДК
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
              borderColor: 'red',
              borderWidth: 1
            }, {
              label: 'Значение',
              data: this.filteredData.map(item => item.value), // Значения столбца "Значение"
              backgroundColor: 'rgba(0, 0, 255, 0.2)',
              borderColor: 'blue',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 0.01,
                  // Функция обратного вызова для динамического изменения максимального значения оси Y
                  callback: function(value, index, values) {
                    // Определение максимального значения в данных
                    let maxDataValue = Math.max(...this.chart.data.datasets[0].data);
                    // Условие для установки максимального значения оси Y
                    if (maxDataValue > 1) {
                      this.chart.options.scales.y.max = 5;
                    } else {
                      this.chart.options.scales.y.max = 0.1;
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
  /////////////////////////////////////////////////////////////
  <template>
  <div class="localPage">
    <div class="filters">
      <TypeIndexSelector class="type" @click="loadFilters"/>
      <Calendar @click="loadDates"/>
      <CitySelector  @click="loadFilters"/>

      <button class="clear" @click="clearFilters">Сбросить фильтры</button>
    </div>


    <table class="table">
      <thead class="tableHead">
        <th class="thComponentIndex">ПОКАЗАТЕЛЬ</th>
        <th class="thComponentValue">ЗНАЧЕНИЕ, мг/м3</th>
        <th class="thComponentDate">ДАТА</th>
        <th class="thComponentCity">ГОРОД</th>
        <th class="thComponentPDK">СУТОЧНАЯ ПДК, мг/м3</th>
        <th class="thComponentPDK">КЛАСС ОПАСНОСТИ</th>
        <th class="thComponentPDK">ИЗА</th>
        <th class="thComponentPDK">PI</th>
      </thead>
      <tbody class="tableBody">
      <tr v-for="(airIndex, index) in paginatedData" :key="index" class="tableRow"  @click="name=airIndex.indexName;
                                                                                            city = airIndex.city;
                                                                                            date = airIndex.date">
        <td class="thComponentIndex">{{airIndex.indexName}}</td>
        <td class="thComponentValue">{{airIndex.value}}</td>
        <td class="thComponentDate">{{airIndex.date}}</td>
        <td class="thComponentCity">{{airIndex.city}}</td>
        <td class="thComponentPDK">{{airIndex.standart}}</td>
        <td class="thComponentPDK">{{airIndex.dangerClass}}</td>
        <td class="thComponentPDK">{{airIndex.isa}}</td>
        <td class="thComponentPDK">{{airIndex.pi}}</td>
      </tr>
      </tbody>

      <tr v-if="name!==null" >
        <td colspan="2" class="info">
          <p class="flag">{{name}}</p>
          <p class="flag">{{city}}</p>
          <p class="flag">{{date}}</p>
          <input class="input" placeholder="ЗНАЧЕНИЕ" v-model="newValue">
          <button  class="btns" @click="updateData">Сохранить</button>
          <button @click="name=null" class="btns">Закрыть</button>
          <p v-if="responseData">Успешно</p>
        </td>
      </tr>

    </table>
    <div>
      <button @click="prevPage" :disabled="currentPage === 1" class="pgBut">Предыдущая</button>
      <span class="pages">{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pgBut">Следующая</button>
    </div>
    <div>
      <button @click="exportToExcel" class="excelBtn">Экспорт в Excel</button>
      <button @click="buildChart" class="excelBtn2">Построить график</button>
    </div>

  </div>
  </template>
  //////////////////////////////////////////////////////////////
  <style scoped>
  .table {
    display: flex;
    flex-direction: column;
    font-family: Bahnschrift;
    margin-top:30px;
    border-style: solid;
    border-width: 2px;
    border-color: cornflowerblue;
    border-radius: 6px;
  }
  .tableHead{
    display:flex;
  }
  .thComponentIndex{
    border-style: solid;
    border-color: cornflowerblue;
    border-width: 2px;
    font-family: Bahnschrift;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
    min-width: 350px;
    max-width: 350px;
  }
  .thComponentValue{
    border-style: solid;
    border-color: cornflowerblue;
    border-width: 2px;
    font-family: Bahnschrift;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
    min-width: 100px;
    max-width: 100px;
  }
  .thComponentDate{
    border-style: solid;
    border-color: cornflowerblue;
    border-width: 2px;
    font-family: Bahnschrift;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
    min-width: 150px;
    max-width: 150px;
  }
  .thComponentCity{
    border-style: solid;
    border-color: cornflowerblue;
    border-width: 2px;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    font-family: Bahnschrift;
    min-width: 150px;
    max-width: 150px;
  }
  .thComponentPDK{
    border-style: solid;
    border-color: cornflowerblue;
    border-width: 2px;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    font-family: Bahnschrift;
    min-width: 100px;
    max-width: 100px;
  }
  .tableRow{
    display: flex;
    align-content: center;
  }
  .tableRow:hover{
    background-color: mistyrose;
  }
  .pgBut{
    margin: 10px;
    font-size: 20px;
    padding: 5px;
    border-radius: 10px;
    font-family: Bahnschrift;
  }
  .clear{
    margin-top: 20px;
    margin-left: 20px;
    font-size: 20px;
    padding: 5px;
    border-radius: 10px;
    font-family: Bahnschrift;
  }
  .pages{
    font-family: Bahnschrift;
    font-size: 20px;
  }
  .localPage{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  }
  .filters{
    display: flex;
    flex-direction: row;

  }
  .type{
    margin-right: 20px;
    //margin-left: 100px;
  }
  .excelBtn{
    font-size: 20px;
    font-family: Bahnschrift;
    border-radius: 10px;
    padding: 5px
  }
  .excelBtn2{
    font-size: 20px;
    font-family: Bahnschrift;
    border-radius: 10px;
    padding: 5px;
    margin-left: 30px;
  }
  .info{
    display: flex;
    flex-direction: row;
  }
  .flag{
    margin-right: 20px;
  }
  .input{
    font-size: 20px;
    font-family: Bahnschrift;
    text-align: center;
    margin-right: 20px;
    margin: 10px;
  }
  .btns{
    border-radius: 10px;
    font-family: Bahnschrift;
    font-size: 20px;
    margin: 10px;
  }
  </style>