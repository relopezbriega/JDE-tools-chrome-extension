function JDE_DS_import() {   
    const frame = window.frames["e1menuAppIframe"];
    const hasContentWindow = !!frame?.contentWindow;
    const iframeObj = hasContentWindow ? frame.contentWindow : frame;

    const iframeBody = iframeObj?.document?.body?.innerHTML;

    if (iframeBody === undefined) {
        alert("This is no a JD Edwards Data selection page. Please open a Data Selection page and try again.");
    } else {

        createPopup();
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
        data_import(inpVals);
    });

    // manual upload handling
    document.getElementById('importDS').addEventListener('click', function(e) {
        
        inpVals = document.getElementById('importValues').value.replace(/(\\r\\n)/g,',').replace(/(\\n)/g,',').split(',');
        data_import(inpVals);
    });

    
}

// Crear e inyectar el popup flotante
function createPopup() {
    if (document.getElementById('JDEcustomPopup')) return;

    const popup = document.createElement('div');
    popup.id = 'JDEcustomPopup';
    popup.innerHTML = `
        <div class="popup-content">
            <button class="close-btn">X</button>
            <h3 class="popup-title">Batch Data Selection Import</h3>
            <!-- File Upload -->
            <div class="upload-section">
                <h4 class="popup-file">Upload file:</h4>
                <input type="file" id="csvFile" accept=".csv" class="file-input">
                <label for="csvFile" class="file-label">
                    Upload CSV file
                    <span class="file-info">File format: CSV with values, one value for row</span>
                </label>
            </div>

            <!-- Manual Input -->
            <div class="manual-input-section">
                <label for="batchDates" class="input-label">or paste here (one value for row):</label>
                <textarea id="importValues" class="batch-input" 
                        placeholder="124044&#10;123365&#10;124274"></textarea>
            </div>

            <button id="importDS" class="convert-button">Import Data</button>
        </div>
        <script>
            document.getElementById('popupForm').onsubmit = function(e) {
                e.preventDefault();
                const inputText = document.getElementById('popupInput').value;
                const result = document.createElement('p');
                result.textContent = 'Nuevo texto: ' + inputText;
                document.body.appendChild(result);
                document.getElementById('JDEcustomPopup').remove();
            }
        </script>
    `;

    // Estilizar el popup
    const style = document.createElement('style');
    style.textContent = `
        #JDEcustomPopup {
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial;
            font-size: small;
            margin: 12px;
            background-color:rgb(51, 49, 49); 
            color: #FBF1C7;
            border-radius: 8px;
        }
        .popup-content {
            padding: 20px;
        }
        .popup-title {
            color: #FBF1C7;
        }
        .popup-file {
            color: #FBF1C7;
        }

        .upload-section {
            margin-bottom: 20px;
        }

        .file-input {
            display: none;
        }

        .file-label {
            display: inline-block;
            padding: 12px 20px;
            background: #f3f4f6;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #374151; 
        }

        .file-label:hover {
            background: #e5e7eb;
        }

        .file-info {
            display: block;
            font-size: 12px;
            color: #6b7280;
            margin-top: 4px;
        }

        /* Manual Input Styles */
        .manual-input-section {
            margin-bottom: 20px;
        }

        .input-label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
        }

        .batch-input {
            width: 90%;
            height: 120px;
            padding: 12px;
            border: 1.5px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            resize: vertical;
        }

        /* Button Styles */
        .convert-button {
            background: #2563eb;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-top: 5px;
        }

        .convert-button:hover {
            background: #1d4ed8;
        }
    `;

    document.body.appendChild(popup);
    document.head.appendChild(style);

    // Cerrar popup con el botón de cerrar
    document.querySelector('.close-btn').onclick = () => {
        popup.remove();
        style.remove();
    };
}

function data_import(inpVals) {
    
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
        JDE_DS_import();
    }
    sendResponse({ executed: true, status: 'success' });
    return true;
});