import axios from "axios";

let userRole = null
let userToken = null
let authFlag = false
let selectedPost = null
let selectedCity = null
let selectedDate = null
let selectedIndexType = null
let selectedStartDate = null
let selectedEndDate = null

function nullStartDate(){
    selectedStartDate = null
}
function nullEndDate(){
    selectedEndDate = null
}

function setEndDate(date){
    selectedEndDate = date
}
function setStartDate(date){
    selectedStartDate = date
}
function setIndexType(type){
    selectedIndexType = type
}

function setDate(date){
    selectedDate = date
}
function setCity(city){
    selectedCity = city
}
function nullCity(){
    selectedCity = null
}
function nullDate(){
    selectedDate = null
}
function nullIndexType(){
    selectedIndexType = null
}
function nullAuthFlag(){
    authFlag = null
}
function setPost(post){
    selectedPost = post
}

function setRole(role){
    userRole = role
}
function setToken(token){
    userToken = token
}
function logoutToken(){
    userToken = null
}
function setAuthFlag(flag){
    authFlag = flag
}
function getConsole(){
    return console.log(userRole +"  "+userToken+"  "+authFlag)
}

export { userRole, userToken, selectedPost, authFlag, selectedCity, selectedDate, selectedIndexType,
    selectedStartDate, selectedEndDate,
    logoutToken, setRole, setToken, setAuthFlag, setPost, nullAuthFlag, setCity, setDate, setIndexType,
    nullCity, nullDate, nullIndexType,getConsole, setStartDate, setEndDate, nullEndDate, nullStartDate}