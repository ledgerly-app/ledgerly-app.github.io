---
sidebar_position: 98
title: Upgrade Guide
---

# Upgrade Guide

This guide explains how to upgrade Ledgerly safely between versions.

Each release may include:

- New features
- Improvements
- Configuration changes
- Database changes
- Breaking changes (in major versions)

Always read the upgrade notes before upgrading.

---

# General Upgrade Steps

When upgrading Ledgerly, follow these steps:

1. Update the package using Composer
2. Review the release notes
3. Publish or update configuration if needed
4. Run migrations if required
5. Run your test suite
6. Verify logging behavior in development

Example:

```bash
composer update ledgerly-app/core
php artisan migrate
````

---

# Version 0.3.0

## Overview

Version 0.3.0 introduces improvements to:

* Context system
* Metadata handling
* Metadata resolvers
* Observability features
* Documentation

This release is backward-compatible for most applications.

---

## New Features

### Context Improvements

Ledgerly now provides:

* Scoped context
* Nested context support
* Context isolation guarantees

Example:

```php
ledgerly()->withContext(['tenant_id' => 42], function () {
    ledgerly()->action('invoice.created')->log();
});
```

---

### Configurable Metadata Resolvers

Metadata resolvers can now be registered via configuration:

```
config/ledgerly.php
```

Example:

```php
'metadata_resolvers' => [
    App\Resolvers\TenantMetadataResolver::class,
],
```

This allows applications to extend a metadata collection without modifying core code.

---

### Standard Metadata Keys

Ledgerly now uses standardized metadata keys to improve consistency and interoperability.

Common keys include:

* request_id
* correlation_id
* environment
* source
* transaction_duration_ms

Applications may continue to use custom metadata keys.

---

## No Breaking Changes

Version 0.3.0 does not introduce breaking changes to:

* Builder API
* Query scopes
* Export methods
* Database schema

Most applications can upgrade safely.

---

## Recommended After Upgrading

After upgrading to 0.3.0, it is recommended to:

* Review metadata resolver configuration
* Verify context behavior in background jobs
* Ensure test suite passes

---

# Version 0.2.x → 0.3.0 Checklist

Quick checklist:

* [ ] Update package
* [ ] Run migrations (if any)
* [ ] Review config/ledgerly.php
* [ ] Verify logging in development
* [ ] Run tests

---

# Version 0.2.0

## Overview

Version 0.2.0 introduced:

* Transactions
* Correlation
* Metadata pipeline
* Severity levels
* Install command
* Validation improvements

No breaking changes were introduced.

---

# Version 0.1.0

Initial release of Ledgerly Core including:

* Immutable entries
* Structured actions
* Diff tracking
* Basic metadata
* Query scopes
* Export support

---

# Handling Breaking Changes

If a future release introduces breaking changes:

1. The change will be clearly documented
2. Migration steps will be provided
3. Deprecated features will be announced in advance when possible

---

# Semantic Versioning

Ledgerly follows semantic versioning:

```
MAJOR.MINOR.PATCH
```

Meaning:

* MAJOR – Breaking changes
* MINOR – New features, backward-compatible
* PATCH – Bug fixes

---

# Reporting Upgrade Issues

If you encounter issues during an upgrade:

1. Check the release notes
2. Review configuration changes
3. Open an issue on GitHub with:

    * Ledgerly version
    * Laravel version
    * Error message
    * Steps to reproduce

---

# Next Step

Continue to:

➡️ **Architecture Overview**
