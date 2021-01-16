const API_KEY = "9dc9418482835bb46764a264d85e15a7";

export async function getWeatherByCity(
  city = "",
  state_code = "",
  country_code = ""
) {
  try {
    const url = `api.openweathermap.org/data/2.5/weather?q=${city},${state_code},${country_code}&appid=${API_KEY}`;
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
    const url = `api.openweathermap.org/data/2.5/weather?id=${id}&appid=${API_KEY}`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(`Error with function getWeatherByCityId ${error.message}`);
    throw error;
  }
}
