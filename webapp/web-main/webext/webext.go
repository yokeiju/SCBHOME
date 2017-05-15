package webext

import (
	"eaciit/scbhome/webapp/web-main/controllers"
	"eaciit/scbhome/webapp/web-main/helper"
	"github.com/eaciit/acl/v1.0"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/orm"
	tk "github.com/eaciit/toolkit"
	"os"
	"path/filepath"
	"time"
)

const APP_NAME = "web"
const APP_FOLDER = "web-main"

func Register() *knot.App {
	SpreadAppName()

	tk.Println("===========> Registering", APP_NAME, "@", APP_FOLDER)
	const LOG_PREFIX_SUB = "           >"

	// ==== prepare database connection
	conn, err := helper.PrepareConnection()
	if err != nil {
		tk.Println(LOG_PREFIX_SUB, err.Error())
		os.Exit(0)
		return nil
	}

	config := helper.ReadConfig()
	ctx := orm.New(conn)
	baseCtrl := new(controllers.BaseController)
	baseCtrl.Ctx = ctx

	acl.SetExpiredDuration(time.Second * time.Duration(config.GetFloat64("loginexpired")))
	err = acl.SetDb(conn)
	if err != nil {
		tk.Println(LOG_PREFIX_SUB, err.Error())
		os.Exit(0)
		return nil
	}

	err = helper.PrepareDefaultUser()
	if err != nil {
		tk.Println(LOG_PREFIX_SUB, err.Error())
		return nil
	}

	app := knot.NewApp(APP_NAME)
	app.LayoutTemplate = "_layout.html"
	app.ViewsPath = filepath.Join(helper.GetBasePath(), APP_FOLDER, "views") + tk.PathSeparator

	tk.Println(LOG_PREFIX_SUB, "Configure view location", app.ViewsPath)

	app.Register(&(controllers.AuthController{baseCtrl}))
	app.Register(&(controllers.DashboardController{baseCtrl}))
	app.Static("static", filepath.Join(helper.GetBasePath(), APP_FOLDER, "assets"))

	knot.RegisterApp(app)

	return app
}

func SpreadAppName() {
	controllers.AppName = APP_NAME
	controllers.AppFolder = APP_FOLDER
	helper.AppName = APP_NAME
	helper.AppFolder = APP_FOLDER
}
