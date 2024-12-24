import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
@Injectable()
export class WeatherService {
  constructor() {}
  async getWeatherByName() {
    try {
      const response: AxiosResponse<WeatherNowResponse> = await axios.get(
        'https://devapi.qweather.com/v7/weather/now?location=101230101&key=2734a0adbf3243adb54d21a9bae828ee',
        {
          headers: {
            'X-QW-Api-Key': '2734a0adbf3243adb54d21a9bae828ee',
            'Accept-Encoding': 'gzip, deflate',
            'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
            Connection: 'keep-alive',
            Accept: 'application/json, text/plain, */*',
            Host: 'devapi.qweather.com',
          },
          responseType: 'json',
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }
}
