# GitHub Workflow Dispatcher

A small HTTP server using node.js and the [hapi](https://hapi.dev/) framework,
that enables you to trigger GitHub Actions workflows using simple links (aka
HTTP `GET` requests).

## About

As you might know, GitHub Actions workflows can be triggered on demand using the
[`workflow_dispatch`](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch)
event. However, to trigger such an event, a HTTP `POST` request with payload and
authentication is required. That way, you are not able to trigger a workflow
using a simple link.

The _GitHub Workflow Dispatcher_ solves this problem. It offers a `GET` route
that can pass-through a `workflow_dispatch` event with optional inputs to the
GitHub API. For authentication, it uses GitHub OAuth to create a user token that
is used for further requests. This way it is ensured, that only users with
sufficient privileges can trigger a workflow.

To use _GitHub Workflow Dispatcher_ with your GitHub Enterprise environment, you
need to host your own instance using the respective
[environment options](https://github.com/simbo/github-workflow-dispatcher/blob/main/.env-sample#L18-L20).

## Development

Requirements:

- node.js >= 18.x
- git-secret
- docker (optional)

### Git Secrets

This project uses [`git-secret`](https://github.com/sobolevn/git-secret) to
store sensitive information in the git repository.

Before being able to decrypt the data, your public GPG key needs to be added to
the list of allowed users.

### Setup

```sh
# clone repo
git clone git@github.com:simbo/github-workflow-dispatcher.git

# install dependencies
npm i

# reveal secrets
git secret reveal

# start dev server
npm start
```

### Docker

The project contains a `Dockerfile` to create an image.

The docker build expects a `.env-production` file to be present (revealed).

```sh
# build docker image
docker build -t github-workflow-dispatcher:VERSION .

# start docker container
docker run -itd -p 8080:3000 -e BASE_URL=http://localhost:8080/ github-workflow-dispatcher:VERSION
```

## License and Author

[MIT &copy; Simon Lepel](https://simbo.mit-license.org/)
