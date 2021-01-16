const API_KEY = "9dc9418482835bb46764a264d85e15a7";
const apiUrl = "https://api.openweathermap.org/data/2.5";

export async function getWeatherByCity(city, state_code, country_code) {
  let params = city;
  if (state_code)
    params = state_code != "" ? params + "," + state_code : params;
  params = country_code != "" ? params + "," + country_code : params;

  try {
    const url = apiUrl + `/weather?appid=${API_KEY}&q=${params}&units=metric`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(`Error with function getWeatherByCity ${error.message}`);
    throw error;
  }
}

export async function getWeatherByCityId(id) {
  try {
    const url = apiUrl + `/weather?id=${id}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(`Error with function getWeatherByCityId ${error.message}`);
    throw error;
  }
}

export async function getWeatherByLatLon(lat, lon) {
  try {
    const url =
      apiUrl + `/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(`Error with function getWeatherByCityId ${error.message}`);
    throw error;
  }
}
