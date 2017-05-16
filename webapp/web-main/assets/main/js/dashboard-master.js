var dashboard = {}
viewModel.dashboard = dashboard

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

dashboard.dataPage = ko.observableArray([])
dashboard.getPageData = function (callback) {
    viewModel.isLoading(true)

    ajaxPost('/web/dashboard/getpage', {}, function (res) {
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

        callback()
    }, function () {
        viewModel.isLoading(false)
        swal("Login Failed!", "Unknown error, please try again", "error")
    })
}

dashboard.refresh = function () {
    var data = dashboard.dataPage()

    if (typeof $('.grid').data('kendoGrid') !== 'undefined') {
        $('.grid').data('kendoGrid').setDataSource(new kendo.data.DataSource({
            data: data
        }))
        return
    }

    $('.grid').kendoGrid({
        dataSource: {
            data: data,
            pageSize: 100
        },
        pageable: true,
        sortable: true,
        filterable: true,
        columns: [
            { field: 'ProjectName', title: 'Project Name' },
            { title: 'Platform', template: function (d) {
                return '<span class="notify-color" style="background-color: ' + d.Color + '">&nbsp;</span>' + d.PlatformName
            }, width: 150 },
            { field: 'URL', title: 'URL Address' },
            { title: '&nbsp;', width: 120, template: function (d) {
                return '<a target="_blank" href="' + d.URL + '" class="notify-link label label-success"><i class="fa fa-share-square"></i>&nbsp; Open in New Tab</a>'
            }, attributes: { class: 'align-center' } },
            { title: '&nbsp;', width: 30, template: function (d) {
                return '<input type="checkbox" />'
            }, attributes: { class: 'align-center' } },
        ]
    })
}

$(function () {
    dashboard.getMasterPlatformData(function () {
        dashboard.getPageData(function () {
            setTimeout(function () {
                viewModel.isLoading(false)
                dashboard.refresh()
            }, 1000)
        })
    })
})