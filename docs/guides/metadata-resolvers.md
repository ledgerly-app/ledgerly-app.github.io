---
sidebar_position: 4
title: Metadata Resolvers
---

# Metadata Resolvers

Metadata resolvers are responsible for automatically attaching metadata to ledger entries.

Resolvers allow applications to:

- Add request information
- Add tenant identifiers
- Attach environment details
- Include job or queue metadata
- Enrich entries without modifying logging code

Resolvers are executed automatically every time an entry is logged.

---

# When to Use a Resolver

Use a metadata resolver when:

- Metadata should be added automatically
- The value is available globally or from the runtime
- You want to avoid repeating metadata in every log call

Examples:

- tenant_id
- request_id
- service name
- region
- feature flag environment

If metadata applies only to a specific operation, use explicit metadata or context instead.

---

# Creating a Resolver

A resolver is a simple class that returns an array.

Example:

```php
namespace App\Ledgerly\Resolvers;

class TenantMetadataResolver
{
    public function resolve(): array
    {
        return [
            'tenant_id' => tenant()->id,
        ];
    }
}
````

Resolvers should return small, structured arrays.

---

# Registering a Resolver

Resolvers are configured in:

```
config/ledgerly.php
```

Example:

```php
'metadata_resolvers' => [
    App\Ledgerly\Resolvers\TenantMetadataResolver::class,
],
```

Resolvers are executed in order.

---

# Resolver Execution Order

Resolvers run sequentially.
If multiple resolvers return the same key, later resolvers override earlier ones.

Example:

```
EnvironmentResolver
TenantResolver
RequestResolver
```

If both return:

```
region
```

The value from `RequestResolver` will be used.

---

# Writing Safe Resolvers

Resolvers should:

* Be fast
* Be deterministic
* Avoid heavy queries
* Avoid network calls
* Never throw exceptions

Resolvers should not:

* Modify database state
* Trigger events
* Perform long-running operations

Resolvers should only gather context.

---

# Example: Request Metadata Resolver

Example resolver that adds request data:

```php
class RequestMetadataResolver
{
    public function resolve(): array
    {
        if (!request()) {
            return [];
        }

        return [
            'ip' => request()->ip(),
            'method' => request()->method(),
            'url' => request()->fullUrl(),
        ];
    }
}
```

This metadata will be attached automatically.

---

# Example: Environment Metadata Resolver

```php
class EnvironmentMetadataResolver
{
    public function resolve(): array
    {
        return [
            'environment' => app()->environment(),
            'service' => config('app.name'),
        ];
    }
}
```

Useful for multi-service or multi-environment deployments.

---

# Example: Feature Flag Resolver

```php
class FeatureFlagResolver
{
    public function resolve(): array
    {
        return [
            'feature_flags' => app(FeatureManager::class)->activeFlags(),
        ];
    }
}
```

Useful for experiments and rollouts.

---

# Conditional Metadata

Resolvers can return an empty array when metadata is not applicable:

```php
if (!auth()->check()) {
    return [];
}
```

This ensures entries remain clean.

---

# Resolver vs Context

Use a resolver when:

* Metadata should always be attached automatically
* Value is derived from runtime environment

Use context when:

* Value applies to a specific request or workflow
* Value is known in application code

Example:

Resolver:

```
environment
request_id
source
```

Context:

```
tenant_id
batch_id
workflow_id
```

---

# Resolver vs Explicit Metadata

Use explicit metadata when:

* Metadata applies to only one entry

Example:

```php
ledgerly()
    ->withMetadata(['channel' => 'email'])
    ->log();
```

---

# Testing Resolvers

Resolvers should be tested independently.

Example:

```php
$resolver = new TenantMetadataResolver();

$this->assertEquals(
    ['tenant_id' => 42],
    $resolver->resolve()
);
```

Testing ensures metadata remains consistent across changes.

---

# Best Practices

Recommended:

* Keep resolvers small
* Return only relevant keys
* Use consistent naming
* Document custom metadata keys

Avoid:

* Returning large payloads
* Storing sensitive data
* Making external API calls
