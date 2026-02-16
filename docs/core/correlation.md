---
sidebar_position: 6
title: Correlation
---

# Correlation

**Correlation** allows multiple ledger entries to be linked together as part of the same logical operation.

This is done using a **correlation identifier**, which is stored in metadata and automatically applied to entries inside a transaction.

Correlation makes it possible to:

- Reconstruct workflows
- Trace requests across multiple steps
- Analyze batch operations
- Understand cause and effect between events

---

# Why Correlation Matters

Many operations in an application involve multiple steps.

Example workflow:

1. Order placed
2. Payment authorized
3. Invoice generated
4. Email sent

Without correlation, these appear as unrelated entries.  
With correlation, they can be grouped and understood as one operation.

---

# How Correlation Works

Ledgerly automatically assigns a **correlation_id** when you use transactions:

```php
ledgerly()->transaction(function () {

    ledgerly()->action('order.created')->log();
    ledgerly()->action('payment.authorized')->log();
    ledgerly()->action('invoice.generated')->log();

});
````

All entries will share the same correlation identifier.

---

# Correlation Identifier

A correlation identifier is a unique value stored in metadata:

```json
{
  "correlation_id": "8f0c9c18-bd47-4c7d-a3a0-0a8e6b2b41e5"
}
```

This identifier can be used to:

* Query-related entries
* Build activity timelines
* Analyze workflows

---

# Querying by Correlation

You can retrieve all entries belonging to the same workflow:

```php
LedgerEntry::withinCorrelation($correlationId)->get();
```

This is useful for debugging and reporting.

---

# Correlation Across Services

Correlation identifiers can also be propagated across systems.

Example:

* API receives request with `X-Correlation-ID`
* Application sets correlation context
* All entries share the same identifier

This allows tracing workflows across multiple services.

---

# Correlation vs Transactions

Transactions are the most common way to create correlation, but they are not the only way.

| Feature                      | Transaction  | Correlation  |
|------------------------------|--------------|--------------|
| Generates correlation id     | Yes          | Not always   |
| Groups entries               | Yes          | Yes          |
| Measures duration            | Yes          | No           |
| Can be propagated externally | Optional     | Yes          |

Transactions are an implementation of correlation inside Ledgerly.

---

# Manual Correlation

In advanced scenarios, correlation identifiers may be supplied externally (for example, from an API gateway or message bus).

These values can be injected into metadata or context so that entries use an existing correlation identifier.

This allows Ledgerly to integrate into distributed systems.

---

# Correlation and Metadata

Correlation identifiers are stored in metadata and preserved in exports:

```php
$entry->toArray();
```

This ensures workflows remain traceable even after exporting data.

---

# Best Practices

Recommended uses:

* Grouping related actions
* Tracking background jobs
* Tracing user workflows
* Linking request chains

Avoid:

* Using correlation identifiers for unrelated events
* Reusing identifiers across different workflows

Each workflow should have a unique correlation identifier.

---

# Next Step

Continue to:

➡️ **[Architecture Overview](../advanced/architecture.md)**
