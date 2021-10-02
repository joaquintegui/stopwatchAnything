/**
 * Created by joaquin on 30/09/2021.
 */

public with sharing class StopWatchController {

    @AuraEnabled
    public static void UpdateRecord(Map<String,Object> record, String ObjectApiName){
        System.debug(record);
        sObject obj = Schema.getGlobalDescribe().get(ObjectApiName).newSObject();
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(String.valueOf(ObjectApiName));
        Map<String, Schema.SObjectField> fieldMap = targetType.getDescribe().fields.getMap();
        for(String s : record.keySet()){
            Object value = record.get(s);
            if(s == 'Id'){
                obj.put(s,value);
            }else if(fieldMap.get(s).getDescribe().isUpdateable()){
                if(value == 'now'){
                    obj.put(s,Datetime.now());
                }else{
                    obj.put(s,value);
                }
            }
        }
        update obj;
    }

}