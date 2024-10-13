onModelAfterCreate((e) => {
    const account = $app.dao().findRecordById("accounts", e.model.get("account"));

    const newAmount = account.get("amount") + e.model.get("amount");
    account.set("amount", newAmount);
    $app.dao().saveRecord(account);
}, "transactions");

onModelBeforeUpdate((e) => {
    const currentTransaction = $app.dao().findRecordById("transactions", e.model.id);
    const account = $app.dao().findRecordById("accounts", currentTransaction.get("account"));

    const newAmount = account.get("amount") + (e.model.get("amount") - currentTransaction.get("amount"));
    account.set("amount", newAmount);
    $app.dao().saveRecord(account);
}, "transactions");

onModelAfterDelete((e) => {
    const account = $app.dao().findRecordById("accounts", e.model.get("account"));
    const newAmount = account.get("amount") - e.model.get("amount");
    account.set("amount", newAmount);
    $app.dao().saveRecord(account);
    console.log('here');
}, "transactions");