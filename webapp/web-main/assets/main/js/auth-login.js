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
        	location.href = '/'
        })
    })
}

$(function () {
    pageLogin.registerSubmitEvent()
})