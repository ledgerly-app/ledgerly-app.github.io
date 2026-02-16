---
sidebar_position: 2
title: Actions
---

# Actions

An **action** describes what happened in a Ledger Entry.  
It is the most important part of an entry because it defines the event being recorded.

Examples:

```

billing.invoice.created
billing.invoice.updated
billing.payment.approved
auth.user.logged_in

```

Every ledger entry must include an action.

---

# Why Structured Actions Matter

Using structured action names makes it possible to:

- Filter entries easily
- Build activity timelines
- Generate reports
- Aggregate events across services
- Maintain consistency in large teams

Without structure, logs quickly become inconsistent and hard to query.

---

# Action Format

Ledgerly enforces a structured format:

```

<domain>.<resource>.<verb>

```

Examples:

```

billing.invoice.created
billing.invoice.sent
auth.user.logged_in
payments.payment.failed

```

This format helps organize events logically.

---

# Action Components

## Domain

The domain groups related parts of the system.

Examples:

```

billing
auth
payments
subscriptions

```

Domains are optional but recommended for larger systems.

---

## Resource

The resource represents the entity being acted upon.

Examples:

```

invoice
payment
user
subscription

```

Resources should usually match your model or business concept names.

---

## Verb

The verb describes what happened.

Ledgerly validates verbs to encourage consistency.

Common verbs include:

```

created
updated
deleted
restored
attached
detached
enabled
disabled
sent
received
logged_in
logged_out
approved
rejected

````

Using consistent verbs makes filtering and reporting much easier.

---

# Logging an Action

Example:

```php
ledgerly()
    ->action('billing.invoice.created')
    ->log();
````

With actor and target:

```php
ledgerly()
    ->actor(auth()->user())
    ->target($invoice)
    ->action('billing.invoice.updated')
    ->log();
```

---

# Choosing Good Action Names

Good actions are:

* Specific
* Predictable
* Consistent
* Verb-based

Good examples:

```
billing.invoice.created
billing.invoice.sent
billing.invoice.marked_overdue
billing.subscription.cancelled
billing.payment.failed
```

Avoid:

```
invoice.changed
data.updated
action.performed
event.logged
```

These provide little useful information.

---

# Naming Guidelines

## Use Past Tense

Actions should describe something that already happened:

Good:

```
invoice.created
payment.failed
```

Avoid:

```
invoice.create
payment.fail
```

---

## Avoid Technical Noise

Actions should describe **business events**, not implementation details.

Avoid:

```
model.saved
controller.executed
job.processed
```

Prefer:

```
invoice.created
invoice.updated
invoice.emailed
```

---

## Be Consistent

If you use:

```
invoice.created
```

Do not later introduce:

```
invoice.create
invoice.was_created
```

Consistency is more important than perfection.

---

# Action Validation

Ledgerly validates actions to ensure:

* Correct format
* Allowed verbs
* Non-empty values

Invalid actions will throw an exception.

This protects data quality over time.

---

# Using Custom Verbs

If your application needs custom verbs, you can extend validation rules in configuration or validators (depending on your setup).

Custom verbs should still follow naming guidelines:

Good:

```
invoice.marked_overdue
subscription.trial_started
```

---

# Filtering by Action

Actions are easy to query:

```php
LedgerEntry::forAction('invoice.created')->get();
```

You can also filter by prefixes:

```
invoice.*
billing.*
```

This makes analytics and reporting easier.

---

# Actions and Severity

Actions can be combined with severity levels:

```php
ledgerly()
    ->severity('warning')
    ->action('invoice.overdue')
    ->log();
```

This helps distinguish informational events from critical ones.

---

# Best Practices

Recommended conventions:

* Use lowercase
* Use dots as separators
* Use past tense verbs
* Keep names short but descriptive
* Prefer business terminology

---

# Next Step

Continue to:

➡️ **[Metadata](metadata.md)**
