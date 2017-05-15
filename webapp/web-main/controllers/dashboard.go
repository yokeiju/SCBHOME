package controllers

import (
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
)

type DashboardController struct {
	*BaseController
}

func (c *DashboardController) Index(k *knot.WebContext) interface{} {
	c.SetupForHTML(k)

	return tk.M{}
}

func (c *DashboardController) GetData(k *knot.WebContext) interface{} {
	c.SetupForAJAX(k)

	return tk.M{}
}
