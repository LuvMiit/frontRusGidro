<template>
  <div class="calendar">
    <div>
      <button @click="prevMonth" class="button">Пред. месяц</button>
      <button @click="nextMonth" class="button">След. месяц</button>
    </div>
    <div class="date">{{ currentMonthName }} {{ currentYear }}</div>
    <div class="days-grid">
      <div v-for="day in daysInMonth" :key="day" class="day" @click="selectDate(day)">
        {{ day }}
      </div>
    </div>
  </div>
</template>

<script>
import {setDate} from "@/Storage.js";

export default {
  data() {
    return {
      currentDate: new Date(),
      selectedDate: null,
    };
  },
  computed: {
    currentYear() {
      return this.currentDate.getFullYear();
    },
    currentMonth() {
      return this.currentDate.getMonth();
    },
    currentMonthName() {
      return this.currentDate.toLocaleString('ru-RU', { month: 'long' });
    },
    daysInMonth() {
      const year = this.currentYear;
      const month = this.currentMonth;
      const days = new Date(year, month + 1, 0).getDate();
      return Array.from({ length: days }, (_, i) => i + 1);
    },
  },
  methods: {
    prevMonth() {
      const month = this.currentMonth;
      const year = this.currentYear;
      this.currentDate = new Date(year, month - 1, 1);
    },
    nextMonth() {
      const month = this.currentMonth;
      const year = this.currentYear;
      this.currentDate = new Date(year, month + 1, 1);
    },
    selectDate(day) {
      const year = this.currentYear;
      const month = this.currentMonth+1;
      this.selectedDate = year+"-"+month+"-"+day;
      setDate(this.selectedDate)
    },
  },
};
</script>

<style>
.calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}
.day {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background-color: deepskyblue;
  cursor: pointer;
}
.button{
  margin: 5px;
  border-radius: 10px;
  font-size: 15px;
  font-family: Bahnschrift;
  padding: 5px;
}
.date{
  font-size: 20px;
  font-family: Bahnschrift;
}
</style>