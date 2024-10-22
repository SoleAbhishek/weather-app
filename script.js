const btn = document.querySelector(".search-button");
const city = document.querySelector(".city");
const notFound = document.querySelector(".not-found");
const info = document.querySelector(".info");
const search = document.querySelector(".search-city");
const forecastDetails = document.querySelector(".forecast-details");

const countryText = document.querySelector('.country');
const tempText = document.querySelector(".temp");
const weatherCondition = document.querySelector(".condition");
const humidityText = document.querySelector(".humidty-value");
const windText = document.querySelector(".wind-value");
const dateText = document.querySelector(".date");
const image = document.querySelector(".weather-details-img");

const apiKey = 'a94b351579c0ace53b31c1a82b728ed5';
btn.addEventListener('click',function(e){
    if(city.value.trim()!='')
    {
        updateWeatherInfo(city.value);
        city.value = ''; 
    }
});
city.addEventListener('keydown',(event)=>{
    if(event.key==='Enter' && city.value.trim()!='')
    {
        updateWeatherInfo(city.value);
        city.value = '';
    }
    
})
async function fetchWeatherInfo(endpoint,city){
    const response = await fetch(`https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`);
    return response.json();
}
async function updateWeatherInfo(city){
    const response = await fetchWeatherInfo('weather',city);
    if(response.cod!="200")
    {
        showSection(notFound);
        return;
    }
    showSection(info);
    // const {
    //     name: country,
    //     main:{temp,humidity},
    //     weather:[{id,main}],
    //     wind: {spped}
    // } = response;
    countryText.textContent = response.name;
    tempText.textContent = response.main.temp+' °C';
    humidityText.textContent = response.main.humidity+' %';
    windText.textContent = response.wind.speed+' M/s';
    weatherCondition.textContent = response.weather[0].main;
    image.src = `assets/weather/${getWeatherImg(response.weather[0].id)}`;
    dateText.textContent = getCurrentDate();
    await updateForcastInfo(city);
}
async function updateForcastInfo(city){
    const forecastResponse = await fetchWeatherInfo('forecast',city);
    const todayDate = new Date().toISOString().split('T')[0];
    
    const timeTaken = "12:00:00";
    forecastDetails.innerHTML =''
    forecastResponse.list.forEach(resp=>{
        if(resp.dt_txt.includes(timeTaken) && !resp.dt_txt.includes(todayDate))
            updateForcastItems(resp);
    })
}
function updateForcastItems(response){
    const date = new Date(response.dt_txt);
    const dateOpt={
        day:'2-digit',
        month:'short'
    }
    const currDate = date.toLocaleDateString('en-US',dateOpt);
    const forecastItem =`
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-text">${currDate}</h5>
            <img src="assets/weather/${getWeatherImg(response.weather.id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(response.main.temp)} °C</h5>
        </div>
    ` 
    forecastDetails.insertAdjacentHTML('beforeend', forecastItem)
    
}
function getCurrentDate()
{
    const currDate = new Date();
    const options = {
        weekday: 'short',
        day:'2-digit',
        month:'short'
    }
    return currDate.toLocaleDateString('en-GB',options);
}
function getWeatherImg(id){
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}
function showSection(section){
    [info,search,notFound].forEach(currSec=>{
        currSec.style.display='none';
    })
    section.style.display = 'flex';
}