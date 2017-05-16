package models

import (
	"github.com/eaciit/orm"
	tk "github.com/eaciit/toolkit"
)

type PageModel struct {
	orm.ModelBase `bson:"-",json:"-"`

	Id          string `bson:"_id",json:"_id"`
	ProjectName string `bson:"ProjectName",json:"ProjectName"`
	PlatformId  string `bson:"PlatformId",json:"PlatformId"`
	URL         string `bson:"URL",json:"URL"`
	Cover       string `bson:"Cover",json:"Cover"`
	Username    string `bson:"Username",json:"Username"`
	Password    string `bson:"Password",json:"Password"`
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
