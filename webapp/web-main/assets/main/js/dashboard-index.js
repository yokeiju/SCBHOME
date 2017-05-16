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

// dashboard.datalist = _.groupBy(dashboard.data, function(e) { return c.push({TitleProject:e.TitleProject}); });
// console.log(dashboard.datalist);

data = dashboard.data
databaru = [];
_.each(_.groupBy(data,"TitleProject"), function(v,i){
    datatmp = []
   _.each(_.groupBy(v,"ColorSubProject"), function(vv,ii){
    datatmp.push(vv[0])
 })
 databaru.push({"data":datatmp})
})

$(function() {
	$("#panel1").show();
	$("#panel2").hide();
});

