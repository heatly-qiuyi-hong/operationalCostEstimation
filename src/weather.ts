import { fetchWeatherApi } from "openmeteo";

async function hourlyWeatherData(
  startTime: string = "2025-11-18",
  endTime: string = "2025-11-19",
  lat: number = 54.9733,
  long: number = -1.614,
) {
  const params = {
    latitude: lat,
    longitude: long,
    start_date: startTime,
    end_date: endTime,
    hourly: "temperature_2m",
    timezone: "GMT",
  };
  const url = "https://archive-api.open-meteo.com/v1/archive";
  const responses = await fetchWeatherApi(url, params);

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  // Attributes for timezone and location
  const latitude = response.latitude();
  const longitude = response.longitude();
  const elevation = response.elevation();
  const utcOffsetSeconds = response.utcOffsetSeconds();

//   console.log(
//     `\nCoordinates: ${latitude}°N ${longitude}°E`,
//     `\nElevation: ${elevation}m asl`,
//     `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
//   );

  const hourly = response.hourly()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    hourly: {
      time: Array.from(
        {
          length:
            (Number(hourly.timeEnd()) - Number(hourly.time())) /
            hourly.interval(),
        },
        (_, i) =>
          new Date(
            (Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) *
              1000,
          ),
      ),
      temperature_2m: hourly.variables(0)!.valuesArray(),
    },
  };
  return weatherData;
}
// The 'weatherData' object now contains a simple structure, with arrays of datetimes and weather information
// const weatherData = await hourlyWeatherData();
// console.log("\nHourly data:\n", weatherData.hourly.temperature_2m);
export default hourlyWeatherData;
