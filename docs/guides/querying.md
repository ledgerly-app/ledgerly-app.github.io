---
sidebar_position: 2
title: Querying Entries
---

# Querying Entries

Ledger entries are stored using Eloquent, so you can query them using familiar Laravel patterns.

Ledgerly also provides useful query scopes for common filtering operations.

---

# Basic Queries

Retrieve recent entries:

```php
use Ledgerly\Core\Models\LedgerEntry;

$entries = LedgerEntry::latest()->take(20)->get();
````

Retrieve all entries:

```php
$entries = LedgerEntry::all();
```

---

# Filtering by Action

Retrieve entries for a specific action:

```php
LedgerEntry::forAction('invoice.updated')->get();
```

This is useful for reporting and analytics.

---

# Filtering by Actor

Retrieve entries performed by a specific user:

```php
LedgerEntry::forActor($user)->get();
```

This works with any polymorphic actor model.

---

# Filtering by Target

Retrieve entries related to a specific model:

```php
LedgerEntry::forTarget($invoice)->get();
```

This is useful for activity timelines.

---

# Filtering by Correlation

Retrieve entries belonging to the same workflow:

```php
LedgerEntry::withinCorrelation($correlationId)->get();
```

This allows reconstructing transactions and workflows.

---

# Filtering by Severity

Retrieve entries by severity:

```php
LedgerEntry::where('severity', 'error')->get();
```

Or using a scope if available:

```php
LedgerEntry::forSeverity('warning')->get();
```

Severity filtering is useful for dashboards and alerting.

---

# Filtering by Date Range

Retrieve entries within a time period:

```php
LedgerEntry::whereBetween('created_at', [
    now()->subDay(),
    now(),
])->get();
```

This is useful for reports and audits.

---

# Combining Filters

You can combine scopes and conditions:

```php
LedgerEntry::forActor($user)
    ->forAction('invoice.updated')
    ->latest()
    ->get();
```

This retrieves updates performed by a specific user.

---

# Building an Activity Timeline

Example:

```php
$entries = LedgerEntry::forTarget($invoice)
    ->latest()
    ->get();
```

This can be displayed in:

* admin panels
* timeline views
* audit logs

---

# Paginating Results

For large datasets, use pagination:

```php
$entries = LedgerEntry::latest()->paginate(50);
```

Pagination is recommended for dashboards and APIs.

---

# Querying Metadata

Metadata is stored as JSON, so you can query it:

Example (MySQL / PostgreSQL):

```php
LedgerEntry::where('metadata->tenant_id', 42)->get();
```

This is useful for:

* multi-tenant filtering
* batch operations
* correlation across systems

---

# Querying Diffs

Example:

```php
LedgerEntry::whereNotNull('diff')->get();
```

Or filter specific fields:

```php
LedgerEntry::whereJsonContains('diff', ['status' => ['draft', 'sent']])->get();
```

Useful for auditing changes.

---

# Sorting Entries

Retrieve oldest first:

```php
LedgerEntry::oldest()->get();
```

Retrieve newest first:

```php
LedgerEntry::latest()->get();
```

---

# Performance Tips

When querying large datasets:

Recommended:

* Use pagination
* Filter by date ranges
* Use indexes (created_at, action, severity)
* Avoid loading unnecessary relations

Avoid:

* Retrieving entire tables
* Large unfiltered exports in web requests

---

# Example: Dashboard Query

Example showing recent critical events:

```php
$entries = LedgerEntry::where('severity', 'critical')
    ->latest()
    ->take(20)
    ->get();
```

---

# Example: Tenant Activity

```php
LedgerEntry::where('metadata->tenant_id', $tenantId)
    ->latest()
    ->paginate(50);
```

---

# Example: Workflow Reconstruction

```php
$entries = LedgerEntry::withinCorrelation($correlationId)
    ->oldest()
    ->get();
```

This allows replaying a workflow step by step.
