package controllers

import (
	"github.com/eaciit/knot/knot.v1"
)

type DashboardController struct {
	*BaseController
}

func (c *DashboardController) Index(k *knot.WebContext) interface{} {
	c.SetupForHTML(k)

	return c.GetBaseData(k)
}

func (c *DashboardController) GetData(k *knot.WebContext) interface{} {
	c.SetupForAJAX(k)

	res := c.GetBaseData(k)
	return res
}
