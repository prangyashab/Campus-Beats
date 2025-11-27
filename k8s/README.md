This folder contains Kubernetes manifest templates and a small helper to generate concrete manifests.

Usage

- Install `envsubst` (part of `gettext`) on your machine.
- Set environment variables `DOCKERHUB_USERNAME` and `MYSQL_ROOT_PASSWORD` (or accept defaults).
- Run the generator:

```bash
cd k8s
./generate-manifests.sh
```

The generated manifests will be in `k8s/generated/`.

Important notes

- Replace the `mysql-pvc` configuration to match your storage class for production.
- `secret-template.yaml` contains placeholders; the generated `secret.yaml` contains plaintext secrets — prefer using `kubectl create secret` with values from CI secrets instead.
