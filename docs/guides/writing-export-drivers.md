---
sidebar_position: 1
title: Writing Export Drivers
---

# Introduction

Ledgerly Export Drivers are responsible for delivering exported audit entries to an external destination.

Drivers define how transformed ledger entries are written to:

* files
* cloud storage
* data warehouses
* message queues
* streaming platforms
* ingestion APIs

Export Drivers are executed after:

* the ledger entry has been converted to an export format
* metadata has been assembled
* transformers have been applied

They are the final stage in the export pipeline.

---

# When Should You Write a Custom Driver?

Custom Export Drivers are typically used when exporting audit logs to:

* Amazon S3
* Google Cloud Storage
* Kafka
* Snowflake
* BigQuery
* Elasticsearch
* internal ingestion APIs

Drivers are not responsible for:

* transforming entries
* filtering records
* modifying metadata
* validation

These concerns should be handled by:

* Entry Transformers
* Metadata Resolvers

---

# Creating a Driver

To create an Export Driver, implement the:

```id="klsm2q"
Ledgerly\Core\Contracts\ExportDriver
```

interface.

---

## Example

```php id="sjh0ok"
use Ledgerly\Core\Contracts\ExportDriver;
use Ledgerly\Core\Export\ExportContext;

class JsonFileExportDriver
    implements ExportDriver
{
    protected $handle;

    public function __construct(
        protected string $path
    ) {}

    public function start(ExportContext $context): void
    {
        $this->handle = fopen($this->path, 'w');
    }

    public function write(array $payload): void
    {
        fwrite(
            $this->handle,
            json_encode($payload).PHP_EOL
        );
    }

    public function finish(): void
    {
        fclose($this->handle);
    }

    public function getConstructorArgs(): array
    {
        return [
            'path' => $this->path,
        ];
    }
}
```

---

# Driver Lifecycle

Each Export Driver participates in the export lifecycle:

```id="0w1tq7"
start() → write() → finish()
```

## start()

Invoked before export begins.

Typically used to:

* open connections
* initialize file handles
* prepare upload sessions

---

## write()

Called once per transformed ledger entry.

Drivers should:

* treat payloads as immutable
* avoid buffering large datasets in memory
* write entries incrementally

---

## finish()

Invoked after export completes.

Used to:

* flush buffers
* finalize uploads
* close connections
* commit transactions

---

# Queue-Safe Drivers

Queued exports require drivers to be reconstructible.

Drivers must implement:

```id="myn0k4"
public function getConstructorArgs(): array;
```

Example:

```php id="qj3w3q"
class S3ExportDriver
    implements ExportDriver
{
    public function __construct(
        protected string $bucket,
        protected string $path
    ) {}

    public function getConstructorArgs(): array
    {
        return [
            'bucket' => $this->bucket,
            'path' => $this->path,
        ];
    }
}
```

Ledgerly will serialize constructor arguments and reconstruct the driver when running queued exports.

---

# Registering a Driver

Export Drivers may be registered globally using an extension.

Implement:

```id="dprx4k"
Ledgerly\Core\Extension\RegistersLedgerlyExtensions
```

---

## Example Extension

```php id="qpsl5f"
use Ledgerly\Core\Extension\ExtensionRegistry;
use Ledgerly\Core\Extension\RegistersLedgerlyExtensions;

class S3ExportExtension
    implements RegistersLedgerlyExtensions
{
    public function registerLedgerlyExtensions(
        ExtensionRegistry $registry
    ): void {

        $registry->exportDriver(
            's3',
            S3ExportDriver::class
        );
    }
}
```

Alias may now reference registered drivers.

---

# Using a Registered Driver

```php id="38juo0"
LedgerExporter::make()
    ->usingDriver('s3', [
        'bucket' => 'audit-logs',
        'path' => 'ledger.jsonl',
    ])
    ->export();
```

Ledgerly will automatically:

* resolve the driver
* construct it using provided arguments
* execute the export pipeline

---

# Handling Large Datasets

Drivers should:

* write entries incrementally
* avoid loading entire datasets into memory
* support streaming or chunked uploads

Ledgerly may export entries in chunks when configured to do so.

---

# Best Practices

When writing Export Drivers:

* keep drivers stateless where possible
* ensure constructor args are serializable
* avoid long-lived connections in write()
* do not mutate payloads
* treat delivery as at-least-once
* handle partial failures gracefully

Drivers should focus solely on delivering already-prepared payloads.

---

# Next Steps

See:

* Writing Transformers
* Exporting Guide
* Webhook Integrations

to further customize Ledgerly export behavior.
