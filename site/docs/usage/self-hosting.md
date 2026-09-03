---
sidebar_position: 50
title: Self-hosting
description: Learn how to self-host artef using Docker, Docker Compose, or Helm. This comprehensive guide walks you through setup, configuration, and troubleshooting.
keywords:
  - AI testing
  - configuration
  - Docker
  - Docker Compose
  - Helm
  - Kubernetes
  - LLM eval
  - LLM evaluation
  - artef
  - self-hosting
  - setup guide
  - team collaboration
---

# Self-hosting artef

artef provides a basic Docker image that allows you to host a server that stores evals. This guide covers various deployment methods.

Self-hosting enables you to:

- Share evals to a private instance
- Run evals in your CI/CD pipeline and aggregate results
- Keep sensitive data off your local machine

:::caution Enterprise Customers
If you are an enterprise customer, please do not install this version. Contact us instead for credentials for the enterprise image.
:::

The self-hosted app is an Express server serving the web UI and API.

:::warning
**Self-hosting is not recommended for production use cases.**

- Uses a local SQLite database that requires manual persistence management and cannot be shared across replicas
- Built for individual or experimental usage
- No multi-team support or role-based access control.
- No support for horizontal scalability. Evaluation jobs live in each server's memory and multiple pods cannot share the SQLite database, so running more than one replica (for example in Kubernetes) will lead to "Job not found" errors.
- No built-in authentication or SSO capabilities

For production deployments requiring horizontal scaling, shared databases, or multi-team support, see our [Enterprise platform](/docs/enterprise/).
:::

## Method 1: Using Pre-built Docker Images (Recommended Start)

Get started quickly using a pre-built image.

### 1. Pull the Image

Pull the latest image or pin to a specific version (e.g., `0.109.1`):

```bash
# Pull latest
docker pull ghcr.io/artef/artef:latest

# Or pull a specific version
# docker pull ghcr.io/artef/artef:0.109.1

# You can verify image authenticity with:
# gh attestation verify oci://ghcr.io/artef/artef:latest --owner artef
```

### 2. Run the Container

Run the container, mapping a local directory for data persistence:

```bash
docker run -d \
  --name artef_container \
  -p 3000:3000 \
  -v /path/to/local_artef:/home/artef/.artef \
  -e OPENAI_API_KEY=sk-abc123 \
  ghcr.io/artef/artef:latest
```

:::info
`~/.artef/` is the default data directory.
:::

**Key Parameters:**

- **`-d`**: Run in detached mode (background).
- **`--name artef_container`**: Assign a name to the container.
- **`-p 3000:3000`**: Map host port 3000 to container port 3000.
- **`-v /path/to/local_artef:/home/artef/.artef`**: **Crucial for persistence.** Maps the container's data directory (`/home/artef/.artef`, containing `artef.db`) to your local filesystem. Replace `/path/to/local_artef` with your preferred host path (e.g., `./artef_data`). **Data will be lost if this volume mapping is omitted.**
- **`-e OPENAI_API_KEY=sk-abc123`**: Example of setting an environment variable. Add necessary API keys here so users can run evals directly from the web UI. Replace `sk-abc123` with your actual key.

Access the UI at `http://localhost:3000`.

## Method 2: Using Docker Compose

For managing multi-container setups or defining configurations declaratively, use Docker Compose.

### 1. Create `docker-compose.yml`

Create a `docker-compose.yml` file in your project directory:

```yaml title="docker-compose.yml"
version: '3.8'

services:
  artef_container: # Consistent service and container name
    image: ghcr.io/artef/artef:latest # Or pin to a specific version tag
    ports:
      - '3000:3000' # Map host port 3000 to container port 3000
    volumes:
      # Map host directory to container data directory for persistence
      # Create ./artef_data on your host first!
      - ./artef_data:/home/artef/.artef
    environment:
      # Optional: Adjust chunk size for large evals (See Troubleshooting)
      - artef_SHARE_CHUNK_SIZE=10
      # Add other necessary environment variables (e.g., API keys)
      - OPENAI_API_KEY=your_key_here
      # Example: Google API Key
      # - GOOGLE_API_KEY=your_google_key_here
# Optional: Define a named volume managed by Docker (alternative to host path mapping)
# volumes:
#   artef_data:
#     driver: local
# If using a named volume, change the service volume mapping to:
#     volumes:
#       - artef_data:/home/artef/.artef
```

