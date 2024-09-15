import { Router, type Request, type Response } from 'express';

const router = Router();

import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  console.log("Weather POST Request from", req.ip);
  
  // Get weater data

  try {
    HistoryService.addCity(req.body.cityName);
    return res.status(200);
  } catch (err) {
    console.log("Error adding city to history:", err);
    return res.status(500);
  }
  
});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  console.log("History GET Request from", req.ip);

  try {
    const cities = await HistoryService.getCities();
    return res.json(cities).status(200);
  } catch (err) {
    console.log("Error fetching history:", err);
    return res.status(500).json({error: `Error Occured: ${err}`});
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  console.log("History DELETE Request from", req.ip);

  HistoryService.removeCity(req.params.id);

  return res.status(404);
});

export default router;
