exports.process = function(datArray){
    console.log("Processing data array");
    var message = [];
    for (var i=0; i< datArray.length; i++){
        element = JSON.parse(datArray[i])
        try{
            if (element["message"]){
                message.push(formattedDate(element["timestamp"]) + " : "+ element["from"] + " => "+ element["message"]);
            }
            switch(element["action"]){
                case "nick":
                    message.push(formattedDate(element["timestamp"]) + " : " + element["oldnick"] + " is now known as " + element["newnick"]);
                    break;
                case "join":
                    message.push(formattedDate(element["timestamp"]) + " : " + element["who"] + " has joined the chat room.");
                    break;
                case "quit":
                case "part":
                    message.push(formattedDate(element["timestamp"]) + " : " + element["who"] + " has left the chat room. " + element["reason"]);
            }
            
        } catch (e) {
            console.error(e)
        }
    }
    console.log("Data Processed, returning it");
    return message;
}

var formattedDate = function(timestamp){
    var frmttdDate = '';
    tempDate = new Date(timestamp);
    year = tempDate.getUTCFullYear(); 
    month = +tempDate.getUTCMonth() + 1;
    if (month < 10){
        month = "0" + month;
    }

    day =  tempDate.getUTCDate();
    if (day < 10){
        day = "0" + day;
    }

    hour = tempDate.getUTCHours();
    if (hour < 10){
        hour = "0" + hour;
    }

    minutes = tempDate.getUTCMinutes();
    if (minutes < 10){
        minutes = "0" + minutes;
    }

    seconds = tempDate.getUTCSeconds();
    if (seconds < 10){
        seconds = "0" + seconds;
    }
    return frmttdDate = year.toString() + "-" + month.toString() + "-" + day.toString() + " " + hour.toString() + ":" + minutes.toString() + ":" + seconds.toString();
}
