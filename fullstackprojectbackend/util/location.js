import axios from "axios";

function getLocation() {
  return axios.get(`https://google-maps-geocoding.p.rapidapi.com/geocode/json`);
}