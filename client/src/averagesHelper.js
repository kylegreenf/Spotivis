var Chart = require('chart.js');
var averageCounts;

module.exports = {


  explicitCount(tracks){
    var totalLen = tracks.length
    var explicitcount = 0;
    for (var i in tracks){
        if (tracks[i].explicit === true) {
          explicitcount++;
        }
    }
    var percent = (totalLen/explicitcount).toFixed(0);
    var ratio = {explicitcount, totalLen, percent};
    return ratio;
  },

  radarAverageCount(tracks) {
    var danceability = 0;
    var acousticness = 0;
    var valence = 0;
    var popularity = 0;
    var energy = 0;

    for (var i in tracks){
        danceability += tracks[i].danceability;
        acousticness += tracks[i].acousticness;
        valence += tracks[i].valence;
        popularity += tracks[i].popularity;
        energy += tracks[i].energy;
    }
    danceability = Math.round((danceability / tracks.length)*100);
    acousticness = Math.round((acousticness / tracks.length)*100);
    valence = Math.round((valence / tracks.length)*100);
    popularity = Math.round((popularity / tracks.length));
    energy = Math.round((energy / tracks.length)*100);

    averageCounts = [danceability, acousticness, valence, popularity, energy];
    return averageCounts;
  },





  RadarChart(tracks) {
    var radarcounts = this.radarAverageCount(tracks);
    var ctx = 'radar-chart';
    var options = {
        title: {
            display: true,
            text: "Diversity Analysis"
        },
        legend:{
            display:true
        }
    };

    var myRadarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ["Danceability", 'Acousticness', 'Happiness', 'Popularity', 'Energy'],
        datasets: [{
          "label":"Variety Breakdown",
          "data":radarcounts,
          "fill":true,
          "backgroundColor":"rgba(100, 9, 100, 0.25)",
          "borderColor":"rgb(100, 0, 100)",
          "pointBackgroundColor":"rgb(100, 9, 100)",
          "pointBorderColor":"#fff",
          "pointHoverBackgroundColor":"#fff",
          "pointHoverBorderColor":"rgb(100, 9, 100)"}]
      },
      options: {
        elements: {
          line: {
            tension: 0,
            borderWidth: 3,
          }
        }
      }
    });
  }
/*

*/
};
