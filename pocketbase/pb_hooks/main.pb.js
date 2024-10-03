routerAdd("POST", "/transaction", (c) => {
    const data = $apis.requestInfo(c).data;
    const userRecord = c.get("authRecord");

    // get account
    const account = $app.dao().findRecordById("accounts", data.accountId);

    if (!account) {
        throw new BadRequestError("Account not found");
    }

    if (account.get("user") != userRecord.id) {
        throw new UnauthorizedError();
    }

    // category
    const category = $app.dao().findRecordById("categories", data.categoryId);

    if (!category) {
        throw new BadRequestError("Category not found");
    }

    if (category.get("user") != userRecord.id) {
        throw new UnauthorizedError();
    }
    
    if (data.amount > 1000000000 || data.amount < -1000000000) {
        throw new BadRequestError("Amount not in authorized range")
    }

    // create transaction
    const collection = $app.dao().findCollectionByNameOrId("transactions");
    const record = new Record(collection);
    const form = new RecordUpsertForm($app, record);

    form.loadData({
        "amount": data.amount,
        "description": data.description,
        "date": data.date,
        "user": userRecord.id,
        "category": category.get("id"),
        "account": account.get("id")
    });
    form.submit();

    // update account
    const newAmount = account.get("amount") + data.amount;
    account.set("amount", newAmount);
    $app.dao().saveRecord(account);

    c.json(200, { "message": "Transaction created." })

}, $apis.requireRecordAuth("users"));