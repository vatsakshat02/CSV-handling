const fs = require('fs')

//reading the file and storing it in the variable Data
const Data = fs.readFileSync('bank.csv','utf-8');

const lines = Data.trim().split('\n');

const headers = lines[0].split(',');

const transaction = [];

for(let i = 1;i<lines.length;i++){
    const values = lines[i].split(',');
    const obj = {};

    headers.forEach((header,index) => {
            obj[header] = values[index];
    })

    obj.Amount = Number(obj.Amount);
    transaction.push(obj);

    obj.Date = new Date(obj.Date);
}

const sortDate = transaction.sort((a,b) => a.date.getTime()-b.date.getTime());

console.log(sortData);