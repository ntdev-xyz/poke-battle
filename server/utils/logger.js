const fs = require('fs');

function newBattleLog({ room }) {
    fs.mkdir('./logs',{ recursive: true }, (error) => {
        if (error) console.error('Error creating directory:', error)
    });
    const textFile = `./logs/battle_log_${room}_${formatCurrentDate()}.txt`;
    fs.writeFile(textFile,"", 'utf8', (error) => {
        if (error) {
            console.error('Error writing to file:', error);
          }
    })  
    
    return textFile
}

function writeBattleLog({ file, dataString }) {
    fs.appendFile(file, dataString, 'utf8', (error) => {
        if (error) {
            console.error('Error writing to file:', error);
          }
    })   
}
function formatCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

module.exports = { newBattleLog, writeBattleLog }