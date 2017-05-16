var dashboard = {}
viewModel.dashboard = dashboard

dashboard.listOfPlatforms = ko.observableArray([
    { _id: 'P01', Name: 'EACIIT App', Color: '#e67e22' },
    { _id: 'P02', Name: 'Exellerator', Color: '#2980b9' },
    { _id: 'P03', Name: 'UAT', Color: '#27ae60' },
    { _id: 'P04', Name: 'Development', Color: '#666699' }
])

dashboard.refresh = function () {
    var data = [
        { _id: 'p1', ProjectName: 'OCIR', PlatformId: 'P01', URL: 'scbocir-dev.eaciit.com/live/dashboard/default', Username: '', Password: '' },
        { _id: 'p2', ProjectName: 'IKEA', PlatformId: 'P01', URL: 'scbikea.eaciit.com/dashboard/default', Username: '', Password: '' },
        { _id: 'p3', ProjectName: 'Super Connect 5', PlatformId: 'P01', URL: 'http://www.superconnect5.com/admin/dashboard/default', Username: '', Password: '' },
        { _id: 'p4', ProjectName: 'BEF', PlatformId: 'P01', URL: 'http://scb-bef.eaciitapp.com/dashboard/default', Username: '', Password: '' },
        { _id: 'p5', ProjectName: 'Sales Perf Dashboard', PlatformId: 'P02', URL: 'https://cbi.exellerator.io/dashboard/default', Username: '', Password: '' },
        { _id: 'p6', ProjectName: 'Mobile Money', PlatformId: 'P01', URL: 'http://scmm.eaciit.com/dashboard/default', Username: '', Password: '' },
        { _id: 'p7', ProjectName: 'TWIST', PlatformId: 'P02', URL: 'https://twist.exellerator.io/', Username: '', Password: '' },
        { _id: 'p8', ProjectName: 'FMI', PlatformId: 'P02', URL: 'https://fmi.exellerator.io', Username: '', Password: '' },
        { _id: 'p9', ProjectName: 'FMI Dev', PlatformId: 'P04', URL: 'http://fmidev.eaciitapp.com', Username: '', Password: '' },
    ]

    data = _.sortBy(data.map(function (d) {
        var platform = dashboard.listOfPlatforms().find(function (e) { 
            return e._id == d.PlatformId
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
    dashboard.refresh()
})