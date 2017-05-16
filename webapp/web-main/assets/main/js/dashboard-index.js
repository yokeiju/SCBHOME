var dashboard = {};
viewModel.dashboard = dashboard

dashboard.showrow = function(){
    $("#panel1").show();
    $("#panel2").hide();    
};

dashboard.showlist = function(){
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

dashboard.dataPage = ko.observableArray([])
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

dashboard.open = function (url) {
    return function () {
        location.href = url
    }
}

dashboard.data = [
    {
        "TitleProject":"Project 1",
        "SubProject":"Exellerator",
        "LinkUrl":"#",
        "ColorSubProject":"#00b0f0"
    },
    {
        "TitleProject":"Project 1",
        "SubProject":"UAT",
        "LinkUrl":"#",
        "ColorSubProject":"#23c6c8"
    },
    {
        "TitleProject":"Project 1",
        "SubProject":"EACIIT",
        "LinkUrl":"#",
        "ColorSubProject":"#ff9966"
    },
    {
        "TitleProject":"Project 1",
        "SubProject":"Development",
        "LinkUrl":"#",
        "ColorSubProject":"#666699"
    },
        {
        "TitleProject":"Project 2",
        "SubProject":"Exellerator",
        "LinkUrl":"#",
        "ColorSubProject":"#00b0f0"
    },
    {
        "TitleProject":"Project 2",
        "SubProject":"EACIIT",
        "LinkUrl":"#",
        "ColorSubProject":"#ff9966"
    },
    {
        "TitleProject":"Project 2",
        "SubProject":"Development",
        "LinkUrl":"#",
        "ColorSubProject":"#666699"
    },
        {
        "TitleProject":"Project 3",
        "SubProject":"Exellerator",
        "LinkUrl":"#",
        "ColorSubProject":"#00b0f0"
    },
    {
        "TitleProject":"Project 3",
        "SubProject":"EACIIT",
        "LinkUrl":"#",
        "ColorSubProject":"#ff9966"
    },
    {
        "TitleProject":"Project 3",
        "SubProject":"Development",
        "LinkUrl":"#",
        "ColorSubProject":"#666699"
    },

]

data = dashboard.data
databaru = [];
_.each(_.groupBy(data, "TitleProject"), function (v, i) {
    datatmp = []
    _.each(_.groupBy(v, "ColorSubProject"), function(vv,ii){
        datatmp.push(vv[0])
    })
    databaru.push({"data": datatmp})
})

$(function() {
    $("#panel1").show();
    $("#panel2").hide();
});


$(function () {
    dashboard.getMasterPlatformData(function () {
        dashboard.getPageData()
    })
})
