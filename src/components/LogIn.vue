<template >
<div class="page">
  <Header/>
  <div class="loginPage">
    <div class="loginMenu" >
      <p class="logo">ВХОД</p>
        <p>Введите имя пользователя</p>
        <input class="loginPlaceholder" type="text" v-model="userLogin" placeholder="Имя пользователя">
      <p>Введите пароль</p>
      <input class="passPlaceholder" type="password" v-model="userPass" placeholder="Пароль">
        <button class="enterButton" @click="sendCredentials()" >Войти</button>
        <p v-if="error !== null" class="error">Неверные логин или пароль!</p>
    </div>
  </div>
</div>
</template>



<script>
import axios from "axios";
import Header from "@/components/Header.vue";
import {setAuthFlag, setRole, setToken} from "@/Storage.js";

export default {
name:"LogIn",
  components: {Header},
  data() {
    return {
      userLogin: null,
      userPass: null,
      userRole: null,
      userToken: null,
      responseData: null,
      authFlag: null,
      error: null
    }

  },
  methods: {
    sendCredentials() {
      this.error = null
      axios.post("http://localhost:8080/auth/login", {login: this.userLogin, password: this.userPass})
          .then(response => this.responseData = response.data).catch(error => this.error = error.data);
      console.log("ERROR " + this.error)
    },

  },
  watch: {

    // Вотчер для переменной
    responseData: function (newValue, oldValue) {
      this.userRole = this.responseData.role
      this.userToken = this.responseData.jwtToken
      this.authFlag = true;
      setAuthFlag(this.authFlag)
      setToken(this.userToken)
      setRole(this.userRole)
      // alert(this.userRole+this.userToken+this.authFlag)
      this.$router.push({name: 'WorkPage'})
    }
  }
}
</script>



<style scoped>
.loginPage{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 92vh;
}
.page{
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  height: 100vh;
}
.logo{
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 0;
}
.loginMenu{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 100px;
  width: 600px;
  height: 92vh;
  background: deepskyblue;
  font-family: 'Bahnschrift', sans-serif;
}
.loginPlaceholder{
  border-radius: 10px;
  width: 200px;
  height: 50px;
  font-size: 20px;
  text-align: center;
  font-family: 'Bahnschrift', sans-serif;
}
.passPlaceholder{
  border-radius: 10px;
  width: 200px;
  height: 50px;
  font-size: 20px;
  text-align: center;
  font-family: 'Bahnschrift', sans-serif;
}
.enterButton{
  margin-top: 10px;
  border-radius: 10px;
  width: 150px;
  height: 60px;
  background-color: gold;
  font-size: 20px;
  transition: transform 500ms ease;

  font-family: 'Bahnschrift', sans-serif;
}
.enterButton:active{
  transform: scale(0.9) translateY(-5px);
}
.error{
  font-family: 'Bahnschrift', sans-serif;
  color: red;
  font-size: 20px;
}
</style>