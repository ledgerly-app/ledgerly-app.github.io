---
sidebar_position: 5
title: Real-World Examples
---

# Real-World Examples

This page demonstrates how Ledgerly can be used in real applications.  
The examples focus on common patterns such as SaaS systems, background jobs, and billing workflows.

---

# Multi-Tenant SaaS Application

In a multi-tenant system, nearly every action belongs to a tenant.

Instead of repeating tenant metadata on every log call, use context.

Example middleware:

```php
ledgerly()->context([
    'tenant_id' => $tenant->id,
]);
````

Now every entry automatically includes tenant information:

```php
ledgerly()->action('invoice.created')->log();
ledgerly()->action('invoice.sent')->log();
```

Resulting metadata:

```
tenant_id = 42
```

This makes filtering and reporting easy.

---

# Billing Workflow

A billing operation often involves multiple steps:

* Invoice created
* Payment authorized
* Receipt generated
* Email sent

These events should be correlated.

Example:

```php
ledgerly()->transaction(function () use ($invoice, $payment) {

    ledgerly()->action('invoice.created')
        ->target($invoice)
        ->log();

    ledgerly()->action('payment.authorized')
        ->target($payment)
        ->log();

    ledgerly()->action('invoice.receipt_sent')
        ->target($invoice)
        ->withMetadata(['channel' => 'email'])
        ->log();

});
```

All entries share the same correlation identifier, allowing the workflow to be reconstructed later.

---

# Recording Model Changes

When updating a model, record the diff:

```php
$before = $invoice->amount;

$invoice->update([
    'amount' => 1500,
]);

ledgerly()
    ->actor(auth()->user())
    ->target($invoice)
    ->action('invoice.updated')
    ->withDiff([
        'amount' => [$before, $invoice->amount],
    ])
    ->log();
```

Diffs make timelines and audits significantly more useful.

---

# Background Job Processing

Queue workers often process many records.

Use transactions to group entries per job:

```php
ledgerly()->transaction(function () use ($batch) {

    foreach ($batch->records as $record) {
        ledgerly()
            ->action('record.processed')
            ->target($record)
            ->log();
    }

});
```

This allows identifying all entries related to a single job execution.

---

# Import or Batch Processing

Batch operations are a perfect use case for context.

```php
ledgerly()->withContext([
    'import_id' => $import->id,
], function () use ($rows) {

    foreach ($rows as $row) {
        ledgerly()
            ->action('customer.imported')
            ->log();
    }

});
```

Each entry automatically includes:

```
import_id
```

---

# User Activity Timeline

Ledgerly works well for building activity timelines.

Example events:

```
user.registered
user.email_verified
subscription.started
subscription.cancelled
```

Each event records:

* actor
* timestamp
* metadata
* optional diff

These entries can be displayed in a UI timeline using ledgerly/ui.

---

# Security and Compliance Logging

Security-sensitive systems often need to record important actions:

```php
ledgerly()
    ->actor(auth()->user())
    ->action('user.password_changed')
    ->severity('warning')
    ->log();
```

Recommended events to log:

* password changes
* role updates
* permission changes
* account lockouts

Avoid storing sensitive values in metadata.

---

# External API Integration

If an API gateway provides a correlation ID:

```php
ledgerly()->context([
    'correlation_id' => request()->header('X-Correlation-ID'),
]);
```

This allows tracing requests across multiple services.

---

# Feature Flags and Experiments

When running A/B tests:

```php
ledgerly()->withContext([
    'feature' => 'checkout_v2',
], function () {

    ledgerly()->action('checkout.started')->log();
    ledgerly()->action('checkout.completed')->log();

});
```

This allows filtering events by feature rollout.

---

# Scheduled Tasks

Scheduled jobs often run periodically:

```php
ledgerly()->action('maintenance.cleanup_started')->log();
```

Ledgerly automatically records metadata such as:

* source = scheduler
* environment
* timestamp

This makes scheduled activity traceable.

---

# Error Tracking Example

Ledgerly can complement error logging:

```php
try {
    $service->process();
} catch (Throwable $e) {

    ledgerly()
        ->action('payment.processing_failed')
        ->severity('error')
        ->withMetadata([
            'error' => $e->getMessage(),
        ])
        ->log();

    throw $e;
}
```

Ledgerly records the business impact, while application logs record technical details.

---

# Best Practices for Real-World Use

In production systems:

* Use context for tenant or workflow identifiers
* Use transactions for multistep operations
* Keep metadata small
* Log meaningful business events
* Keep action naming consistent
