<script>
import {setPost, userToken} from "@/Storage.js";
import axios from "axios";
export default {
  name: 'PostSelector',
  data() {
    return {
      post: null,
      responseData: null
    }
  },
  created() {
    axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
    axios.get("http://localhost:8080/post/all")
        .then(response => this.responseData = response.data)
        .catch(localError => alert(localError))
  },
  watch:{
    post: function (){
      setPost(this.post)
    }
  }
}
</script>

<template>
  <div class="dropList">
    <select class="list" v-model="post">
      <option disabled value="">Выберите должность</option>
      <option v-for="data in responseData" :key="data.postID">{{data.postName}}</option>
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