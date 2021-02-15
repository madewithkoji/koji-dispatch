# Koji Dispatch
![npm (scoped)](https://img.shields.io/npm/v/@withkoji/dispatch?color=green&style=flat-square)

**Create real-time functionality in your Koji templates.**

## Overview

**NOTE:**
This package is deprecated and is included only for backwards compatibility. For new templates, use @withkoji/core.

The @withkoji/dispatch package enables you to implement real-time functionality in your Koji template. For example, chats, multi-player games, and polls.

You can use dispatch on the frontend to enable real-time updates and communication between connected clients. You can also use it transactionally on the backend to send secure messages to specific clients that have been identified with a short-lived token.

## Installation

Install the package in your Koji project.

```
npm install --save @withkoji/dispatch
```

**NOTE:** You must also install the [@withkoji/vcc package](https://developer.withkoji.com/reference/packages/withkoji-vcc-package).

## Basic use

Import and instantiate `Dispatch` on the frontend.

```
import Dispatch from '@withkoji/dispatch';
const dispatch = new Dispatch({
  projectId: instantRemixing.get(['metadata', 'projectId']),
});
```

Import and instantiate `Dispatch` on the backend.

```
import Dispatch from '@withkoji/dispatch';
const dispatch = new Dispatch({
  projectId: res.locals.KOJI_PROJECT_ID || process.env.KOJI_PROJECT_ID,
  options: {
    projectToken: res.locals.KOJI_PROJECT_TOKEN || process.env.KOJI_PROJECT_TOKEN,
  },
});
```

Use the `connect` function to join an open shard.
```
dispatch.connect();
```

Emit and respond to events for multi-user functionality.
```
dispatch.emitEvent('myEvent', myDataPayload);
dispatch.on('myEvent', myHandlerFunction);
```

## Related resources

* [Package documentation](https://developer.withkoji.com/reference/packages/withkoji-dispatch-package)
* [Vote counter template](http://developer.withkoji.com/docs/blueprints/vote-counter-blueprint)
* [Koji homepage](http://withkoji.com/)

## Contributions and questions

See the [contributions page](https://developer.withkoji.com/docs/about/contribute-koji-developers) on the developer site for info on how to make contributions to Koji repositories and developer documentation.

For any questions, reach out to the developer community or the `@Koji Team` on our [Discord server](https://discord.com/invite/9egkTWf4ec).
