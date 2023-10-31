
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
        timestamp = timestamp.replace(/\D/g, '');
        console.log(timestamp);
        if(timestamp.length > 14) timestamp = timestamp.slice(0,14);
        timestamp = timestamp.slice(0,4) + "-" + timestamp.slice(4,6) + "-" + timestamp.slice(6,8) + " " + timestamp.slice(8,10) + ":" + timestamp.slice(10,12) + ":"  + timestamp.slice(12,14);

        newTimestamps.push(timestamp);
    }
    return newTimestamps;
}



module.exports = { reformatTimes };
