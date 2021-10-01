/**
 * Created by joaquin on 30/09/2021.
 */

import {LightningElement, track, api, wire} from 'lwc';
import {getRecord} from "lightning/uiRecordApi";

export default class StopWatch extends LightningElement {

    @api recordId;
    @api objectApiName;
    @track running = false;
    @track timeVal = '0:0:0:0';
    @api StartField;
    @api EndField;
    @track fields;
    @track StartValue;
    @track EndValue;


    timeIntervalInstance;
    totalMilliseconds = 0;

    @wire(getRecord, { recordId: '$recordId' , fields: '$fields'})
    loadCustomer({ error, data }) {
        if (error) {
            console.log('error:',
                error.body.errorCode,
                error.body.message
            );
        } else if (data) {
            console.log(JSON.stringify(data.fields[this.StartField]));
            let startValue = new Date(data.fields[this.StartField]['value']);
            //Esto da los segundos
            console.log(Date.now()-startValue);
            // this.StartValue = data.fields.Name.value;
            // this.EndValue = data.fields.Customer_Id__c.value;
        }
        ;
    }

    connectedCallback() {
        this.fields = [this.objectApiName+'.'+this.StartField,this.objectApiName+'.'+this.EndField];

    }

    startStopClick(event) {
        if(this.running){
            this.running = false;
            clearInterval(this.timeIntervalInstance);
        }else{
            this.running = true;
            var parentThis = this;

            // Run timer code in every 100 milliseconds
            this.timeIntervalInstance = setInterval(function() {

                // Time calculations for hours, minutes, seconds and milliseconds
                var hours = Math.floor((parentThis.totalMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((parentThis.totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((parentThis.totalMilliseconds % (1000 * 60)) / 1000);

                // Output the result in the timeVal variable
                parentThis.timeVal = hours + ":" + minutes + ":" + seconds;

                parentThis.totalMilliseconds += 100;
            }, 100);
        }

    }

    get startStopButtonLabel(){
        return this.running ? 'Parar' : 'Empezar';
    }


    reset(event) {
        this.running = false;
        this.timeVal = '0:0:0';
        this.totalMilliseconds = 0;
        clearInterval(this.timeIntervalInstance);
    }
}