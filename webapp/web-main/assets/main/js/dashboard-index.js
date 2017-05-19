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
    row.Cover = ""
    row.Id = viewModel.randomString(32)
    row.ProjectName = ""
    row.Description = ""
    return row
}
dashboard.newPagePlatformObject = function () {
    var row = {}
    row.PlatformId = ""
    row.PlatformName = ""
    row.URL = ""
    row.Username = ""
    row.Password = ""
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
        return cond1
    })
}, dashboard)

dashboard.getPageData = function (callback) {
    viewModel.isLoading(true)

    ajaxPost('/web/dashboard/getpage', {}, function (res) {
        viewModel.isLoading(false)
        if (res.Status !== 'OK') {
            swal("Login Failed!", res.Message, "error")
            return
        }

        var data = _.sortBy(res.Data.map(function (d) {
            d.Platforms = dashboard.dataMasterPlatform().map(function (e) {
                var eachPlatform = d.Platforms.find(function (f) {
                    return f.PlatformId === e.Id
                })
                if (eachPlatform === undefined) {
                    eachPlatform = dashboard.newPagePlatformObject()
                    eachPlatform.PlatformId = e.Id
                    eachPlatform.PlatformName = e.Name
                }

                if (eachPlatform.URL === '') {
                    // eachPlatform.URL = '#'
                } else if (eachPlatform.URL.indexOf('http') === -1) {
                    eachPlatform.URL = 'http://' + eachPlatform.URL
                }

                eachPlatform.Color = e.Color

                return eachPlatform
            })


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
        return false
    }
}
dashboard.openById = function (obj) {
    var id = $(obj).attr('data-id')
    var row = dashboard.dataPage().find(function (d) {
        return d.Id === id
    })

    if (row === undefined) {
        return
    }

    dashboard.open(row.URL)()
}

$(function () {
    dashboard.registerSearchEvent()
    dashboard.getMasterPlatformData(function () {
        dashboard.getPageData()
    })
    dashboard.mode('list')
})
