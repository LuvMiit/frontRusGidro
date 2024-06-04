<script>
import Header from "@/components/Header.vue";
import PostSelector from "@/components/selectors/PostSelector.vue";
import {selectedPost, userToken} from "@/Storage.js";
import axios from "axios";

export default {
  name: 'RegisterPage',
  components: {PostSelector, Header},
  data(){
    return{
      responseData: null,
      error: null,
      selectedPost: null,
      surname:null,
      firstname:null,
      patronymic:null,
      login:null,
      password:null,
      inputError: ""
    }
  },
  methods: {
    register() {
      this.inputError = ""
      this.responseData = null
      this.error = null
      if (this.firstname === null) {
        this.inputError = this.inputError + "Поле 'Имя' не может быть пустым! "
      }
      if (this.surname === null) {
        this.inputError = this.inputError + "Поле 'Фамилия' не может быть пустым! "
      }
      if (this.login.length<7) {
        this.inputError = this.inputError + "Имя пользвоателя не может быть меньше 7 символов! "
      }
      if (this.password.length < 7) {
        this.inputError = this.inputError + "Пароль не может быть меньше 7 символов! "
      }

      this.selectedPost = selectedPost
      if (this.inputError === "") {
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
        axios.post("http://localhost:8080/employee/register", {
          name: this.firstname,
          surname: this.surname,
          patronimyc: this.patronymic,
          post: this.selectedPost,
          login: this.login,
          pass: this.password
        })
            .then(response => this.responseData = response)
            .catch(error => this.error = error)
      }
    }
  }
}
</script>

<template>
<div class="page">
  <Header/>
  <div class="workspace">
    <div class="inputs">
      <p class="label">РЕГИСТРАЦИЯ</p>
      <p>{{inputError}}</p>
        <input placeholder="Фамилия" class="inputTop" v-model="surname">
        <input placeholder="Имя" class="input" v-model="firstname">
        <input placeholder="Отчество" class="input" v-model="patronymic">
        <PostSelector/>
        <input placeholder="Имя пользователя" class="input" v-model="login">
        <input placeholder="Пароль" type="password" class="input" v-model="password">
      <button class="regBut" @click="register">Зарегистрировать</button>
      <p v-if="responseData">Успешно!</p>
      <p v-if="error">Пользователь существует!</p>
    </div>
  </div>
</div>
</template>

<style scoped>
.page{
    display: flex;
    flex-direction: column;
    height: 100vh;
    align-items: center;

}
.inputs{
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 300px;

}
.inputTop{
  font-size: 20px;
  text-align: center;
  font-family: Bahnschrift;
  border-radius: 10px;
  padding-top: 10px;
  padding-bottom: 10px
}
.input{
  font-size: 20px;
  text-align: center;
  font-family: Bahnschrift;
  border-radius: 10px;
  margin-top: 20px;
  padding-top: 10px;
  padding-bottom: 10px;

}
.workspace{
  width:600px;
  height: 92vw;
  background-color: deepskyblue;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;


}
.label{
  text-align: center;
  font-family: Bahnschrift;
  font-size: 40px;
}
.regBut{
  max-width: 200px;
  padding: 10px;
  border-radius: 10px;
  margin-top: 50px;
  font-size: 20px;
  transition: transform 200ms ease;
}
.regBut:active{
  transform: scale(0.9);
}
</style>