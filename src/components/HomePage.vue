<template >
<div class="page">
  <Header/>
  <div class="workspace">
    <div class="mainPlace">
      <div class="upPlace">
        <div class="leftPlace">
            <CitySelector class="city" @click="loadDate"/>
            <DateSelector class="cal" @click="loadDate"/>
            <p class="date">Выбранная дата: {{selectedDate}}</p>
        </div>
        <div class="rightPlace">
          <TypeIndexSelector class="selector" @click="loadDate"/>
          <p class="value" v-if="responseData">{{responseData.indexValue}}</p>
          <p class="description" v-if="responseData">{{responseData.description}}</p>
        </div>
      </div>
      <div class="downPlace" v-if="responseData">
        <p class="down">{{ responseData.recommend }}</p>
      </div>
      <div class="graphPlace" v-if="graphFlag">
        <GraphForecast :data = "responseDataForGraph"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Header from "@/components/Header.vue";
import CitySelector from "@/components/selectors/CitySelector.vue";
import DateSelector from "@/components/selectors/DateSelector.vue";
import {nullCity, nullDate, nullIndexType, selectedCity, selectedDate, selectedIndexType} from "@/Storage.js";
import TypeIndexSelector from "@/components/selectors/TypeIndexSelector.vue";
import axios from "axios";
import GraphForecast from "@/components/GraphForecast.vue";

export default {
  name: "HomePage",
  components: {GraphForecast, TypeIndexSelector, DateSelector, CitySelector, Header},
  data() {
    return {
      selectedDate: null,
      selectedCity: null,
      selectedIndexType: null,
      responseData: null,
      responseDataForGraph: null,
      graphFlag: false
    }
  },
  watch: {
    selectedDate() {
      this.checkFields();
    },
    selectedCity() {
      this.checkFields();
      this.checkTwoFields();
    },
    selectedIndexType() {
      this.checkFields();
      this.checkTwoFields();
    }
  },
  methods: {
    loadDate() {
      this.selectedDate = selectedDate
      this.selectedCity = selectedCity
      this.selectedIndexType = selectedIndexType
    },
    checkFields() {
      if (this.selectedDate !== null && this.selectedCity !== null && this.selectedIndexType !== null) {
        this.getData();

      }
    },
    checkTwoFields() {
      console.log("Проверяются оба поля")
      if (this.selectedCity !== null && this.selectedIndexType !== null) {
        this.graphFlag = true
        this.getForecast();

      }
    },
    getData() {
      axios.get(
          `http://localhost:8080/airIndex/${this.selectedCity}/${this.selectedIndexType}/${this.selectedDate}`
      )
          .then(response => this.responseData = response.data)
          .catch(error => alert(error))
    },
    getForecast() {
      axios.get(
          `http://localhost:8080/forecast/all/${this.selectedCity}/${this.selectedIndexType}`
      )
          .then(response => {
            this.responseDataForGraph = response.data;
            this.sortDataByDate()
          })
          .catch(error => alert(error))
    },
    sortDataByDate() {
      this.responseDataForGraph.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
    },
    created() {
      nullDate()
      nullCity()
      nullIndexType()
    }
  }
}
</script>

<style scoped>
.page{
  width: 100vw;
}
.mainPlace{
  margin: 30px;
  border-radius: 50px;
  background-color: #C6F2FB;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.upPlace{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 50vh;
}
.downPlace{
  //border-style: solid;
  margin: 0 40px 40px;
  height: 30vh;
  border-radius: 50px;
  background-color: #BFD7EF;
}
.graphPlace{
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 40px 40px;
  height: 50vh;
  border-radius: 50px;
  background-color: #BFD7EF;
}
.rightPlace{
  display: flex;
  //border-style: solid;
  flex-direction: column;
  border-radius: 50px;
  margin:40px;
  width: 70vw;
  background-color: #BFD7EF;
}
.leftPlace{
  display: flex;
  flex-direction: column;
  width: 20vw;
  margin: 40px;
}
.down{
  margin: 40px;
  font-size: 30px;
  font-family: Bahnschrift;
}
.workspace{
  display: flex;
  max-width: 100vw;
  align-items: center;
  justify-content: center;
}
.date{
  font-size: 20px;
  font-family: Bahnschrift;
}
.selector{
  margin: 30px 30px 30px 70px;
}
.value{
  font-size: 40px;
  font-family: Bahnschrift;
  margin: 30px;
  margin-bottom: 0;
  margin-top: 0;
}
.description{
  font-size: 20px;
  font-family: Bahnschrift;
  margin: 30px;
  margin-top:15px
}
.cal{
  margin-top: 130px;
}
</style>
