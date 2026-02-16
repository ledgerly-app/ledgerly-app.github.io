---
sidebar_position: 1
title: Architecture Overview
---

# Architecture Overview

Ledgerly is designed as a layered system that separates responsibilities into small, focused components.

This architecture ensures:

- Predictable behavior
- Extensibility
- Testability
- Clear public API boundaries

This page provides a high-level overview of how Ledgerly works internally.

---

# High-Level Flow

When you log an entry:

```php
ledgerly()
    ->actor($user)
    ->action('billing.invoice.updated')
    ->target($invoice)
    ->log();
````

Ledgerly performs the following steps:

1. Collects builder state (actor, action, target, metadata, diff)
2. Resolves metadata using the metadata pipeline
3. Merges transaction and context metadata
4. Validates the payload
5. Creates an immutable LedgerEntry
6. Stores it in the database
7. Resets builder state

Each step is handled by a separate component.

---

# Core Components

Ledgerly Core is structured into several main parts.

## Builder

The builder provides the public API:

```php
ledgerly()->action(...)->log();
```

Responsibilities:

* Collect runtime data
* Coordinate logging
* Delegate work to other components

The builder does not perform validation or persistence directly.

---

## EntryPayload

EntryPayload is a data object that represents a complete ledger entry before persistence.

Responsibilities:

* Encapsulate entry data
* Provide a stable structure
* Decouple builder from storage

This improves testability and separation of concerns.

---

## EntryValidator

The validator ensures entries are valid before being stored.

Validation includes:

* Action format
* Diff structure
* Metadata structure
* Required fields

Invalid entries throw exceptions to prevent bad data.

---

## LedgerEntryFactory

The factory converts payloads into Eloquent models.

Responsibilities:

* Create LedgerEntry instances
* Apply casts and defaults
* Persist entries

This keeps persistence logic separate from the builder.

---

## Metadata Pipeline

The metadata pipeline collects metadata from multiple sources.

Resolvers may include:

* Source resolver
* Request resolver
* Job resolver
* Context resolver
* Environment resolver

Resolvers are configurable and executed in order.

---

## MetadataAssembler

The assembler merges metadata from multiple layers:

1. Pipeline metadata
2. Transaction metadata
3. Context metadata
4. Explicit metadata

Later layers override earlier ones.

This ensures deterministic behavior.

---

## ContextStore

ContextStore maintains runtime context values.

Responsibilities:

* Store context layers
* Support scoped context
* Restore context automatically
* Provide values to metadata resolvers

Context uses a stack-based design to support nesting safely.

---

## TransactionManager

TransactionManager handles:

* Correlation identifiers
* Transaction lifecycle
* Nested transactions
* Duration tracking

Transactions are lightweight and safe to use frequently.

---

## Metadata Resolvers

Resolvers are small classes responsible for supplying metadata.

Examples:

* SourceMetadataResolver
* RequestMetadataResolver
* JobMetadataResolver
* EnvironmentMetadataResolver

Resolvers are configured via:

```
config/ledgerly.php
```

Applications can register custom resolvers.

---

# Public API vs. Internal Components

Ledgerly defines a clear boundary.

## Public API (Stable)

These are safe to depend on:

* ledgerly() helper
* Builder methods
* LedgerEntry model
* Query scopes
* Export methods
* Events
* Configuration

## Internal Components

These are not part of the public API and may change:

* Factories
* Validators
* Assemblers
* Internal services

Internal classes are marked with `@internal`.

---

# Metadata Flow Diagram

Conceptually, metadata flows like this:

```
Resolvers
   ↓
Transaction metadata
   ↓
Context metadata
   ↓
Explicit metadata
   ↓
Stored in entry
```

Each step overrides earlier values if keys conflict.

---

# Logging Lifecycle

A simplified lifecycle:

```
Builder collects data
→ Metadata resolved
→ Payload built
→ Payload validated
→ Entry persisted
→ Builder reset
```

Resetting the builder ensures the state does not leak between logs.

---

# Extensibility Points

Ledgerly is designed to be extended safely.

Common extension points:

* Metadata resolvers
* Actor resolvers
* Severity mapping
* UI integrations
* Export pipelines

These extension points allow customization without modifying the core.

---

# Design Principles

Ledgerly follows several design principles:

### Immutability

Entries cannot be modified or deleted.

### Deterministic Behavior

Metadata merging and transactions behave predictably.

### Separation of Concerns

Each component has a single responsibility.

### Laravel-Native Design

Ledgerly uses familiar Laravel patterns:

* Service container
* Config-driven behavior
* Eloquent models
* Artisan commands

---

# Future Architecture

Ledgerly is designed to support:

* UI visualization
* Cloud aggregation
* Multi-application logging
* Analytics pipelines

The core architecture is intentionally small and focused to support these layers.

---

# Next Step

Continue to:

➡️ **[Extending Ledgerly](extending.md)**
