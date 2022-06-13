window.onload = getTime(), getImage(), getStocks()

async function getImage() {
    try {
        const res = await fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature")
        const data = await res.json()
        document.body.style.backgroundImage = `url(${data.urls.full})`
        document.getElementById("author").textContent = `By: ${data.user.name}`
    } catch(err) {
        console.error(err)
        document.body.style.backgroundImage = `
            url('https://images.unsplash.com/photo-1504198266287-1659872e6590?crop=entropy&cs=srgb&fm=jpg&ixid=MnwxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTA5NzI4NzM&ixlib=rb-1.2.1&q=85')
        `
        document.getElementById("author").textContent = `By: Sarah Dorweiler`
    }
}

async function getStocks() {
    try {
        const res = await fetch("https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false")
        const data = await res.json()
        if (!res.ok) {
            throw Error("something went wrong")
        }
        let arrowId = ""
        if (data.market_data.price_change_24h < 0) {
            arrowId = "arrow-down"
        } else {
            arrowId = "arrow-up"
        }
        document.getElementById('stocks').innerHTML = `
            <div class="name-container">
                <img src="${data.image.small}">
                <h3>${data.name}</h3>
            </div>
            <div class="price-container">
                <p>$${data.market_data.current_price.usd}</p>
                <div id="${arrowId}"></div>
            </div>
            <p>high: $${data.market_data.high_24h.usd}</p>
            <p>low: $${data.market_data.low_24h.usd}</p>
        `
        window.setTimeout(getStocks, 60000)
    } catch(err) {
        console.error(err)
        document.getElementById('stocks').innerHTML = "<p>coin data not available</p>"
    }
}

function getTime() {
    const date = new Date()
    const z = (n) => (n<10?'0':'') + n
    const h = date.getHours()

    document.getElementById('time').textContent = `
    ${z(h%12)}:${z(date.getMinutes())} ${h>12?"PM":"AM"}
    `
    window.setTimeout(getTime, 1000)
}

async function getWeather(lat, lon) {
    try {
        const res = await fetch(`
        https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=0f9e66a464b8647d5d2b0f198c854d14
        `)
        const data = await res.json()
        console.log(data)

        if (!res.ok) {
            throw Error("Weather data not available")
        }

        document.getElementById("weather").innerHTML = `
            <p>${data.name}</p>
            <h1>${Math.round(data.main.temp)}°C</h1>
            <div class="weather-cond">
                <img src=" http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
                <p>${data.weather[0].main}</p>
            </div>
            <p>Feels like ${Math.round(data.main.feels_like)}°C</p>
        `
    } catch(err) {
        console.log(err)
        document.getElementById("weather").innerHTML = "<p>weather data not available</p>"
    }
}

navigator.geolocation.getCurrentPosition((position) => {
    getWeather(position.coords.latitude, position.coords.longitude) 
})

