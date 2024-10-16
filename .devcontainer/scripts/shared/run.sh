#!/usr/bin/env/bash

SERVICE=${1}
WORKSPACE_DIR=${WORKSPACE_DIR:-"/workspace"}

set -e

cd $WORKSPACE_DIR

pnpm install
pnpm run $SERVICE || true

sleep infinity