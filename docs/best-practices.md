---
sidebar_position: 4
title: Best Practices
---

# Best Practices

This guide provides practical recommendations for using Ledgerly effectively in real-world applications.

Following these practices will help keep your audit logs consistent, useful, and easy to maintain.

---

# 1. Log Business Events, Not Technical Noise

Ledgerly is designed to record **business-level events**.

Good examples:

```

invoice.created
payment.approved
subscription.cancelled
user.invited

```

Avoid logging:

```

model.saved
controller.executed
job.run
cache.cleared

```

Technical logs belong in application logs, not audit logs.

---

# 2. Use Clear and Consistent Action Names

Use structured action names:

```

<domain>.<resource>.<verb>

```

Examples:

```

billing.invoice.created
auth.user.logged_in
payments.payment.failed

````

Consistency is more important than perfection.  
Once a naming convention is chosen, stick to it.

---

# 3. Use Context for Shared Data

If multiple entries share the same value, use context:

```php
ledgerly()->context([
    'tenant_id' => $tenant->id,
]);
````

Good candidates for context:

* tenant_id
* batch_id
* workflow_id
* import_id

Avoid repeating the same metadata manually on every log call.

---

# 4. Use Transactions for Workflows

Transactions help group related events:

```php
ledgerly()->transaction(function () {

    ledgerly()->action('order.created')->log();
    ledgerly()->action('payment.authorized')->log();
    ledgerly()->action('invoice.generated')->log();

});
```

Use transactions when:

* A process has multiple steps
* Events should be analyzed together

---

# 5. Keep Metadata Small and Meaningful

Metadata should:

* Be structured
* Be relevant
* Be small

Good metadata:

```
channel = email
retry_attempt = 2
gateway = stripe
```

Avoid:

* Large blobs of data
* Entire request payloads
* Debug dumps

Large metadata increases storage size and reduces performance.

---

# 6. Avoid Storing Sensitive Data

Do not store:

* Passwords
* Tokens
* Private keys
* Personal data unless required

Audit logs often have long retention periods, so sensitive data should be avoided or carefully controlled.

---

# 7. Use Diff Tracking for Changes

When recording updates, include diffs:

```php
ledgerly()
    ->action('invoice.updated')
    ->withDiff([
        'amount' => [100, 150],
    ])
    ->log();
```

Diffs make timelines and audits much more useful.

---

# 8. Keep Resolvers Lightweight

Metadata resolvers should:

* Be fast
* Avoid heavy queries
* Avoid network calls

Resolvers run frequently, so performance matters.

If heavy computation is required, consider:

* Precomputing values
* Using context instead of resolvers

---

# 9. Use Severity Consistently

Define clear meaning for severity levels:

| Severity   | Meaning                  |
|------------|--------------------------|
| info       | Normal operation         |
| warning    | Unusual but not critical |
| error      | Operation failed         |
| critical   | Severe issue             |

Example:

```php
ledgerly()
    ->severity('warning')
    ->action('invoice.overdue')
    ->log();
```

Consistency improves dashboards and filtering.

---

# 10. Keep Entries Focused

Each entry should represent **one event**.

Avoid combining multiple events into one entry.

Good:

```
invoice.created
invoice.sent
invoice.paid
```

Avoid:

```
invoice.processed
```

Specific entries are easier to analyze later.

---

# 11. Do Not Modify Existing Entries

Ledger entries are immutable by design.

If something changes:

* Log a new entry
* Do not attempt to update old ones

This preserves audit integrity.

---

# 12. Use Query Scopes Instead of Manual Filtering

Ledgerly provides query scopes:

```php
LedgerEntry::forAction('invoice.updated')->get();
LedgerEntry::forActor($user)->get();
LedgerEntry::withinCorrelation($id)->get();
```

Using scopes keeps queries readable and consistent.

---

# 13. Test Logging in Your Application

Include logging in automated tests when possible:

* Verify entries are created
* Verify metadata is correct
* Verify context behavior

This prevents regressions in critical audit functionality.

---

# 14. Plan Retention and Archiving

Audit logs can grow quickly.

Consider:

* Retention policies
* Archiving strategies
* Export pipelines

Ledgerly supports exporting entries to help with long-term storage.

---

# 15. Document Your Action Naming Conventions

In larger teams, create a short document defining:

* Domains
* Resources
* Common verbs

This prevents inconsistent action names over time.

---

# Conclusion

Good audit logs are:

* Consistent
* Structured
* Meaningful
* Lightweight
* Simple to query

Following these best practices helps ensure Ledgerly remains a valuable part of your application's observability and compliance strategy.
