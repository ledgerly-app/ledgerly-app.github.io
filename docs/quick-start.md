---
sidebar_position: 1
title: Quick Start (5 Minutes)
---

# Quick Start (5 Minutes)

This guide walks you through installing Ledgerly and logging your first real workflow in just a few minutes.

By the end, you will:

- Install Ledgerly
- Log an entry
- Record a change with a diff
- Group entries with a transaction
- Add context

---

# Step 1: Install Ledgerly

Install the package using Composer:

```bash
composer require ledgerly-app/core
````

Run the install command:

```bash
php artisan ledgerly:install
```

Run migrations:

```bash
php artisan migrate
```

Ledgerly is now ready to use.

---

# Step 2: Log Your First Entry

Anywhere in your application:

```php
ledgerly()
    ->action('invoice.created')
    ->log();
```

This creates an immutable audit entry in the database.

---

# Step 3: Log an Entry with Actor and Target

Example inside a controller:

```php
ledgerly()
    ->actor(auth()->user())
    ->target($invoice)
    ->action('invoice.updated')
    ->log();
```

This records:

* Who performed the action
* What was affected
* When it happened

---

# Step 4: Record What Changed

Diff tracking makes logs much more useful:

```php
ledgerly()
    ->actor(auth()->user())
    ->target($invoice)
    ->action('invoice.updated')
    ->withDiff([
        'amount' => [1200, 1450],
    ])
    ->log();
```

This records both the previous and new value.

---

# Step 5: Group Multiple Events with a Transaction

Transactions group related entries:

```php
ledgerly()->transaction(function () use ($invoice) {

    ledgerly()->action('invoice.created')
        ->target($invoice)
        ->log();

    ledgerly()->action('invoice.sent')
        ->target($invoice)
        ->withMetadata(['channel' => 'email'])
        ->log();

});
```

Both entries share a correlation identifier, allowing workflows to be reconstructed later.

---

# Step 6: Add Context

Context automatically applies values to multiple entries:

```php
ledgerly()->context([
    'tenant_id' => 42,
]);

ledgerly()->action('invoice.created')->log();
ledgerly()->action('invoice.sent')->log();
```

Each entry now includes:

```
tenant_id = 42
```

---

# Step 7: Query Entries

Retrieve recent entries:

```php
use Ledgerly\Core\Models\LedgerEntry;

$entries = LedgerEntry::latest()->take(10)->get();
```

Filter by action:

```php
LedgerEntry::forAction('invoice.updated')->get();
```

---

# Step 8: Export Entries

Entries can be exported:

```php
$entry->toArray();
$entry->toJson();
```

Exports preserve:

* metadata
* context
* diffs
* severity

---

# What You Learned

In a few minutes, you learned how to:

* Install Ledgerly
* Log entries
* Track changes
* Use transactions
* Use context
* Query entries

This is enough to start using Ledgerly in a real application.
