---
sidebar_position: 2
title: Extending Ledgerly
---

# Extending Ledgerly

Ledgerly is designed to be extended without modifying the core package.  
Most applications will customize logging behavior by adding metadata resolvers, context values, or integrations.

This guide explains the supported extension points.

---

# Extension Points Overview

Ledgerly can be extended in several ways:

| Extension Point    | Purpose                       |
|--------------------|-------------------------------|
| Metadata resolvers | Automatically attach metadata |
| Context            | Attach runtime values         |
| Actor resolution   | Customize actor detection     |
| Severity usage     | Define severity conventions   |
| UI integrations    | Visualize entries             |
| Export pipelines   | Process entries externally    |

The most common extension point is metadata resolvers.

---

# Creating a Custom Metadata Resolver

Metadata resolvers automatically provide metadata to every entry.

Example resolver:

```php
namespace App\Resolvers;

use Ledgerly\Contracts\MetadataResolver;

class TenantMetadataResolver implements MetadataResolver
{
    public function resolve(): array
    {
        return [
            'tenant_id' => tenant()->id,
        ];
    }
}
````

---

# Registering a Resolver

Resolvers are configured in:

```
config/ledgerly.php
```

Example:

```php
'metadata_resolvers' => [
    App\Resolvers\TenantMetadataResolver::class,
],
```

Resolvers are executed in order, and later resolvers override earlier values.

---

# Resolver Best Practices

Resolvers should:

* Return small arrays
* Never throw exceptions
* Avoid heavy database queries
* Be idempotent

Resolvers should not:

* Modify database state
* Perform long-running operations

Resolvers should only gather context.

---

# Using Context for Custom Data

If values are known at runtime, the context may be simpler than a resolver.

Example:

```php
ledgerly()->context([
    'tenant_id' => $tenant->id,
]);
```

Context is ideal for:

* Tenant identifiers
* Batch IDs
* Workflow identifiers

---

# Scoped Context in Extensions

Example:

```php
ledgerly()->withContext([
    'import_id' => $import->id,
], function () {

    // multiple log entries here

});
```

This ensures the context is isolated and automatically restored.

---

# Custom Actor Resolution

Ledgerly can automatically resolve actors.

Applications may customize this behavior using an actor resolver:

Example:

```php
Ledgerly::resolveActorUsing(function () {
    return auth()->user();
});
```

This ensures actors are automatically attached when available.

---

# Severity Conventions

Ledgerly allows severity levels such as:

```
info
warning
error
critical
```

Applications may define their own conventions or mappings.

Example:

```php
ledgerly()
    ->severity('warning')
    ->action('invoice.overdue')
    ->log();
```

Severity values should remain consistent across the application.

---

# Export Integrations

Entries can be exported:

```php
$entry->toArray();
$entry->toJson();
```

Applications can build integrations that:

* Send entries to external systems
* Stream logs to analytics pipelines
* Generate compliance reports

Exports preserve metadata, context, and diffs.

---

# UI Integrations

Ledgerly Core is UI-agnostic.

Visualization can be handled by:

* ledgerly/ui
* Custom dashboards
* Admin panels

Entries are structured to make timeline views easy to build.

---

# Writing Safe Extensions

When extending Ledgerly:

Recommended:

* Keep extensions small
* Prefer resolvers over modifying builder logic
* Prefer context over manual metadata repetition

Avoid:

* Modifying core classes
* Overriding internal services
* Storing large data in metadata

---

# Public API Boundary

Only rely on documented public APIs:

* Builder methods
* LedgerEntry model
* Config settings
* Events
* Resolver interfaces

Internal classes marked with `@internal` may change between releases.

---

# Example: Multi-Tenant Extension

Example combining context and resolvers:

1. Middleware sets tenant context:

```php
ledgerly()->context([
    'tenant_id' => $tenant->id,
]);
```

2. Entries automatically include tenant metadata.

This approach avoids repeating metadata on every log call.

---

# Next Step

Continue to:

➡️ **[FAQ](../faq.md)**

