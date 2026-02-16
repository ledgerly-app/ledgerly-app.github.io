---
sidebar_position: 2
title: Getting Started
---

# Getting Started

This guide will help you install Ledgerly and record your first audit entry in just a few minutes.

---

# Requirements

Ledgerly requires:

- PHP 8.2+
- Laravel 11+
- A configured database connection

---

# Installation

Install Ledgerly using Composer:

```bash
composer require ledgerly-app/core
````

Run the installation command:

```bash
php artisan ledgerly:install
```

Then run migrations:

```bash
php artisan migrate
```

This creates the table used to store audit entries.

---

# Logging Your First Entry

You can log an entry anywhere in your application:

```php
ledgerly()
    ->action('billing.invoice.created')
    ->log();
```

That’s it — an immutable audit entry has been stored.

---

# Logging with Actor and Target

Most audit entries include context about **who performed an action** and **what was affected**.

Example:

```php
ledgerly()
    ->actor(auth()->user())
    ->action('billing.invoice.updated')
    ->target($invoice)
    ->log();
```

Ledgerly will store polymorphic references to the actor and target.

---

# Recording Changes (Diffs)

You can record attribute changes:

```php
ledgerly()
    ->action('billing.invoice.updated')
    ->withDiff([
        'amount' => [1200, 1450],
        'status' => ['draft', 'sent'],
    ])
    ->log();
```

Diffs help build activity timelines and audits.

---

# Adding Metadata

You can attach additional structured metadata:

```php
ledgerly()
    ->action('billing.invoice.sent')
    ->withMetadata([
        'channel' => 'email',
    ])
    ->log();
```

Ledgerly also collects metadata automatically, such as request and environment information.

---

# Using Transactions (Correlation)

To group multiple entries together:

```php
ledgerly()->transaction(function () {

    ledgerly()->action('billing.invoice.created')->log();
    ledgerly()->action('billing.invoice.sent')->log();

});
```

Entries inside a transaction share a correlation identifier.

---

# Using Context

Context allows attaching values that apply to multiple entries.

Example:

```php
ledgerly()->context([
    'tenant_id' => 42,
]);

ledgerly()->action('billing.invoice.created')->log();
```

All later entries will include this context in metadata.

---

# Scoped Context

You can limit context to a specific block:

```php
ledgerly()->withContext(['tenant_id' => 42], function () {
    ledgerly()->action('billing.invoice.created')->log();
});
```

Context is automatically restored after the block.

---

# Querying Entries

You can query entries using Eloquent:

```php
use Ledgerly\Core\Models\LedgerEntry;

$entries = LedgerEntry::latest()->take(10)->get();
```

Ledgerly also provides query scopes:

```php
LedgerEntry::forAction('billing.invoice.updated')->get();
LedgerEntry::forActor($user)->get();
LedgerEntry::forTarget($invoice)->get();
```

---

# Exporting Entries

Ledger entries can be exported:

```php
$entry->toArray();
$entry->toJson();
```

Exports preserve metadata, context, and diffs.

---

# What to Read Next

To understand how Ledgerly works internally, continue with:

➡️ **[Core Concepts](./core/entries.md)**
