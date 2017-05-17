var dashboard = {};
viewModel.dashboard = dashboard

dashboard.mode = ko.observable('box')

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
dashboard.newPageObject = function () {
    var row = {}
    row.Color = ""
    row.Cover = ""
    row.Id = viewModel.randomString(32)
    row.Password = ""
    row.PlatformId = ""
    row.PlatformName = ""
    row.ProjectName = ""
    row.URL = ""
    row.PlatformName = ""
    row.ProjectName = ""
    row.URL = ""
    row.Username = ""
    return row
}
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

    var grouped = _.groupBy(data, "ProjectName")
    var result = Object.keys(grouped).map(function (d) {
        var row = {}
        row.ProjectName = d
        row.Data = grouped[d].slice(0)

        dashboard.dataMasterPlatform().forEach(function (d) {
            var isFound = row.Data.filter(function (k) {
                return k.PlatformId === d.Id
            }).length > 0
            if (!isFound) {
                var fakePage = dashboard.newPageObject()
                fakePage.PlatformId = d.Id
                fakePage.PlatformName = d.Name
                fakePage.Color = d.Color
                fakePage.ProjectName = d
                fakePage.IsFake = true
                row.Data.push(fakePage)
            }
        })

        row.Data = _.sortBy(row.Data, 'PlatformName')
        return row
    })

    return _.sortBy(result, 'ProjectName')
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
