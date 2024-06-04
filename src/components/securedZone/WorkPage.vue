<script>
import Header from "@/components/Header.vue";
import AirIndexTable from "@/components/tables/AirIndexTable.vue";
import axios from "axios";
import {userToken} from "@/Storage.js";
import CitySelector from "@/components/selectors/CitySelector.vue";

export default {
  name: 'WorkPage',
  components: {CitySelector, AirIndexTable, Header},
  data(){
    return{
      responseData: null
    }
  },
  created(){
    axios.defaults.headers.common['Authorization']=`Bearer ${userToken}`
    axios.get("http://localhost:8080/airIndex/all-index")
        .then(response=>this.responseData=response.data)
        .catch(error=>alert(error))
  }
}
</script>
////////////////////////////////////////////////////////
<template>
<div class="page">
  <Header/>
  <div class="workSpace">
    <AirIndexTable :data="responseData"/>
    <button @click="$router.push('Register')" class="regBut">Регистрация сотрдуника</button>
  </div>
</div>
</template>
///////////////////////////////////////////////////////
<style scoped>
.page{
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.workSpace{
  display: flex;
  flex-direction: row;
  justify-content: right;
}
.regBut{
  margin: 30px;
  margin-top: 200px;
  padding: 10px;
  border-radius: 10px;
  font-size: 20px;
  font-family: Bahnschrift;
  transition: transform 200ms ease;
  max-height: 50px;
}
.regBut:active{
  transform: scale(0.9);
}
</style>