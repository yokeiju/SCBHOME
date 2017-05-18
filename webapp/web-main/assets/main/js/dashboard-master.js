var dashboard = {}
viewModel.dashboard = dashboard

dashboard.dataMasterPlatform = ko.observableArray([])
dashboard.checkedData = ko.observableArray([])
dashboard.inputMasterMap = ko.observable()
dashboard.inputMaster = {
    Id: "",
    ProjectName: "",
    Description: "",
    Platforms:[],
}

dashboard.ListPlatforms = {
        PlatformId :"", 
        PlatformName : "", 
        URL : "", 
        Username : "", 
        Password : "",
}

dashboard.getMasterPlatformData = function (callback) {
    viewModel.isLoading(true)

    ajaxPost('/web/dashboard/getmasterplatform', {}, function (res) {
        if (res.Status !== 'OK') {
            swal("Error!", res.Message, "error")
            return
        }

        dashboard.dataMasterPlatform(res.Data)


        callback()
    }, function () {
        viewModel.isLoading(false)
        swal("Error!", "Unknown error, please try again", "error")
    })
}

dashboard.dataPage = ko.observableArray([])
dashboard.getPageData = function (callback) {
    viewModel.isLoading(true)

    ajaxPost('/web/dashboard/getpage', {}, function (res) {
        if (res.Status !== 'OK') {
            swal("Error!", res.Message, "error")
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

            // if (d.URL.indexOf('http') !== 0) {
            //     d.URL = 'http://' + d.URL
            // }

            return d
        }), 'ProjectName')
        dashboard.dataPage(data)

        callback()
    }, function () {
        viewModel.isLoading(false)
        swal("Error!", "Unknown error, please try again", "error")
    })
}

dashboard.refresh = function () {
    var data = dashboard.dataPage()

    if (typeof $('.grid').data('kendoGrid') !== 'undefined') {
        $('.grid').data('kendoGrid').setDataSource(new kendo.data.DataSource({
            data: data,
            pageSize: 100
        }))
        return
    }

    var columns = [
        { field: 'ProjectName', title: 'Project Name', width: 200 },
        { field: 'Description' },
    ]
    var columnPlatforms = dashboard.dataMasterPlatform().map(function (d) {
        return {
            width: 96,
            attributes: { class: 'align-center' },
            headerTemplate: function () {
                return '<div class="align-center">' + d.Name + '</div>'
            },
            template: function (e) {
                var row = e.Platforms.find(function (k) {
                    return k.PlatformId === d.Id
                })
                if (row !== undefined) {
                    if ($.trim(row.URL) !== '') {
                        return '<i class="fa fa-check"></i>'
                    }
                }

                return ''
            }
        }
    })
    columns = columns.concat([{ 
        headerTemplate: function () {
            return '<div class="align-center">Platform Availability</div>'
        },
        columns: columnPlatforms
    }, { 
        title: '&nbsp;', 
        width: 40, 
        template: function (d) {
            return '<input class="checkboxgrid" type="checkbox" id="checkbox-'+d.Id+'" onclick="dashboard.listcheck(\''+d.Id+'\')"/>'
        }, 
        attributes: { class: 'align-center' }
    }])

    $('.grid').kendoGrid({
        dataSource: {
            data: data,
            pageSize: 8
        },
        pageable: true,
        sortable: true,
        filterable: true,
        columns: columns
    })
}

dashboard.listcheck = function(idmaster){
    if($('#checkbox-'+idmaster).is(':checked')){
        dashboard.checkedData.push(idmaster)
    } else {
        var index = dashboard.checkedData().indexOf(idmaster);
        dashboard.checkedData().splice(index, 1);
    }
}

dashboard.editMaster = function () {
    if (dashboard.checkedData().length == 0 || dashboard.checkedData().length > 1) {
        swal("Error!", "Please choose one row", "error");
        return
    }

    $("#TitleModal").html("Edit");
    $("#TitleButtonModal").html("Update");
    var tempdata = _.find(dashboard.dataPage(),{Id:dashboard.checkedData()[0]});
    console.log(tempdata);
    $('#inputMaster').modal('show');
    dashboard.inputMasterMap(ko.mapping.fromJS(tempdata))
}

dashboard.deleteMaster = function(){
    if (dashboard.checkedData().length == 0) {
        swal("Error!", "Please choose at least one row", "error");
        return
    }

    swal({
        title: "Caution",
        text: "Are you sure want to delete this Data!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: false
    }, function () {
        setTimeout(function () {
            var url = "/web/dashboard/deletepage";
            var param = { Ids: dashboard.checkedData() }
            ajaxPost(url, param, function(data) {
                if (data.Status == "OK") {            
                    dashboard.checkedData([]);
                    dashboard.global();
                    swal("Deleted!", "Your Data has been deleted.", "success");
                } else {
                    swal("Error!", data.Message, "error");
                }
            });
        }, 400)
    });
}

dashboard.saveMaster = function() {
    console.log(ko.mapping.toJS(dashboard.inputMasterMap));
    var validator = $("#myForm").kendoValidator().data("kendoValidator")
    if (validator.validate()) {
        viewModel.isLoading(true);
        var url = "/web/dashboard/savepage";

        var param = ko.mapping.toJS(dashboard.inputMasterMap)
        ajaxPost(url, param, function(data) {
            if (data.Status == "OK") {
                swal("Saved!", "Your file has been successfully Update.", "success");
                dashboard.reset();
                dashboard.checkedData([]);
                dashboard.global();
                $('#inputMaster').modal('hide');
            } else {
                swal("Error!", data.Message, "error");
            }
        });
    }
}

dashboard.reset = function(){
    $("#TitleModal").html("Add Master");
    $("#TitleButtonModal").html("Save");
    dashboard.ListPlatforms =[];
    _.each(dashboard.dataMasterPlatform(), function(v,i) { 
        console.log(v.Id);
        dashboard.ListPlatforms.push({
            PlatformId :v.Id, 
            PlatformName : v.Name, 
            URL : "", 
            Username : "", 
            Password : "",
        });
    });
    dashboard.inputMaster.Platforms = dashboard.ListPlatforms;
    dashboard.inputMasterMap(ko.mapping.fromJS(dashboard.inputMaster))
}

dashboard.global = function(){
    dashboard.getMasterPlatformData(function() {
        dashboard.getPageData(function() {
            setTimeout(function() {
                viewModel.isLoading(false)
                dashboard.refresh()
            }, 1000)
        })
    })
}
$(function () {
    dashboard.global();
    
})