
const reformatTimes = function (timestampArr, functionName){
    // const timestampArr = [createdAt, updatedAt];
    console.log(timestampArr);
    const newTimestamps = [];
    for (let i = 0; i < timestampArr.length; i++) {
        let timestamp = timestampArr[i];
        console.log(timestamp);
        // if(timestamp.length === 30 && functionName === "getAllSpots"){
        //     timestamp = timestamp.slice(0,19);
        // }
        // if(timestamp.length === 24 && functionName === )
        if (typeof timestamp === 'string' || timestamp instanceof String) {
            timestamp = timestamp.replace(/\D/g, '');
            console.log(timestamp);
            if(timestamp.length > 14) timestamp = timestamp.slice(0,14);
            timestamp = timestamp.slice(0,4) + "-" + timestamp.slice(4,6) + "-" + timestamp.slice(6,8) + " " + timestamp.slice(8,10) + ":" + timestamp.slice(10,12) + ":"  + timestamp.slice(12,14);
        } else {
            //year
            timestampYear = timestamp.getFullYear();
            //month
            timestampMonth = timestamp.getMonth()+1;
            if(timestampMonth < 10) timestampMonth = "0" + timestampMonth;
            //date
            timestampDate =  timestamp.getDate();
            if(timestampDate < 10) timestampDate = "0" + timestampDate;
            //hours
            timestampHours = timestamp.getHours();
            if(timestampHours < 10) timestampHours = "0" + timestampHours;
            //minutes
            timestampMinutes = timestamp.getMinutes();
            if(timestampMinutes < 10) timestampMinutes = "0" + timestampMinutes;
            //seconds
            timestampSeconds = timestamp.getSeconds();
            if(timestampSeconds < 10) timestampSeconds = "0" + timestampSeconds;

            timestamp = timestampYear + "-" + timestampMonth + "-" + timestampDate + " " + timestampHours + ":" + timestampMinutes + ":"  + timestampSeconds;
        }


        newTimestamps.push(timestamp);
    }
    return newTimestamps;
}

/*
    // for (let i = 0; i < Spots.length; i++) {
        // const spot = Spots[i];
        const timestampArr = [spot.createdAt, spot.updatedAt];
        let newTimestamps = reformatTimes(timestampArr, "getAllSpots");
        spot.createdAt = newTimestamps[0];
        spot.updatedAt = newTimestamps[1];
    //}  
*/

module.exports = { reformatTimes };
