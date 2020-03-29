import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { NgxXml2jsonService } from 'ngx-xml2json';
import * as _ from 'lodash';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  satiClearingForm: FormGroup;
  title = 'Sati-Clearing-Agency';
  sanitizeObjects = [];

  constructor(private _fb: FormBuilder, private ngxXml2jsonService: NgxXml2jsonService, private appService: AppService) {
  }

  ngOnInit() {
    this.satiClearingForm = this._fb.group({
      xmlInput: [''],
      file:[]
    });
  }

  addTable() {
    const rawXml = this.satiClearingForm.get("xmlInput").value
    const parser = new DOMParser();
    const xml = parser.parseFromString(rawXml, 'text/xml');
    const rawObj = this.ngxXml2jsonService.xmlToJson(xml);
    this.sanitizeObject(rawObj);
    this.satiClearingForm.get("xmlInput").patchValue('');
    this.satiClearingForm.get("file").patchValue(null);
  }

  sanitizeObject(rawObj) {
    let sanitizeObject = {};
    sanitizeObject["Number_of_loading_lists"] = _.get(rawObj, ["ASYCUDA", "Property", "Nbers", "Number_of_loading_lists"]);
    sanitizeObject["Serial_number"] = _.get(rawObj, ["ASYCUDA", "Identification", "Registration", "Number"]);
    sanitizeObject["Value_details"] = _.get(rawObj, ["ASYCUDA", "General_information", "Value_details"]);
    sanitizeObject["Total_CIF"] = _.get(rawObj, ["ASYCUDA", "Valuation", "Total_CIF"]);
    sanitizeObject["Total_number_of_packages"] = _.get(rawObj, ["ASYCUDA", "Property", "Nbers", "Total_number_of_packages"]);
    sanitizeObject["Customs_clearance_office_code"] = _.get(rawObj, ["ASYCUDA", "Identification", "Office_segment", "Customs_clearance_office_code"]);
    sanitizeObject["Consignee_code"] = _.get(rawObj, ["ASYCUDA", "Traders", "Consignee", "Consignee_code"]);
    sanitizeObject["Total_invoice"] = _.get(rawObj, ["ASYCUDA", "Valuation", "Total", "Total_invoice"]);
    sanitizeObject["Previous_document_reference"] = _.get(rawObj, ["ASYCUDA", "Item", 0, "Previous_doc", "Previous_document_reference"]);
    this.sanitizeObjects.push(sanitizeObject);
  }

  downloadTable() {
    let excelData = [];
    this.sanitizeObjects.forEach(sanitizeObject => {
      excelData.push(
        [
          sanitizeObject["Number_of_loading_lists"],
          sanitizeObject["Serial_number"],
          sanitizeObject["Value_details"],
          sanitizeObject["Total_CIF"],
          sanitizeObject["Total_number_of_packages"],
          sanitizeObject["Customs_clearance_office_code"],
          sanitizeObject["Consignee_code"],
          sanitizeObject["Total_invoice"],
          sanitizeObject["Previous_document_reference"]])
    });
    this.appService.generateExcel(excelData);
  }

  openFile(event) {
    let input = event.target;
    for (var index = 0; index < input.files.length; index++) {
      let reader = new FileReader();
      reader.onload = () => {
        // this 'text' is the content of the file
        var text = reader.result;
        this.satiClearingForm.get("xmlInput").patchValue(text);
      }
      reader.readAsText(input.files[index]);
    };
  }

}
