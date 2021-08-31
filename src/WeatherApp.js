import React,{ useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import WeatherCard from './WeatherCard';
import sunriseAndSunsetData from './sunrise-sunset.json';
import useWeatherApi from './useWeatherApi';
import WeatherSetting from './WeatherSetting';
import { findLocation } from './utils';

const theme = {
  light:{
    backgroundColor: '#ededed',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dark:{
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};
const Container = styled.div`
  background-color: ${({theme}) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  `;
const getMoment = (locationName)=>{
    const location = sunriseAndSunsetData.find(
        (data)=>data.location === locationName
    );
    if(!location) return null;
    const now =new Date();
    const nowDate = Intl.DateTimeFormat('zh-TW',{
        year:'numeric',
        month:'2-digit',
        day:'2-digit',
    })
    .format(now)
    .replace(/\//g,'-');
    const locationDate =
      location.time&&location.time.find((time) => time.dataTime === nowDate);
    const sunriseTimestamp = new Date(
        `${locationDate.dataTime} ${locationDate.sunrise}`
    ).getTime();
    const sunsetTimestamp = new Date(
        `${locationDate.dataTime} ${locationDate.sunset}`
    ).getTime();
    const nowTimeStamp = now.getTime();
    return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <=sunsetTimestamp
    ? 'day'
    :'night';
};
const WeatherApp = () => {
  console.log('---invoke funciton component---');
  const storageCity = localStorage.getItem('cityName');
  const [currentCity,setCurrentCity] = useState( storageCity || '臺北市');
  const currentLocation = findLocation(currentCity) || {};
  const [weatherElement,fetchData]=useWeatherApi(currentLocation);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [currentPage, setCurrentPage] = useState("WeatherCard");
  // const {locationName} = weatherElement;
  const moment = useMemo(
    () => getMoment(currentLocation.sunriseCityName),
    [currentLocation.sunriseCityName]
  );
  useEffect(() => {
    setCurrentTheme(moment === "day" ? "dark" : "light");
  }, [moment]);
  useEffect(() => {
    localStorage.setItem('cityName',currentCity);
  },[currentCity]);
  return (
    <ThemeProvider theme={theme[currentTheme]}>
    <Container>
      {console.log('render, isLoading:',weatherElement.isLoading)}
      {currentPage === 'WeatherCard' && (
        <WeatherCard
          cityName={currentLocation.cityName}
          weatherElement={weatherElement}
          moment={moment}
          fetchData={fetchData}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === 'WeatherSetting' &&( 
        <WeatherSetting
          cityName={currentLocation.cityName}
          setCurrentCity={setCurrentCity} 
          setCurrentPage={setCurrentPage}
        />)}
    </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;
