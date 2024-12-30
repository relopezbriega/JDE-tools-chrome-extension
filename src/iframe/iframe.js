import { toJDEJulianDate, toGregoDate } from '../utils/julian-date.js'; 

let method = '';

// Batch processing functions
function processDateBatch(dates) {
    return dates.map(date => {

        try {
            if (method === 'fromJulian') { 
                const gregoDate = toGregoDate(date.trim());
            
                return {
                    originalDate: date.trim(),
                    julianDate: gregoDate,
                    status: 'Ok'
                };
            }
            if (method === 'fromGrego') {
                const julianDate = toJDEJulianDate(date.trim());
               
                return {
                    originalDate: date.trim(),
                    julianDate: julianDate,
                    status: 'Ok'
                };
            }
            
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


function downloadCSV(results) {
    const csvContent = [
        ['Original Date', 'Date Converted', 'Status'],
        ...results.map(r => [r.originalDate, r.julianDate, r.status])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Dates_converted.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() { 
    
    method = document.getElementById('convert-method').value;
   

    document.getElementById('convert-method').addEventListener('change', function(e) {
        method = e.target.value;
    
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
    
    // Manual input handling
    document.getElementById('convertBatch').addEventListener('click', function() {
        const dates = document.getElementById('batchDates').value.split('\n');
        
        const results = processDateBatch(dates);
        
        displayResults(results);
    });

    // Copy results
    document.getElementById('copyResults').addEventListener('click', function() {
        const results = Array.from(document.getElementById('resultsBody').rows)
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
    
});