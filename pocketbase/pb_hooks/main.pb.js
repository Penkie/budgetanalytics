onModelAfterCreate((e) => {
    const account = $app.dao().findRecordById("accounts", e.model.get("account"));

    const newAmount = account.get("amount") + e.model.get("amount");
    account.set("amount", newAmount);
    $app.dao().saveRecord(account);
}, "transactions");

onModelBeforeUpdate((e) => {
    let newAmount = 0;
    const currentTransaction = $app.dao().findRecordById("transactions", e.model.id);
    const account = $app.dao().findRecordById("accounts", currentTransaction.get("account"));

    // handle case where account is updated
    if (account.get("id") != e.model.get("account")) {
        // get model account
        const modelAccount = $app.dao().findRecordById("accounts", e.model.get("account"));
        if (!modelAccount) return;
        newAmount = modelAccount.get("amount") + e.model.get("amount");
        modelAccount.set("amount", newAmount);
        $app.dao().saveRecord(modelAccount);

        // remove entry on old account
        newAmount = account.get("amount") - e.model.get("amount");
        account.set("amount", newAmount);
        $app.dao().saveRecord(account);
    // account is not updated, handle the change normally
    } else {
        newAmount = account.get("amount") + (e.model.get("amount") - currentTransaction.get("amount"));
        account.set("amount", newAmount);
        $app.dao().saveRecord(account);
    }
}, "transactions");

onModelAfterDelete((e) => {
    const account = $app.dao().findRecordById("accounts", e.model.get("account"));
    const newAmount = account.get("amount") - e.model.get("amount");
    account.set("amount", newAmount);
    $app.dao().saveRecord(account);
    console.log('here');
}, "transactions");