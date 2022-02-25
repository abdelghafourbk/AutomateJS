const puppeteer = require('puppeteer')
const XLSX = require('xlsx')

var delibSheet = XLSX.readFile('L3 ISIL B 21-22.xlsx')
var sheet_matricule_list = delibSheet.SheetNames;
const sheetJSON =  XLSX.utils.sheet_to_json(delibSheet.Sheets[sheet_matricule_list[0]])

var Matricules = []
sheetJSON.forEach(elm=>{
    if (Number(elm["__EMPTY_1"])/1 == Number(elm["__EMPTY_1"]) ) {
        let temp =[]
        temp.push(Number(elm["__EMPTY_1"]), elm['__EMPTY_2'])
        Matricules.push(temp)   
    }
})

var finalData = []
async function getData() {

     for(const elm of Matricules){
       try {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto('https://ent.usthb.dz/delib/',{
            waitUntil: 'load',
            // Remove the timeout
            timeout: 0
        });
        await page.type('input[name="matricule"]', String(elm[0]))
        await page.click('input[name="ok"]')

        const pageContent = await page.content();
        await page.close();
        let arr =[]
        await arr.push(pageContent)
        try {
            let a1 = await arr[0].match(/<strong>JANV :(\d*,\d*)/);
            // console.log(a1[1]);
                let temp = []
            await temp.push(elm[0],elm[1], a1[1])
            console.log(temp);
            await finalData.push(temp)
            await browser.close()
        } catch (e) {
            continue;
        }
       } catch (e) {
           console.log(finalData);
           console.log(e);
           return;
       }
    }
    
    console.log(finalData);
  }

   getData()