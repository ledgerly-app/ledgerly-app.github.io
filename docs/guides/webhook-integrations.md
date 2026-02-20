---
sidebar_position: 11
title: Webhook Integrations
---

# Introduction

Ledgerly provides a webhook delivery system that allows external systems to receive real-time audit events as they occur within your application.

Webhook integrations are typically used to:

* forward audit logs to SIEM platforms
* ingest events into analytics pipelines
* synchronize activity across distributed services
* power automation workflows
* stream audit trails into Ledgerly Cloud

Each time a ledger entry is persisted, Ledgerly may emit an HTTP webhook containing a structured representation of the event.

---

# Enabling Webhook Delivery

Webhook delivery is controlled via the configured dispatcher.

Inside your `ledgerly.php` configuration file:

```php
'webhook_dispatcher' =>
    \Ledgerly\Core\Webhooks\SignedWebhookDispatcher::class,
```

Ledgerly will now automatically dispatch webhook payloads whenever entries are created.

---

# Webhook Payload Structure

Each webhook request contains:

```json
{
  "event": "entry_persisted",
  "data": {
    "id": "...",
    "action": "...",
    "actor": {...},
    "target": {...},
    "diff": {...},
    "metadata": {...},
    "context": {...},
    "severity": "...",
    "created_at": "..."
  }
}
```

Payloads are generated using the active:

```
LedgerEntryExport
```

version, ensuring consistent structure across integrations.

---

# Request Signing

By default, Ledgerly signs webhook requests using HMAC SHA-256.

Each request includes:

```
X-Ledgerly-Signature:
t=timestamp,v1=signature
```

Consumers should:

1. Extract timestamp
2. Concatenate:

```
timestamp.payload
```

3. Recompute signature using a shared secret
4. Compare using constant-time equality

---

# Verifying Webhook Signatures (Example)

```php
$timestamp = $request->header('X-Ledgerly-Timestamp');
$signature = $request->header('X-Ledgerly-Signature');

$expected = hash_hmac(
    'sha256',
    $timestamp.'.'.$request->getContent(),
    env('LEDGERLY_WEBHOOK_SECRET')
);

if (! hash_equals($expected, $signature)) {
    abort(403);
}
```

---

# Retry Policy

A queued job handles webhook delivery.

Retries are configured per event:

```php
'webhook_retry' => [
    'entry_persisted' => [
        'tries' => 3,
        'backoff' => [10, 30, 60],
    ],
],
```

Ledgerly will retry delivery if:

* the request fails
* the endpoint returns a 5xx response
* the connection times out

Client-side errors (4xx) are treated as permanent failures and will not be retried.

---

# Queue Configuration

Webhook delivery occurs asynchronously.

You may configure queue routing:

```php
SendLedgerEntryWebhook::class => [
    'connection' => 'redis',
    'queue' => 'ledgerly-webhooks',
],
```

Ensure workers are running:

```bash
php artisan queue:work
```

---

# Implementing a Custom Dispatcher

Advanced integrations may require:

* batching
* alternative transports
* message queues
* streaming ingestion
* custom authentication

You may implement your own dispatcher by conforming to:

```
Ledgerly\Core\Contracts\WebhookDispatcher
```

---

## Example

```php
use Ledgerly\Core\Contracts\WebhookDispatcher;

class KafkaWebhookDispatcher
    implements WebhookDispatcher
{
    public function dispatch(
        array $payload,
        string $event
    ): void {

        Kafka::publish(
            topic: "ledgerly.$event",
            message: json_encode($payload)
        );
    }
}
```

Register the dispatcher:

```php
'webhook_dispatcher' =>
    \App\Integrations\KafkaWebhookDispatcher::class,
```

Ledgerly will now deliver audit entries via Kafka instead of HTTP.

---

# Event-Driven Integrations

Webhook dispatch is triggered by:

```
LedgerEntryCreated
```

This allows:

* custom dispatch strategies
* conditional routing
* tenant-aware integrations

Example:

```php
Event::listen(
    LedgerEntryCreated::class,
    function ($event) {
        // forward to external ingestion layer
    }
);
```

---

# Best Practices

When consuming Ledgerly webhooks:

* treat delivery as at-least-once
* make handlers idempotent
* verify request signatures
* respond quickly (<2s)
* process asynchronously
* avoid side effects in request handlers

---

# Next Steps

See:

* Exporting Guide
* Metadata Resolvers
* Context Usage

for customizing webhook payload contents.
