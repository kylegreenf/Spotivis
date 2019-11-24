
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
/*

*/
};
