---
sidebar_position: 10
title: Cursor-Based Pagination
---

# Cursor-Based Pagination

When working with large audit tables, traditional offset pagination becomes slow and inefficient. Cursor-based pagination is a better alternative for high-volume datasets.

This guide explains how to use cursor pagination with Ledgerly entries.

---

# Why Cursor Pagination?

Offset pagination:

```php
LedgerEntry::latest()->paginate(50);
````

Problems with large tables:

* Slow queries at high offsets
* Increasing query cost
* Inconsistent results if rows change

Cursor pagination avoids these issues by using a stable reference point.

---

# Basic Example

Using Laravel’s built-in cursor pagination:

```php
use Ledgerly\Core\Models\LedgerEntry;

$entries = LedgerEntry::orderBy('id')->cursorPaginate(50);
```

This retrieves the next set of entries based on the last seen record rather than an offset.

---

# Displaying Results in a Controller

Example:

```php
public function index()
{
    $entries = LedgerEntry::orderBy('id')->cursorPaginate(50);

    return view('entries.index', compact('entries'));
}
```

Blade example:

```blade
@foreach ($entries as $entry)
    {{ $entry->action }}
@endforeach

{{ $entries->links() }}
```

---

# Cursor Pagination for Timelines

Example timeline query:

```php
LedgerEntry::forTarget($invoice)
    ->orderBy('id')
    ->cursorPaginate(50);
```

This works efficiently even with millions of rows.

---

# Cursor Pagination by Date

Example:

```php
LedgerEntry::whereDate('created_at', today())
    ->orderBy('id')
    ->cursorPaginate(100);
```

Cursor pagination works best with a stable ordering column like `id` or `created_at`.

---

# Choosing the Ordering Column

Recommended:

* id (best)
* created_at (acceptable if indexed)

Avoid:

* non-indexed columns
* computed columns

A stable ordering column ensures reliable pagination.

---

# API Example

Cursor pagination works well in APIs:

```php
return LedgerEntry::orderBy('id')
    ->cursorPaginate(50)
    ->toArray();
```

Response will include a cursor token instead of page numbers.

---

# Cursor vs. Offset Pagination

| Feature         | Offset   | Cursor    |
|-----------------|----------|-----------|
| Large tables    | Slow     | Fast      |
| Stable results  | No       | Yes       |
| Page numbers    | Yes      | No        |
| API performance | Moderate | Excellent |

---

# When to Use Cursor Pagination

Recommended for:

* Activity timelines
* Audit logs
* Infinite scroll interfaces
* APIs with large datasets

Offset pagination is acceptable for:

* small tables
* admin panels with limited data

---

# Performance Tips

For best performance:

* Always index the ordering column
* Prefer ordering by id
* Combine with filtering by date range

Example:

```php
LedgerEntry::where('severity', 'error')
    ->orderBy('id')
    ->cursorPaginate(50);
```

---

# Summary

Cursor pagination:

* Scales better than offset pagination
* Keeps queries fast on large tables
* Works well with timelines and APIs

For large audit logs, cursor pagination is strongly recommended.

