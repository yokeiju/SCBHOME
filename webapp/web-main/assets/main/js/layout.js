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

viewModel.randomString = function (len) {
    var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

viewModel.convertHexToRGBA = function (hex, alpha) {
    alpha = alpha || 1
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        var c = hex.substring(1).split('');
        if(c.length == 3){
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255, alpha].join(',')+')';
    }

    return hex
}

window.normalizeData = viewModel.normalizeData
window.ajaxPost = viewModel.ajaxPost 

viewModel.registerSidebarToggle = function () {
    $('.layout-sidebar .navbar-nav li a.toggler').on('click', function () {
        if ($('body').hasClass('close-sidebar')) {
            $('body').removeClass('close-sidebar')
        } else {
            $('body').addClass('close-sidebar')
        }
    })
}

$(function () {
    viewModel.registerSidebarToggle()
})