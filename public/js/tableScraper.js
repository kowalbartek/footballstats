//Scrape league names and urls from the main page - https://www.soccerstats.com/leagues.asp
//Give user search box with suggestions based on league names
//When user selects league, pull the name and url part where "league=country" is
//assign that to a string and use it to build the url for the league page
//run the web scraper

const axios = require('axios');
const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv');

//let urlLeague = document.innerHTML('input').value;

urlLeague = "england";
const url = 'https://www.soccerstats.com/widetable.asp?league=' + urlLeague;

//Scraping Premiere League Table
tableLog = [];
(async function scraper(filename, options) {
    const response = await axios(url);
    // connection status check
    // response.status === 200 ? console.log("Table connection: "+response.status + " (OK)") : console.log("Table connection: "+response.status + " (ERROR)");
    const html = await response.data;
    const $ = cheerio.load(html);
    const allRows = $('table#btable tbody tr');

    const replace = (s) => {
        const chars = ["\t", "\n", "\r", " "];
        for(let c of chars)
            s = s.replaceAll(c, "");
        return s;
    }

    allRows.each((i, row) => {
        if(i > 0) {
            let data = [];
            for (let j = 0; j < 10; j++)
                //fills array with data from each column
                data[j] = replace($($(row).find('td')[j]).text());

            if (data[0] !== '') {
                tableLog.push({
                    "Place": data[0],
                    "Team": data[1],
                    "Games_Played": data[2],
                    "Wins": data[3],
                    "Draws": data[4],
                    "Losses": data[5],
                    "Goals_For": data[6],
                    "Goals_Against": data[7],
                    "Goal_Difference": data[8],
                    "Points": data[9]
                });
            }
        }
    });

    console.log("Scraping "+$('h1').text()+"...");
    const csv = new ObjectsToCsv(tableLog);
    await csv.toDisk("./data/temp/tempTableLog.csv", options);

    require('convert-csv-to-json').generateJsonFileFromCsv("./data/temp/tempTableLog.csv", "./data/tableLog.json");
})();
