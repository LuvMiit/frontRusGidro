<template>
  <div class="workPage">
    <div class="header">
      <div class="logos" @click="$router.push('HomePage'); clearToken(); nullAuth()">
        <img :src="logoRusGidro" alt="Логотип компании" class="logotip" >
        <p class="name">РОСГИДРОМЕТ</p>
      </div>
      <button class="loginBut" @click="$router.push('LogIn'); nullFilters()" v-if="!authFlag">ВОЙТИ</button>
      <button class="loginBut" @click="$router.push('HomePage'); clearToken(); nullAuth()" v-if="authFlag">ВЫЙТИ</button>

    </div>
  </div>
</template>

<script>
import logoRusGidro from '@/assets/logoRusGidro.png'
import {authFlag, logoutToken, nullAuthFlag, nullCity, nullIndexType} from "@/Storage.js";
export default {
  name: "Header",
  data(){
    return{
      authFlag: false,
      logoRusGidro
    }
  },
  methods:{
    nullFilters(){
      nullIndexType()
      nullCity()
    },

    clearToken(){
      logoutToken()
    },
    nullAuth(){
      nullAuthFlag()
    }
  },
  created() {
    this.authFlag = authFlag
  }
}
</script>

<style scoped>
.workPage{
  display: flex;
  flex-direction: column;

  width: 100vw;
  height: 8vh;

  background-color: deepskyblue;
}
.header{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  max-width: 100vw;
  height: 10vh;
}
.loginBut{
  min-height: 30px;

  border-radius: 15px;
  margin-right: 30px;
  padding: 12px 20px 12px 20px;
  transition: transform 200ms ease;
  font-size: 18px;
  font-family: 'Bahnschrift', sans-serif;
  //background-color: ;
}
.loginBut:active{
  transform: scale(0.9);
}
.logotip{
  max-height: 60px;
  margin-left: 10px;
}
.logos{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.name{
  margin-left: 10px;
  font-size: 20px;
  font-family: 'Bahnschrift', sans-serif;
  font-weight: bold;
}
</style>