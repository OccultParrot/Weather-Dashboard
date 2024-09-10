import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  private HISTORY_PATH = 'db/searchHistory.json';
  
  private async read() {
    return await fs.readFile(this.HISTORY_PATH, {
      flag: 'a+',
      encoding: 'utf-8'
    });
  }

  private async write(cities: City[]) {
    return await fs.writeFile(this.HISTORY_PATH, JSON.stringify(cities, null, '\t'));
  }

  async getCities() {
    return await this.read().then((cities) => {
      let parsedCities: City[];

      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }

      return parsedCities;
    })
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    if (!city) {
      throw new Error('City cannot be blank!');
    }

    // TESTING! REMOVE THIS!!
    console.log("Adding", city, "to history");

    const newCity: City = {
      name: city,
      id: uuidv4()
    };

    const cities = await this.getCities();

    cities.push(newCity);

    this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    if (!id) {
      throw new Error('ID cannot be blank!');
    }

    const cities = await this.getCities();

    for (let i = 0; i < cities.length; i++) {
      if (cities[i].id == id) {
        cities.splice(i);
        
        // We return so that the loop doesnt keep going once we find what we want
        return;
      }
    }
  }
}

export default new HistoryService();
