/**
 * Created by y_mil on 2/9/2016.
 */
'use strict';

var Table = require('cli-table');
var readlineSync = require('readline-sync');

var personId = 0;
var groupId = 0;
var currGroup = 0;
var contacts = [];
var groups = [];

function initGroup(){
    var groupObj = {
        parentGroup:currGroup,
        id:++groupId,
        name:'phonebook',
        type:'group'
    };
    groups.push(groupObj);
    currGroup = groupObj.id;
}

function addPerson(fname,lname,phonenums){
    var personObj = {
        id:personId++,
        fName:fname,
        lName:lname,
        phoneNums:phonenums,
        groupId:currGroup,
        type:'contact'
    };
    contacts.push(personObj);
    console.log(personObj.fName + " " + personObj.lName + " Added!");
}

function addGroup(name){
    var groupObj = {
        parentGroup:currGroup,
        id:++groupId,
        name:name,
        type:'group'
    };
    groups.push(groupObj);
    currGroup = groupObj.id;
    console.log(groupObj.name+ " Added!");
}

function changeCurrGroup(name){
    var tmpGroup;
    if (name == ".." && currGroup>1){
        tmpGroup = findGroupById(currGroup);
        currGroup = tmpGroup.parentGroup;
    }else {
        tmpGroup = findGroupByName(name);
        if (tmpGroup){
            currGroup = tmpGroup.id;
        }else{
            console.log("a group with that name can not be found");
        }
    }
}

function printAll(){
    checkSubGroups(0);
}

function printCurrGroup(){
    checkSubGroups(currGroup);
}

function checkSubGroups(grpId){
    var table2 = new Table();
    table2.push(['Name','Id','Parent id']);

    for (var v=0;v<groups.length;v++) {
        if (groups[v].parentGroup == grpId) {
            table2.push([groups[v].name,groups[v].id,groups[v].parentGroup]);
            console.log(table2.toString());
            //console.log("?????"+groups[v].name);
            printGroupPersons(groups[v].id,groups[v].name);
            checkSubGroups(groups[v].id);
        }
    }
    if (table2.length>1) {
        //
    }
}

function printGroupPersons(Id,thisGroup) {
    var table2 = new Table();
    table2.push(['First name','Last name','Phone number','ID']);

    for (var i=0; i<contacts.length; i++){
        if (contacts[i].groupId == Id){
            table2.push([contacts[i].fName,contacts[i].lName,contacts[i].phoneNums.toString(),contacts[i].id]);
        }
    }
    if (table2.length>1){
        console.log("Contacts under "+thisGroup+" ::");
        console.log(table2.toString());
    }
}

function find(str){
    if (!str) {
        console.log("No string was passed");
        return;
    }
    var table2 = new Table();
    table2.push(['Name','Type','Id']);
    var findStr = str.toLowerCase();

    var tmpGrp = findGroupByName(findStr);
    if (tmpGrp){
        table2.push([tmpGrp.name,tmpGrp.type,tmpGrp.id]);
    }

    for (var v=0; v<contacts.length; v++){
        if (contacts[v].fName == findStr || contacts[v].lName == findStr){
            table2.push([(contacts[v].fName+ " " + contacts[v].lName).toString(), contacts[v].type.toString(), contacts[v].id]);
        }
    }
    if (table2.length>0){
        console.log("Found the next matches::");
        console.log(table2.toString());
    }else{
        console.log("No group or contact was found");
    }
}

function deleteContactByGroupId(idToDel){
    for (var i=0; i<contacts.length; i++){
        if (contacts[i].groupId == idToDel){
            console.log("deleting contact: " + contacts[i].id);
            contacts.splice(i, 1);
            --i;
        }
    }
    return;
}

function deleteContact(idTodel){
    var indOfcontactToDel = findContactById(idTodel);
    if (indOfcontactToDel){
        console.log("deleting contact: " + idTodel);
        contacts.splice(indOfcontactToDel, 1);
    }else{
        console.log("No contact with that id was found.");
    }
}

function deleteGroup(idToDel){
    if (!idToDel) {
        console.log("No ID was passed");
        return;
    }else{
        console.log("Searching group id: "+idToDel);
    }
    for (var i=0; i<groups.length; i++){
        if (groups[i].id == idToDel){
            deleteContactByGroupId(groups[i].id);
            groups.splice(i, 1);
            i--;
        }
    }
    for (var v=0;v<groups.length;v++) {
        if (groups[v] && groups[v].parentGroup == idToDel) {
            deleteGroup(groups[v].id);
            v--;
        }
    }
}

function findGroupById(ID){
    for (var i=0; i<groups.length; i++){
        if (groups[i].id == ID){
            return groups[i];
        }
    }
}

function findGroupByName(str){
    for (var i=0; i<groups.length; i++){
        if (groups[i].name == str){
            return groups[i];
        }
    }
}

function findContactById(ID){
    for (var i=0; i<contacts.length; i++){
        if (contacts[i].id == ID){
            return i;
        }
    }
}

function initialData() {
    addPerson('yoav', 'melkman', ['0542011802', '05555555']);
    addPerson('joe', 'gggg', ['8787878', '7878787878']);
    addGroup("friends");
    addGroup("bffs");
    changeCurrGroup('friends');
    addPerson('gg', 'melkman', ['0542011802', '05555555']);
    addPerson('hh', 'gggg', ['8787878', '7878787878']);
    addGroup("the bff");
    changeCurrGroup('the bff');
    addPerson('bff', 'gggg', ['8787878', '7878787878']);
    addGroup("gg");
    changeCurrGroup('..');
    changeCurrGroup('..');
    addGroup("test2");

    //printCurrGroup();
    printAll();
    //find("gg");
    //deleteGroup(3);
    //printAll();
    //deleteGroup(2);
    //deleteContact(2);
    //deleteContact(2);

    console.log(groups);
}

function displayMenu(){
    var inputCmd = 0;
    while (inputCmd != 8) {
        var tmpGrp = findGroupById(currGroup);

        console.log("CURRENT GROUP> " + tmpGrp.name);

        var menu = ['Add new person', 'Add new group ', 'Change current group ', 'Print current group ', 'Print All ',
        'Find','Delete Group','Delete Contact','Exit']
        inputCmd = readlineSync.keyInSelect(menu, 'Choose your action');


        switch (inputCmd){
            case 0: //Add contact
                console.log(" ");
                var contactFname = readlineSync.question('First name?');
                var contactLname = readlineSync.question('Last name?');
                var contactNumber = readlineSync.question('phone number? (seperate by commas)');
                addPerson(contactFname, contactLname, contactNumber);
                break;

            case 1: //Add new group
                console.log(" ");
                var newGroupName = readlineSync.question('Group name?');
                addGroup(newGroupName);
                break;

            case 2: //Change current group
                console.log(" ");
                var destination = readlineSync.question('where to?');
                changeCurrGroup(destination);
                break;

            case 3: //Print current group
                console.log(" ");
                printCurrGroup();
                console.log("you chose: 4");
                break;

            case 4: //Print All
                console.log(" ");
                printAll();
                break;

            case 5: //Find
                console.log(" ");
                var what = readlineSync.question('what?');
                find(what);
                break;

            case 6: //Delete group
                console.log(" ");
                var whichGrp = readlineSync.question('which group id?');
                deleteGroup(whichGrp);
                break;

            case 7: //Delete Contact
                console.log(" ");
                var whichCntc = readlineSync.question('which contact id?');
                deleteContact(whichCntc);
                break;

            case 8: //Exit
                break;

            default: //do nothing
                break;
        }
    }
}

initGroup();
//initialData();

displayMenu();
