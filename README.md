# Koji Dispatch

**Create realtime functionality in your Koji apps.**

## Overview

The @withkoji/dispatch package enables you to implement real-time functionality in your Koji template. For example, chats, multi-player games, and polls.

## Installation

Install the package in your Koji projects' frontend services.

```
npm install --save @withkoji/dispatch
```

NOTE: You must also install the `@withkoji/vcc` package.

## Basic use

Import and initialise the dispatch package in your frontend service.

```
import Dispatch from '@withkoji/dispatch';
const dispatch = new Dispatch({
  projectId: instantRemixing.get(['metadata', 'projectId']),
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

For any questions, reach out to the developer community or the `@Koji Team` on our [Discord server](https://discord.gg/eQuMJF6).
