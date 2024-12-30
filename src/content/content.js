function JDE_DS_import() {   
    const frame = window.frames["e1menuAppIframe"];
    const hasContentWindow = !!frame?.contentWindow;
    const iframeObj = hasContentWindow ? frame.contentWindow : frame;

    const iframeBody = iframeObj?.document?.body?.innerHTML;

    if (iframeBody === undefined) {
        alert("This is no a JD Edwards Data selection page. Please open a Data Selection page and try again.");
    } else {

        createPopup(hasContentWindow);
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
            const inpVals = e.target.result.split('\n');
				console.log(inpVals);
				data_import(inpVals);
            };
            reader.readAsText(file);
        }
		
    });

    // manual upload handling
    document.getElementById('importDS').addEventListener('click', function(e) {
        
        inpVals = document.getElementById('importValues').value.split('\n');
        data_import(inpVals);
    });

    
}

// Crear e inyectar el popup flotante
function createPopup() {
	
	doc = document;
    
	var blanket = doc.createElement("div");
    blanket.id = "blanket";
    blanket.style.background = "#111;";
    blanket.style.filter = "alpha(opacity=65)";
    blanket.style.opacity = "0.65";
    blanket.style.position = "absolute";
    blanket.style.zIndex = "9001";
    blanket.style.top = 0;
    blanket.style.left = 0;
    blanket.style.width = "100%";
    blanket.style.height = "100%";
	
    if (doc.getElementById('JDEcustomPopup')) return;

    const popup = doc.createElement('div');
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
    const style = doc.createElement('style');
    style.textContent = `
        #JDEcustomPopup {
            position: absolute;
			width: 600px;
			height: 400px;
			border: 5px solid rgb(74, 74, 74);
			z-index: 9002;
			text-align: center;
			top: 149.5px;
			left: 533px;
			background-color:rgb(51, 49, 49); 
            color: #FBF1C7;
            border-radius: 8px;
		}
        .popup-content {
            padding: 20px !important ;
        }
        .popup-title {
            color: #FBF1C7 !important ;
        }
        .popup-file {
            color: #FBF1C7 !important ;
        }

        .upload-section {
            margin-bottom: 20px !important ;
        }

        .file-input {
            display: none !important ;
        }

        .file-label {
            display: inline-block !important ;
            padding: 12px 20px !important ;
            background: #f3f4f6 !important ;
            border-radius: 8px !important ;
            cursor: pointer !important ;
            transition: all 0.2s ease !important ;
            color: #374151 !important ;
        }

        .file-label:hover {
            background: #e5e7eb !important ;
        }

        .file-info {
            display: block !important ;
            font-size: 12px !important ;
            color: #6b7280 !important ;
            margin-top: 4px !important ;
        }

        /* Manual Input Styles */
        .manual-input-section {
            margin-bottom: 20px !important ;
        }

        .input-label {
            display: block !important ;
            margin-bottom: 8px !important ;
            font-size: 14px !important ;
        }

        .batch-input {
            width: 90% !important ;
            height: 120px !important ;
            padding: 12px !important ;
            border: 1.5px solid #e5e7eb !important ;
            border-radius: 8px !important ;
            font-size: 14px !important ;
            resize: vertical !important ;
        }

        /* Button Styles */
        .convert-button {
            background: #2563eb !important ;
            color: white !important ;
            padding: 12px 24px !important ;
            border: none !important ;
            border-radius: 8px !important ;
            font-size: 15px !important ;
            font-weight: 500 !important ;
            cursor: pointer !important ;
            transition: all 0.2s ease !important ;
            margin-top: 5px !important ;
        }

        .convert-button:hover {
            background: #1d4ed8 !important ;
        }
		.close-btn {
			position:absolute;
			top:0;
			right:0;
		}
    `;
	doc.body.appendChild(blanket);
    doc.body.appendChild(popup);
    doc.head.appendChild(style);

    // Cerrar popup con el botón de cerrar
    doc.querySelector('.close-btn').onclick = () => {
        popup.remove();
        style.remove();
    };
}

function data_import(inpVals) {
	
	var iObj = window.frames['e1menuAppIframe'].contentWindow?.document || window.frames['e1menuAppIframe'].document;
    var actionURL = iObj.forms['JDE'].action;
    
    var xmlHttp = false;try {xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');} catch (e) {try {xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');} catch (e2) {xmlHttp = false;}}

    if (!xmlHttp && typeof XMLHttpRequest != 'undefined') {xmlHttp = new XMLHttpRequest();}

    var count = 0, arrLength=inpVals.length;
    

    times = window.setInterval(function(){
        if (arrLength <= count) {
			times = clearTimeout(times);
			var e2 = document.getElementById('blanket');
			e2.parentNode.removeChild(e2);
			var e1 = document.getElementById('popUpDiv');
			e1.parentNode.removeChild(e1);
			}
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
