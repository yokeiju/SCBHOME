var pageLogin = {}
viewModel.pageLogin = pageLogin

pageLogin.inputUsername = ko.observable('')
pageLogin.inputPassword = ko.observable('')

pageLogin.registerSubmitEvent = function () {
    $('form').on('submit', function (e) {
        e.preventDefault()

        var payload = {}
        payload.username = pageLogin.inputUsername()
        payload.password = pageLogin.inputPassword()
        ajaxPost('/web/auth/dologin', payload, function (res) {
        	if (res.Status !== 'OK') {
        		swal("Login Failed!", res.Message, "error")
        		return
        	}

        	swal({
				title: 'Login Success',
				text: 'Will automatically redirect to dashboard page',
				type: 'success',
				timer: 2000,
				showConfirmButton: false
			}, function () {
	        	location.href = '/'
			});
        })
    })
}

$(function () {
    pageLogin.registerSubmitEvent()
})