String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

function round(value, precision, mode) {

    var m, f, isHalf, sgn;
    precision |= 0;
    m = Math.pow(10, precision);
    value *= m;
    sgn = (value > 0) | -(value < 0);
    isHalf = value % 1 === 0.5 * sgn;
    f = Math.floor(value);

    if (isHalf) {
        switch (mode) {
            case 'PHP_ROUND_HALF_DOWN':
                value = f + (sgn < 0);
                break;
            case 'PHP_ROUND_HALF_EVEN':
                value = f + (f % 2 * sgn);
                break;
            case 'PHP_ROUND_HALF_ODD':
                value = f + !(f % 2);
                break;
            default:
                value = f + (sgn > 0);
        }
    }

    return (isHalf ? value : Math.round(value)) / m;
}

function round_up(val, precision) {
    power = Math.pow(10, precision);
    poweredVal = Math.ceil(val * power);
    result = poweredVal / power;

    return result;
}

function round_down(val, precision) {
    power = Math.pow(10, precision);
    poweredVal = Math.floor(val * power);
    result = poweredVal / power;

    return result;
}

function getJsonObjectByKeyValue(json, key, value) {
    var obj;
    $$.each(json, function(i, v) {
        if (v[key] === value) {
            obj = v;
            return;
        }
    });
    return obj;
}

function getObjectValueByKeyValue(object, key, value, targetKey) {
    var obj;
    $$.each(object, function(i, v) {
        $$.each(object[i], function(i2, v2) {
            if (v2[key] === value) {
                obj = v2;
                return;
            }
        });
    });
    return obj[targetKey];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimal) {
    return (Math.random() * (max - min) + min).toFixed(decimal);
}

function getRandomString(x) {
    var s = "";
    while (s.length < x && x > 0) {
        var r = Math.random();
        s += (r < 0.1 ? Math.floor(r * 100) : String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97 : 65)));
    }
    return s;
}

function getRandomAlphaNum(len) {
    var rdmString = "";
    for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
    return rdmString.substr(0, len);

}

function getRandomBoolean() {
    return Math.floor((Math.random() * 2) + 1) === 1;
}

function getRandomArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomTime() {
    var date = new Date();
    date.setHours(getRandomInt(0, 23));
    date.setMinutes(getRandomInt(0, 59));
    return date;
}

function getArrMax(arr) {
    return Math.max.apply(Math, arr);
}

function getArrMin(arr) {
    return Math.min.apply(Math, arr);
}

function shuffleArray(arr) {
    return arr.sort(function() {
        return Math.random() - 0.5;
    });
}

function getObjectArraySmallest(objArr, key) {
    var smallest = Number.MAX_SAFE_INTEGER;
    for (var prop in objArr) {
        if (objArr.hasOwnProperty(prop)) {
            if (objArr[prop][key] < smallest) {
                smallest = objArr[prop][key];
            }
        }
    }
    return smallest;
}

function getObjectArrayLargest(objArr, key) {
    var largest = Number.MIN_SAFE_INTEGER;
    for (var prop in objArr) {
        if (objArr.hasOwnProperty(prop)) {
            if (objArr[prop][key] > largest) {
                largest = objArr[prop][key];
            }
        }
    }
    return largest;
}

function getArraySmallest(arr) {
    var smallest = Number.MAX_SAFE_INTEGER;
    for (i = 0; i < arr.length; i++) {
        if (arr[i] < smallest) {
            smallest = arr[i];
        }
    }
    return smallest;
}

function getArrayLargest(arr) {
    var largest = Number.MIN_SAFE_INTEGER;
    for (i = 0; i < arr.length; i++) {
        if (arr[i] > largest) {
            largest = arr[i];
        }
    }
    return largest;
}

function getLastObjectArray(objArr, key) {
    return objArr[getObjectSize(objArr) - 1][key];
}

function getDecimalPlaces(numStr) {
    numStr = numStr.toString();
    var pieces = numStr.split(".");
    return pieces[1].length;
}

function getObjectSize(obj) {
    var count = 0;
    for (var property in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, property)) {
            count++;
        }
    }
    return count;
}

/*Object.prototype.getKeyByValue = function(value) {
  return
    value = value.toString().toLowerCase();
    for (var prop in this) {
        if (this.hasOwnProperty(prop)) {
            this[prop] = this[prop].toString().toLowerCase();
            if (this[prop] === value)
                return prop;
        }
    }
};*/

