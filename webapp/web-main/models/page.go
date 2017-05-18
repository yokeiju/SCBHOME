package models

import (
	"github.com/eaciit/orm"
	tk "github.com/eaciit/toolkit"
)

type PagePlatform struct {
	PlatformId   string `bson:"PlatformId",json:"PlatformId"`
	PlatformName string `bson:"PlatformName",json:"PlatformName"`
	URL          string `bson:"URL",json:"URL"`
	Username     string `bson:"Username",json:"Username"`
	Password     string `bson:"Password",json:"Password"`
}

type PageModel struct {
	orm.ModelBase `bson:"-",json:"-"`
	Id            string         `bson:"_id",json:"_id"`
	ProjectName   string         `bson:"ProjectName",json:"ProjectName"`
	Description   string         `bson:"Description",json:"Description"`
	Cover         string         `bson:"Cover",json:"Cover"`
	Platforms     []PagePlatform `bson:"Platforms",json:"Platforms"`
}

func NewPageModel() *PageModel {
	m := new(PageModel)
	m.Id = tk.RandomString(32)
	return m
}

func (e *PageModel) RecordID() interface{} {
	return e.Id
}

func (m *PageModel) TableName() string {
	return "Page"
}
