---
sidebar_position: 6
title: Production Deployment
---

# Production Deployment

Ledgerly is designed to run safely in production environments with high volumes of events.  
This guide explains how to configure and operate Ledgerly in real-world systems.

Topics covered:

- Database indexing
- Payload limits
- Retention strategies
- Exporting and archiving
- Metadata best practices
- Performance tips

---

# 1. Database Indexing

As the `ledger_entries` table grows, proper indexing becomes essential.

Recommended indexes:

- created_at
- action
- severity
- actor_type + actor_id
- target_type + target_id

Example migration:

```php
Schema::table('ledger_entries', function (Blueprint $table) {
    $table->index('created_at');
    $table->index('action');
    $table->index('severity');
    $table->index(['actor_type', 'actor_id']);
    $table->index(['target_type', 'target_id']);
});
````

Indexes dramatically improve:

* activity timelines
* dashboards
* exports
* filtering queries

---

# 2. Payload Size Limits

To prevent oversized entries:

```
LEDGERLY_MAX_PAYLOAD_BYTES=65536
LEDGERLY_MAX_DIFF_BYTES=32768
```

These limits help:

* protect database performance
* prevent accidental large metadata
* reduce storage costs

Recommended:

* Keep metadata small
* Avoid storing full objects
* Avoid storing request bodies

---

# 3. Retention Strategy

Audit logs grow continuously. Plan retention early.

Example:

```
LEDGERLY_RETENTION_DAYS=90
```

Schedule pruning:

```php
$schedule->command('ledgerly:prune')->daily();
```

Retention strategies:

* Keep recent entries in DB
* Archive older entries to storage
* Delete very old entries

---

# 4. Exporting for Archival

Use streaming exports for large datasets:

```php
LedgerExporter::streamToFile(storage_path('ledger.jsonl'));
```

Best practices:

* Export before pruning
* Use chunked or streamed exports
* Compress archives

Example compression:

```
ledger.jsonl.gz
```

---

# 5. Metadata Best Practices

Metadata should be:

* Small
* Structured
* Relevant

Good examples:

```
tenant_id
request_id
job_id
service
region
```

Avoid:

* large debug dumps
* full request bodies
* serialized models

Use metadata filters if needed.

---

# 6. Resolver Performance

Metadata resolvers should:

* Be fast
* Avoid database queries when possible
* Avoid network calls
* Return small arrays

Slow resolvers impact every log operation.

Use resolver profiling in development:

```
LEDGERLY_PROFILE_RESOLVERS=true
```

---

# 7. Context Usage

Context is powerful but should be used carefully.

Recommended:

* tenant_id
* correlation_id
* batch_id

Avoid:

* large arrays
* temporary debug values

Use scoped context to prevent leaks.

---

# 8. Transaction Logging

Transactions group related entries and improve traceability.

Best practices:

* Use transactions for workflows
* Avoid extremely long transactions
* Keep transaction metadata small

---

# 9. Queue Workers

When logging inside jobs:

* Ensure context is set inside the job
* Avoid heavy metadata resolvers
* Monitor memory usage

Logging itself is lightweight, but metadata can increase cost.

---

# 10. Monitoring Table Growth

Track:

* row count
* table size
* index size

Recommended alerts:

* rapid growth spikes
* unusual diff sizes
* metadata anomalies

---

# 11. Backup Strategy

Ledger entries are often compliance-relevant.

Recommended:

* Include ledger tables in backups
* Export critical logs regularly
* Store backups offsite

---

# 12. Large Dataset Tips

When tables exceed millions of rows:

* Always filter by date range
* Use cursor or chunk exports
* Avoid `LedgerEntry::all()`

Correct:

```php
LedgerEntry::whereDate('created_at', today())->get();
```

Avoid:

```php
LedgerEntry::all();
```

---

# 13. Security Considerations

Audit logs may contain sensitive information.

Recommended:

* Filter sensitive metadata
* Avoid storing tokens or secrets
* Restrict database access

---

# 14. Scaling Strategies

As usage grows:

* Increase retention discipline
* Archive older data
* Consider read replicas for analytics
* Use background exports

Ledgerly is optimized for write-heavy workloads.

---

# 15. Recommended Production Checklist

Before going live:

* Indexes added
* Retention configured
* Payload limits configured
* Backup strategy in place
* Export strategy defined
* Resolver profiling tested in staging

---

# Summary

A production-ready Ledgerly deployment should:

* Store small, structured metadata
* Prune or archive regularly
* Use indexes
* Use streaming exports for large datasets
* Monitor table growth

These practices ensure long-term performance and reliability.
