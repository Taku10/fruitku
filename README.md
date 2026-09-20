# Fruitku

Next.js storefront using hosted Sanity, Firebase, Stripe, and EmailJS services.
The container runs the storefront and its API routes. The separate
`sanityfruitstation/` Studio project is not part of the storefront image.

## Run with Docker

Requires Docker Engine with BuildKit and Docker Compose v2 or newer.

1. Copy `.env.example` to `.env` if you do not already have one, then fill in
   the values for your services. Never commit `.env`.
2. Run `docker compose up --build -d --wait`.
3. Open <http://localhost:3000>.

Use `docker compose logs -f app` for logs and `docker compose down` to stop.
Set `APP_PORT` in `.env` to change the host port. The default binding is localhost;
for remote deployment, put a TLS reverse proxy in front of the app and configure
its networking explicitly.

All `NEXT_PUBLIC_*` values are public and compiled into browser bundles during
build. Rebuild the image when they change. `STRIPE_SECRET_KEY` is supplied only
at runtime. Compose passes only explicitly listed variables into the build and
container; `.env` files are excluded from the build context.

If migrating an existing `.env`:

- Rename `NEXT_PUBLIC_STRIPE_SECRET_KEY` to `STRIPE_SECRET_KEY`.
- Rename `EMAIL_SERVICE_ID`, `EMAIL_TEMPLATE_ID`, and `EMAIL_PUBLIC_KEY` to their
  `NEXT_PUBLIC_` equivalents; these configure the browser EmailJS SDK.
- Remove `NEXT_PUBLIC_SANITY_TOKEN`. The storefront reads the public Sanity
  dataset without credentials. A private dataset requires a separate server-only
  data access design, not a token embedded in browser JavaScript.
- Supply `NEXT_PUBLIC_FIREBASE_APP_ID` alongside the other Firebase values.

Rotate any real secret previously published in browser bundles.

## Container design

The multi-stage Dockerfile uses Node 22 on Debian slim, installs dependencies
with `npm ci` and the committed lockfile, and copies only Next.js standalone
output and static assets into the runtime stage. It runs as the unprivileged
`node` user. Compose enables init and drops Linux capabilities, prevents privilege
escalation, and bounds log storage. Next.js owns its runtime files so its page
and image caches remain writable.

`/api/health` is a lightweight process health check; it does not test external
services. Builds require network access to npm and Sanity because existing
product and news pages fetch content during static generation. Configure the
hosted services' allowed domains/CORS for your deployment.

The Node base image is pinned by digest for reproducible builds. Regularly
update that digest for security patches, rebuild, and redeploy. For immutable
releases, publish the built image to your registry and deploy its digest.

## Local development

Use Node 22, run `npm ci`, configure `.env`, and run `npm run dev`.
`npm run build` produces the production build; `npm run lint` runs lint checks.

The repository currently pins Next.js 12.3.1. Containerization does not upgrade
or remediate its existing framework/dependency issues; review and upgrade these
before an internet-facing production release.

References: [Next.js container guide](https://docs.docker.com/guides/nextjs/)
and [Next.js standalone output](https://nextjs.org/docs/pages/api-reference/config/next-config-js/output).

## k3s

See [k3s deployment instructions](k8s/README.md) for the manifests targeting
`nonprod`, image import, runtime Secret setup, and internal service access.

## GitHub Actions

[CI workflow](.github/workflows/ci.yaml) builds and smoke-tests
pull requests targeting `main`. Pushes to `main` and manual runs on `main`
publish the exact tested image to `ghcr.io/taku10/fruitku`. Unique tags include
commit SHA, run ID, and attempt so reruns cannot overwrite earlier releases.
The workflow summary records the registry digest for deployment.

Before the first run, add the `NEXT_PUBLIC_*` values from `.env.example` under
GitHub **Settings → Secrets and variables → Actions → Variables**. Use nonprod
service configuration initially. These values are public browser configuration;
never put Stripe's secret key or a Sanity token into build variables. CI uses a
placeholder runtime Stripe key and does not exercise real payment/auth flows.
The build still needs access to the hosted Sanity dataset for static generation.

Publishing uses the automatic `GITHUB_TOKEN` with package-write permission;
no personal token or cluster kubeconfig is required. Ensure repository policies
allow package publishing. PRs never log in or publish. Configure `Build and test` as
a required branch-protection check. Dependabot maintains action and base-image
pins. The smoke test checks pages, assets, non-root execution, and excluded files.

This workflow publishes images; it does not deploy to the cluster. To promote a
successful build, set `newName: ghcr.io/taku10/fruitku` in
`k8s/kustomization.yaml`, replace `newTag` with `digest: sha256:...` from the run
summary, and follow the k3s instructions. For a private GHCR package, configure
an imagePullSecret in `nonprod` and reference it in the pod spec. For GitOps,
commit that image change in the platform repository once Fruitku has been
registered through its Argo CD bootstrap. Production needs its own browser
configuration build if it uses different Firebase/Stripe projects.

Reference: [GitHub's image publishing guidance](https://docs.github.com/en/actions/tutorials/publish-packages/publish-docker-images).
