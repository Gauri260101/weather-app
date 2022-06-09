let time = document.getElementById('time');
let day_date = document.getElementById('day-date');
let ap;
let place = document.getElementById('place');
let long_lat = document.getElementById("long-lat");
let humidity = document.getElementById('humidity');
let pressure = document.getElementById('pressure');
let sunrise = document.getElementById('sunrise');
let sunset = document.getElementById('sunset');
let wind = document.getElementById('wind');
let input = document.getElementById('in');
let day_temp = document.getElementsByClassName('day-temp');
let night_temp = document.getElementsByClassName('night-temp');
let day = document.getElementsByClassName('day');
let img = document.querySelectorAll('img');
let description = document.getElementById('description');
let Shortdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let p = document.createElement('i');
let d;
let flag = 0;
let API_KEY = '2f876180bb519efcb73cc3ddda428c2d';
let da;

function search() {
    flag = 1;
    let value = document.getElementById('city').value;
    
    if(value !=''){
        let url = `http://api.openweathermap.org/geo/1.0/direct?q=${value}&appid=${API_KEY}`;
    
        document.getElementById('city').value = '';
    
        fetch(url).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            da = data;
            if (da[0] == null || da['cod'] == '400') {
                p.style.color = '#f5c320';
                p.innerHTML = 'Invalid city!';
                input.insertAdjacentElement("afterend", p);
    
                place.innerHTML = '';
                humidity.innerHTML = ``;
                pressure.innerHTML = ``;
                wind.innerHTML = ``;
                sunrise.innerHTML = '';
                sunset.innerHTML = '';
                day_date.style.marginTop = "0px";
                day_date.innerHTML = '';
                long_lat.innerHTML = '';
                for (let i = 0; i < 7; i++) {
                    img[i].src = 'http://openweathermap.org/img/wn/01d@2x.png';
                    img[i].alt = '';
                    day[i].innerHTML = Shortdays[i];
                    day_temp[i].innerHTML = '';
                    night_temp[i].innerHTML = '';
                    if (i == 0) {
                        description.innerHTML = '';
                    }
                }
            }
            else {
                p.innerHTML='';
                p.remove();
                let { lat, lon } = data[0];
                getData2(lat, lon);
            }
    
        })
    } 
}

function getData() {
    flag=0;
    if(p.innerHTML == 'Invalid city!'){
        p.remove();
    }
    navigator.geolocation.getCurrentPosition((success) => {
        let { latitude, longitude } = success.coords;
        getData2(latitude, longitude);
    })
}

function getData2(latitude, longitude) {
    long_lat.innerHTML = `${latitude}, ${longitude}`;
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`;
    fetch(url).then((response) => {
        return response.json();
    }).then((data) => {
        displayData(data);
    })
}

function displayData(data) {
    if(flag == 1){
        place.innerHTML = da[0]['name'];
    }
    else{
        place.innerHTML = data.timezone;
    }
    
    humidity.innerHTML = `${data.current.humidity}%`;
    pressure.innerHTML = `${data.current.pressure} hPa`;
    wind.innerHTML = `${data.current.wind_speed} m/s`;
    sunrise.innerHTML = window.moment(data.current.sunrise * 1000).format('hh:mm a');
    sunset.innerHTML = window.moment(data.current.sunset * 1000).format('hh:mm a');
    day_date.style.marginTop = "5px";
    day_date.innerHTML = window.moment(data.current.sunset * 1000).format('dddd, D MMMM');

    d = days.indexOf(window.moment(data.current.sunset * 1000).format('dddd'));

    for (let i = 0; i < 7; i++) {
        if (i == 0) {
            day[i].innerHTML = days[d].toUpperCase();
            description.innerHTML = data.daily[i].weather[0].description;
            description.innerHTML = description.innerHTML.charAt(0).toUpperCase() + description.innerHTML.substring(1);
        }
        else {
            day[i].innerHTML = Shortdays[(d + i) % 7];
        }
        let icon = data.daily[i].weather[0].icon;
        img[i].src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        img[i].alt = data.daily[i].weather[0].description;
        day_temp[i].innerHTML = parseInt(data.daily[i].temp.day) + '&#176;C';
        night_temp[i].innerHTML = parseInt(data.daily[i].temp.night) + '&#176;C';
    }
}