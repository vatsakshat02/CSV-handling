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

//to calculate total credit and total debit of an user 
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



//identify the largest transaction per user
function largestTrans(trans){
    const summary = {};
    

    for(const txn of transaction){
        const currentAmount =  Math.abs(txn.Amount)
        const name = txn.AccountHolder;
      if(!summary[name] || currentAmount>summary[name].LargestTransaction){
        summary[name] = {
            AccountHolder: name,
            LargestTransaction: currentAmount
            }
        }
     
    }
return Object.values(summary);
}

// console.log(largestTrans(transaction))

//all the transaction where the remark contain salary
function Salary(trans){
   return trans.filter(txn => txn.Remarks.toLowerCase().includes('salary'))
}

// console.log(Salary(transaction))




function SummariseTransacrions(summarise){
    const summary = {};
    for(const txn of summarise){
        const name = txn.AccountHolder;
        if(!summary[name]){
            summary[name]= {
                AccountHolder: name,
                TotalCredit : 0,
                TotalDebit : 0,
                LargestTransaction: 0,
                SalaryTransactions: []

            }
        }

        if(txn.Type === "Credit"){
            summary[name].TotalCredit+= txn.Amount;
        }
        else if(txn.Type === "Debit"){
            summary[name].TotalDebit += txn.Amount;
        }

        const absAmount = Math.abs(txn.Amount)
        if(absAmount>summary[name].LargestTransaction){
            summary[name].LargestTransaction = absAmount;
        }

        if(txn.Remarks.toLowerCase().includes('salary')){
            summary[name].SalaryTransactions.push(txn.TransactionID)
        }
    }
    return Object.values(summary);
}

function SummaryCSV(summary){
    const headers = [
        "AccountHolder",
        "TotalCredit",
        "TotalDebit",
        "LargestTransaction",
        "SalaryTransactions"
    ]
    const rows = summary.map(obj => 
        [
        obj.AccountHolder,
        obj.TotalCredit,
        obj.TotalDebit,
        obj.LargestTransaction,
        obj.SalaryTransactions.join('|')].join(","))

        const csv = [headers.join(','), ...rows].join('\n')
        fs.writeFileSync('bank_summary.csv',csv);
}

const result = (SummariseTransacrions(transaction));

console.log(SummaryCSV(result));