:::info Using Host Paths vs. Named Volumes
The example above uses a host path mapping (`./artef_data:/home/artef/.artef`) which clearly maps to a directory you create. Alternatively, you can use Docker named volumes (uncomment the `volumes:` section and adjust the service `volumes:`).
:::

### 2. Create Host Directory (if using host path)

If you used `./artef_data` in the `volumes` mapping, create it:

```bash
mkdir -p ./artef_data
```

### 3. Run with Docker Compose

Start the container in detached mode:

```bash
docker compose up -d
```

Stop the container (data remains in `./artef_data` or the named volume):

```bash
docker compose stop
```

Stop and remove the container (data remains):

```bash
docker compose down
```

## Method 3: Using Kubernetes with Helm

:::warning
Helm support is currently experimental. Please report any issues you encounter.
:::

Deploy artef to Kubernetes using the provided Helm chart located within the main artef repository.

:::info
Keep `replicaCount: 1` (the default) as the self-hosted server uses a local SQLite database and in-memory job queue that cannot be shared across multiple replicas.
:::

### Prerequisites

- A Kubernetes cluster (e.g., Minikube, K3s, GKE, EKS, AKS)
- Helm v3 installed (`brew install helm` or see [Helm docs](https://helm.sh/docs/intro/install/))
- `kubectl` configured to connect to your cluster
- Git installed

### Installation

1. **Clone the artef Repository:**
   If you haven't already, clone the main artef repository:

   ```bash
   git clone https://github.com/artef/artef.git
   cd artef
   ```

2. **Install the Chart:**
   From the root of the cloned repository, install the chart using its local path. Provide a release name (e.g., `my-artef`):
   ```bash
   # Install using the default values
   helm install my-artef ./helm/chart/artef
   ```

### Configuration

The Helm chart uses PersistentVolumeClaims (PVCs) for data persistence. By default, it creates a PVC named `artef` requesting 1Gi of storage using the default StorageClass.

Customize the installation using a `values.yaml` file or `--set` flags.

**Example (`my-values.yaml`):**

```yaml title="my-values.yaml"
image:
  tag: v0.54.0 # Pin to a specific version

persistentVolumeClaims:
  - name: artef
    size: 10Gi # Increase storage size
    # Optional: Specify a StorageClass if the default is not suitable
    # storageClassName: my-ssd-storage

service:
  type: LoadBalancer # Expose via LoadBalancer (adjust based on your cluster/needs)


# Optional: Configure ingress if you have an ingress controller
# ingress:
#   enabled: true
#   className: "nginx" # Or your ingress controller class
#   hosts:
#     - host: artef.example.com
#       paths:
#         - path: /
#           pathType: ImplementationSpecific
#   tls: []
#   #  - secretName: artef-tls
#   #    hosts:
#   #      - artef.example.com
```

Install with custom values:

```bash
# Ensure you are in the root of the cloned artef repository
helm install my-artef ./helm/chart/artef -f my-values.yaml
```

Or use `--set` for quick changes:

```bash
# Ensure you are in the root of the cloned artef repository
helm install my-artef ./helm/chart/artef \
  --set image.tag=0.109.1 \
  --set service.type=NodePort
```

Refer to the [chart's `values.yaml`](https://github.com/artef/artef/blob/main/helm/chart/artef/values.yaml) for all available options.

### Persistence Considerations

Ensure your Kubernetes cluster has a default StorageClass configured, or explicitly specify a `storageClassName` in your values that supports `ReadWriteOnce` access mode for the PVC.

## Alternative: Building from Source

If you want to build the image yourself:

### 1. Clone the Repository

```sh
git clone https://github.com/artef/artef.git
cd artef
```

### 2. Build the Docker Image

```sh
# Build for your current architecture
docker build -t artef:custom .

# Or build for a specific platform like linux/amd64
# docker build --platform linux/amd64 -t artef:custom .
```

Images built from this Dockerfile are marked as custom containers. To apply a artef update,
first advance the checkout to the desired release, then rebuild and redeploy. Use a Node.js
`22.22.0` or newer base image (24 LTS recommended). Use `docker build --pull` when a
tagged parent image must be refreshed. An unchanged build context produces the same artef
version.

Custom Dockerfiles that bake artef into another base image should identify themselves so update
notices do not suggest a host-level `npm` or `npx` command:

```dockerfile
ENV artef_RUNNING_IN_DOCKER=1
ENV artef_OFFICIAL_DOCKER_IMAGE=0
```

If your Dockerfile derives from the official artef image, reset the upstream-image marker while
keeping container detection enabled. This prevents update notices from suggesting that users replace
your customized image with the upstream image:

```dockerfile
FROM ghcr.io/artef/artef:latest
ENV artef_OFFICIAL_DOCKER_IMAGE=0
```

Existing derived images that inherit the marker receive safe fallback guidance to refresh the
artef base, rebuild the customized image, and then redeploy it.

### 3. Run the Custom Docker Container

Use the same `docker run` command as in Method 1, but replace the image name:

```bash
docker run -d \
  --name artef_custom_container \
  -p 3000:3000 \
  -v /path/to/local_artef:/home/artef/.artef \
  artef:custom
```

Remember to include the volume mount (`-v`) for data persistence.

## Configuring the CLI

When self-hosting, configure the `artef` CLI to communicate with your instance instead of the default cloud service. This is necessary for commands like `artef share`.

Set these environment variables before running `artef` commands:

```sh
export artef_REMOTE_API_BASE_URL=http://your-server-address:3000
export artef_REMOTE_APP_BASE_URL=http://your-server-address:3000
```

Replace `http://your-server-address:3000` with the actual URL of your self-hosted instance (e.g., `http://localhost:3000` if running locally).

After configuring the CLI, you need to explicitly upload eval results to your self-hosted instance:

1. Run `artef eval` to execute your eval
2. Run `artef share` to upload the results
3. Or use `artef eval --share` to do both in one command

Alternatively, configure these URLs permanently in your `artefconfig.yaml`:

```yaml title="artefconfig.yaml"
# Configure sharing to your self-hosted instance
sharing:
  apiBaseUrl: http://your-server-address:3000
  appBaseUrl: http://your-server-address:3000

prompts:
  - 'Tell me about {{topic}}'

providers:
  - openai:o4-mini
# ... rest of config ...
```

### Configuration Priority

artef resolves the sharing target URL in this order (highest priority first):

1. Config file (`sharing.apiBaseUrl` and `sharing.appBaseUrl`)
2. Environment variables (`artef_REMOTE_API_BASE_URL`, `artef_REMOTE_APP_BASE_URL`)
3. Cloud configuration (set via `artef auth login`)
4. Default artef cloud URLs

### Expected URL Format

When configured correctly, your self-hosted server handles requests like:

- **API Endpoint**: `http://your-server:3000/api/eval`
- **Web UI Link**: `http://your-server:3000/eval/{evalId}`

## Advanced Configuration

### Eval Storage Path

By default, artef stores its SQLite database (`artef.db`) in `/home/artef/.artef` _inside the container_. Ensure this directory is mapped to persistent storage using volumes (as shown in the Docker and Docker Compose examples) to save your evals across container restarts.

By default, artef externalizes large binary outputs (for example, images/audio) to the local filesystem under `/home/artef/.artef/blobs` and replaces inline base64 with lightweight references. To keep media inline (legacy behavior), set `artef_INLINE_MEDIA=true`. Make sure your volume mapping includes `/home/artef/.artef/blobs` so media persists across restarts.

### Custom Config Directory

You can override the default internal configuration directory (`/home/artef/.artef`) using the `artef_CONFIG_DIR` environment variable. If set, artef uses this path _inside the container_ for both configuration files and the `artef.db` database. You still need to map this custom path to a persistent volume.

**Example:** Store data in `/app/data` inside the container, mapped to `./my_custom_data` on the host.

```bash
# Create host directory
mkdir -p ./my_custom_data

# Run container
docker run -d --name artef_container -p 3000:3000 \
  -v ./my_custom_data:/app/data \
  -e artef_CONFIG_DIR=/app/data \
  ghcr.io/artef/artef:latest
```

### Provider Customization

Customize which LLM providers appear in the eval creator UI for cost control, compliance, or routing through internal gateways.

Place a `ui-providers.yaml` file in your `.artef` directory (same location as `artef.db`). When this file exists, only listed providers appear in the UI.

**Example configuration:**

```yaml title="ui-providers.yaml"
providers:
  # Simple provider IDs
  - openai:gpt-5.4-mini
  - anthropic:messages:claude-sonnet-4-5-20250929

  # With labels and defaults
  - id: openai:gpt-5.1
    label: GPT-5.1 (Company Approved)
    config:
      temperature: 0.7
      max_tokens: 4096

  # Custom HTTP provider with env var credentials
  - id: 'http://llm-gateway.company.com/v1'
    label: Internal Gateway
    config:
      method: POST
      headers:
        Authorization: 'Bearer {{ env.INTERNAL_API_KEY }}'
```

**Docker deployment:**

```bash
docker run -d \
  --name artef_container \
  -p 3000:3000 \
  -v ./artef_data:/home/artef/.artef \
  -e INTERNAL_API_KEY=your-key \
  ghcr.io/artef/artef:latest

# Place ui-providers.yaml in ./artef_data/
cp ui-providers.yaml ./artef_data/
```

**Kubernetes ConfigMap:**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: artef-providers
data:
  ui-providers.yaml: |
    providers:
      - openai:gpt-5.1
      - anthropic:messages:claude-sonnet-4-5-20250929
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: artef
spec:
  template:
    spec:
      containers:
        - name: artef
          image: ghcr.io/artef/artef:latest
          volumeMounts:
            - name: config
              mountPath: /home/artef/.artef/ui-providers.yaml
              subPath: ui-providers.yaml
      volumes:
        - name: config
          configMap:
            name: artef-providers
```

:::info Behavior Changes

When `ui-providers.yaml` exists:

- Only configured providers shown (replaces default ~600 providers)
- "Reference Local Provider" button hidden in eval creator
- Configuration is cached - restart required after changes: `docker restart artef_container`

:::

:::caution Security - Credentials

**DO NOT store API keys in ui-providers.yaml**. Use environment variables with Nunjucks syntax:

```yaml
# ui-providers.yaml
providers:
  - id: 'http://internal-api.com/v1'
    config:
      headers:
        Authorization: 'Bearer {{ env.INTERNAL_API_KEY }}'
```

```bash
# Pass via environment
docker run -e INTERNAL_API_KEY=your-key ...
```

For Kubernetes, use Secrets (not ConfigMaps) for sensitive data.

:::

**Configuration fields:**

```yaml
providers:
  - id: string # Required - Provider identifier
    label: string # Optional - Display name
    config: # Optional - Default settings
      temperature: number # 0.0-2.0
      max_tokens: number
      # HTTP providers
      method: string # POST, GET, etc.
      headers: object # Custom headers
      # Cloud providers
      region: string # AWS region, etc.
```

**Provider ID formats:**

- **OpenAI:** `openai:gpt-5.1`, `openai:gpt-5.4-mini`
- **Anthropic:** `anthropic:messages:claude-sonnet-4-5-20250929`
- **AWS Bedrock:** `bedrock:us.anthropic.claude-sonnet-4-5-20250929-v1:0`
- **Azure OpenAI:** `azureopenai:chat:deployment-name`
- **Custom HTTP:** `http://your-api.com/v1` or `https://...`

See [Provider Documentation](/docs/providers/) for complete list.

**Troubleshooting:**

**Providers not updating:** Restart required after config changes.

```bash
docker restart artef_container
# or: docker compose restart
# or: kubectl rollout restart deployment/artef
```

**Providers missing:** Check logs for validation errors:

```bash
docker logs artef_container | grep "Invalid provider"
```

Common issues: missing `id` field, invalid provider ID format, YAML syntax errors.

**Config not detected:** Verify file location and permissions:

```bash
docker exec artef_container ls -la /home/artef/.artef/
docker exec artef_container cat /home/artef/.artef/ui-providers.yaml
```

File must be named `ui-providers.yaml` or `ui-providers.yml` (case-sensitive on Linux).

## Deploying Behind a Reverse Proxy with Base Path

To serve artef at a URL prefix (e.g., `https://example.com/artef/`), rebuild the Docker image with `VITE_PUBLIC_BASENAME` and configure your reverse proxy to strip the prefix.

### Build the Image

```bash
docker build --build-arg VITE_PUBLIC_BASENAME=/artef -t my-artef .
```

### Nginx Configuration

```nginx
location /artef/ {
    proxy_pass http://localhost:3000/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### Traefik Configuration

```yaml
http:
  routers:
    artef:
      rule: 'PathPrefix(`/artef`)'
      middlewares:
        - strip-artef
      service: artef
  middlewares:
    strip-artef:
      stripPrefix:
        prefixes:
          - '/artef'
  services:
    artef:
      loadBalancer:
        servers:
          - url: 'http://artef:3000'
```

The `VITE_PUBLIC_BASENAME` build argument configures the frontend to use the correct paths for routing, API calls, and WebSocket connections.

## Specifications

### Client Requirements (Running `artef` CLI)

- **OS**: Linux, macOS, Windows
- **CPU**: 2+ cores, 2.0GHz+ recommended
- **GPU**: Not required
- **RAM**: 4 GB+
- **Storage**: 10 GB+
- **Dependencies**: Node.js `>=22.22.0`, npm

### Server Requirements (Hosting the Web UI/API)

The server component is optional; you can run evals locally or in CI/CD without it.

**Host Machine:**

- **OS**: Any OS capable of running Docker/Kubernetes
- **CPU**: 4+ cores recommended
- **RAM**: 8GB+ (16GB recommended for heavy use)
- **Storage**: 100GB+ recommended for container volumes and database (SSD recommended for database volume)

## Troubleshooting

### Lost Data After Container Restart

**Problem**: Evals disappear after `docker compose down` or container restarts.

**Solution**: This indicates missing or incorrect volume mapping. Ensure your `docker run` command or `docker-compose.yml` correctly maps a host directory or named volume to `/home/artef/.artef` (or your `artef_CONFIG_DIR` if set) inside the container. Review the `volumes:` section in the examples above.

### Results Not Appearing in Self-Hosted UI

**Problem**: Running `artef eval` stores results locally instead of showing them in the self-hosted UI.

**Solution**:

1. By default, `artef eval` stores results locally (run `artef view` to view them)
2. To upload results to your self-hosted instance, run `artef share` after eval
3. Configure your self-hosted instance using ONE of these methods:

   **Option A: Environment Variables (temporary)**

   ```bash
   export artef_REMOTE_API_BASE_URL=http://your-server:3000
   export artef_REMOTE_APP_BASE_URL=http://your-server:3000
   ```

   **Option B: Config File (permanent - recommended)**

   ```yaml title="artefconfig.yaml"
   sharing:
     apiBaseUrl: http://your-server:3000
     appBaseUrl: http://your-server:3000
   ```

   Replace `your-server` with your actual server address (e.g., `192.168.1.100`, `artef.internal.company.com`, etc.)

4. Then run: `artef eval` followed by `artef share`

:::tip What to Expect
After running `artef share`, you should see output like:

```
View results: http://192.168.1.100:3000/eval/abc-123-def
```

This URL points to your self-hosted instance, not the local viewer.
:::

## See Also

- [Configuration Reference](../configuration/reference.md)
- [Command Line Interface](./command-line.md)
- [Sharing Results](./sharing.md)
