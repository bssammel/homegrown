
const reformatTimes = function (timestampArr, functionName){
    // const timestampArr = [createdAt, updatedAt];
    console.log(timestampArr);
    const newTimestamps = [];
    for (let i = 0; i < timestampArr.length; i++) {
        let timestamp = timestampArr[i];
        // 2023-10-31 16:49:31.783 +00:00
        console.log(timestamp);
        if(timestamp.length === 30){
            timestamp = timestamp.slice(0,19);
        }


        newTimestamps.push(timestamp);
    }
    return newTimestamps;
}



module.exports = { reformatTimes };
