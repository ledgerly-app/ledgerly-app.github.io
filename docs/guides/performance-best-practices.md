---
sidebar_position: 7
title: Performance Best Practices
---

# Performance Best Practices

Ledgerly is designed to be lightweight and efficient, but performance depends heavily on how it is used and configured.

This guide explains how to keep logging fast and scalable in high-volume systems.

---

# 1. Keep Metadata Small

Metadata size is the most common performance issue.

Recommended:

- Keep metadata under a few kilobytes
- Store identifiers, not full objects
- Use short keys where appropriate

Good:

```

tenant_id
request_id
job_id
region

```

Avoid:

```

full_request_body
serialized_models
large debug dumps

````

Large metadata increases:

- storage cost
- I/O time
- export time

---

# 2. Use Diff Sparingly

Diffs should represent meaningful changes, not entire objects.

Good:

```php
->withDiff([
    'status' => ['draft', 'approved'],
])
````

Avoid:

```php
->withDiff([
    'invoice' => [$oldInvoice->toArray(), $newInvoice->toArray()],
])
```

Large diffs slow down:

* inserts
* exports
* analytics queries

---

# 3. Use Transactions for Workflows

Transactions group related events and reduce query overhead when analyzing logs.

Good:

```php
ledgerly()->transaction(function () {
    // multiple logs
});
```

Benefits:

* easier correlation
* fewer queries during analysis
* clearer audit trails

---

# 4. Index the ledger_entries Table

Indexes are critical for large datasets.

Recommended indexes:

* created_at
* action
* severity
* actor_type + actor_id
* target_type + target_id

Indexes improve:

* dashboards
* timelines
* exports
* filtering

Without indexes, large tables become slow quickly.

---

# 5. Use Chunking or Streaming for Large Exports

Avoid loading large datasets into memory.

Correct:

```php
LedgerExporter::cursor(function ($entry) {
    // process entry
});
```

Or:

```php
LedgerExporter::chunk(1000, function ($entries) {
    // process batch
});
```

Avoid:

```php
LedgerEntry::all();
```

---

# 6. Avoid Slow Metadata Resolvers

Resolvers run on every log entry.

Resolvers should:

* Avoid database queries
* Avoid network calls
* Return small arrays

If profiling is enabled:

```
LEDGERLY_PROFILE_RESOLVERS=true
```

Use it in development to detect slow resolvers.

---

# 7. Use Context Instead of Repeating Metadata

If metadata applies to many entries:

Use context:

```php
ledgerly()->context([
    'tenant_id' => $tenantId,
]);
```

Instead of:

```php
->withMetadata(['tenant_id' => $tenantId])
```

Benefits:

* cleaner code
* less duplication
* more consistent metadata

---

# 8. Filter Metadata When Needed

If metadata can grow unpredictably, use metadata filters to enforce limits.

Example:

```php
Ledgerly::filterMetadataUsing(function ($metadata) {
    unset($metadata['debug']);
    return $metadata;
});
```

This prevents performance issues caused by unexpected payloads.

---

# 9. Avoid Logging Inside Tight Loops

Logging is lightweight, but excessive logging can still impact performance.

Better:

* Batch operations
* Log significant events
* Avoid logging every iteration of large loops

Good:

```
Import started
Import completed
```

Instead of logging every row.

---

# 10. Use Retention Policies

Audit tables grow continuously.

Recommended:

* Prune old entries
* Archive before deletion
* Schedule pruning jobs

Example:

```php
$schedule->command('ledgerly:prune')->daily();
```

Large tables slow down:

* backups
* exports
* queries

---

# 11. Query by Date Range

Always narrow queries when possible.

Good:

```php
LedgerEntry::whereBetween('created_at', [
    now()->subDay(),
    now(),
])->get();
```

Avoid:

```php
LedgerEntry::all();
```

---

# 12. Monitor Table Growth

Track:

* row count
* disk usage
* average row size

Unexpected growth often indicates:

* large metadata
* large diffs
* excessive logging

---

# 13. Avoid Long-Running Transactions

Transactions should be short and focused.

Avoid:

* long background operations
* large imports inside a single transaction

Keep transactions small and meaningful.

---

# 14. Optimize Queue Workers

If logging inside jobs:

* Ensure context is set efficiently
* Avoid heavy metadata resolvers
* Monitor memory usage

Queue workers often process thousands of logs.

---

# 15. Profile in Staging

Before production:

* Enable resolver profiling
* Run realistic workloads
* Inspect metadata size
* Test exports

Performance issues are easier to fix early.

---

# Summary

For best performance:

* Keep metadata small
* Keep diffs small
* Index the database
* Stream or chunk large exports
* Use retention policies
* Avoid slow resolvers

Following these practices ensures Ledgerly remains fast even with millions of entries.

