/**
 * Created by joaquin on 04/10/2021.
 */
@isTest
public with sharing class TestClass {

    @isTest
    private static void testupdate(){
        Contact ct = new Contact(LastName='test');
        insert ct;
        Map<String,Object> mapTest = new Map<String, Object>();
        mapTest.put('Id',ct.id);
        mapTest.put('firstName','name');
        mapTest.put('LastCURequestDate','now');
        StopWatchController.UpdateRecord(mapTest,'contact');

    }

    @IsTest
    private static void TestPicklists(){
        VisualEditor.DesignTimePageContext context=new  VisualEditor.DesignTimePageContext();
        context.entityName='Contact';
        DateTimePicklist DateTimePick = new DateTimePicklist(context);
        VisualEditor.DynamicPickListRows rowsDt = DateTimePick.getValues();
        VisualEditor.DataRow rowsDtdf = DateTimePick.getDefaultValue();
        integerPicklist intPicklist = new integerPicklist(context);
        VisualEditor.DynamicPickListRows rowsInt = intPicklist.getValues();
        VisualEditor.DataRow rowsIntdf = intPicklist.getDefaultValue();
    }
}