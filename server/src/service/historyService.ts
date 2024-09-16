import fs from "node:fs/promises";
import { v4 as uuidv4 } from 'uuid';

// TODO: Define a City class with name and id properties
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
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    return await fs.readFile("db/searchHistory.json", "utf-8");
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    console.log(cities);
    await fs.writeFile("db/searchHistory.json", JSON.stringify(cities), "utf-8");
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    const data: string = await this.read();
    return JSON.parse(data);
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    try {
      let exists = false;
      console.log("Attempting to add", city, "to history...")
      const cities: City[] = await this.getCities();
      cities.forEach(cityItem => {
      if (city == cityItem.name) {
        console.log(city, "is already exists");
        exists = true;
      }
      });
      if (!exists) {
        console.log("Sucessfully added city to history")
        cities.push(new City(city, uuidv4()));
        await this.write(cities)
      }
    } catch (err) {
      console.log(err);
    }
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    console.log("Attempting to remove", id, "from history.")
    try {
      const cities = await this.getCities();
      for (let i = 0; i < cities.length; i++) {
        if (cities[i].id == id) {
          console.log("Found matching ID! Attempting to remove city \"" + cities[i].name + "\".")
          cities.splice(i);
          console.log("Sucess!");
          this.write(cities)
        }
      }
    } catch (err) {
      console.log("Error removeing city with id", id + ":", err)
    }
  }
}

export default new HistoryService();
