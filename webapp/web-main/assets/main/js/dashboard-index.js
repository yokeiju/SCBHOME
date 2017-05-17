var dashboard = {};
viewModel.dashboard = dashboard

dashboard.showRow = function(){
    $("#panel1").show();
    $("#panel2").hide();    
};

dashboard.showList = function(){
    $("#panel1").hide();
    $("#panel2").show();    
}

dashboard.dataMasterPlatform = ko.observableArray([])
dashboard.getMasterPlatformData = function (callback) {
    viewModel.isLoading(true)

    ajaxPost('/web/dashboard/getmasterplatform', {}, function (res) {
        if (res.Status !== 'OK') {
            swal("Login Failed!", res.Message, "error")
            return
        }

        dashboard.dataMasterPlatform(res.Data)
        callback()
    }, function () {
        viewModel.isLoading(false)
        swal("Login Failed!", "Unknown error, please try again", "error")
    })
}

dashboard.searchKeyword = ko.observable('')
dashboard.dataPage = ko.observableArray([])
dashboard.dataPageFiltered = ko.computed(function () {
    if (dashboard.searchKeyword() == '') {
        return dashboard.dataPage()
    }

    return dashboard.dataPage().filter(function (d) {
        var keyword = _.lowerCase(dashboard.searchKeyword())
        var cond1 = _.lowerCase(d.ProjectName).indexOf(keyword) > -1
        var cond2 = _.lowerCase(d.PlatformName).indexOf(keyword) > -1

        return cond1 || cond2
    })
}, dashboard)
dashboard.dataPageBoxFiltered = ko.computed(function () {
    var data = dashboard.dataPageFiltered()
    var result = []
    
    _.each(_.groupBy(data, "ProjectName"), function (v, i) {
        datatmp = []
        _.each(_.groupBy(v, "Color"), function(vv, ii) {
            datatmp.push(vv[0])
        })
        result.push({"data": datatmp})
    })

    return result
})

dashboard.getPageData = function (callback) {
    viewModel.isLoading(true)

    ajaxPost('/web/dashboard/getpage', {}, function (res) {
        viewModel.isLoading(false)
        if (res.Status !== 'OK') {
            swal("Login Failed!", res.Message, "error")
            return
        }

        var data = _.sortBy(res.Data.map(function (d) {
            var platform = dashboard.dataMasterPlatform().find(function (e) { 
                return e.Id == d.PlatformId
            })
            if (typeof platform !== 'undefined') {
                d.Color = platform.Color
                d.PlatformName = platform.Name
            }

            if (d.URL.indexOf('http') !== 0) {
                d.URL = 'http://' + d.URL
            }

            return d
        }), 'ProjectName')
        dashboard.dataPage(data)
    }, function () {
        viewModel.isLoading(false)
        swal("Login Failed!", "Unknown error, please try again", "error")
    })
}

dashboard.registerSearchEvent = function () {
    $('.search-box .search').on('keyup', _.debounce(function () {
        var text = $(this).val()
        dashboard.searchKeyword(text)
    }, 300))
}

dashboard.open = function (url) {
    return function () {
        window.open(url, '_blank')
    }
}

$(function () {
    dashboard.registerSearchEvent()
    dashboard.getMasterPlatformData(function () {
        dashboard.getPageData()
    })
})
