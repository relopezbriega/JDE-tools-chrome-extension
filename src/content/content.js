function JDE_DS_import() {   
    const frame = window.frames["e1menuAppIframe"];
    const hasContentWindow = !!frame?.contentWindow;
    const iframeObj = hasContentWindow ? frame.contentWindow : frame;

    const iframeBody = iframeObj?.document?.body?.innerHTML;

    if (iframeBody === undefined) {
        alert("Unable to determine if this is a data selection page");
    } else {

        const width = 600;
        const height = 800;
        const left = screen.width/2;
        const top = 20;
    
        const popup = window.open(
            chrome.runtime.getURL('/src/iframe/iframe-ds-import.html'),
            'FloatingIframe',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes`
        );
    
        if (!popup) {
            alert('Allow popup windows for using this functionality.');
        }
    }

    var iObj = window.frames['e1menuAppIframe'].contentWindow?.document || window.frames['e1menuAppIframe'].document;
    var actionURL = iObj.forms['JDE'].action;
    var inpVals = [];

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

    // manual upload handling
    document.getElementById('importDS').addEventListener('click', function(e) {
        
        inpVals = document.getElementById('importValues').value.replace(/(\\r\\n)/g,',').replace(/(\\n)/g,',').split(',');
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
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message === "JDE_DS_import") {
        console.log(message);   
        JDE_DS_import();
    }
    sendResponse({ executed: true, status: 'success' });
    return true;
});