---
sidebar_position: 4
title: Context
---

# Context

**Context** allows you to attach values that automatically apply to multiple ledger entries during a period of execution.

Context is commonly used for:

- Tenant identifiers
- Feature flags
- Service identifiers
- Batch or import identifiers
- Business workflow identifiers

Unlike explicit metadata, context is applied automatically to every entry until it is changed or cleared.

---

# Why Context Exists

In real applications, many events share the same information.

Example:

- A request belongs to a tenant
- A batch process processes multiple records
- A job handles a single import

Without context, you would need to repeat metadata on every log call.

Context solves this problem.

---

# Setting Global Context

You can define context values:

```php
ledgerly()->context([
    'tenant_id' => 42,
]);
````

All subsequent entries will include this metadata.

Example:

```php
ledgerly()->context(['tenant_id' => 42]);

ledgerly()->action('billing.invoice.created')->log();
ledgerly()->action('billing.invoice.sent')->log();
```

Both entries will include:

```
tenant_id = 42
```

---

# Scoped Context

Scoped context applies only inside a block:

```php
ledgerly()->withContext(['tenant_id' => 42], function () {

    ledgerly()->action('billing.invoice.created')->log();
    ledgerly()->action('billing.invoice.sent')->log();

});
```

After the block finishes, context is automatically restored.

---

# Nested Context

Context scopes can be nested:

```php
ledgerly()->withContext(['tenant_id' => 1], function () {

    ledgerly()->action('billing.invoice.created')->log();

    ledgerly()->withContext(['feature' => 'beta'], function () {
        ledgerly()->action('billing.invoice.updated')->log();
    });

    ledgerly()->action('billing.invoice.sent')->log();

});
```

Resulting metadata:

| Entry           | Metadata                      |
|-----------------|-------------------------------|
| invoice.created | tenant_id = 1                 |
| invoice.updated | tenant_id = 1, feature = beta |
| invoice.sent    | tenant_id = 1                 |

Ledgerly restores context automatically after each scope.

---

# Context vs Metadata

Use **context** when:

* A value applies to many entries
* The value represents the runtime state
* The value should be inherited automatically

Use **explicit metadata** when:

* A value applies to one entry only
* The value describes a specific event

Example:

Good use of context:

```
tenant_id
batch_id
import_id
workflow_id
```

Good use of metadata:

```
channel = email
retry_attempt = 2
payment_gateway = stripe
```

---

# Context vs Transactions

Context and transactions serve different purposes.

| Feature             | Context                | Transaction           |
|---------------------|------------------------|-----------------------|
| Purpose             | Attach shared metadata | Group related entries |
| Scope               | Runtime state          | Workflow grouping     |
| Adds metadata       | Yes                    | Yes                   |
| Adds correlation id | No                     | Yes                   |

You can use both together.

---

# Context and Metadata Precedence

Context is merged into metadata with the following priority:

```
1. Metadata resolvers
2. Transaction metadata
3. Context metadata
4. Explicit metadata
```

Explicit metadata always overrides context values.

---

# Automatic Restoration

Ledgerly ensures context is restored even if an exception occurs:

```php
ledgerly()->withContext(['tenant_id' => 42], function () {
    throw new RuntimeException();
});
```

After the exception, context is no longer applied.

This prevents accidental context leakage.

---

# Best Practices

Recommended uses for context:

* Tenant identifiers
* Batch processing identifiers
* Service identifiers
* Feature flags
* Workflow identifiers

Avoid using context for:

* Large datasets
* Sensitive secrets
* Values unique to a single event

---

# How Context Works Internally

Internally, Ledgerly maintains a stack of context layers.

Each scoped context:

1. Pushes a new layer
2. Applies it to entries
3. Pops the layer after execution

This ensures:

* Isolation
* Nesting support
* Exception safety

---

# Next Step

Continue to:

➡️ **[Transactions](transactions.md)**
