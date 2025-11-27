**Campus-Beats: Deployment Guide — what I automated and next steps**

What I added for you in this repo:

- Dockerfiles:
  - `backend/Dockerfile` — builds the Spring Boot app in a Maven multi-stage build and packages a runnable JAR.
  - `Dockerfile.frontend` — builds the React app and serves it with nginx.

- CI (GitHub Actions):
  - `.github/workflows/docker-build-push.yml` — builds and pushes backend and frontend images to Docker Hub. Requires `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` repo secrets.
  - `.github/workflows/deploy-to-k8s.yml` — optional deploy workflow that generates manifests and applies them using a `KUBE_CONFIG_DATA` secret.

- Kubernetes templates and helper:
  - `k8s/` contains templated manifests and `generate-manifests.sh` that runs `envsubst` to create `k8s/generated/`.

- Ansible:
  - `ansible/deploy-k8s.yml` and `ansible/inventory.ini` — copies manifests to a remote host and runs `kubectl apply` there.

What I can't do from here (requires your credentials or environment access):

- I cannot push images to Docker Hub on your behalf — the CI job will do that when you provide Docker Hub credentials in GitHub Secrets, or you can run `docker build` and `docker push` locally with your account.
- I cannot apply manifests to your Kubernetes cluster because I don't have access to your kubeconfig. You can either: add `KUBE_CONFIG_DATA` as a base64-encoded kubeconfig secret in GitHub secrets and use the `deploy-to-k8s` workflow, or run `kubectl apply -f k8s/generated/` locally after running the generator script.
- I cannot access your remote deployment hosts to run Ansible until you update `ansible/inventory.ini` with actual host IPs and credentials (and ensure the host can run `kubectl`).

Recommended next steps for you (quick checklist):

1. Add repository secrets:
   - `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` (Docker Hub access token).
   - `MYSQL_ROOT_PASSWORD` (optional; used by k8s generator and deploy workflow).
   - `KUBE_CONFIG_DATA` (base64-encoded kubeconfig) if you want CI to deploy to k8s.

2. Update manifests if you want production-ready settings:
   - Replace `emptyDir` with a real PVC backed by your cloud provider.
   - Use Kubernetes Secrets for DB creds (the workflow shows how to generate/apply one).

3. Run locally to sanity-check:
   - Build backend image locally:
     ```powershell
     cd backend
     docker build -t <your-dockerhub-username>/campus-beats-backend:local .
     ```
   - Build frontend image locally:
     ```powershell
     docker build -f Dockerfile.frontend -t <your-dockerhub-username>/campus-beats-frontend:local .
     ```
   - Generate k8s manifests:
     ```bash
     cd k8s
     DOCKERHUB_USERNAME=<your-dockerhub-username> MYSQL_ROOT_PASSWORD=<password> ./generate-manifests.sh
     kubectl apply -f generated/
     ```

4. (Optional) Use the Ansible playbook to copy and apply manifests on a remote host that has `kubectl` configured.

If you want, I can now:
- Replace all remaining placeholder image names with your Docker Hub username (you provide it),
- Populate `ansible/inventory.ini` and `group_vars` with real host details (you provide),
- Configure the GitHub Actions `deploy-to-k8s.yml` to run automatically on push using your secrets (you provide), or
- Create Helm charts instead of raw manifests.

Tell me which of the above you'd like me to do next and provide any values (Docker Hub username, whether you want CI deploying to k8s, and whether your cluster uses a custom storage class). If you'd rather keep secrets private, I will only edit templates and instructions.
