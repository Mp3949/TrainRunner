var stations = [
    "Mumbai Central BCT",
    "Chhatrapati Shivaji Terminus CSTM",
    "Lokmanya Tilak Terminus LTT",
    "Dadar DR",
    "New Delhi NDLS",
    "Delhi DLI",
    "Delhi Sarai Rohilla DEE",
    "Hazrat Nizamuddin NZM",
    "Howrah HWH",
    "Kolkata KOAA",
    "Chennai Central MAS",
    "Chennai Egmore MS",
    "Hyderabad HYB",
    "Bengaluru SBC",
    "Bengaluru Cantonment BNC",
    "Ahmedabad ADI",
    "Pune Junction PUNE",
    "Jaipur JP",
    "Lucknow LKO",
    "Surat ST",
    "Kanpur Central CNB",
    "Nagpur NGP",
    "Visakhapatnam VSKP",
    "Bhopal BPL",
    "Patna PNBE",
    "Ludhiana LDH",
    "Agra Cantt AGC"
];

function suggestStations(inputId) {
    var inputElement = document.getElementById(inputId);
    var inputValue = inputElement.value.toUpperCase();
    var suggestionsContainer = document.getElementById(inputId.toLowerCase() + "-suggestions");
    suggestionsContainer.innerHTML = "";

    if (!inputValue.trim()) return;

    var matches = stations.filter(function (station) {
        return station.toUpperCase().includes(inputValue);
    });

    matches.forEach(function (match) {
        var suggestionElement = document.createElement("div");
        suggestionElement.textContent = match;
        suggestionElement.addEventListener("click", function () {
            inputElement.value = match;
            suggestionsContainer.innerHTML = "";
        });
        suggestionsContainer.appendChild(suggestionElement);
    });
}

document.getElementById('From').addEventListener('input', function () {
    suggestStations('From');
});

document.getElementById('To').addEventListener('input', function () {
    suggestStations('To');
});

function extractStationCode(station) {
    var parts = station.split(" ");
    if (parts.length < 2) {
        return null;
    }
    return parts[parts.length - 1];
}

async function searchTrains(event) {
    event.preventDefault();

    const fromStationName = document.getElementById('From').value.trim();
    const toStationName = document.getElementById('To').value.trim();
    const fromStationCode = extractStationCode(fromStationName);
    const toStationCode = extractStationCode(toStationName);

    const fromErrorElement = document.getElementById('from-error');
    const toErrorElement = document.getElementById('to-error');

    if (!fromStationCode) {
        fromErrorElement.textContent = "Invalid From Station. Please use the format 'Station Name CODE'.";
    } else {
        fromErrorElement.textContent = "";
    }

    if (!toStationCode) {
        toErrorElement.textContent = "Invalid To Station. Please use the format 'Station Name CODE'.";
    } else {
        toErrorElement.textContent = "";
    }

    if (!fromStationCode || !toStationCode) {
        return;
    }

    const date = document.getElementById('Date').value;

    console.log(`Searching trains from ${fromStationCode} to ${toStationCode} on ${date}`);

    const apiUrl = `https://irctc1.p.rapidapi.com/api/v3/trainBetweenStations?fromStationCode=${fromStationCode}&toStationCode=${toStationCode}&dateOfJourney=${date}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '3e0a22547cmshe9428c7fad9f821p1e4230jsnc67389e81c35',
            'x-rapidapi-host': 'irctc1.p.rapidapi.com'
        }
    };

    console.log('Fetching data from API...');
    try {
        const response = await fetch(apiUrl, options);
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Data fetched from API:', data);
        displayTrains(data.data);
    } catch (error) {
        console.error('Error fetching train data:', error);
    }
}

function displayTrains(trains) {
    const tbody = document.querySelector('#train-table tbody');
    tbody.innerHTML = '';
    console.log('ok');
    if (!trains || trains.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No trains found</td></tr>';
        return;
    }

    trains.forEach(train => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${train.train_number}</td>
            <td>${train.train_name}</td>
            <td>${train.from_station_name} - ${train.to_station_name
            }</td>
            <td>${train.class_type}</td>
            <td>${train.run_days}</td>
            <td><button class="book-Ticket-btn" data-train-name="${train.train_name}" data-train-number="${train.train_number}" data-from-station="${train.from_station_name}" data-to-station="${train.to_station_name}" data-date="${train.train_date}" data-class-type="${train.class_type}">Book Ticket</button></td>
        `;
        tbody.appendChild(row);
    });
    console.log('ready');

    document.getElementById('train-results').classList.remove('hiddentable');
    console.log('executed');
}

document.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('book-Ticket-btn')) {
        const date = event.target.getAttribute('data-date');
        const fromStationName = document.getElementById('From').value.trim();
        const toStationName = document.getElementById('To').value.trim();

        const bookingUrl = `https://www.confirmtkt.com/rbooking-d/trains/from/${fromStationName}/to/${toStationName}/${date}`;
        window.location.href = bookingUrl;
    }
});

document.getElementById('SearchtrainSubmitBtn').addEventListener('click', searchTrains);