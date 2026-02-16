---
sidebar_position: 3
title: Design Principles
---

# Design Principles

Ledgerly is designed to provide reliable, structured audit logging for Laravel applications.  
Its architecture and features are guided by a small set of core principles that shape how the system behaves and evolves.

Understanding these principles helps developers use Ledgerly effectively and extend it safely.

---

# 1. Immutability First

Ledger entries are **immutable**.

Once recorded, entries:

- Cannot be updated
- Cannot be deleted
- Cannot be altered

This ensures:

- Trustworthy audit trails
- Compliance readiness
- Reliable historical data

If corrections are required, the correct approach is to log a new entry rather than modifying an existing one.

---

# 2. Structured Data Over Text Logs

Ledgerly records structured data instead of plain text logs.

Each entry contains:

- Action
- Actor
- Target
- Diff
- Metadata
- Timestamps

Structured data allows:

- Querying
- Filtering
- Aggregation
- Exporting
- Visualization

This makes Ledgerly suitable for analytics and auditing workflows.

---

# 3. Business Events Over Technical Events

Ledgerly is designed to record **business-level events**, not technical noise.

Good entries describe meaningful events:

```

invoice.created
payment.approved
subscription.cancelled

```

Avoid logging:

```

model.saved
job.executed
controller.run

```

Technical logs belong in application logs, not audit trails.

---

# 4. Deterministic Behavior

Ledgerly is designed so that logging behavior is predictable.

Examples:

- Metadata merging follows a defined order
- Context precedence is deterministic
- Transactions behave consistently
- Validation prevents inconsistent data

Deterministic systems are easier to debug, test, and reason about.

---

# 5. Separation of Concerns

Ledgerly separates responsibilities into focused components:

- Builder (public API)
- Metadata pipeline
- Context management
- Transactions
- Validation
- Persistence
- Exporting

Each component has a single responsibility, which:

- Improves maintainability
- Reduces bugs
- Makes testing easier

---

# 6. Extensibility Without Modification

Ledgerly is designed so applications can extend behavior without modifying core code.

Supported extension points include:

- Metadata resolvers
- Context values
- Actor resolution
- Export integrations
- UI integrations

This ensures upgrades remain safe and predictable.

---

# 7. Laravel-Native Design

Ledgerly follows Laravel conventions wherever possible:

- Service container
- Configuration files
- Eloquent models
- Artisan commands
- Facade-style helper

This makes Ledgerly feel familiar and easy to adopt.

---

# 8. Lightweight by Default

Ledgerly is designed to be fast and lightweight:

- Logging is a simple insert
- Metadata resolvers are small
- No heavy background processing is required

This allows Ledgerly to be used in:

- Web requests
- Queue workers
- Console commands

without significant performance overhead.

---

# 9. Observability Through Context

Modern applications need visibility into workflows, not just individual events.

Ledgerly supports:

- Context
- Correlation
- Transactions
- Metadata pipelines

These features allow developers to understand:

- What happened
- Why it happened
- In which workflow it occurred

---

# 10. Explicit Is Better Than Implicit

Ledgerly favors explicit behavior:

- Actions must be defined
- Validation is strict
- Metadata merging is predictable
- Public APIs are clearly defined

This prevents silent failures and inconsistent data.

---

# 11. Stability of Public APIs

Ledgerly maintains a clear boundary between:

- Public APIs (stable)
- Internal classes (subject to change)

Applications should rely only on documented public APIs.

Internal classes marked with `@internal` may change between releases.

---

# 12. Focused Scope

Ledgerly intentionally does **not** attempt to be:

- A full event sourcing system
- A metrics or monitoring tool
- A distributed tracing platform
- A real-time streaming engine

Instead, Ledgerly focuses on:

- Audit logging
- Activity timelines
- Business observability

A focused scope keeps the system reliable and maintainable.

---

# 13. Designed for Growth

Ledgerly Core is designed to support future layers:

- Visualization (ledgerly/ui)
- Aggregation and monitoring (ledgerly/cloud)
- Multi-application observability

The core remains small while enabling powerful extensions.

---

# Conclusion

Ledgerly is built to be:

- Predictable
- Extensible
- Reliable
- Lightweight
- Structured

These principles guide every design decision and help ensure that Ledgerly remains a stable and useful foundation for audit logging in Laravel applications.
