/**
 * Created by joaquin on 30/09/2021.
 */

public with sharing class StopWatchController {

    @AuraEnabled
    public static void UpdateRecord(Map<String,Object> record, String ObjectApiName){
        System.debug(record);
        sObject obj = Schema.getGlobalDescribe().get(ObjectApiName).newSObject();
        for(String s : record.keySet()){
            Object value = record.get(s);
            if(value == 'now'){
                obj.put(s,Datetime.now());
            }else{
                obj.put(s,value);
            }
        }
        update obj;
    }

}