---
title: Writing Policies
sidebar_position: 14
---

# Writing Policies

Ledgerly Policies allow you to enforce organizational logging rules before audit entries are persisted.

They provide a governance layer on top of audit logging by validating:

- actor presence
- metadata completeness
- severity classification
- action naming conventions
- compliance requirements
- tenancy attribution
- request tracing

Policies run **before persistence**, allowing you to:

- reject invalid audit entries
- enforce audit taxonomy
- ensure compliance requirements are met
- gradually introduce logging discipline across teams

---

## What Is A Policy?

A Ledgerly Policy is a class that implements the `EntryPolicy` contract.

```php
use Ledgerly\Core\Contracts\EntryPolicy;
use Ledgerly\Core\Entries\EntryPayload;

class RequireActorPolicy implements EntryPolicy
{
    public function validate(EntryPayload $payload): void
    {
        if (! $payload->actorId()) {
            throw new EntryPolicyViolation(
                policy: static::class,
                message: 'Actor is required.'
            );
        }
    }
}
````

If the policy throws an `EntryPolicyViolation`, the audit entry will:

* be rejected in enforcement mode
* be persisted but logged in debug mode

---

## EntryPayload

Policies receive an `EntryPayload` instance containing:

| Method        | Description    |
|---------------|----------------|
| action()      | Action name    |
| actorId()     | Actor ID       |
| actorType()   | Actor class    |
| targetId()    | Target ID      |
| targetType()  | Target class   |
| diff()        | Attribute diff |
| metadata()    | Metadata array |
| severity()    | Severity level |
| correlation() | Correlation ID |

Policies must be:

* stateless
* deterministic
* side-effect free

---

## Throwing Violations

To reject an entry:

```php
throw new EntryPolicyViolation(
    policy: static::class,
    message: 'Tenant ID is required.',
    context: [
        'missing_key' => 'tenant_id',
    ]
);
```

The optional context can be used for:

* logging
* reporting
* observability
* debugging

---

## Action-Scoped Policies

Policies may be bound to action patterns.

Ledgerly uses wildcard matching:

```php
use App\Policies\RequireTenantPolicy;

RequireTenantPolicy::for('invoice.*');
```

Supported patterns:

| Pattern    | Matches         |
|------------|-----------------|
| invoice.*  | invoice.created |
| *.updated  | user.updated    |
| security.* | security.alert  |

---

## Parameterized Policies

Policies may accept configuration:

```php
class RequireMetadataKeysPolicy implements EntryPolicy
{
    public function __construct(
        protected array $keys
    ) {}

    public function validate(EntryPayload $payload): void
    {
        foreach ($this->keys as $key) {
            if (! array_key_exists($key, $payload->metadata())) {
                throw new EntryPolicyViolation(
                    policy: static::class,
                    message: "Missing metadata key [$key]."
                );
            }
        }
    }
}
```

Bind with:

```php
RequireMetadataKeysPolicy::for(
    'invoice.*',
    ['tenant_id']
);
```

---

## Registering Policies

### Global

```php
'policies' => [
    RequireActorPolicy::class,
],
```

### Scoped

```php
'policies' => [
    RequireActorPolicy::for('*.updated'),
],
```

### Parameterized

```php
'policies' => [
    RequireMetadataKeysPolicy::for(
        'invoice.*',
        ['tenant_id']
    ),
],
```

---

## Extension-Based Registration

Extensions may also register policies:

```php
class BillingExtension implements RegistersLedgerlyExtensions
{
    public function registerLedgerlyExtensions(
        ExtensionRegistry $registry
    ): void {

        $registry->policy(
            RequireMetadataKeysPolicy::for(
                'invoice.*',
                ['tenant_id']
            )
        );
    }
}
```

---

## Debug Mode

During rollout, you may wish to observe violations instead of enforcing them.

Enable debug mode:

```php
'policy' => [
    'debug' => true,
],
```

When enabled:

* violations are logged
* `EntryPolicyViolated` event is dispatched
* audit entries are still persisted

This allows safe policy rollout in production.

---

## Validating Configuration

Ledgerly provides a CLI command to validate policy configuration:

```bash
php artisan ledgerly:policy:check
```

This checks:

* class existence
* contract implementation
* constructor validity
* binding configuration

---

## Best Practices

* Keep policies stateless
* Avoid IO inside policies
* Do not resolve models
* Do not perform queries
* Keep validation deterministic
* Prefer metadata to actor lookups

Policies should validate structure, not behavior.

---
