#!/usr/bin/env bash
set -euo pipefail

# Generates concrete k8s manifests from templates using envsubst.
# Requires: envsubst (from gettext) installed.

OUT_DIR="generated"
mkdir -p "$OUT_DIR"

export DOCKERHUB_USERNAME="${DOCKERHUB_USERNAME:-swaraj0405}"
export MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-changeme}"

for f in mysql-deployment.yaml mysql-service.yaml mysql-pvc.yaml secret-template.yaml backend-deployment.yaml backend-service.yaml frontend-deployment.yaml frontend-service.yaml; do
  if [ -f "$f" ]; then
    envsubst < "$f" > "$OUT_DIR/$f"
    echo "Generated $OUT_DIR/$f"
  fi
done

echo "Manifests generated in $OUT_DIR" 
