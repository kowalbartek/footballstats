const axios = require('axios');
const cheerio = require('cheerio');
const ObjectsToCsv = require('objects-to-csv');

//Scraping league names and urls from the website
index = [];
(async function html_scraper(filename, options) {
    const response = await axios('https://www.soccerstats.com/leagues.asp');
    //if(response.status === 200) { console.log("Leagues connection: "+response.status + " (OK)"); } else { console.log("Leagues connection: "+response.status + " (ERROR)"); }
    const html = await response.data;
    const $ = cheerio.load(html);
    const allRows = $('table.sortable tbody tr');

    allRows.each((i, row) => {
        if(i > 0) {
            const columns = $(row).find('td');
            index.push({
                "League": $(columns[0]).text().substring($(columns[0]).text().indexOf('-')+2).trim(),
                "Country" : $(columns[0]).text().substring(0, $(columns[0]).text().indexOf('-')-1).trim(),
                "URL": $(columns[1]).find('a').attr('href')
                    .substring($(columns[1]).find('a').attr('href').indexOf('=')+1,
                        $(columns[1]).find('a').attr('href').length)
            });
        }
    });

    console.log("Scraping from "+index.length+" leagues");
    const csv = new ObjectsToCsv(index);
    await csv.toDisk("./data/temp/index.csv", options);
    require('convert-csv-to-json').generateJsonFileFromCsv("./data/temp/index.csv", "./data/index.json");
})();