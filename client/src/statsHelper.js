
module.exports = {
  
  getBucketCount(dict){
    var valArr = [];
    for (var key in dict){
        valArr.push(dict[key])
    }      
    return valArr;
  },

  getBucketLabel(dict){
    var valArr = [];
    for (var key in dict){
        valArr.push(key.toString() + "-" +(parseInt(key)+10))
    }      
    return valArr;
  },

  splitByField(tracks,field){
    var totalLen = tracks.length
    var countDict = {}
    for (var i in tracks){
        var val = tracks[i][field]
        val = (Math.floor(val*10))*10

        if(val in countDict){
            countDict[val] += 1        
        }else{
            countDict[val] = 1
        }
    }
    return countDict
  },

  getTopFive(tracks,field){
    tracks.sort((a, b) => (a[field] < b[field]) ? 1 : -1);
    var topFive = tracks.slice(0,5);
    var names = [];
    for (var t in topFive){
        names.push(topFive[t])
    }
    return names
  },

getBotFive(tracks,field){
    tracks.sort((a, b) => (a[field] > b[field]) ? 1 : -1);
    var topFive = tracks.slice(0,5);
    var names = [];
    for (var t in topFive){
        names.push(topFive[t])
    }
    return names
  }
/*
                
*/
};
