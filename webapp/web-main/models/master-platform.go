package models

import (
	"github.com/eaciit/orm"
	tk "github.com/eaciit/toolkit"
)

type MasterPlatformModel struct {
	orm.ModelBase `bson:"-",json:"-"`

	Id    string `bson:"_id",json:"_id"`
	Name  string `bson:"Name",json:"Name"`
	Color string `bson:"Color",json:"Color"`
}

func NewMasterPlatformModel() *MasterPlatformModel {
	m := new(MasterPlatformModel)
	m.Id = tk.RandomString(32)
	return m
}

func (e *MasterPlatformModel) RecordID() interface{} {
	return e.Id
}

func (m *MasterPlatformModel) TableName() string {
	return "MasterPlatform"
}
