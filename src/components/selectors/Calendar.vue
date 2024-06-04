<template>
  <div>
    <input type="text" placeholder="Дата начала" class="inputFirst" v-model="startDate" @focus="showCalendar = 'start'">
    <input type="text" placeholder="Дата конца" class="inputFirst" v-model="endDate" @focus="showCalendar = 'end'">
    <div v-if="showCalendar" @click="selectDate($event)" class="calendar">
      <div class="header">
        <button @click="previousMonth">&lt;</button>
        <span>{{ months[currentMonth] }}, {{ currentYear }}</span>
        <button @click="nextMonth">&gt;</button>
      </div>
      <div class="days">
        <span v-for="day in days" :key="day">{{ day }}</span>
      </div>
      <div class="dates">
        <span v-for="(date, index) in daysInMonth" :key="index" @click="setDate(date)" :class="{ selected: isSelectedDate(date) }">{{ date }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {setEndDate, setStartDate} from "@/Storage.js";

export default {
  name: 'CalendarRange',
  data() {
    return {
      startDate: '',
      endDate: '',
      showCalendar: null,
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'октябрь', 'Ноябрь', 'Декабрь']
    };
  },
  computed: {
    daysInMonth() {
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (v, k) => k + 1);
    }
  },
  methods: {
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    selectDate(event) {
      const calendar = document.querySelector('.calendar');
      if (!calendar.contains(event.target)) {
        this.showCalendar = null;
      }
    },
    setDate(date) {
      if (this.showCalendar === 'start') {
        this.startDate = `${this.currentYear}-${this.currentMonth + 1}-${date}`;
      } else if (this.showCalendar === 'end') {
        this.endDate = `${this.currentYear}-${this.currentMonth + 1}-${date}`;
      }
      this.showCalendar = null;
    },
    isSelectedDate(date) {
      const fullDate = `${this.currentYear}-${this.currentMonth + 1}-${date}`;
      return fullDate === this.startDate || fullDate === this.endDate;
    }
  },
  watch:{
    startDate: function (){
      setStartDate(this.startDate)
    },
    endDate: function (){
      setEndDate(this.endDate)
    }
  }
}
</script>

<style>
.calendar {
  position: absolute;
  z-index: 999;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 10px;
  font-family: Bahnschrift;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 0.5em;
}

.days {
  display: flex;
  justify-content: space-around;
  padding: 0.5em;
}

.dates {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5em;
  padding: 0.5em;
}

.selected {
  background-color: #f0f0f0;
}
.inputFirst{
  border-radius: 10px;
  font-size: 20px;
  font-family: Bahnschrift;
  padding: 3px;
  text-align: center;
  margin-right: 20px;
  margin-top:20px;
  min-height: 38px;
}
</style>