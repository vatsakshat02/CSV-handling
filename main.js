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
    obj.Date = new Date(obj.Date);
    transaction.push(obj);

    
}
//sorting data by date 
const sortDate = transaction.sort((a,b) => a.Date.getTime()-b.Date.getTime());

// console.log(sortDate);

function totalCredit(trans){
        const summary  = {};
        for(const txn of trans){
            const name = txn.AccountHolder;
            if(!summary[name]){
                summary[name] = {AccountHolder: name, totalcredit: 0,totaldebit: 0}
            }
            if(txn.Type==='Credit'){
                summary[name].totalcredit += txn.Amount;
            }
            else if(txn.Type==='Debit'){
                summary[name].totaldebit += Math.abs(txn.Amount);
            }
        }
        return Object.values(summary);
}

console.log(totalCredit(transaction))