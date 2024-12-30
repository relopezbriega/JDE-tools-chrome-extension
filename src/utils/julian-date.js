// Date conversion functions
export function toJDEJulianDate(date) {
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

export function toGregoDate(myJul) {
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

