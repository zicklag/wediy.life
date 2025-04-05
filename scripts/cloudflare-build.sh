#!/bin/env bash

set -ex

# Install deno
curl -fsSL https://deno.land/install.sh | sh
deno="$HOME/.deno/bin/deno"

# Configure environment
echo "PUBLIC_TURNSTILE_SITE_KEY=$TURNSTILE_SITE_KEY" >> .env.production
echo "TURNSTILE_SECRET_KEY=$TURNSTILE_SECRET_KEY" >> .env.production
echo "PUBLIC_CONTACT_WEBHOOK=$CONTACT_WEBHOOK" >> .env.production

# Install dependencies
$deno install --allow-scripts
$deno run build
