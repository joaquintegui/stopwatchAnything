/**
 * Created by joaquin on 30/09/2021.
 */

import {LightningElement, track, api, wire} from 'lwc';
import {getRecord} from "lightning/uiRecordApi";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import UpdateRecord from '@salesforce/apex/StopWatchController.UpdateRecord';



export default class StopWatch extends LightningElement {

    @api recordId;
    @api objectApiName;
    @track running = false;
    @track timeVal = '0:0:0';
    @api StartField;
    @api EndField;
    @track fields;
    @track StopStartDisabled = false;
    fieldsupdate = {};



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
            this.record = data;
            let startValue = data.fields[this.StartField]['value'] == null ? null : new Date(data.fields[this.StartField]['value']);
            let endValue = data.fields[this.EndField]['value'] == null ? null : new Date(data.fields[this.EndField]['value']);
            let now = new Date();
            if(startValue != null && endValue == null){
                this.totalMilliseconds = now-startValue;
                this.startStop();
            }else if(endValue != null && startValue != null){
                this.totalMilliseconds = endValue-startValue;
                this.StopStartDisabled = true;
            }else if(endValue != null && startValue == null){
                this.timeVal = 'Error: No Start';
            }
            this.timeVal = this.MilisecondsToHms(this.totalMilliseconds);
        }
            // this.StartValue = data.fields.Name.value;
            // this.EndValue = data.fields.Customer_Id__c.value;
        }

    connectedCallback() {
        this.fields = [this.objectApiName+'.'+this.StartField,this.objectApiName+'.'+this.EndField];
    }

    startStopClick() {
        if(this.running) {
            this.fieldsupdate[this.EndField] = 'now';
            this.StopStartDisabled = true;
        }else{
            this.fieldsupdate[this.StartField] = 'now';
        }
        this.update();
        this.startStop();
        }

    startStop() {
        if(this.running){
            this.running = false;
            clearInterval(this.timeIntervalInstance);
        }else{
            this.running = true;
            var parentThis = this;
            // Run timer code in every 100 milliseconds
            this.timeIntervalInstance = setInterval(function() {

                // Output the result in the timeVal variable
                parentThis.timeVal = parentThis.MilisecondsToHms(parentThis.totalMilliseconds);

                parentThis.totalMilliseconds += 100;
            }, 100);
        }

    }

    get startStopButtonLabel(){
        return this.running ? 'Parar' : 'Empezar';
    }


    reset(event) {
        this.fieldsupdate[this.StartField] = null;
        this.fieldsupdate[this.EndField] = null;
        this.update();
        this.running = false;
        this.timeVal = '0:0:0';
        this.totalMilliseconds = 0;
        clearInterval(this.timeIntervalInstance);
    }

    MilisecondsToHms(duration) {
        var milliseconds = Math.floor((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    update(){
        this.fieldsupdate['Id'] = this.recordId;
        console.log(this.fieldsupdate);

        UpdateRecord(({ record: this.fieldsupdate, ObjectApiName: this.objectApiName }))
            .then(() => {
                console.log('exito');
                const event = new ShowToastEvent({
                    title: 'Exito',
                    message: 'La fecha se ha guradado',
                    variant: 'success'
                });
                this.dispatchEvent(event);
            })
            .catch(error => {
                console.log(JSON.stringify(error));
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}