/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1ocrccb3bqlxu64")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "i1hypnas",
    "name": "hidden",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1ocrccb3bqlxu64")

  // remove
  collection.schema.removeField("i1hypnas")

  return dao.saveCollection(collection)
})
