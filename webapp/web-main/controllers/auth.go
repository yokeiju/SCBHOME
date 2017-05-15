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

	activeUser := new(acl.User)
	err = acl.FindUserByLoginID(activeUser, payload.Username)
	if err != nil {
		tk.Println(err.Error())
		return c.SetResultError(err.Error(), nil)
	}

	k.SetSession(SESSION_KEY, sessionId)
	k.SetSession(SESSION_USERNAME, payload.Username)
	k.SetSession(SESSION_USER, string(tk.Jsonify(activeUser)))

	return c.SetResultOK(tk.M{}.
		Set(SESSION_KEY, sessionId).
		Set(SESSION_USERNAME, payload.Username))
}

func (c *AuthController) DoLogout(k *knot.WebContext) interface{} {
	k.Config.OutputType = knot.OutputJson

	sessionId := tk.ToString(k.Session(SESSION_KEY, ""))
	err := acl.Logout(sessionId)
	if err != nil {
		tk.Println(err.Error())
		return c.SetResultError(err.Error(), nil)
	}

	k.SetSession(SESSION_KEY, "")
	k.SetSession(SESSION_USERNAME, "")
	k.SetSession(SESSION_USER, "")
	c.Redirect(k, "auth", "login")

	return nil
}
