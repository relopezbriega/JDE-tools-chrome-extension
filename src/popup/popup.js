import { toJDEJulianDate, toGregoDate } from '../utils/julian-date.js';  // Import the julian-date.js file


document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const formatDate = today.toISOString().split('T')[0];
    const julianDisplay = document.getElementById('julian-date');
    const gregoDisplay = document.getElementById('grego-date');
    const julianDate = toJDEJulianDate(formatDate);
    const gregoDate = toGregoDate(julianDate);
    
    console.log(julianDate);
    
    julianDisplay.textContent = `Julian Date is: ${julianDate}`;
    gregoDisplay.textContent = `The Date is: ${gregoDate}`;

    document.getElementById('gregorian-date').value = formatDate;
    document.getElementById('juliana-date').value = julianDate;

    document.getElementById('gregorian-date').addEventListener('change', function(e) {
        const gregoDate = document.getElementById('gregorian-date').value;
        const julianDate = toJDEJulianDate(gregoDate);
        julianDisplay.textContent = `Julian Date is: ${julianDate}`;

    });

    document.getElementById('juliana-date').addEventListener('change', function(e) {
        const julianDate = document.getElementById('juliana-date').value;
        const gregoDate = toGregoDate(julianDate);

        console.log(julianDate);

        gregoDisplay.textContent = `The Date is: ${gregoDate}`;

    });

    document.getElementById('openDateIframe').addEventListener('click', (event) => {
        event.preventDefault();
    
        const width = 600;
        const height = 800;
        const left = screen.width/2;
        const top = 20;
    
        const popup = window.open(
            chrome.runtime.getURL('/src/iframe/iframe-date-converter.html'),
            'FloatingIframe',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes`
        );
    
        if (!popup) {
            alert('Allow popup windows for using this functionality.');
        }
    });

    document.getElementById('openDSIframe').addEventListener('click', (event) => {
        event.preventDefault();
    
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
    });

    
});


