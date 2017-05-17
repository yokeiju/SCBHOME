package controllers

import (
	"eaciit/scbhome/webapp/web-main/models"
	"github.com/eaciit/knot/knot.v1"
	// tk "github.com/eaciit/toolkit"
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

func (c *DashboardController) SavePage(k *knot.WebContext) interface{} {
	c.SetupForAJAX(k)

	payload := new(models.PageModel)
	err := k.GetPayload(&payload)
	if err != nil {
		return c.SetResultError(err.Error(), nil)
	}

	err = c.Ctx.Save(payload)
	if err != nil {
		return c.SetResultError(err.Error(), nil)
	}

	return c.SetResultOK(nil)
}

func (c *DashboardController) DeletePage(k *knot.WebContext) interface{} {
	c.SetupForAJAX(k)

	payload := struct {
		Ids []string
	}{}
	err := k.GetPayload(&payload)
	if err != nil {
		return c.SetResultError(err.Error(), nil)
	}

	for _, eachId := range payload.Ids {
		eachModel := new(models.PageModel)
		eachModel.Id = eachId

		err = c.Ctx.Delete(eachModel)
		if err != nil {
			return c.SetResultError(err.Error(), nil)
		}
	}

	return c.SetResultOK(nil)
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

func (c *DashboardController) InsertPredefinedData(k *knot.WebContext) interface{} {
	c.SetupForAJAX(k)

	// platforms
	err := (func() error {
		platforms := []models.MasterPlatformModel{
			{Id: "P01", Name: "EACIIT App", Color: "#e67e22"},
			{Id: "P02", Name: "Exellerator", Color: "#03A9F4"},
			{Id: "P03", Name: "UAT", Color: "#27ae60"},
			{Id: "P04", Name: "Development", Color: "#d066e2"}}

		for _, each := range platforms {
			err := c.Ctx.Save(&each)
			if err != nil {
				return err
			}
		}

		return nil
	})()
	if err != nil {
		return c.SetResultError(err.Error(), nil)
	}

	// pages
	err = (func() error {
		pages := []models.PageModel{
			{
				Id:          "p4",
				ProjectName: "BEF",
				PlatformId:  "P01",
				URL:         "http://scb-bef.eaciitapp.com/dashboard/default",
				Cover:       "breather-181294.jpg"},
			{
				Id:          "p8",
				ProjectName: "FMI",
				PlatformId:  "P02",
				URL:         "https://fmi.exellerator.io",
				Cover:       "sean-pollock-203658.jpg"},
			{
				Id:          "p9",
				ProjectName: "FMI Dev",
				PlatformId:  "P04",
				URL:         "http://fmidev.eaciitapp.com",
				Cover:       "sebastian-grochowicz-249102.jpg"},
			{
				Id:          "p2",
				ProjectName: "IKEA",
				PlatformId:  "P01",
				URL:         "http://scbikea.eaciit.com/dashboard/default",
				Cover:       "benjamin-child-17946.jpg"},
			{
				Id:          "p6",
				ProjectName: "Mobile Money",
				PlatformId:  "P01",
				URL:         "http://scmm.eaciit.com/dashboard/default",
				Cover:       "michal-kubalczyk-257107.jpg"},
			{
				Id:          "p1",
				ProjectName: "OCIR",
				PlatformId:  "P01",
				URL:         "http://scbocir-dev.eaciit.com/live/dashboard/default",
				Cover:       "adan-guerrero-131738.jpg"},
			{
				Id:          "p5",
				ProjectName: "Sales Perf Dashboard",
				PlatformId:  "P02",
				URL:         "https://cbi.exellerator.io/dashboard/default",
				Cover:       "jeff-sheldon-3231.jpg"},
			{
				Id:          "p3",
				ProjectName: "Super Connect 5",
				PlatformId:  "P01",
				URL:         "http://www.superconnect5.com/admin/dashboard/default",
				Cover:       "benjamin-child-90768.jpg"},
			{
				Id:          "p7",
				ProjectName: "TWIST",
				PlatformId:  "P02",
				URL:         "https://twist.exellerator.io/",
				Cover:       "miguel-carraca-131178.jpg"}}

		for _, each := range pages {
			err := c.Ctx.Save(&each)
			if err != nil {
				return err
			}
		}

		return nil
	})()
	if err != nil {
		return c.SetResultError(err.Error(), nil)
	}

	return c.SetResultOK(nil)
}
