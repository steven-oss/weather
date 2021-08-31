import React,{useState,useEffect,useMemo} from 'react';
import styled from '@emotion/styled';

import {ReactComponent as DayThunderstorm} from './images/day-thunderstorm.svg';
import { ReactComponent as DayClear } from './images/day-clear.svg';
import { ReactComponent as DayCloudyFog } from './images/day-cloudy-fog.svg';
import { ReactComponent as DayCloudy } from './images/day-cloudy.svg';
import { ReactComponent as DayFog } from './images/day-fog.svg';
import { ReactComponent as DayPartiallyClearWithRain } from './images/day-partially-clear-with-rain.svg';
import { ReactComponent as DaySnowing } from './images/day-snowing.svg';
import { ReactComponent as NightThunderstorm } from './images/night-thunderstorm.svg';
import { ReactComponent as NightClear } from './images/night-clear.svg';
import { ReactComponent as NightCloudyFog } from './images/night-cloudy-fog.svg';
import { ReactComponent as NightCloudy } from './images/night-cloudy.svg';
import { ReactComponent as NightFog } from './images/night-fog.svg';
import { ReactComponent as NightPartiallyClearWithRain } from './images/night-partially-clear-with-rain.svg';
import { ReactComponent as NightSnowing } from './images/night-snowing.svg';



const IconContainer = styled.div`
    flex-basic:30%;
    svg{
        max-height:110px;
    }
`;
const WeatherTypes ={
    isThunderstorm:[15,16,17,18,21,22,33,34,35,36,41],
    isClear:[1],
    isCloudyFog:[25,26,27,28],
    isCloudy:[2,3,4,5],
    isFog:[24],
    isPartiallyClearWithRain:[
        8,9,10,11,12,
        13,14,19,20,29,30,
        31,32,38,39
    ],
    isSnowing:[23,37,42],
};

const WeatherIcons={
    day:{
        isThunderstorm:<DayThunderstorm/>,
        isClear:<DayClear/>,
        isCloudyFog:<DayCloudyFog/>,
        isCloudy:<DayCloudy/>,
        isFog:<DayFog/>,
        isPartiallyClearWithRain:<DayPartiallyClearWithRain/>,
        isSnowing:<DaySnowing/>,
    },
    night:{
        isThunderstorm:<NightThunderstorm/>,
        isClear:<NightClear/>,
        isCloudyFog:<NightCloudyFog/>,
        isCloudy:<NightCloudy/>,
        isFog:<NightFog/>,
        isPartiallyClearWithRain:<NightPartiallyClearWithRain/>,
        isSnowing:<NightSnowing/>,
    }
}
const weatherCode2Type = (weatherCode) =>{
    const [WeatherType] =
        Object.entries(WeatherTypes).find(([WeatherType,weatherCodes])=>
            weatherCodes.includes(Number(weatherCode))
        )||[];
    return WeatherType;
}

const WeatherIcon = ({currentWeatherCode,moment})=>{
    const [currentWeatherIcon,setCurrentWeatherIcon]=useState("isClear");
    const theWeatherIcon = useMemo(()=>
        weatherCode2Type(currentWeatherCode),[currentWeatherCode]
    );
    useEffect(()=>{       
        setCurrentWeatherIcon(theWeatherIcon);
    },[theWeatherIcon]);
    return(
        <IconContainer>
            {WeatherIcons[moment][currentWeatherIcon]}
        </IconContainer>
    );
};

export default WeatherIcon;