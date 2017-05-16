package controllers

import (
	"eaciit/scbhome/webapp/web-main/models"
	"github.com/eaciit/knot/knot.v1"
	tk "github.com/eaciit/toolkit"
)

type DashboardController struct {
	*BaseController
}

func (c *DashboardController) Index(k *knot.WebContext) interface{} {
	c.SetupForHTML(k)

	return c.GetBaseData(k)
}

func (c *DashboardController) Master(k *knot.WebContext) interface{} {
	c.SetupForHTML(k)

	return c.GetBaseData(k)
}

func (c *DashboardController) GetData(k *knot.WebContext) interface{} {
	c.SetupForAJAX(k)

	res := c.GetBaseData(k)
	return res
}

func (c *DashboardController) GetPage(k *knot.WebContext) interface{} {
	c.SetupForAJAX(k)

	csr, err := c.Ctx.Connection.
		NewQuery().
		From(new(models.PageModel).TableName()).
		Select().
		Cursor(nil)
	if csr != nil {
		defer csr.Close()
	}
	if err != nil {
		return c.SetResultError(err.Error(), nil)
	}

	data := make([]models.PageModel, 0)
	err = csr.Fetch(&data, 0, true)
	if err != nil {
		return c.SetResultError(err.Error(), nil)
	}

	return c.SetResultOK(data)
}

func (c *DashboardController) GetMasterPlatform(k *knot.WebContext) interface{} {
	c.SetupForAJAX(k)

	csr, err := c.Ctx.Connection.
		NewQuery().
		From(new(models.MasterPlatformModel).TableName()).
		Select().
		Cursor(nil)
	if csr != nil {
		defer csr.Close()
	}
	if err != nil {
		return c.SetResultError(err.Error(), nil)
	}

	data := make([]models.MasterPlatformModel, 0)
	err = csr.Fetch(&data, 0, true)
	if err != nil {
		return c.SetResultError(err.Error(), nil)
	}

	return c.SetResultOK(data)
}

func (c *DashboardController) InsertMasterPlatform(k *knot.WebContext) interface{} {
	c.SetupForAJAX(k)

	platforms := []models.MasterPlatformModel{
		{Id: "P01", Name: "EACIIT App", Color: "#e67e22"},
		{Id: "P02", Name: "Exellerator", Color: "#2980b9"},
		{Id: "P03", Name: "UAT", Color: "#27ae60"},
		{Id: "P04", Name: "Development", Color: "#666699"},
	}

	queryInsert := c.Ctx.Connection.
		NewQuery().
		SetConfig("multiexec", true).
		From(new(models.MasterPlatformModel).TableName()).
		Save()
	if queryInsert != nil {
		defer queryInsert.Close()
	}

	for _, each := range platforms {
		err := queryInsert.Exec(tk.M{}.Set("data", each))
		if err != nil {
			return c.SetResultError(err.Error(), nil)
		}
	}

	return c.SetResultOK(nil)
}
