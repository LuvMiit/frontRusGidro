<script>
import {setCity} from "@/Storage.js";
import axios from "axios";

export default {
  name: 'CitySelector',
  data() {
    return {
      city: "",
      responseData: null
    }
  },
  created() {
    axios.get("http://localhost:8080/city/all")
        .then(response => this.responseData = response.data)
        .catch(localError => alert(localError))

  },
  watch:{
    city: function (){
      setCity(this.city)
    }
  }
}
</script>

<template>
  <div class="dropList">
    <select class="list" v-model="city" >
      <option disabled value="">Выберите город</option>
      <option v-for="data in responseData" :key="data.cityID">{{data.cityName}}</option>
    </select>
  </div>
</template>

<style scoped>
.dropList{
  display: flex;
}
.list{
  margin-top: 20px;
  padding: 10px 13px 10px 13px;
  font-size: 20px;
  text-align: center;
  font-family: Bahnschrift;
  border-radius: 10px;
  border-width: 2px;
  border-color: black;
}
</style>