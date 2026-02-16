---
sidebar_position: 1
title: Entries
---

# Entries

A **Ledger Entry** is the fundamental record stored by Ledgerly.  
Each entry represents a single, immutable business event that occurred in your application.

Examples:

- An invoice was created
- A payment was approved
- A user logged in
- A subscription was canceled

Entries are designed to answer:

- What happened?
- Who did it?
- What was affected?
- When did it happen?
- What changed?

---

# Structure of an Entry

Each Ledger Entry contains structured fields:

| Field                   | Description                  |
|-------------------------|------------------------------|
| id                      | Unique identifier            |
| action                  | Structured action name       |
| actor_type / actor_id   | Who performed the action     |
| target_type / target_id | What was affected            |
| diff                    | Attribute changes (optional) |
| metadata                | Additional structured data   |
| severity                | Importance level (optional)  |
| created_at              | Timestamp                    |

Entries are stored in the database and exposed through the `LedgerEntry` model.

---

# Immutability

Ledger entries are **immutable**.

Once recorded:

- They cannot be updated
- They cannot be deleted
- Their contents never change

This ensures:

- Audit reliability
- Compliance readiness
- Trustworthy history

If a correction is needed, a **new entry** should be logged rather than modifying an existing one.

---

# Action Names

Every entry must include an action:

```php
ledgerly()->action('billing.invoice.created')->log();
````

Action names follow a structured format:

```
<domain>.<resource>.<verb>
```

Examples:

```
billing.invoice.created
billing.invoice.updated
auth.user.logged_in
billing.payment.approved
```

Structured actions make filtering and reporting easier.

More details are covered in the **Actions** section.

---

# Actors

The actor represents **who performed the action**.

Example:

```php
ledgerly()
    ->actor(auth()->user())
    ->action('billing.invoice.created')
    ->log();
```

Actors are stored as polymorphic relationships, so they can reference any model.

Actors are optional; some events may be system-generated.

---

# Targets

The target represents **what was affected**.

Example:

```php
ledgerly()
    ->actor(auth()->user())
    ->target($invoice)
    ->action('billing.invoice.updated')
    ->log();
```

Targets are also polymorphic and optional.

---

# Diff Tracking

Entries can record what changed:

```php
ledgerly()
    ->action('billing.invoice.updated')
    ->withDiff([
        'amount' => [100, 150],
        'status' => ['draft', 'sent'],
    ])
    ->log();
```

Each diff value is stored as:

```
[field => [before, after]]
```

Diffs allow building activity timelines and change histories.

---

# Metadata

Metadata provides additional structured information about the event.

Examples:

* Request details
* Environment
* Correlation identifiers
* Custom application data

Metadata can be added manually:

```php
ledgerly()
    ->action('billing.invoice.sent')
    ->withMetadata([
        'channel' => 'email',
    ])
    ->log();
```

Ledgerly also collects metadata automatically using resolvers.

More details are covered in the **Metadata** section.

---

# Severity

Entries may include a severity level:

```php
ledgerly()
    ->severity('warning')
    ->action('billing.invoice.overdue')
    ->log();
```

Severity can be used in:

* dashboards
* alerts
* filtering
* UI timelines

Severity is optional.

---

# Correlation

Entries can be grouped together using transactions:

```php
ledgerly()->transaction(function () {

    ledgerly()->action('billing.invoice.created')->log();
    ledgerly()->action('billing.invoice.sent')->log();

});
```

Grouped entries share a correlation identifier, allowing reconstruction of workflows.

More details are covered in the **Transactions** section.

---

# Exporting Entries

Entries can be exported:

```php
$entry->toArray();
$entry->toJson();
```

Exports preserve:

* metadata
* diffs
* severity
* correlation

This makes Ledgerly suitable for:

* compliance exports
* analytics
* backups

---

# Best Practices

Good entries are:

* specific
* structured
* consistent in naming
* rich in metadata when needed

Avoid:

* generic action names like `updated`
* storing unstructured text logs
* modifying existing entries

---

# Next Step

Continue to:

➡️ **[Actions](actions.md)**
