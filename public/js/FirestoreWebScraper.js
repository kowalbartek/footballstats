// JavaScript
const axios = require('axios');
const cheerio = require('cheerio');
//const firebase = require('firebase.json');
const express = require('express');
const firebase = require("firebase/compat");

const app = express();
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDwyjIWGGJbJC95bowUumRbS_g_KImWfxM",
    authDomain: "football-webapp-cs353.firebaseapp.com",
    projectId: "football-webapp-cs353",
    storageBucket: "football-webapp-cs353.appspot.com",
    messagingSenderId: "263782230",
    appId: "1:263782230:web:a76fec49a0c32eb21f60f7",
    measurementId: "G-VWV9455Z9B"
};

firebase.initializeApp(firebaseConfig);

// Scrape data from website
app.post('/pages/search.html', (req, res) => {
    const league1 = req.body.search;
    res.body = league1;
    const URL = `https://www.soccerstats.com/widetable.asp?league=${league1}`;

    axios.get(URL)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const allRows = $('table#btable tbody tr');
            const tableLog = {};

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
            //Upload to Firebase Firestore
            firebase.firestore().collection('statistics_data').doc(league1).set({
                data: tableLog
            })
                .then(() => {
                    console.log('Table data successfully uploaded to Firebase!');
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
});