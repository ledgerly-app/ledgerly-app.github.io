---
sidebar_position: 3
title: Exporting Entries
---

# Exporting Entries

Ledgerly provides built-in methods for exporting ledger entries in structured formats.

Exports are useful for:

- Compliance reports
- Archiving
- Analytics pipelines
- Data migrations
- Integrations with external systems

Exports preserve:

- action
- actor
- target
- diff
- metadata
- severity
- timestamps

---

# Exporting a Single Entry

Convert an entry to an array:

```php
$entry->toArray();
````

Convert to JSON:

```php
$entry->toJson();
```

These methods return a stable, structured representation of the entry.

---

# Exporting Multiple Entries

Example exporting a collection:

```php
$entries = LedgerEntry::latest()->take(100)->get();

$data = $entries->map->toArray();
```

This produces a collection of structured entries ready for serialization.

---

# Exporting to a File

Example exporting to a JSON file:

```php
$entries = LedgerEntry::latest()->get();

file_put_contents(
    storage_path('exports/ledger.json'),
    $entries->toJson(JSON_PRETTY_PRINT)
);
```

This is useful for:

* backups
* reporting
* data exchange

---

# Exporting by Date Range

Example exporting entries for the last 24 hours:

```php
$entries = LedgerEntry::whereBetween('created_at', [
    now()->subDay(),
    now(),
])->get();

$data = $entries->map->toArray();
```

This is commonly used for scheduled exports.

---

# Exporting by Tenant or Metadata

Example:

```php
$entries = LedgerEntry::where('metadata->tenant_id', 42)->get();
```

This allows exporting tenant-specific audit logs.

---

# Exporting a Workflow (Correlation)

To export all entries belonging to a workflow:

```php
$entries = LedgerEntry::withinCorrelation($correlationId)->get();
```

This is useful for:

* debugging workflows
* auditing operations
* investigating incidents

---

# Streaming Large Exports

For large datasets, process entries in chunks:

```php
LedgerEntry::chunk(1000, function ($entries) {
    foreach ($entries as $entry) {
        // process export
    }
});
```

This prevents memory exhaustion when exporting large tables.

---

# Scheduled Exports

Example scheduled export in a command:

```php
public function handle()
{
    $entries = LedgerEntry::whereDate('created_at', today())->get();

    Storage::put(
        'exports/ledger-' . today()->toDateString() . '.json',
        $entries->toJson(JSON_PRETTY_PRINT)
    );
}
```

This pattern is commonly used for compliance archives.

---

# Export Format Stability

Ledgerly ensures that exported entries have a stable structure so that:

* External systems can rely on consistent keys
* Backups remain compatible
* Long-term storage remains usable

Fields may be added in future versions, but existing fields are not removed without a major version change.

---

# Example Export Structure

Example entry export:

```json
{
  "id": 123,
  "action": "invoice.updated",
  "severity": "info",
  "actor": {
    "type": "App\\Models\\User",
    "id": 5
  },
  "target": {
    "type": "App\\Models\\Invoice",
    "id": 42
  },
  "diff": {
    "amount": [100, 150]
  },
  "metadata": {
    "tenant_id": 42,
    "request_id": "abc123"
  },
  "created_at": "2026-02-01T12:00:00Z"
}
```

---

# Best Practices for Exporting

Recommended:

* Export by date range
* Use chunking for large datasets
* Store exports outside the main database
* Compress archives when necessary

Avoid:

* Exporting entire tables in web requests
* Running large exports synchronously

Use queue workers for heavy export tasks.

---

# Integrating with External Systems

Exports can be used to:

* Send logs to analytics tools
* Feed audit pipelines
* Push events to monitoring systems

Example:

```php
Http::post($endpoint, [
    'entries' => $entries->map->toArray(),
]);
```
