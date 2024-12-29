// Date conversion functions
function toJDEJulianDate(date) {
    try {
        if (typeof date === 'string') {
            const [year, month, day] = date.split('-');
            date = new Date(year, month -1, day);
        }
        
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }
        
        const year = parseInt(date.getFullYear());
        const yearInCentury = year - 1900;
        
        const startOfYear = new Date(year, 0, 1);
        const diff = date - startOfYear;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay) + 1;
        
        return `${yearInCentury.toString().padStart(3, '0')}${dayOfYear.toString().padStart(3, '0')}`;
    } catch (error) {
        throw new Error('Conversion fallida');
    }
}

function toGregoDate(myJul) {
    try {
        if (myJul.length == 5) {
          var yearSubStr = myJul.substr(0,2);
          var daySubStr = myJul.substr(2,3);
        }
        else {
          yearSubStr = myJul.substr(0,3);
          daySubStr = myJul.substr(3,3);
		    }

        var year = 1900 + parseInt(yearSubStr);
				
        if (daySubStr.substr(0,1)=="0") {
          if (daySubStr.substr(0,2)=="00")
            daySubStr = parseInt(daySubStr.substr(2,1));
          else
            daySubStr = parseInt(daySubStr.substr(1,2));
        }
        else { 
          daySubStr = parseInt(daySubStr.substr(0,3));
        }
        
        var days = daySubStr;
        var grego = new Date(year, 0, 1);

        grego.setDate(grego.getDate() + days - 1);
		
        var myYear = grego.getFullYear();
        var myDay = grego.getDate();
        var myMonth = grego.getMonth() +1;
        var mygrego = `${myYear}-${myMonth.toString().padStart(2, '0')}-${myDay.toString().padStart(2, '0')}`;
        
        return mygrego;
    } catch (error) {
        throw new Error('Conversion fallida');
    }
}

// Batch processing functions
function processDateBatch(dates) {
    return dates.map(date => {
        try {
            const julianDate = toJDEJulianDate(date.trim());
            return {
                originalDate: date.trim(),
                julianDate: julianDate,
                status: 'Ok'
            };
        } catch (error) {
            return {
                originalDate: date.trim(),
                julianDate: '',
                status: 'Error'
            };
        }
    });
}

// Batch processing functions
function processDateBatchJul(dates) {
    return dates.map(date => {
        try {
            const julianDate = toGregoDate(date.trim());
            return {
                originalDate: date.trim(),
                julianDate: julianDate,
                status: 'Ok'
            };
        } catch (error) {
            return {
                originalDate: date.trim(),
                julianDate: '',
                status: 'Error'
            };
        }
    });
}

function displayResults(results) {
    const tbody = document.getElementById('resultsBody');
    tbody.innerHTML = '';
    
    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.originalDate}</td>
            <td>${result.julianDate}</td>
            <td class="status-${result.status}">
                ${result.status === 'Ok' ? '✓' : '✗'}
            </td>
        `;
        tbody.appendChild(row);
    });
    
    document.getElementById('resultsContainer').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('resultsContainer').classList.add('visible');
    }, 50);
}

function displayResultsJul(results) {
    const tbody = document.getElementById('resultsBodyJul');
    tbody.innerHTML = '';
    
    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.originalDate}</td>
            <td>${result.julianDate}</td>
            <td class="status-${result.status}">
                ${result.status === 'Ok' ? '✓' : '✗'}
            </td>
        `;
        tbody.appendChild(row);
    });
    
    document.getElementById('resultsContainerJul').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('resultsContainerJul').classList.add('visible');
    }, 50);
}

function downloadCSV(results) {
    const csvContent = [
        ['Fecha Original', 'Fecha Convertida', 'Estado'],
        ...results.map(r => [r.originalDate, r.julianDate, r.status])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Fechas_julianas.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Single date picker
    const julianDisplay = document.getElementById('julian-date');
    new Pikaday({
        field: document.getElementById('datepicker'),
        format: 'YYYY-MM-DD',
        onSelect: function(date) {
            const julianDate = toJDEJulianDate(date);
            julianDisplay.textContent = `Fecha Juliana: ${julianDate}`;
        }
    });

    // Single date julian
    const gregoDisplay = document.getElementById('grego-date');
    document.getElementById('datejulian').addEventListener('change', function(e) {
      const myjulian=document.getElementById('datejulian').value;
      const mygrego=toGregoDate(myjulian);
      gregoDisplay.textContent = `Fecha Gregoriana: ${mygrego}`;
    
    });
    // File upload handling
    document.getElementById('csvFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const dates = e.target.result.split('\n');
                const results = processDateBatch(dates);
                displayResults(results);
            };
            reader.readAsText(file);
        }
    });
    document.getElementById('csvFileJul').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const juldates = e.target.result.split('\n');
                const results = processDateBatchJul(juldates);
                displayResultsJul(results);
            };
            reader.readAsText(file);
        }
    });
    
    // Manual input handling
    document.getElementById('convertBatch').addEventListener('click', function() {
        const dates = document.getElementById('batchDates').value.split('\n');
        const results = processDateBatch(dates);
        displayResults(results);
    });
    document.getElementById('convertBatchJul').addEventListener('click', function() {
        const juldates = document.getElementById('batchDatesJul').value.split('\n');
        console.log(juldates);
        const results = processDateBatchJul(juldates);
        displayResultsJul(results);
    });
    // Copy results
    document.getElementById('copyResults').addEventListener('click', function() {
        const results = Array.from(document.getElementById('resultsBody').rows)
            .map(row => Array.from(row.cells).map(cell => cell.textContent.trim()).join('\t'))
            .join('\n');
        navigator.clipboard.writeText(results);
        alert('Resultos copiados al clipboard!');
    });
    document.getElementById('copyResultsJul').addEventListener('click', function() {
        const results = Array.from(document.getElementById('resultsBodyJul').rows)
            .map(row => Array.from(row.cells).map(cell => cell.textContent.trim()).join('\t'))
            .join('\n');
        navigator.clipboard.writeText(results);
        alert('Resultos copiados al clipboard!');
    });
    
    // Download CSV
    document.getElementById('downloadCSV').addEventListener('click', function() {
        const results = Array.from(document.getElementById('resultsBody').rows)
            .map(row => ({
                originalDate: row.cells[0].textContent.trim(),
                julianDate: row.cells[1].textContent.trim(),
                status: row.cells[2].textContent.includes('✓') ? 'Ok' : 'error'
            }));
        downloadCSV(results);
    });
    document.getElementById('downloadCSVJul').addEventListener('click', function() {
        const results = Array.from(document.getElementById('resultsBodyJul').rows)
            .map(row => ({
                originalDate: row.cells[0].textContent.trim(),
                julianDate: row.cells[1].textContent.trim(),
                status: row.cells[2].textContent.includes('✓') ? 'Ok' : 'error'
            }));
        downloadCSV(results);
    });
});