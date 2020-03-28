import { Injectable } from "@angular/core";

import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Injectable()
export class AppService {

    generateExcel(data) {
        const title = 'Sati Clearing Agency Report';
        const header = ["Number of loading lists", "Serial number (M)", "Value details", "Total CIF", "Total number of packages", "Customs clearance office code", "Consignee code", "Total invoice", "Previous document reference"];
        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Sati Clearing Agency');
        let titleRow = worksheet.addRow([title]);
        titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
        worksheet.addRow([]);
        let subTitleRow = worksheet.addRow(['Date : ' + new Date()]);
        //     let logo = workbook.addImage({
        //         base64: logoFile.logoBase64,
        //         extension: 'png',
        //   });
        //   worksheet.addImage(logo, 'E1:F3');
        //worksheet.mergeCells('A1:D2')
        let headerRow = worksheet.addRow(header);
        headerRow.eachCell((cell, number) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFF00' },
                bgColor: { argb: 'FF0000FF' }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });

        data.forEach(d => {
            let row = worksheet.addRow(d);
            // let qty = row.getCell(5);
            let color = 'FF99FF99';
            // if (+qty.value < 500) {
            //     color = 'FF9999'
            // }
            // qty.fill = {
            //     type: 'pattern',
            //     pattern: 'solid',
            //     fgColor: { argb: color }
            // }
        });

        let footerRow = worksheet.addRow(['This is system generated excel sheet.']);
        footerRow.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFCCFFE5' }
        };
        footerRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        //Merge Cells
        worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);


        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, 'SatiClearingAgencyData.xlsx');
        });
    }


}