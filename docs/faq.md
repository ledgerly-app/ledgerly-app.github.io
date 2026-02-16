---
sidebar_position: 99
title: FAQ
---

# FAQ

This page answers common questions about Ledgerly.

---

# General Questions

## What is Ledgerly used for?

Ledgerly is used to record **structured business events** in a reliable and queryable way.

Typical use cases include:

- Audit logs
- Activity timelines
- Compliance reporting
- Workflow tracing
- Multi-tenant observability

---

## Is Ledgerly a replacement for application logs?

No.

Ledgerly records **business-level events**, while application logs record:

- Errors
- Debug messages
- Infrastructure events

Both systems are useful and serve different purposes.

---

## Can Ledgerly replace event sourcing?

No.

Ledgerly is not an event store and is not designed to reconstruct application state.  
It records important events for auditing and observability, not domain persistence.

---

# Logging Questions

## Do I need to specify an actor every time?

No.

Actors are optional, and applications can define automatic actor resolution:

```php
Ledgerly::resolveActorUsing(fn () => auth()->user());
````

---

## Can I log entries without a target?

Yes.

Some events are system-level:

```php
ledgerly()->action('system.maintenance_started')->log();
```

---

## Can I log entries inside jobs or console commands?

Yes.

Ledgerly detects runtime context automatically and records metadata such as:

* source
* queue name
* job identifiers

---

# Metadata Questions

## What metadata is collected automatically?

Ledgerly may collect:

* request information
* correlation identifiers
* environment
* runtime source
* queue metadata

Exact metadata depends on enabled resolvers.

---

## Can I add my own metadata?

Yes:

```php
ledgerly()
    ->action('invoice.sent')
    ->withMetadata(['channel' => 'email'])
    ->log();
```

---

## How do I add metadata automatically?

Create a metadata resolver and register it in configuration:

```php
'metadata_resolvers' => [
    App\Resolvers\TenantMetadataResolver::class,
],
```

---

# Context Questions

## When should I use context instead of metadata?

Use context when:

* A value applies to multiple entries
* The value represents the runtime state

Example:

```
tenant_id
batch_id
workflow_id
```

Use explicit metadata when:

* The value applies to one entry only.

---

## Does context leak between requests?

No.

Ledgerly uses lifecycle-scoped services to ensure context is isolated per request or job.

Scoped context is also automatically restored after execution.

---

# Transactions and Correlation

## When should I use transactions?

Use transactions when:

* A workflow generates multiple entries
* Steps should be grouped together
* Correlation is useful for debugging or reporting

---

## Do transactions affect database transactions?

No.

Ledgerly transactions are **logical transactions**, not database transactions.
They group entries but do not control database commits or rollbacks.

---

# Performance Questions

## Is Ledgerly slow?

No.

Ledgerly is designed to be lightweight:

* Metadata resolvers are small and fast
* Entries are simple inserts
* No heavy processing occurs during logging

Most applications can log entries with negligible overhead.

---

## Can Ledgerly handle high-volume logging?

Yes.

For very high-volume scenarios, recommended practices include:

* Avoid large metadata payloads
* Avoid heavy resolver logic
* Use queue workers if needed

---

# Security and Compliance

## Can entries be modified or deleted?

No.

Ledger entries are immutable by design to ensure audit integrity.

If corrections are needed, log a new entry.

---

## Can I store sensitive data in metadata?

It is not recommended.

Avoid storing:

* Passwords
* Tokens
* Personal data unless required and encrypted

Ledgerly does not encrypt metadata automatically.

---

# Exports and Integrations

## Can I export entries?

Yes:

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

## Can Ledgerly integrate with external systems?

Yes.

Common integrations include:

* Analytics pipelines
* Audit exports
* Monitoring dashboards

---

# UI and Visualization

## Does Ledgerly include a UI?

Ledgerly Core is UI-agnostic.

Visualization is provided by:

* ledgerly/ui
* Custom dashboards
* Admin panels

---

# Troubleshooting

## Why is metadata empty in tests?

This usually happens when:

* Metadata resolvers are not registered
* Configuration is overridden in tests
* Pipeline instances are cached

Ensure resolvers are configured and the pipeline is resolved after configuration is set.

---

## Why are entries missing actors?

Possible causes:

* Actor resolver isn’t configured
* Authentication is not available in the current context
* Actor explicitly set to null

---

# Future Development

## What features are planned?

Planned areas include:

* Improved observability
* Multi-application aggregation
* Cloud services
* Advanced analytics integrations

---

# Getting Help

If you need help:

* Check the documentation
* Review examples
* Open an issue on GitHub

---

# Next Step

Continue to:

➡️ **[Upgrade Guides](upgrade-guide.md)**
