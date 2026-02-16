---
sidebar_position: 1
title: Logging Entries
---

# Logging Entries

This guide shows how to log entries in real applications using Ledgerly.  
It focuses on common patterns and recommended usage.

---

# Basic Logging

The simplest entry:

```php
ledgerly()
    ->action('invoice.created')
    ->log();
````

This records:

* action
* timestamp
* metadata collected automatically

---

# Logging with Actor

To record who performed an action:

```php
ledgerly()
    ->actor(auth()->user())
    ->action('invoice.created')
    ->log();
```

Actors are stored as polymorphic relationships.

Actors are optional but recommended for user-driven events.

---

# Logging with Target

To record what was affected:

```php
ledgerly()
    ->actor(auth()->user())
    ->target($invoice)
    ->action('invoice.updated')
    ->log();
```

Targets help build activity timelines and audit trails.

---

# Logging Changes (Diffs)

When recording updates, include diffs:

```php
ledgerly()
    ->actor(auth()->user())
    ->target($invoice)
    ->action('invoice.updated')
    ->withDiff([
        'amount' => [1200, 1450],
        'status' => ['draft', 'sent'],
    ])
    ->log();
```

Each diff entry should follow:

```
[field => [before, after]]
```

Diffs make logs much more useful for auditing.

---

# Logging with Metadata

You can attach structured metadata:

```php
ledgerly()
    ->action('invoice.sent')
    ->withMetadata([
        'channel' => 'email',
        'attempt' => 1,
    ])
    ->log();
```

Explicit metadata overrides automatic metadata if keys overlap.

---

# Logging with Severity

Severity helps categorize entries:

```php
ledgerly()
    ->severity('warning')
    ->action('invoice.overdue')
    ->log();
```

Common severity levels:

```
info
warning
error
critical
```

Severity is optional.

---

# Logging Inside Transactions

Transactions group related entries:

```php
ledgerly()->transaction(function () use ($invoice) {

    ledgerly()->action('invoice.created')
        ->target($invoice)
        ->log();

    ledgerly()->action('invoice.sent')
        ->target($invoice)
        ->log();

});
```

Entries inside a transaction share a correlation identifier.

Use transactions for:

* workflows
* batch processes
* multi-step operations

---

# Logging with Context

Context automatically applies metadata:

```php
ledgerly()->context([
    'tenant_id' => 42,
]);

ledgerly()->action('invoice.created')->log();
```

This avoids repeating metadata.

---

# Scoped Context

Context can be limited to a specific block:

```php
ledgerly()->withContext(['tenant_id' => 42], function () {

    ledgerly()->action('invoice.created')->log();
    ledgerly()->action('invoice.sent')->log();

});
```

Context is restored automatically.

---

# Automatic Actor Resolution

If your application always has an authenticated user, you can configure an actor resolver:

```php
Ledgerly::resolveActorUsing(function () {
    return auth()->user();
});
```

After this, actors are attached automatically when available.

---

# Logging System Events

Some events are system-level:

```php
ledgerly()->action('system.maintenance_started')->log();
```

Actors and targets are optional.

---

# Logging in Background Jobs

Ledgerly works inside jobs:

```php
public function handle()
{
    ledgerly()
        ->action('import.started')
        ->log();
}
```

Metadata such as:

* source
* queue
* job_id

may be collected automatically.

---

# Logging Failures

When handling exceptions:

```php
try {
    $service->process();
} catch (Throwable $e) {

    ledgerly()
        ->action('payment.failed')
        ->severity('error')
        ->withMetadata([
            'error' => $e->getMessage(),
        ])
        ->log();

    throw $e;
}
```

Ledgerly records the business impact while application logs record technical details.

---

# Logging in Middleware

Example of setting context in middleware:

```php
ledgerly()->context([
    'tenant_id' => $tenant->id,
]);
```

All entries in that request inherit the context.

---

# Best Practices for Logging

Recommended:

* Log meaningful business events
* Use consistent action names
* Record diffs for updates
* Use context for shared values
* Use transactions for workflows

Avoid:

* Logging technical noise
* Logging large metadata blobs
* Logging sensitive data
