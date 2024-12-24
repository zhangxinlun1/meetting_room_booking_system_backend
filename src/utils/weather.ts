interface WeatherNowResponse {
  code: string;
  updateTime: string;
  fxLink: string;
  now: {
    obsTime: string;
    temp: number;
    feelsLike: number;
    icon: string;
    text: string;
    wind360: number;
    windDir: string;
    windScale: number;
    windSpeed: number;
    humidity: number;
    precip: number;
    pressure: number;
    vis: number;
    cloud: number;
    dew: number;
  };
}
