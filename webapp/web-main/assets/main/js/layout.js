
function normalizeData(e, dateOrStr) {
    if (dateOrStr == undefined) {
        dateOrStr = 'date';
    }

    Object.keys(e).forEach(function (k) {
        if (typeof e[k] == 'string' && e[k] != null && e[k] != undefined) {
            if (e[k].indexOf('/Date') >= 0) {
                var dt = (dateOrStr == 'str') ? jsonDateStr(e[k]) : jsonDate(e[k]);
                e[k] = dt;
            }
        } else if (typeof e[k] == 'object') {
            e[k] = normalizeData(e[k]);
        }
    });

    return e;
}

function ajaxPost(url, data, callbackOK, callbackNope) {
    if (typeof data === 'undefined') data = {};
    if (typeof callbackOK === 'undefined') callbackOK = {};
    if (typeof callbackNope === 'undefined') callbackNope = {};

    return $.ajax({
        url: url,
        type: 'POST',
        data: ko.mapping.toJSON(data),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            data = normalizeData(data);
            callbackOK(data);
        },
        error: function (error) {
            if (typeof callbackNope !== 'function') {
                alert('There was an error posting the data to the server: ' + error.responseText);
                return
            }

            callbackNope(error);
        }
    });
}