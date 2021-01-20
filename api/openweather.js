const API_KEY = "9dc9418482835bb46764a264d85e15a7";
const apiUrl = "https://api.openweathermap.org/data/2.5";

//Permet la concaténation des paramètres, séparés par une virgule
const createParams = (city, state_code, country_code) => {
  let params = city;
  if (state_code)
    params = state_code != "" ? params + "," + state_code : params;
  params = country_code != "" ? params + "," + country_code : params;
  return params;
};

export async function getWeatherByCity(city, state_code, country_code) {
  let params = createParams(city, state_code, country_code);

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

export async function getForecastForCity(city, state_code, country_code) {
  let params = createParams(city, state_code, country_code);

  try {
    const url =
      apiUrl + `/forecast?appid=${API_KEY}&q=${params}&units=metric&cnt=4`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(`Error with function getForecastForCity ${error.message}`);
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

// export async function getCompleteData(lat, lon) {
//   try {
//     const url =
//       apiUrl +
//       `/onecall?lat=${lat}&lon=${lon}&exclude=alerts,minutely,daily&appid=${API_KEY}`;
//     const response = await fetch(url);
//     const json = await response.json();
//     return json;
//   } catch (error) {
//     console.log(`Error with function getCompleteData ${error.message}`);
//     throw error;
//   }
// }

// export async function getCoordinates(city, state_code, country_code) {
//   let params = createParams(city, state_code, country_code);

//   try {
//     const url = geocodingUrl + `/direct?q=${params}&limit=1&appid=${API_KEY}`;
//     const response = await fetch(url);
//     const json = await response.json();
//     return json;
//   } catch (error) {
//     console.log(`Error with function getCoordinates ${error.message}`);
//     throw error;
//   }
// }
