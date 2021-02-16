const API_KEY = "AIzaSyCH8L87O_8AmBuJzb79qRR_mPvTbCTyeNs";
const apiUrl = "https://maps.googleapis.com/maps/api/geocode";

export async function getAddress(lat, lon) {
  try {
    const url = apiUrl + `/json?latlng=${lat},${lon}&key=${API_KEY}`;
    const response = await fetch(url);
    const json = await response.json();
    return json.results;
  } catch (error) {
    console.log(`Error with function getAddress ${error.message}`);
    throw error;
  }
}