function isToday(td) {
    var d = new Date();
    td = new Date(td);
    return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

Number.prototype.padLeft = function(n, str) {
    return (this < 0 ? '-' : '') +
        Array(n - String(Math.abs(this)).length + 1)
        .join(str || '0') +
        (Math.abs(this));
};

function getFormatTime(d) {
    var date;
    if (typeof(d) === 'object') {
        date = d;
    } else {
        date = new Date(d.toString().replace(/-/g, '/').replace('T', ' ').replace(/(\..*|\+.*)/, ""));

    }
    var h = date.getHours();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    var m = date.getMinutes();
    return h + ':' + m.padLeft(2) + ' ' + ampm;
}

function dateFromString(str) {
    return new Date(str.toString().replace(/-/g, '/').replace('T', ' ').replace(/(\..*|\+.*)/, ""));
}

function getFormattedDate(date, format) {
    if (typeof(date) !== 'object') {
        date = dateFromString(date);
    }
    var todayTime = date;
    var month = todayTime.getMonth() + 1;
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    switch (format) {
        case 'ymd-':
            return year + "-" + month.padLeft(2) + "-" + day.padLeft(2);
        case 'ymd':
            return year + "/" + month.padLeft(2) + "/" + day.padLeft(2);
        case 'dmy-':
            return day.padLeft(2) + "-" + month.padLeft(2) + "-" + year;
        case 'dmyhm':
            return day.padLeft(2) + "-" + month.padLeft(2) + "-" + year.toString().substr(2, 2) + ' ' + getFormatTime(date);
        default:
            return day.padLeft(2) + "/" + month.padLeft(2) + "/" + year;
    }
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isEmail(email) {
    return email.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
}

function isUrl(url) {
    return url.match(/^https?:\/\//i);
}

function isBase64(string) {
    return string.match(/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/);
}

function isAlphanumeric(string) {
    return string.match(/^[a-zA-Z0-9]+$/);
}

function isEmpty(str) {
    return str === undefined ? true : !str.replace(/^\s+/g, '').length; // boolean (`true` if field is empty)
}


function getDateString(newDate) {
    var now = new Date(newDate);

    var dayArray = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

    var monthArray = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

    var date = ((now.getDate() < 10) ? "0" : "") + now.getDate();

    today = dayArray[now.getDay()] + ", " + monthArray[now.getMonth()] + " " + date + ", " + (fourdigits(now.getYear()));

    return today;
}

function fourdigits(number) {
    return (number < 1000) ? number + 1900 : number;
}

var Base64 = {
    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
                Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = Base64._keyStr.indexOf(input.charAt(i++));
            enc2 = Base64._keyStr.indexOf(input.charAt(i++));
            enc3 = Base64._keyStr.indexOf(input.charAt(i++));
            enc4 = Base64._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }
        return string;
    }
};

function tableToJson() {
    (function($) {
        'use strict';

        $.fn.tableToJSON = function(opts) {

            // Set options
            var defaults = {
                ignoreColumns: [],
                onlyColumns: null,
                ignoreHiddenRows: true,
                headings: null,
                allowHTML: false
            };
            opts = $.extend(defaults, opts);

            var notNull = function(value) {
                return value !== undefined && value !== null;
            };

            var ignoredColumn = function(index) {
                if (notNull(opts.onlyColumns)) {
                    return $.inArray(index, opts.onlyColumns) === -1;
                }
                return $.inArray(index, opts.ignoreColumns) !== -1;
            };

            var arraysToHash = function(keys, values) {
                var result = {},
                    index = 0;
                $.each(values, function(i, value) {
                    // when ignoring columns, the header option still starts
                    // with the first defined column
                    if (index < keys.length && notNull(value)) {
                        result[keys[index]] = value;
                        index++;
                    }
                });
                return result;
            };

            var cellValues = function(cellIndex, cell) {
                var value, result;
                if (!ignoredColumn(cellIndex)) {
                    var override = $(cell).data('override');
                    if (opts.allowHTML) {
                        value = $.trim($(cell).html());
                    } else {
                        value = $.trim($(cell).text());
                    }
                    result = notNull(override) ? override : value;
                }
                return result;
            };

            var rowValues = function(row) {
                var result = [];
                $(row).children('td,th').each(function(cellIndex, cell) {
                    if (!ignoredColumn(cellIndex)) {
                        result.push(cellValues(cellIndex, cell));
                    }
                });
                return result;
            };

            var getHeadings = function(table) {
                var firstRow = table.find('tr:first').first();
                return notNull(opts.headings) ? opts.headings : rowValues(firstRow);
            };

            var construct = function(table, headings) {
                var i, j, len, len2, txt, $row, $cell,
                    tmpArray = [],
                    cellIndex = 0,
                    result = [];
                table.children('tbody,*').children('tr').each(function(rowIndex, row) {
                    if (rowIndex > 0 || notNull(opts.headings)) {
                        $row = $(row);
                        if ($row.is(':visible') || !opts.ignoreHiddenRows) {
                            if (!tmpArray[rowIndex]) {
                                tmpArray[rowIndex] = [];
                            }
                            cellIndex = 0;
                            $row.children().each(function() {
                                if (!ignoredColumn(cellIndex)) {
                                    $cell = $(this);

                                    // process rowspans
                                    if ($cell.filter('[rowspan]').length) {
                                        len = parseInt($cell.attr('rowspan'), 10) - 1;
                                        txt = cellValues(cellIndex, $cell, []);
                                        for (i = 1; i <= len; i++) {
                                            if (!tmpArray[rowIndex + i]) {
                                                tmpArray[rowIndex + i] = [];
                                            }
                                            tmpArray[rowIndex + i][cellIndex] = txt;
                                        }
                                    }
                                    // process colspans
                                    if ($cell.filter('[colspan]').length) {
                                        len = parseInt($cell.attr('colspan'), 10) - 1;
                                        txt = cellValues(cellIndex, $cell, []);
                                        for (i = 1; i <= len; i++) {
                                            // cell has both col and row spans
                                            if ($cell.filter('[rowspan]').length) {
                                                len2 = parseInt($cell.attr('rowspan'), 10);
                                                for (j = 0; j < len2; j++) {
                                                    tmpArray[rowIndex + j][cellIndex + i] = txt;
                                                }
                                            } else {
                                                tmpArray[rowIndex][cellIndex + i] = txt;
                                            }
                                        }
                                    }
                                    // skip column if already defined
                                    while (tmpArray[rowIndex][cellIndex]) {
                                        cellIndex++;
                                    }
                                    if (!ignoredColumn(cellIndex)) {
                                        txt = tmpArray[rowIndex][cellIndex] || cellValues(cellIndex, $cell, []);
                                        if (notNull(txt)) {
                                            tmpArray[rowIndex][cellIndex] = txt;
                                        }
                                    }
                                }
                                cellIndex++;
                            });
                        }
                    }
                });
                $.each(tmpArray, function(i, row) {
                    if (notNull(row)) {
                        txt = arraysToHash(headings, row);
                        result[result.length] = txt;
                    }
                });
                return result;
            };

            // Run
            var headings = getHeadings(this);
            return construct(this, headings);
        };
    })(jQuery);

    $('#convert-table').click(function() {
        var table = $('#example-table').tableToJSON(); // Convert the table into a javascript object
        console.log(table);
        var json = JSON.stringify(table);
        var res = document.getElementById("res");
        res.value = json;
    });
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function getGUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-315r-' + s4() + '-810m-' + s4() + s4() + s4();
}

String.format = function() {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = arguments[0];

    // start with the second argument (i = 1)
    for (var i = 1; i < arguments.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }

    return theString;
};

String.formatArray = function() {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = arguments[0];

    // start with the second argument (i = 1)
    var array = arguments[1].split(',');
    for (var i = 0; i < array.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i) + "\\}", "gm");
        if (array[i] === '1') {
            theString = theString.replace(regEx, LANG[localStorage.main_lang]['data_status']['1']);
        } else if (array[i] === '2') {
            theString = theString.replace(regEx, LANG[localStorage.main_lang]['data_status']['2']);
        } else if (array[i] === 'APPROVED' || array[i] === '3') {
            theString = theString.replace(regEx, LANG[localStorage.main_lang]['data_status']['3']);
        } else if (array[i] === 'REJECT' || array[i] === '4') {
            theString = theString.replace(regEx, LANG[localStorage.main_lang]['data_status']['4']);
        } else if (array[i] === 'PENDING' || array[i] === 'WAITING' || array[i] === '5') {
            theString = theString.replace(regEx, LANG[localStorage.main_lang]['data_status']['5']);
        } else {
            theString = theString.replace(regEx, array[i]);
        }
    }

    return theString;
};

function getBracketWord(text) {
    try {
        return text.match(/\(([^)]+)\)/)[1];
    } catch (Exception) {
        return '---';
    }
}
