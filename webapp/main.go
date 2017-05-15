package main

import (
	_ "eaciit/scbhome/webapp/web-main"
	"eaciit/scbhome/webapp/web-main/controllers"
	"github.com/eaciit/acl/v1.0"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
	"net/http"
)

const port = 1234

func main() {
	tk.Println("===========> Starting application")

	otherRoutes := make(map[string]knot.FnContent)
	otherRoutes["/"] = func(k *knot.WebContext) interface{} {
		urlLoginPage := "/" + controllers.AppName + "/auth/login"
		urlUserLandingPage := "/" + controllers.AppName + "/dashboard/index"
		urlAdminLandingPage := "/" + controllers.AppName + "/admin/index"

		if k.Session(controllers.SESSION_KEY) == nil {
			http.Redirect(k.Writer, k.Request, urlLoginPage, http.StatusTemporaryRedirect)
		} else {
			user := new(acl.User)
			tk.Unjson([]byte(k.Session(controllers.SESSION_USER).(string)), user)

			tk.Println("user", user)

			if tk.HasMember(user.Groups, "user") {
				http.Redirect(k.Writer, k.Request, urlUserLandingPage, http.StatusTemporaryRedirect)
			} else if tk.HasMember(user.Groups, "admin") {
				http.Redirect(k.Writer, k.Request, urlAdminLandingPage, http.StatusTemporaryRedirect)
			}
		}

		return true
	}

	container := new(knot.AppContainerConfig)
	container.Address = tk.Sprintf(":%d", port)

	knot.DefaultOutputType = knot.OutputTemplate
	knot.StartContainerWithFn(container, otherRoutes)
}
