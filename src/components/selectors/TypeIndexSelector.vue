<script>
import {setIndexType, setPost, userToken} from "@/Storage.js";
import axios from "axios";
export default {
  name: 'TypeIndexSelector',
  data() {
    return {
      indexType: "",
      responseData: null
    }
  },
  created() {
    axios.get("http://localhost:8080/indexTypes/all")
        .then(response => this.responseData = response.data)
        .catch(localError => alert(localError))
  },
  watch:{
    indexType: function (){
      setIndexType(this.indexType )
    }
  }
}
</script>

<template>
  <div class="dropList">
    <select class="list" v-model="indexType">
      <option disabled value="">Выберите показатель</option>
      <option v-for="(data,index) in responseData" :key="index">{{data.indexName}}</option>
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