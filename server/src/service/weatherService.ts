// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  APIKey: string = process.env.API_KEY as string;
  cityName: string = "";

  // TODO: Create fetchLocationData method
  public async fetchLocationData(query: string) {
    try {
      const response = await fetch(this.buildGeocodeQuery(query));
      const cityData = await response.json();
      
      return cityData;
    } catch (err) {
      console.log(err)

      return null;
    }
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query:string): string {
    return `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${this.APIKey}`;
  }

  // TODO: Create buildWeatherQuery method
  /** 
   * @param [queryType="forecast"] Defines the type of weather query, where forecast is a 5 day forcast and weather is current weather.
  */
  private buildWeatherQuery(coordinates: Coordinates, queryType: string = "forecast"): string {
    return `https://api.openweathermap.org/data/2.5/${queryType}?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.APIKey}`;
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const weatherResponse = await fetch(this.buildWeatherQuery(coordinates, "weather"));
      const forcastResponse = await fetch(this.buildWeatherQuery(coordinates));

      const weatherData = await weatherResponse.json();
      const forcastData = await forcastResponse.json()

      return [weatherData, forcastData]
    } catch (err) {
      console.log(err)
      return null
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const city: string = response.name;
    const date: Date = new Date();
    const icon: string = response.weather[0].icon;
    const iconDescription: string = response.weather[0].description;
    const tempF: number = response.main.temp
    const windSpeed: number = response.wind.speed;
    const humidity: number = response.main.humidity;

    return new Weather(city, date.toLocaleDateString(), icon, iconDescription, tempF, windSpeed, humidity);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const outputArray: Weather[] = [];

    outputArray.push(currentWeather);

    let count = 0;
    weatherData.forEach(item => {
      const city = currentWeather.city;
      const date = new Date(item.dt_txt).toDateString();
      const icon = item.weather[0].icon;
      const iconDescription = item.weather[0].description;
      const tempF = item.main.temp;
      const windSpeed = item.wind.speed;
      const humidity = item.main.humidity;

      if (count % 8 == 1) {
        outputArray.push(new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity));
      }
      count++;
    });
    
    return outputArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    try {
      const localData = await this.fetchLocationData(city)
      const coordinates: Coordinates = localData.coord as Coordinates;
      const rawWeatherData = await this.fetchWeatherData(coordinates);
      
      if (!rawWeatherData) {
        return []
      }
      const currentWeather: Weather = this.parseCurrentWeather(rawWeatherData[0]);
      const forcastArray = this.buildForecastArray(currentWeather, rawWeatherData[1].list)

      return forcastArray;
    } catch (err) {
      console.log(err)
      return []
    }
  }
}

export default new WeatherService();
