---
sidebar_position: 1
title: Introduction
---

# Ledgerly

**Ledgerly** is a structured audit logging engine for Laravel applications designed to record, correlate, and export business events in a consistent and reliable way.

It helps developers answer questions like:

- Who changed this?
- What exactly changed?
- When did it happen?
- What triggered it?
- Which request or process was responsible?

Ledgerly focuses on **business-level observability**, not infrastructure metrics.

---

# Why Ledgerly Exists

Many applications need reliable audit trails, activity timelines, and compliance logging. While logging libraries and activity log packages exist, they often lack:

- Structured metadata
- Correlation across actions
- Transaction grouping
- Context awareness
- Export-friendly data formats
- Extensibility without modifying the core

Ledgerly is designed to solve these problems in a predictable and scalable way.

---

# Core Principles

Ledgerly is built around a few key principles:

### 1. Immutable Logs
Once recorded, entries cannot be modified or deleted.  
Audit logs should be trustworthy and tamper-resistant.

### 2. Structured Data
Entries are stored as structured data rather than plain text logs, making them easy to query, filter, and export.

### 3. Deterministic Behavior
Metadata, context, and transactions follow clear precedence rules to ensure predictable results.

### 4. Extensibility
Applications can add metadata resolvers, context providers, and integrations without modifying the core package.

### 5. Separation of Concerns
Ledgerly separates:
- Logging
- Metadata resolution
- Context handling
- Persistence
- Exporting

This keeps the system maintainable as it grows.

---

# What Ledgerly Provides

Ledgerly Core provides:

- Immutable audit entries
- Structured action names
- Actor and target tracking
- Diff tracking
- Metadata collection
- Correlation and transactions
- Context support
- Metadata resolvers
- Export to an array and JSON
- Query scopes
- Install command

Additional packages extend functionality:

- **ledgerly/ui** – Timeline and visualization
- **ledgerly/cloud** – Aggregation, monitoring, and analysis (planned)

---

# How Ledgerly Works

At a high level, logging an entry looks like this:

```php
ledgerly()
    ->actor($user)
    ->action('billing.invoice.updated')
    ->target($invoice)
    ->withDiff([
        'amount' => [1200, 1450],
    ])
    ->log();
````

Behind the scenes, Ledgerly:

1. Validates the action and payload
2. Collects metadata using resolvers
3. Merges context and transaction data
4. Stores an immutable entry
5. Makes the entry available for querying and exporting

---

# Concepts You'll Learn

As you explore the documentation, you’ll learn about:

* Actions
* Entries
* Context
* Metadata
* Transactions
* Correlation
* Metadata resolvers
* Exporting entries

Each concept builds on the previous one, so reading in order is recommended.

---

# Who Should Use Ledgerly

Ledgerly is useful for:

* SaaS platforms
* Financial systems
* Admin panels
* Multi-tenant applications
* Compliance-sensitive applications
* Activity timelines
* Operational auditing

If your application needs to **explain what happened and why**, Ledgerly is designed for that.

---

# What Ledgerly Is Not

Ledgerly is not:

* A replacement for application logs
* A metrics or monitoring system
* A tracing or APM tool
* A real-time event streaming platform

It complements these tools by providing **structured business event history**.

---

# Next Steps

To get started, continue with:

➡️ **[Getting Started](getting-started.md)**
