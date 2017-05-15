viewModel.title = ko.observable('')
viewModel.title.subscribe(function (value) {
    jQuery('title').text(value)
})
viewModel.title('SCB Home')
viewModel.isLoading = ko.observable(false)

viewModel.normalizeData = function (e, dateOrStr) {
    if (dateOrStr == undefined) {
        dateOrStr = 'date'
    }

    Object.keys(e).forEach(function (k) {
        if (typeof e[k] == 'string' && e[k] != null && e[k] != undefined) {
            if (e[k].indexOf('/Date') >= 0) {
                var dt = (dateOrStr == 'str') ? jsonDateStr(e[k]) : jsonDate(e[k])
                e[k] = dt
            }
        } else if (typeof e[k] == 'object') {
            e[k] = normalizeData(e[k])
        } 
    })

    return e
}
viewModel.ajaxPost = function (url, data, callbackOK, callbackNope) {
    if (typeof data === 'undefined') data = {}
    if (typeof callbackOK === 'undefined') callbackOK = {}
    if (typeof callbackNope === 'undefined') callbackNope = {}

    return $.ajax({
        url: url,
        type: 'POST',
        data: ko.mapping.toJSON(data),
        contentType: 'application/json charset=utf-8',
        success: function (data) {
            callbackOK(data)
        },
        error: function (error) {
            if (typeof callbackNope !== 'function') {
                alert('There was an error posting the data to the server: ' + error.responseText)
                return
            }

            callbackNope(error)
        }
    })
}

window.normalizeData = viewModel.normalizeData
window.ajaxPost = viewModel.ajaxPost 
