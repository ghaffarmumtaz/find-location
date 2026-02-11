document.querySelector('button').addEventListener('click', getLocation);

// UI elements
let countryName = document.querySelector('h3');
let flagName = document.querySelector('.flag'); // <img>
let addres = document.querySelector('.addres');
let bordersEl = document.querySelector('.borders'); // <p> for borders

function getLocation() {
    navigator.geolocation.getCurrentPosition(
        function(success) {
            const { latitude, longitude } = success.coords;
            countryNameFoo(latitude, longitude);
        },
        function(error) {
            console.log(error, 'error');
        }
    );
}

function countryNameFoo(lat, long) {
    const API_KEY = '7ae1faf3cd9943fabb55c5bb3166cda3';

    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${API_KEY}`)
    .then(res => res.json())
    .then(result => {
        const country = result.results[0].components.country;
        const countryCode = result.results[0].components.country_code.toLowerCase();
        const address = result.results[0].formatted;

        countryName.textContent = country;
        addres.textContent = address;

        // Flag
        flagName.src = `https://flagcdn.com/48x36/${countryCode}.png`;

        // Now get border countries
        fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
        .then(res => res.json())
        .then(data => {
            const borders = data[0].borders; // array of country codes
            if (!borders || borders.length === 0) {
                bordersEl.textContent = "No border countries";
                return;
            }

            // Convert border codes to names
            fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(',')}`)
            .then(res => res.json())
            .then(bData => {
                const borderNames = bData.map(c => c.name.common);
                bordersEl.textContent = "Border Countries: " + borderNames.join(', ');
            });
        });
    })
    .catch(err => console.log(err));
}
