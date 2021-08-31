import { useState, useEffect, useCallback } from "react";

const fetchCurrentWeather = (locationName) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-16BAB4CE-FF37-4466-B9DB-34A5452463E7&locationName=${locationName}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("data", data);
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue;
          }
          return neededElements;
        },
        {}
      );
      return {
        obervationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temprature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        humid: weatherElements.HUMD,
      };
    });
};
const fetchWeatherForecast = (cityName) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-16BAB4CE-FF37-4466-B9DB-34A5452463E7&locationName=${cityName}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("data", data);
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["Wx", "PoP", "CI"].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );
      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName,
      };
    });
};
const useWeatherApi = (currentLocation) => {
  const {locationName,cityName} = currentLocation;
  const [weatherElement, setWeatherElement] = useState({
    obervationTime: new Date(),
    locationName: "",
    humid: 0,
    temprature: 0,
    windSpeed: 0,
    description: "",
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: 0,
    isLoading: true,
  });
  const fetchData = useCallback(() => {
    const fetchingData = async () => {
      const [currentWeather, weatherForecast] = await Promise.all([
        fetchCurrentWeather(locationName),
        fetchWeatherForecast(cityName),
      ]);
      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false,
      });
    };
    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    fetchingData();
  }, [locationName,cityName]);
  useEffect(() => {
    console.log("execute function in useEffect");
    fetchData();
  }, [fetchData]);
  
  return [weatherElement,fetchData];
};

export default useWeatherApi;
