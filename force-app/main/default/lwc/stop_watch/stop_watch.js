/**
 * Created by joaquin on 30/09/2021.
 */

import { LightningElement, track,api } from 'lwc';

export default class StopWatch extends LightningElement {
    @track running = false;
    @track timeVal = '0:0:0:0';
    @api StartField;
    @api EndField;

    timeIntervalInstance;
    totalMilliseconds = 0;

    //agregar connected callback para conseguir los campos y empezar o mostrar el tiempo

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
        this.timeVal = '0:0:0:0';
        this.totalMilliseconds = 0;
        clearInterval(this.timeIntervalInstance);
    }
}