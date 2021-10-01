/**
 * Created by joaquin on 30/09/2021.
 */

global with sharing class StopWatchPicklists extends VisualEditor.DynamicPickList {

    VisualEditor.DesignTimePageContext context;

    global StopWatchPicklists(VisualEditor.DesignTimePageContext context){
        this.context = context;
    }

    global override VisualEditor.DataRow getDefaultValue() {
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow(
                'Seleccione...','');
        return defaultValue;
    }

    global override VisualEditor.DynamicPickListRows getValues() {

        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(String.valueOf(this.context.entityName));
        Map<String, Schema.SObjectField> fieldMap = targetType.getDescribe().fields.getMap();
        VisualEditor.DynamicPickListRows  myValues = new VisualEditor.DynamicPickListRows();
        for (Schema.SObjectField field : fieldMap.values()) {
            if(String.valueOf(field.getDescribe().getType()) =='DATETIME'){
                VisualEditor.DataRow value1 = new VisualEditor.DataRow(field.getDescribe().getLabel(), field.getDescribe().getName());
                myValues.addRow(value1);

            }
        }

        return myValues;
    }
}