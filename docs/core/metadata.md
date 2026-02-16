---
sidebar_position: 3
title: Metadata
---

# Metadata

**Metadata** provides additional structured information about a ledger entry.

While the action describes **what happened**, metadata helps explain:

- Where it happened
- How it happened
- What triggered it
- Which request or job was involved?
- Which environment or tenant was affected?

Metadata is stored as structured JSON and is fully exportable.

---

# Example Metadata

A typical metadata payload might look like:

```json
{
  "request_id": "abc123",
  "ip": "192.168.1.10",
  "user_agent": "Mozilla/5.0",
  "source": "http",
  "environment": "production",
  "tenant_id": 42
}
````

This data is automatically collected and merged by Ledgerly.

---

# Sources of Metadata

Metadata in Ledgerly comes from several sources:

1. Metadata resolvers (automatic)
2. Transaction metadata
3. Context values
4. Explicit metadata provided by the developer

These sources are merged deterministically.

---

# Metadata Precedence

When multiple sources provide the same key, the following precedence applies:

```
1. Metadata resolvers (lowest priority)
2. Transaction metadata
3. Context metadata
4. Explicit metadata (highest priority)
```

Later layers override earlier ones.

Example:

```php
ledgerly()
    ->context(['tenant_id' => 1])
    ->withMetadata(['tenant_id' => 2])
    ->action('billing.invoice.created')
    ->log();
```

Final metadata:

```
tenant_id = 2
```

---

# Automatic Metadata Collection

Ledgerly automatically collects metadata using **metadata resolvers**.

Common metadata includes:

| Key            | Description                           |
|----------------|---------------------------------------|
| request_id     | Unique request identifier             |
| correlation_id | Transaction grouping identifier       |
| source         | Runtime source (http, queue, console) |
| environment    | Application environment               |
| service        | Application name                      |
| ip             | Client IP address                     |
| method         | HTTP method                           |
| url            | Request URL                           |
| user_agent     | Browser or client                     |
| job_id         | Queue job identifier                  |
| queue          | Queue name                            |

Resolvers can be configured and extended.

---

# Adding Metadata Manually

You can attach metadata directly:

```php
ledgerly()
    ->action('billing.invoice.sent')
    ->withMetadata([
        'channel' => 'email',
        'attempt' => 1,
    ])
    ->log();
```

Explicit metadata has the highest priority.

---

# Context and Metadata

Context automatically contributes to metadata:

```php
ledgerly()->context([
    'tenant_id' => 42,
]);
```

All subsequent entries will include this value.

Scoped context is also supported:

```php
ledgerly()->withContext(['tenant_id' => 42], function () {
    ledgerly()->action('billing.invoice.created')->log();
});
```

Context is restored automatically.

More details are covered in the **Context** section.

---

# Transaction Metadata

Transactions may add metadata such as:

* correlation_id
* duration
* execution metrics

Example:

```php
ledgerly()->transaction(function () {
    ledgerly()->action('billing.invoice.created')->log();
});
```

Entries inside the transaction share correlation metadata.

---

# Metadata Resolvers

Metadata resolvers automatically supply metadata.

Resolvers are configured in:

```
config/ledgerly.php
```

Example:

```php
'metadata_resolvers' => [
    SourceMetadataResolver::class,
    RequestMetadataResolver::class,
    JobMetadataResolver::class,
    EnvironmentMetadataResolver::class,
],
```

You can register your own resolvers to extend a metadata collection.

---

# Creating a Custom Metadata Resolver

Example:

```php
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
```

Register it in configuration:

```php
'metadata_resolvers' => [
    App\Resolvers\TenantMetadataResolver::class,
],
```

---

# Standard Metadata Keys

Ledgerly uses conventional metadata keys to ensure consistency:

### Lifecycle

* request_id
* correlation_id
* transaction_duration_ms
* source

### Environment

* environment
* service

### HTTP

* ip
* method
* url
* user_agent

### Queue

* job_id
* queue
* connection

Applications may include any additional keys as needed.

---

# Exporting Metadata

Metadata is preserved in all export formats:

```php
$entry->toArray();
$entry->toJson();
```

No metadata is removed or transformed during export.

---

# Best Practices

Recommended:

* Use structured keys
* Keep metadata small and meaningful
* Prefer context for shared values
* Use resolvers for automatic metadata

Avoid:

* Storing large blobs
* Storing unstructured logs
* Storing sensitive secrets

---

# Next Step

Continue to:

➡️ **[Context](context.md)**
