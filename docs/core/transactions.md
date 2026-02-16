---
sidebar_position: 5
title: Transactions
---

# Transactions

A **transaction** allows you to group multiple ledger entries into a single logical operation.

All entries recorded inside a transaction share a **correlation identifier**, making it possible to reconstruct workflows and understand sequences of events.

Transactions are useful when:

- A business operation triggers multiple actions
- A workflow spans multiple steps
- A job processes multiple records
- A process needs to be analyzed as a unit

---

# Basic Example

```php
ledgerly()->transaction(function () {

    ledgerly()->action('billing.invoice.created')->log();
    ledgerly()->action('billing.invoice.sent')->log();

});
````

Both entries will share the same correlation identifier.

This allows tools and queries to group them together.

---

# Why Transactions Matter

In real applications, many operations are composed of multiple steps:

Example:

```
Order placed
Payment authorized
Invoice generated
Email sent
```

Without correlation, these appear as unrelated entries.

Transactions connect them into a single narrative.

---

# Correlation Identifier

Every transaction generates a **correlation_id** stored in metadata.

Example metadata:

```json
{
  "correlation_id": "c9b8e1f4-2f5a-4c5c-9c7b-8c5a6f1e3c12"
}
```

This identifier is automatically applied to entries inside the transaction.

---

# Nested Transactions

Ledgerly supports nested transactions:

```php
ledgerly()->transaction(function () {

    ledgerly()->action('billing.invoice.created')->log();

    ledgerly()->transaction(function () {
        ledgerly()->action('billing.invoice.sent')->log();
    });

});
```

Nested transactions inherit the same correlation context unless explicitly separated.

---

# Transaction Duration

Ledgerly may record transaction performance metadata such as:

```
transaction_duration_ms
```

This helps:

* Analyze slow workflows
* Identify bottlenecks
* Monitor background jobs

Duration is calculated automatically.

---

# Transactions and Metadata

Transactions can contribute metadata automatically:

* correlation_id
* transaction_duration_ms
* execution metrics (if enabled)

This metadata is merged into each entry.

---

# Transactions and Context

Transactions and context work together.

Example:

```php
ledgerly()->context(['tenant_id' => 42]);

ledgerly()->transaction(function () {

    ledgerly()->action('billing.invoice.created')->log();
    ledgerly()->action('billing.invoice.sent')->log();

});
```

Each entry will include:

```
tenant_id
correlation_id
```

Context describes the environment.
Transactions describe the workflow.

---

# Transactions vs Context

| Feature             | Context         | Transaction      |
|---------------------|-----------------|------------------|
| Purpose             | Shared metadata | Grouping entries |
| Adds correlation id | No              | Yes              |
| Supports nesting    | Yes             | Yes              |
| Automatic duration  | No              | Yes              |

Use:

* Context for environment/state
* Transactions for workflows

---

# Querying Transactions

You can query entries by correlation identifier:

```php
LedgerEntry::withinCorrelation($id)->get();
```

This makes it easy to reconstruct workflows.

---

# Failure Handling

If an exception occurs inside a transaction:

```php
ledgerly()->transaction(function () {

    ledgerly()->action('invoice.created')->log();

    throw new RuntimeException();

});
```

Ledgerly ensures:

* Transaction state is restored
* Context is not leaked
* Future logs behave normally

Entries logged before the exception remain valid.

---

# Best Practices

Recommended uses:

* Multi-step workflows
* Import jobs
* Payment processing flows
* User onboarding flows
* Batch operations

Avoid using transactions for:

* Single log entries
* Unrelated events

---

# How Transactions Work Internally

Internally, Ledgerly:

1. Generates a correlation identifier
2. Tracks transaction state
3. Collects performance metadata
4. Merges transaction metadata into entries
5. Restores state when the transaction ends

Transactions are lightweight and safe to use frequently.

---

# Next Step

Continue to:

➡️ **[Correlation](correlation.md)**
