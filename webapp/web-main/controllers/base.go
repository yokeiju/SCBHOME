package controllers

import (
	"errors"
	"github.com/eaciit/acl/v1.0"
	"github.com/eaciit/knot/knot.v1"
	"github.com/eaciit/orm"
	tk "github.com/eaciit/toolkit"
	"net/http"
)

var AppName string
var AppFolder string

type IBaseController interface {
}

type BaseController struct {
	base         IBaseController
	Ctx          *orm.DataContext
	TemplatePath string
}

type PageInfo struct {
	PageTitle    string
	SelectedMenu string
	Breadcrumbs  map[string]string
}

type Previlege struct {
	View     bool
	Create   bool
	Edit     bool
	Delete   bool
	Approve  bool
	Process  bool
	Menuid   string
	Menuname string
	Username string
}

func (b *BaseController) SetupForHTML(k *knot.WebContext) {
	k.Config.OutputType = knot.OutputTemplate
	k.Config.NoLog = true

	b.IsAuthenticate(k, nil, func() {
		b.Redirect(k, "auth", "login")
	})
}

func (b *BaseController) SetupForAJAX(k *knot.WebContext) {
	k.Config.OutputType = knot.OutputJson
	k.Config.NoLog = true

	b.IsAuthenticate(k, nil, func() {
		b.Redirect(k, "auth", "login")
	})
}

func (b *BaseController) IsAuthenticate(k *knot.WebContext, callback, failback func()) {
	sessionid := tk.ToString(k.Session("sessionId", ""))
	tk.Println(">>>", sessionid)
	if acl.IsSessionIDActive(sessionid) {
		if callback != nil {
			callback()
		}
	} else {
		k.SetSession("sessionId", "")
		if failback != nil {
			failback()
		}
	}
}

func (b *BaseController) IsLoggedIn(k *knot.WebContext) bool {
	return (k.Session("sessionId") != nil)
}

func (b *BaseController) GetCurrentUser(k *knot.WebContext) string {
	if k.Session("sessionId") == nil {
		return ""
	}
	return k.Session("username").(string)
}

func (b *BaseController) Redirect(k *knot.WebContext, controller string, action string) {
	urlString := "/" + AppName + "/" + controller + "/" + action
	http.Redirect(k.Writer, k.Request, urlString, http.StatusTemporaryRedirect)
}

func (b *BaseController) SetResultOK(data interface{}) *tk.Result {
	r := tk.NewResult()
	r.Data = data

	return r
}

func (b *BaseController) SetResultError(msg string, data interface{}) *tk.Result {
	r := tk.NewResult()
	r.SetError(errors.New(msg))
	r.Data = data

	return r
}

// func (b *BaseController) AccessMenu(k *knot.WebContext) []tk.M {
// 	url := k.Request.URL.String()
// 	if strings.Index(url, "?") > -1 {
// 		url = url[:strings.Index(url, "?")]
// 		//		tk.Println("URL_PARSED,", url)
// 	}
// 	sessionRoles := k.Session("roles")
// 	access := []tk.M{}
// 	if sessionRoles != nil {
// 		accesMenu := sessionRoles.([]models.SysRolesModel)
// 		if len(accesMenu) > 0 {
// 			for _, o := range accesMenu[0].Menu {
// 				if o.Url == url {
// 					obj := tk.M{}
// 					obj.Set("View", o.View)
// 					obj.Set("Create", o.Create)
// 					obj.Set("Approve", o.Approve)
// 					obj.Set("Delete", o.Delete)
// 					obj.Set("Process", o.Process)
// 					obj.Set("Edit", o.Edit)
// 					obj.Set("Menuid", o.Menuid)
// 					obj.Set("Menuname", o.Menuname)
// 					obj.Set("Username", k.Session("username").(string))
// 					access = append(access, obj)
// 					return access
// 				}

// 			}
// 		}
// 	}
// 	return access
// }

// func (b *BaseController) GetNextIdSeq(collName string) (int, error) {
// 	ret := 0
// 	mdl := models.NewSequenceModel()
// 	crs, err := b.Ctx.Find(models.NewSequenceModel(), tk.M{}.Set("where", db.Eq("collname", collName)))
// 	if err != nil {
// 		return -9999, err
// 	}
// 	defer crs.Close()
// 	err = crs.Fetch(mdl, 1, false)
// 	if err != nil {
// 		return -9999, err
// 	}
// 	ret = mdl.Lastnumber + 1
// 	mdl.Lastnumber = ret
// 	b.Ctx.Save(mdl)
// 	return ret, nil
// }
