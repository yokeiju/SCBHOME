var dashboard = {}
viewModel.dashboard = dashboard

dashboard.dataMasterPlatform = ko.observableArray([])
dashboard.checkeddata = ko.observableArray([])
dashboard.inputmaster = {
    Id:ko.observable(""),
    ProjectName:ko.observable(""),
    PlatformId:ko.observable(""),
    URL:ko.observable(""),
}
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
                return '<input class="checkboxgrid" type="checkbox" id="checkbox-'+d.Id+'" onclick="dashboard.listcheck(\''+d.Id+'\')"/>'
            }, attributes: { class: 'align-center' } },
        ]
    })
}

dashboard.listcheck = function(idmaster){
    if($('#checkbox-'+idmaster).is(':checked')){
        dashboard.checkeddata.push(idmaster)
    } else {
        var index = dashboard.checkeddata().indexOf(idmaster);
        dashboard.checkeddata().splice(index, 1);
    }
}

dashboard.editMaster = function(){
    if(dashboard.checkeddata().length == 1){
        $("#TitleModal").html("Edit");
        $("#TitleButtonModal").html("Update");
        var tempdata = _.find(dashboard.dataPage(),{Id:dashboard.checkeddata()[0]});
        $('#inputMaster').modal('show');
        dashboard.inputmaster.Id(tempdata.Id);
        dashboard.inputmaster.ProjectName(tempdata.ProjectName);
        dashboard.inputmaster.PlatformId(tempdata.PlatformId);
        dashboard.inputmaster.URL(tempdata.URL);
    } else {
         swal("Error!", "Please choose only one !!!", "error");
    }   
}

dashboard.deleteMaster = function(){
    if(dashboard.checkeddata().length != 0){
        swal({
            title: "Are you sure?",
            text: "You want to Deleted this Data!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
        function(){
            var url = "/web/dashboard/deletepage";

            var param = {
            Ids: dashboard.checkeddata(),
            }

            ajaxPost(url, param, function(data) {
                if (data.Status == "OK") {            
                    dashboard.checkeddata([]);
                    dashboard.global();
                    swal("Deleted!", "Your Data has been deleted.", "success");
                } else {
                    swal("Error!", data.Message, "error");
                }
            });           
        });
    }
}

dashboard.saveMaster = function() {
        viewModel.isLoading(true);
        var url = "/web/dashboard/savepage";

        if (dashboard.inputmaster.Id() == "") {
            var idmaster = "";
        } else {
            var idmaster = dashboard.inputmaster.Id();
        }

        var param = {
            Id: idmaster,
            ProjectName: dashboard.inputmaster.ProjectName(),
            PlatformId: dashboard.inputmaster.PlatformId(),
            URL: dashboard.inputmaster.URL(),
        }

        ajaxPost(url, param, function(data) {
            if (data.Status == "OK") {
                swal("Saved!", "Your file has been successfully Update.", "success");
                dashboard.reset();
                dashboard.checkeddata([]);
                dashboard.global();
                $('#inputMaster').modal('hide');
            } else {
                swal("Error!", data.Message, "error");
            }

        });
}

dashboard.reset = function(){
    dashboard.inputmaster.Id("");
    dashboard.inputmaster.ProjectName("");
    dashboard.inputmaster.PlatformId("");
    dashboard.inputmaster.URL("");
    $("#platform").val("").data("kendoDropDownList").text("");
    $("#TitleModal").html("Add Master");
    $("#TitleButtonModal").html("Save");
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