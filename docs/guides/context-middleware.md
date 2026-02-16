---
sidebar_position: 5
title: Using Context in Middleware
---

# Using Context in Middleware

Middleware is one of the best places to set Ledgerly context automatically.

This allows metadata such as:

- tenant_id
- request_id
- region
- service
- feature flags

to be attached to every entry created during a request.

This avoids repeating metadata in controllers, services, or jobs.

---

# Basic Example

Example middleware that sets the tenant context:

```php
namespace App\Http\Middleware;

use Closure;

class AttachTenantContext
{
    public function handle($request, Closure $next)
    {
        if ($tenant = tenant()) {
            ledgerly()->context([
                'tenant_id' => $tenant->id,
            ]);
        }

        return $next($request);
    }
}
````

All ledger entries logged during this request will now include:

```
tenant_id
```

---

# Registering Middleware

Register the middleware in:

```
app/Http/Kernel.php
```

Example:

```php
protected $middlewareGroups = [
    'web' => [
        \App\Http\Middleware\AttachTenantContext::class,
    ],
];
```

---

# Adding Multiple Context Values

You can attach multiple values:

```php
ledgerly()->context([
    'tenant_id' => $tenant->id,
    'region' => $tenant->region,
    'plan' => $tenant->plan,
]);
```

This metadata will automatically be included in all entries for the request.

---

# Context in API Middleware

For APIs, you may extract values from headers:

```php
ledgerly()->context([
    'request_id' => $request->header('X-Request-ID'),
    'correlation_id' => $request->header('X-Correlation-ID'),
]);
```

This allows tracing across services.

---

# Context in Multi-Tenant Applications

A common SaaS pattern:

Tenant resolution middleware:

```php
$tenant = TenantResolver::resolve($request);

ledgerly()->context([
    'tenant_id' => $tenant->id,
]);
```

Now all audit logs automatically include tenant information.

---

# Context in Queue Jobs

If jobs need context, pass values explicitly:

```php
dispatch(new ProcessImportJob($tenantId));
```

Inside the job:

```php
public function handle()
{
    ledgerly()->context([
        'tenant_id' => $this->tenantId,
    ]);

    ledgerly()->action('import.started')->log();
}
```

Context is scoped to the job execution.

---

# Using Scoped Context in Middleware

Scoped context ensures isolation:

```php
return ledgerly()->withContext([
    'tenant_id' => $tenant->id,
], function () use ($request, $next) {
    return $next($request);
});
```

This ensures context is automatically restored after the request finishes.

This approach is recommended for long-lived processes.

---

# Middleware Order Considerations

Context middleware should run:

* After authentication (if an actor depends on auth)
* After tenant resolution
* Before controllers execute

Typical order:

```
Auth
Tenant Resolver
Ledgerly Context Middleware
Controllers
```

---

# Best Practices

Recommended:

* Attach tenant_id in middleware
* Attach request_id if available
* Keep the context small
* Use scoped context when possible

Avoid:

* Storing large objects in context
* Storing sensitive values
* Performing heavy logic in middleware

---

# Debugging Context

To verify context is working:

1. Log an entry in a controller
2. Inspect metadata in the database
3. Confirm context values are present

---

# Example: Full Request Flow

1. Middleware sets context
2. Controller logs entries
3. Entries automatically include metadata

Controller:

```php
ledgerly()
    ->action('invoice.created')
    ->log();
```

Metadata:

```
tenant_id = 42
request_id = abc123
source = http
```

---

# When NOT to Use Middleware

Do not use middleware when:

* Context applies only to one operation
* Values are computed deep in services
* Context applies only inside a transaction

In these cases, use scoped context instead.
