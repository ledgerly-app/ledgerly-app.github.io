---
sidebar_position: 12
title: Writing Transformers
---

# Introduction

Ledgerly provides a flexible export pipeline that allows audit entries to be transformed before they are written to an external destination.

Entry Transformers allow you to:

* redact or mask sensitive values
* remove internal metadata
* enrich entries with external context
* reshape payloads for ingestion systems
* normalize output for analytics pipelines

Transformers are applied during export and do not modify stored ledger entries.

---

# When Should You Use a Transformer?

Transformers are typically used when:

* exporting audit logs to external systems
* preparing payloads for SIEM ingestion
* sanitizing sensitive information (PII)
* enforcing compliance policies
* adapting audit data for data warehouses

They are not intended for:

* modifying stored ledger entries
* influencing logging behavior
* altering metadata collection

---

# Creating a Transformer

To create a transformer, implement the:

```
Ledgerly\Core\Contracts\EntryTransformer
```

interface.

---

## Example

```php
use Ledgerly\Core\Contracts\EntryTransformer;

class RemoveIpAddressTransformer
    implements EntryTransformer
{
    public function transform(array $entry): array
    {
        unset($entry['metadata']['ip']);

        return $entry;
    }

    public function getConstructorArgs(): array
    {
        return [];
    }
}
```

---

# Applying a Transformer

Transformers may be applied at export time:

```php
LedgerExporter::make()
    ->transformUsing(
        new RemoveIpAddressTransformer
    )
    ->usingDriver('file', [
        'path' => storage_path('ledger.jsonl'),
    ])
    ->export();
```

Multiple transformers may be chained:

```php
LedgerExporter::make()
    ->transformUsing(new RemoveIpAddressTransformer)
    ->transformUsing(new MaskEmailTransformer)
    ->export();
```

Transformers are executed in the order they are registered.

---

# Making Transformers Queue-Safe

Queued exports require transformers to be reconstructible.

For this reason, all transformers must implement:

```php
public function getConstructorArgs(): array;
```

Example:

```php
class MaskFieldsTransformer
    implements EntryTransformer
{
    public function __construct(
        protected array $fields
    ) {}

    public function transform(array $entry): array
    {
        foreach ($this->fields as $field) {
            data_set($entry, $field, '***');
        }

        return $entry;
    }

    public function getConstructorArgs(): array
    {
        return [
            'fields' => $this->fields,
        ];
    }
}
```

This allows Ledgerly to serialize and later reconstruct the transformer during queued export execution.

---

# Automatically Applying Transformers

Transformers may be registered globally via an extension.

Implement:

```
Ledgerly\Core\Extension\RegistersLedgerlyExtensions
```

---

## Example Extension

```php
use Ledgerly\Core\Extension\ExtensionRegistry;
use Ledgerly\Core\Extension\RegistersLedgerlyExtensions;

class ComplianceExtension
    implements RegistersLedgerlyExtensions
{
    public function registerLedgerlyExtensions(
        ExtensionRegistry $registry
    ): void {

        $registry->transformer(
            MaskFieldsTransformer::class
        );
    }
}
```

Registered transformers will automatically be applied to all exports.

---

# Execution Order

Transformer execution order is:

```
LedgerEntryExport
    ↓
Extension Transformers
    ↓
Manually Registered Transformers
    ↓
Export Driver
```

This allows:

* global policies to apply automatically
* export-specific overrides to be layered on top

---

# Best Practices

When writing transformers:

* avoid side-effects
* do not perform network calls
* keep transformations deterministic
* ensure constructor arguments are serializable
* treat entries as immutable
* prefer idempotent transformations

Transformers should operate only on the provided entry array and return a modified copy.

---

# Next Steps

See:

* Exporting Guide
* Writing Export Drivers
* Metadata Resolvers

to further customize Ledgerly export behavior.
