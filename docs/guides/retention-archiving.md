---
sidebar_position: 9
title: Retention & Archiving Strategies
---

# Retention & Archiving Strategies

Ledger entries grow continuously in production systems.  
Without a retention and archiving strategy, audit tables can become huge and slow to query.

This guide explains how to:

- Define a retention policy
- Archive entries safely
- Prune old data
- Maintain performance over time

---

# Why Retention Matters

Audit logs are append-only by design. Over time this leads to:

- Large tables
- Slower exports
- Longer backups
- Higher storage costs

A retention strategy ensures:

- Predictable performance
- Manageable storage
- Compliance with data policies

---

# Define a Retention Policy

Typical retention periods:

| Use Case            | Retention   |
|---------------------|-------------|
| Operational logs    | 30–90 days  |
| Business audit logs | 6–12 months |
| Compliance records  | 1–7 years   |

Choose a policy based on:

- Legal requirements
- Storage capacity
- Reporting needs

---

# Using the Prune Command

Ledgerly provides a pruning command:

```bash
php artisan ledgerly:prune --days=90
````

This removes entries older than the specified number of days.

To preview deletions:

```bash
php artisan ledgerly:prune --days=90 --dry-run
```

---

# Scheduling Pruning

Recommended schedule:

```php
$schedule->command('ledgerly:prune')->daily();
```

Daily pruning keeps the table size stable.

---

# Archiving Before Deletion

In many systems, old entries should be archived before being deleted.

Recommended workflow:

1. Export old entries
2. Store archive
3. Prune archived entries

---

# Exporting Old Entries

Example export:

```php
LedgerExporter::chunkQuery(
    LedgerEntry::where('created_at', '<', now()->subDays(90)),
    1000,
    function ($entries) use ($handle) {
        foreach ($entries as $entry) {
            fwrite($handle, json_encode($entry->toArray()) . PHP_EOL);
        }
    }
);
```

This produces a JSONL archive suitable for long-term storage.

---

# Storage Options for Archives

Common archive destinations:

* S3 or object storage
* Cold storage
* External logging systems
* Compliance archives

Recommended format:

```
JSONL + compression
```

Example:

```
ledger-2026-01.jsonl.gz
```

---

# Compression

Large archives should be compressed.

Typical compression reduces size by 70–90%.

Example workflow:

```
Export → gzip → upload to storage
```

---

# Partitioning Strategy (Advanced)

Large systems may use table partitioning.

Common strategies:

* Partition by month
* Partition by year

Benefits:

* Faster pruning
* Faster queries
* Smaller indexes

Partitioning is database-specific and should be planned carefully.

---

# Retention by Severity

Some systems keep critical entries longer.

Example policy:

| Severity  | Retentio  |
|-----------|-----------|
| info      | 90 days   |
| warning   | 180 days  |
| error     | 365 days  |

This can be implemented with custom pruning logic.

---

# Retention by Tenant

Multi-tenant systems may require:

* per-tenant retention rules
* tenant-specific exports

Recommended approach:

* export tenant entries separately
* prune using metadata filters

---

# Monitoring Table Growth

Track:

* row count
* table size
* average row size

Rapid growth may indicate:

* large metadata
* large diffs
* excessive logging

---

# Backup Considerations

Ledger entries may be legally important.

Recommended:

* Include ledger tables in backups
* Retain archives separately
* Verify restore procedures

---

# Recommended Production Workflow

A typical production workflow:

1. Daily pruning of recent entries beyond a retention period
2. Weekly or monthly archival exports
3. Compression and offsite storage
4. Monitoring table size

This keeps performance stable while preserving historical data.

---

# Summary

A healthy retention strategy:

* Defines a retention window
* Archives important entries
* Prunes regularly
* Monitors table growth

These practices ensure Ledgerly remains fast and manageable even in high-volume systems.
