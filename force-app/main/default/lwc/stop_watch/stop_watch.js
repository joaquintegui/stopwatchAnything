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
    @api StartField;
    @api EndField;
    @api DurationField;
    @api campoReset;
    @track running = false;
    @track timeVal = '00:00:00';
    @track fields = [];
    @track errorMessage;
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
            if(this.errorMessage)return;
            this.record = data;
            let startValue = data.fields[this.StartField]['value'] == null ? null : new Date(data.fields[this.StartField]['value']);
            let endValue = data.fields[this.EndField]['value'] == null ? null : new Date(data.fields[this.EndField]['value']);
            let durationValue = data.fields[this.DurationField]['value'] ;
            let now = new Date();
            console.log(startValue);
            console.log(endValue);
            if(durationValue != null){
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
            // this.StartValue = data.fields.Name.value;
            // this.EndValue = data.fields.Customer_Id__c.value;
        }

    connectedCallback() {
        if(this.StartField != null){
            this.fields = [...this.fields, this.objectApiName+'.'+this.StartField];
        }
        if(this.EndField != null){
            this.fields = [...this.fields, this.objectApiName+'.'+this.EndField];
        }
        if(this.DurationField != null){
            this.fields = [...this.fields, this.objectApiName+'.'+this.DurationField];
        }

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