# Koji Dispatch
**Create realtime functionality in your Koji apps. Build chats, multiplayer games, and more!**

## Getting started

Install the package in your Koji project:
`npm i --save @withkoji/dispatch`

Note that you should also have `@withkoji/vcc` installed.

Import the library and initialize a new Dispatch class.
```
import Dispatch, { DISPATCH_EVENT } from '@withkoji/dispatch';
const dispatch = new Dispatch({
  projectId: Koji.config.metadata.projectId,
});
```

Koji dispatch comes with some predefined events to help you get up and running. Listen for them:

```
dispatch.on(DISPATCH_EVENT.CONNECTED, ({ clientId, shardName }) => {
  // clientId is the internal ID of this client
  // shardName is the name of the shard to which the user is connected. See below for more info
});

dispatch.on(DISPATCH_EVENT.CONNECTED_CLIENTS_CHANGED, ({ connectedClients }) => {
  // connectedClients is an object of the form { clientId: { userInfo } }
});
```

After you connect, you can broadcast any JSON payload and all connected clients on the shard will receive it. Example:

```
dispatch.emitEvent('chat_message_sent', {
  author: 'AuthorUsername',
  body: 'This is the body of my message',
});

dispatch.on('chat_message_sent', (payload) => {
  // payload will be an object matching the one we sent above
  // it will also include the timestamp of the message and the ID of the client who sent it
})
```

## User data

You can specify persistent user data using `dispatch.setUserInfo({ object... })`. The object set here will be broadcast to all clients when they connect as part of the `DISPATCH_EVENT.CONNECTED_CLIENTS_CHANGED` event.

You can use this for things like attaching usernames, avatars, etc. to a client.

## Understanding shards

Think of shards like "servers" in a multiplayer game. You can use them to organize and separate different groups of users. This can be useful for performance reasons (e.g., you only want 20 players per world), or for organizing channels in a chatroom, or performing matchmaking in a 1v1 game.

When you create a new dispatch object, you can specify an additional `options` key to configure how shards behave:
```
const dispatch = new Dispatch({
  projectId: Koji.config.metadata.projectId,
  options: {
    shardName: 'expicitShardName', // the name of the shard you want to connect to. if this key is not present, the user will automatically be placed onto a shard
    maxConnectionsPerShard: 20, // specify how many users to allow on a shard before it is "full" -- once a shard is full, new users will be added to a new shard unless a different shard is explicity set
  }
})
```

You can retrieve a list of the current shards and their approximate connected client count by calling:
```
dispatch.info().then((shards) => {
  // [{ shardName: "myshard", numConnectedClients: 10 }]
});
```
