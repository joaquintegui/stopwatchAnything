/**
 * Created by joaquin on 30/09/2021.
 */

import {LightningElement, track, api, wire} from 'lwc';
import {getRecord} from "lightning/uiRecordApi";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import UpdateRecord from '@salesforce/apex/StopWatchController.UpdateRecord';
import { refreshApex } from '@salesforce/apex';



export default class StopWatch extends LightningElement {

    @api recordId;
    @api objectApiName;
    @api StartField;
    @api EndField;
    @api DurationField;
    @api ResetField;
    @api NetTimeMode;
    @track running = false;
    @track timeVal = '00:00:00';
    @track fields = [];
    @track errorMessage;
    @track StopStartDisabled = false;
    fieldsupdate = {};
    returnedData;



    timeIntervalInstance;
    totalMilliseconds = 0;

    @wire(getRecord, { recordId: '$recordId' , fields: '$fields'})
    loadCustomer(result) {
        this.returnedData = result;

        if (result.error) {
            console.log('error:',
                result.error.body.errorCode,
                result.error.body.message
            );
            this.errorMessage =  result.error.body.message;
        } else if (result.data) {
            if(this.errorMessage)return;
            this.record = result.data;
            let returnedFields = result.data.fields;
            let startValue;
            let endValue;
            let durationValue;
            let now = new Date();
            if(this.StartField)startValue = returnedFields[this.StartField]['value'] == null ? null : new Date(returnedFields[this.StartField]['value']);
            if(this.EndField)endValue = returnedFields[this.EndField]['value'] == null ? null : new Date(returnedFields[this.EndField]['value']);
            if(this.DurationField)durationValue = returnedFields[this.DurationField]['value'] ;

            if(durationValue != null && this.NetTimeMode){
                this.totalMilliseconds = this.HourstoMiliseconds(durationValue);
            }else if(startValue != null && endValue == null){
                this.totalMilliseconds = now-startValue;
                this.startStop();
            }else if(endValue != null && startValue != null){
                this.totalMilliseconds = endValue-startValue;
                this.StopStartDisabled = true;
            }else if(endValue != null && startValue == null){
                this.errorMessage = 'Error: la fecha de inicio no esta seteada pero si la de fin';
                return;
            }else if(endValue < startValue){
                this.errorMessage = 'Error: la fecha de fin no puede ser menor que la de inicio';
                return;
            }
            this.timeVal = this.MilisecondsToHms(this.totalMilliseconds);
        }
            // this.StartValue = returnedFields.Name.value;
            // this.EndValue = data.fields.Customer_Id__c.value;
        }

    connectedCallback() {
        if(this.StartField){
            this.fields = [...this.fields, this.objectApiName+'.'+this.StartField];
        }
        if(this.EndField){
            this.fields = [...this.fields, this.objectApiName+'.'+this.EndField];
        }
        if(this.DurationField){
            this.fields = [...this.fields, this.objectApiName+'.'+this.DurationField];
        }
        if(this.NetTimeMode && (this.EndField || this.StartField)) this.errorMessage = 'En el modo tiempo neto no se puede setear fecha de inicio ni fin.';

    }

    startStopClick() {
        if(this.running) {
            this.fieldsupdate[this.EndField] = 'now';
            this.StopStartDisabled = true;
            if(this.DurationField != null){
                console.log(this.MilisecondstoHours(this.totalMilliseconds));
                this.fieldsupdate[this.DurationField] = this.MilisecondstoHours(this.totalMilliseconds);
            }
        }else{
            this.fieldsupdate[this.StartField] = 'now';
        }
        this.update();
        this.startStop();
        refreshApex(this.returnedData);
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
        this.fieldsupdate[this.DurationField] = null;
        this.update()
        this.running = false;
        this.timeVal = 'reset';
        this.totalMilliseconds = 0;
        clearInterval(this.timeIntervalInstance);
        refreshApex(this.returnedData);

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

    MilisecondstoHours(duration){
        return duration / (1000 * 60 * 60);
    }

    HourstoMiliseconds(hours){
        return hours * (1000 * 60 * 60);
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