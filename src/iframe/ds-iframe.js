
// Initialize
document.addEventListener('DOMContentLoaded', function() { 

const frame = window.frames["e1menuAppIframe"];
const hasContentWindow = !!frame?.contentWindow;
const iframeObj = hasContentWindow ? frame.contentWindow : frame;

const iframeBody = iframeObj?.document?.body?.innerHTML;

  if (iframeBody === undefined) {
    console.log("Unable to determine if this is a data selection page");
  }

var iObj = window.frames['e1menuAppIframe'].contentWindow?.document || window.frames['e1menuAppIframe'].document;
var actionURL = iObj.forms['JDE'].action;
var inpVals = document.getElementById('importValues').value.replace(/(\\r\\n)/g,',').replace(/(\\n)/g,',').split(',');

// File upload handling
document.getElementById('csvFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            inpVals = e.target.result.split('\n');
        };
        reader.readAsText(file);
    }
});

var xmlHttp = false;try {xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');} catch (e) {try {xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');} catch (e2) {xmlHttp = false;}}

if (!xmlHttp && typeof XMLHttpRequest != 'undefined') {xmlHttp = new XMLHttpRequest();}

var count = 0, arrLength=inpVals.length;
var closeButton = document.getElementById('closeButton');

times = window.setInterval(function(){
    if (arrLength <= count) {times = clearTimeout(times);closeButton.onclick();}
    else {
        actionURL = iObj.forms['JDE'].action;
        var EtfList = inpVals[count];
        var jdemafjasLinkTarget = iObj.forms['JDE'].jdemafjasLinkTarget.value;
        var pgIDKey = iObj.forms['JDE'].pgIDKey.value;
        var RID = iObj.forms['JDE'].RID.value;
        var stackId = iObj.forms['JDE'].stackId.value;
        var jdemafjasLauncher = iObj.forms['JDE'].jdemafjasLauncher.value;
        var jdemafjasUID = iObj.forms['JDE'].jdemafjasUID.value;
        var jdemafjasComponent = iObj.forms['JDE'].jdemafjasComponent.value;
        var jdemafjascacheUID = iObj.forms['JDE'].jdemafjascacheUID.value;
        var portletstateparameter = iObj.forms['JDE'].jdemafjascacheUID.value;
        var formval = 'cmdLitPrompt=a&jdemafjasLinkTarget='+jdemafjasLinkTarget+'&pgIDKey='+pgIDKey+'&RID='+RID+'&stackId='+stackId+'&jdemafjasLauncher='+jdemafjasLauncher+'&jdemafjasUID='+jdemafjasUID+'&jdemafjasComponent='+jdemafjasComponent+'&jdemafjascacheUID='+jdemafjascacheUID+'&portletstateparameter='+portletstateparameter+'&EtfList=' + EtfList;

        xmlHttp.open('POST',actionURL,false);xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');xmlHttp.send(formval);

        if (xmlHttp.readyState == 4) {
            iObj.open('text/html'); iObj.write(xmlHttp.responseText); iObj.close();
        }

    }count++;},50);

});