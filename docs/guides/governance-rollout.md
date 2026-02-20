---
title: Governance Rollout Strategy
sidebar_position: 15
---

# Governance Rollout Strategy

Ledgerly Policies allow organizations to enforce audit logging discipline across their applications.

However, introducing governance rules in production can be risky if done incorrectly.

This guide describes how to safely roll out audit policies across teams and services using Ledgerly.

---

## Why Governance Rollout Matters

Introducing audit governance affects:

- audit logging behavior
- developer workflows
- compliance reporting
- security observability
- tenancy attribution
- incident traceability

Policies may reject audit entries that previously would have been accepted.

If introduced abruptly, this can:

- break audit logging pipelines
- disrupt application monitoring
- cause unexpected runtime exceptions
- block audit persistence in production

Ledgerly provides **Debug Mode** to enable safe rollout.

---

## Enforcement Modes

Ledgerly supports two policy modes:

### Enforcement Mode

Policies are strictly enforced.

If a policy fails:

- an `EntryPolicyViolation` is thrown
- the audit entry is rejected
- persistence is aborted

This is suitable for:

- regulated environments
- hardened production deployments
- compliance enforcement
- mature logging systems

---

### Debug Mode

Policies are advisory.

If a policy fails:

- the violation is logged
- the `EntryPolicyViolated` event is dispatched
- the audit entry is still persisted

Enable Debug Mode:

```php
'policy' => [
    'debug' => true,
],
````

This allows observing policy violations without affecting production logging.

---

## Recommended Rollout Phases

### Phase 1 — Observability

Enable Debug Mode and introduce initial policies.

Example:

```php
'policies' => [

    RequireActorPolicy::for('*.updated'),

    RequireMetadataKeysPolicy::for(
        'invoice.*',
        ['tenant_id']
    ),

    RequireSeverityPolicy::for(
        'security.*',
        minimum: 'high'
    ),
],
```

Violations will now be:

* logged
* observable
* queryable
* reportable

Audit entries will still persist.

---

### Phase 2 — Violation Monitoring

Subscribe to policy violations:

```php
Event::listen(
    EntryPolicyViolated::class,
    function ($event) {

        logger()->warning(
            'Ledgerly Policy Violation',
            [
                'policy' => $event->violation->policy(),
                'message' => $event->violation->getMessage(),
            ]
        );
    }
);
```

Track:

* violation frequency
* affected actions
* missing metadata
* severity misclassification

This helps identify:

* legacy logging patterns
* non-compliant services
* missing context propagation
* incomplete tenancy attribution

---

### Phase 3 — Developer Remediation

Update logging calls across services:

* ensure actors are resolved
* attach required metadata
* propagate tenant identifiers
* include request identifiers
* classify severity levels

Example:

```php
ledgerly()
    ->actor($user)
    ->action('invoice.updated')
    ->withMetadata([
        'tenant_id' => $tenant->id,
        'request_id' => $requestId,
    ])
    ->severity('high')
    ->log();
```

---

### Phase 4 — Gradual Enforcement

Disable Debug Mode:

```php
'policy' => [
    'debug' => false,
],
```

Policy violations will now:

* throw exceptions
* reject non-compliant entries
* enforce audit discipline

---

### Phase 5 — Policy Expansion

Introduce stricter policies over time:

* metadata completeness
* action naming rules
* domain restrictions
* severity thresholds
* tenancy requirements

Policies may also be introduced per-domain:

```php
RequireMetadataKeysPolicy::for(
    'billing.*',
    ['tenant_id']
);
```

---

## CI Validation

Before deploying policy changes:

```bash
php artisan ledgerly:policy:check
```

This validates:

* class existence
* contract implementation
* constructor validity
* binding configuration

---

## Best Practices

* Always introduce policies in Debug Mode
* Monitor violations before enforcing
* Avoid enforcing across all domains simultaneously
* Roll out domain-by-domain
* Keep policies stateless
* Avoid performing IO inside policies

---

## Summary

Ledgerly Policies allow organizations to move from:

* unstructured logging
* inconsistent audit trails
* incomplete metadata

to:

* structured audit taxonomy
* traceable activity timelines
* compliance-ready audit records

Roll out policies gradually to ensure safe adoption across services.

---
