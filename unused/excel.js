const ExcelJS = require('exceljs');

const loadXLS = async () => {
    const wb = new ExcelJS.Workbook();
    const excelFile = await wb.xlsx.readFile('./comments.xlsx');
    let ws = excelFile.getWorksheet('ExportComments.com');
    // console.log(ws.getSheetValues())
    let data = ws.getSheetValues();
    data.map(r => {
        return [r[3],r[2],r[3]]
    })
    data.shift();
    data.shift();
    data = data.map((r,i)=>{
        if(i === 0){
            // return [
            //     'Item',
            //     'Hot Links',
            //     r[4]
            // ]
            return [
                'Post Link',
                r[2],
                ''
            ]
        }
        // if(i === 1){
        //     return [
        //         'Sequence',
        //         'Date',
        //         'Comment'
        //     ]
        // }
        if( i > 1){
            if(r[2]){
                let t = r[2].replace('-', '.')
                return [
                    parseFloat(t), r[5], r[7]
                ]
            }else{
                if(r[1])
                    return [
                        r[1], r[5], r[7]
                    ]
            }  
        }
    })
    console.log(data);
    
}
loadXLS()