---
sidebar_position: 8
title: Indexing Strategies
---

# Indexing Strategies

As your `ledger_entries` table grows, database indexing becomes essential for maintaining fast queries.

This guide explains which indexes to use, when to use them, and how to avoid common mistakes.

---

# Why Indexing Matters

Ledgerly workloads typically involve:

- activity timelines
- dashboards
- exports
- date-range queries
- filtering by actor or target

Without proper indexes, large tables can slow down dramatically.

Indexes ensure:

- fast lookups
- predictable performance
- efficient pagination
- scalable exports

---

# Recommended Core Indexes

These indexes are recommended for nearly all production deployments.

---

## created_at

Most queries:

- latest entries
- date-range exports
- dashboards

Migration example:

```php
$table->index('created_at');
````

This is the most important index.

---

## action

Useful for:

* filtering by event type
* reporting
* analytics

Migration example:

```php
$table->index('action');
```

---

## severity

Useful for:

* alerts
* dashboards
* filtering

Migration example:

```php
$table->index('severity');
```

---

# Polymorphic Relationship Indexes

Ledgerly uses polymorphic relations for actors and targets.

Composite indexes are required for good performance.

---

## Actor Index

Used for:

* user activity timelines
* filtering by actor

Migration example:

```php
$table->index(['actor_type', 'actor_id']);
```

---

## Target Index

Used for:

* model timelines
* audit views

Migration example:

```php
$table->index(['target_type', 'target_id']);
```

---

# Timeline Optimization

For high-performance timelines, add:

```php
$table->index(['target_type', 'target_id', 'created_at']);
```

This improves:

* timeline queries
* chronological ordering
* pagination

---

# Correlation ID Indexing

Correlation IDs are often stored in metadata.

Indexing strategy depends on the database.

---

## MySQL

Use a generated column:

```php
$table->string('correlation_id')
    ->virtualAs("json_unquote(json_extract(metadata, '$.correlation_id'))")
    ->nullable();

$table->index('correlation_id');
```

This allows fast queries using:

```php
LedgerEntry::withinCorrelation($id);
```

---

## PostgreSQL

Use an expression index:

```sql
CREATE INDEX ledger_entries_correlation_idx
ON ledger_entries ((metadata->>'correlation_id'));
```

This provides efficient lookups without schema changes.

---

# Optional Indexes

These are useful in specific workloads.

---

## Actor Timeline Optimization

```php
$table->index(['actor_type', 'actor_id', 'created_at']);
```

Useful when:

* user activity views are common
* auditing user behavior

---

## Action + Date Index

```php
$table->index(['action', 'created_at']);
```

Useful for:

* analytics
* reporting
* filtering by action over time

---

# Indexes to Avoid

Avoid indexing:

* diff column
* full metadata JSON
* low-value fields

These indexes:

* consume large amounts of storage
* slow down inserts
* rarely improve performance

---

# Large Dataset Considerations

As tables grow into millions of rows:

* Always filter queries by date range
* Use cursor or chunk exports
* Avoid full-table scans

Good:

```php
LedgerEntry::whereBetween('created_at', [...])->get();
```

Avoid:

```php
LedgerEntry::all();
```

---

# Monitoring Index Usage

In production, periodically check:

* slow query logs
* query execution plans
* index size

If an index is not used, consider removing it.

---

# Migration Strategy

Indexes should be added via migrations, not manually.

Example migration:

```php
Schema::table('ledger_entries', function (Blueprint $table) {
    $table->index('created_at');
    $table->index('action');
    $table->index('severity');
    $table->index(['actor_type', 'actor_id']);
    $table->index(['target_type', 'target_id']);
});
```

---

# Summary

For most applications, the following indexes are sufficient:

* created_at
* action
* severity
* actor_type + actor_id
* target_type + target_id

Add additional indexes only when necessary.

Proper indexing ensures Ledgerly remains fast and reliable even with millions of entries.
