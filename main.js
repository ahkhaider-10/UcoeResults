resultDetails = {
    "civil": {
        "resultIds" : [
            11078609,
            11079412,
        ],
        "credits" : [
            22.5,
            21.5,

        ]
    },
    "mech":{
        "resultIds" : [
            11078609,
            11079412,
        ],
        "credits" : [
            22.5,
            21.5,
        ]
    },
    "cse":{
        "resultIds" : [
            11078609,
            11079412,
            11080361,
            11080711,
            11081441,
        ],
        "credits" : [
            21.5,
            22.5,
            24,
            25,
            31,
        ]
    }
}

function substring(s, start, end){
    try {
        return s.split(start)[1].split(end)[0];
    } catch (error) {
        return "Not found"
    }
}

function get_result(resultid, rollno){
    const baseUrl = 'https://results.pupexamination.ac.in/t8/results/results.php';

    const queryParams = {
        'rslstid': resultid,
        'ROLL': rollno,
        'submit': 'Submit',
    };

    const queryString = new URLSearchParams(queryParams).toString();
    const apiUrl = `https://thingproxy.freeboard.io/fetch/${baseUrl}?${queryString}`;

    headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'max-age=0',
        'Sec-Ch-Ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
    }

    fetch(apiUrl, {
    method: 'GET',
    headers : headers
    })
    .then(response => {
        if (response.ok) {
        return response.text();
        } else {
        throw new Error('Network Error');
        }
    })
    .then(data => {
        // Handle the JSON data here
        console.log(data);
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Fetch error:', error);
    });
}

get_result(resultDetails["cse"][0], 12004002);