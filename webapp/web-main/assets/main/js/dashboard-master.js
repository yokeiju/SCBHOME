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

        var raw = [
            { Id: 'p1', ProjectName: 'OCIR', PlatformId: 'P01', URL: 'scbocir-dev.eaciit.com/live/dashboard/default', Username: '', Password: '' },
            { Id: 'p2', ProjectName: 'IKEA', PlatformId: 'P01', URL: 'scbikea.eaciit.com/dashboard/default', Username: '', Password: '' },
            { Id: 'p3', ProjectName: 'Super Connect 5', PlatformId: 'P01', URL: 'http://www.superconnect5.com/admin/dashboard/default', Username: '', Password: '' },
            { Id: 'p4', ProjectName: 'BEF', PlatformId: 'P01', URL: 'http://scb-bef.eaciitapp.com/dashboard/default', Username: '', Password: '' },
            { Id: 'p5', ProjectName: 'Sales Perf Dashboard', PlatformId: 'P02', URL: 'https://cbi.exellerator.io/dashboard/default', Username: '', Password: '' },
            { Id: 'p6', ProjectName: 'Mobile Money', PlatformId: 'P01', URL: 'http://scmm.eaciit.com/dashboard/default', Username: '', Password: '' },
            { Id: 'p7', ProjectName: 'TWIST', PlatformId: 'P02', URL: 'https://twist.exellerator.io/', Username: '', Password: '' },
            { Id: 'p8', ProjectName: 'FMI', PlatformId: 'P02', URL: 'https://fmi.exellerator.io', Username: '', Password: '' },
            { Id: 'p9', ProjectName: 'FMI Dev', PlatformId: 'P04', URL: 'http://fmidev.eaciitapp.com', Username: '', Password: '' },
        ]
        var data = _.sortBy(raw.map(function (d) {
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