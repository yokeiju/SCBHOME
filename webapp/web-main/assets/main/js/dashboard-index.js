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
    dashboard.registerSearchEvent()
    dashboard.getMasterPlatformData(function () {
        dashboard.getPageData()
    })
})
