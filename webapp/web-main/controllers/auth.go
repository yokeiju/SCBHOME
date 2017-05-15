package controllers

import (
	"github.com/eaciit/acl/v1.0"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
)

type AuthController struct {
	*BaseController
}

func (c *AuthController) Login(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputTemplate

	return tk.M{}
}

func (c *AuthController) Logout(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputTemplate

	return tk.M{}
}

func (c *AuthController) DoLogin(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	payload := struct {
		Username string
		Password string
	}{}

	err := k.GetPayload(&payload)
	if err != nil {
		tk.Println(err.Error())
		return c.SetResultError(err.Error(), nil)
	}

	sessionId, err := acl.Login(payload.Username, payload.Password)
	if err != nil {
		tk.Println(err.Error())
		return c.SetResultError(err.Error(), nil)
	}

	k.SetSession("sessionId", sessionId)
	k.SetSession("username", payload.Username)

	return c.SetResultOK(tk.M{}.
		Set("sessionId", sessionId).
		Set("username", payload.Username))
}

func (c *AuthController) DoLogout(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	sessionId := tk.ToString(k.Session("sessionId", ""))
	err := acl.Logout(sessionId)
	if err != nil {
		tk.Println(err.Error())
		return c.SetResultError(err.Error(), nil)
	}

	k.SetSession("sessionId", "")
	c.Redirect(k, "auth", "login")

	return nil
}
