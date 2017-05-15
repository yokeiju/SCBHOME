package main

import (
	_ "eaciit/scbhome/webapp/web-main"
	"eaciit/scbhome/webapp/web-main/controllers"
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
		urlLandingPage := "/" + controllers.AppName + "/dashboard/index"

		if k.Session("username") == nil || k.Session("sessionId") == nil {
			http.Redirect(k.Writer, k.Request, urlLoginPage, http.StatusTemporaryRedirect)
		} else {
			http.Redirect(k.Writer, k.Request, urlLandingPage, http.StatusTemporaryRedirect)
		}

		return true
	}

	container := new(knot.AppContainerConfig)
	container.Address = tk.Sprintf(":%d", port)

	knot.DefaultOutputType = knot.OutputTemplate
	knot.StartContainerWithFn(container, otherRoutes)
}
