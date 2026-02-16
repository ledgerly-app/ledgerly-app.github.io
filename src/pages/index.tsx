import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home() {
  return (
    <Layout
      title="Ledgerly"
      description="Structured audit logging for Laravel applications"
    >
      <main>
        <section style={{textAlign: 'center', padding: '4rem 1rem'}}>
          <h1>Ledgerly</h1>
          <p style={{fontSize: '1.2rem', maxWidth: 600, margin: '0 auto'}}>
            Structured audit logging for Laravel applications.
            Record business events, track workflows, and build activity timelines.
          </p>

          <div style={{marginTop: '2rem'}}>
            <Link
              className="button button--primary button--lg"
              to="/docs/quick-start"
            >
              Quick Start
            </Link>

            <Link
              className="button button--secondary button--lg"
              to="https://github.com/ledgerly-app/core"
              style={{marginLeft: '1rem'}}
            >
              GitHub
            </Link>
          </div>
        </section>

        <section style={{padding: '3rem 1rem', textAlign: 'center'}}>
          <h2>Why Ledgerly?</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            marginTop: '2rem'
          }}>
            <div>
              <h3>Immutable Logs</h3>
              <p>Entries are never modified, ensuring reliable audit trails.</p>
            </div>

            <div>
              <h3>Structured Data</h3>
              <p>Actions, metadata, and diffs are stored in a predictable format.</p>
            </div>

            <div>
              <h3>Transactions</h3>
              <p>Group related events and reconstruct workflows easily.</p>
            </div>

            <div>
              <h3>Extensible</h3>
              <p>Add metadata resolvers, context providers, and integrations.</p>
            </div>
          </div>
        </section>

        <section style={{padding: '3rem 1rem', maxWidth: 800, margin: '0 auto'}}>
          <h2>Example</h2>

          <pre>
{`ledgerly()
    ->actor(auth()->user())
    ->target($invoice)
    ->action('invoice.updated')
    ->withDiff([
        'amount' => [1200, 1450],
    ])
    ->log();`}
          </pre>
        </section>

        <section style={{textAlign: 'center', padding: '3rem 1rem'}}>
          <h2>Get Started</h2>
          <Link
            className="button button--primary button--lg"
            to="/docs/quick-start"
          >
            Start in 5 Minutes
          </Link>
        </section>

      </main>
    </Layout>
  );
}
