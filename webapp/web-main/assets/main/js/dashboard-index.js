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

$(function() {
	$("#panel1").show();
	$("#panel2").hide();
});
