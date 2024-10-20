/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1ocrccb3bqlxu64")

  collection.createRule = "@request.auth.id != \"\" &&\n@request.data.user = @request.auth.id &&\n(@request.data.category:isset = false || @request.data.category.user = @request.auth.id)"
  collection.updateRule = "@request.auth.id != \"\" &&\n@request.data.user = @request.auth.id &&\n(@request.data.category:isset = false || @request.data.category.user = @request.auth.id)"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1ocrccb3bqlxu64")

  collection.createRule = "@request.auth.id != \"\" &&\n@request.data.user = @request.auth.id &&\n@request.data.category.user = @request.auth.id"
  collection.updateRule = "@request.auth.id != \"\" &&\n@request.data.user = @request.auth.id &&\n@request.data.category.user = @request.auth.id"

  return dao.saveCollection(collection)
})
