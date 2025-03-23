This repository helps familiarize with async-reactivity approach to browser and server communication.

# Modes

## HTTP

HTTP mode is easier to implement and it provides many benefits comparing to traditional approach:

* Browser
    * Query is lazy loaded (loaded only when actually used in the view)
    * Query result is cached and could be reused in multiple components
    * Query refresh is replaced by query result invalidation, which is beneficial because cache invalidation does not always result in refreshing (for example when not actually used in the view)
* Server
    * State is lazy loaded and cached
* Shared types

## Socket

Socket mode is more complex, but it provides even more benefits:

* Fully declarative
    * Browser gets real-time updates
    * No need to care about refresh
* Query can be adjusted, minimal amount of recalculations is ensured

# Packages

## Core

This code should not be part of this repository and eventually will be moved out. This code will become part of async-reactivity libraries.

## Shared

This code is shared among server and web.

Usage of `Promise` might look excessive, but it is unavoidable.

## Server

There are three main parts:

* [state](packages/server/src/state.ts) is a sample state
    * `a` is a number provided by user
    * `b` is a boolean which tells if `a` is divisible by 5
    * async-reactivity components (`Ref`, `Computed`) are used to minimize recalculations (for example `b` in [state](packages/server/src/state.ts) is only recomputed if `a` is changed)
* [server](packages/server/src/server.ts) sets everything up and takes care of `a` updates (HTTP PUT)
* [http](packages/server/src/http.ts) and [socket](packages/server/src/socket.ts) illustrate sample query implementation
    * There is not much sense to use `SampleQuery` in [http](packages/server/src/http.ts) in this sample. But it might be reasonable if reactivity is needed in server (for example push notification is pushed when inverted `b` becomes false)

## Web (browser)

* [main.ts](packages/web/src/main.ts) mounts the app
* [App.vue](packages/web/src/App.vue)
    * **Input** section allows user to send `a` to server (global scope)
    * **Query** section allows user to `invert` query result (query scope)
* Both modes usage is very similar: [Http.vue](packages/web/src/Http.vue), [Socket.vue](packages/web/src/Socket.vue)
    * `async-reactivity-vue` takes care of integration between `async-reactivity` and `@vue/reactivity`
    * HTTP mode has **Invalidate** button as it is unknown when server state changes
* [http](packages/web/src/http.ts) implementation performs fetch request
* [socket](packages/web/src/socket.ts) implementation creates live query and uses [Connection](packages/core/src/Connection.ts)

# Run

Build

```bash
cd packages/core
pnpm run build
cd ../shared
pnpm run build
cd ../server
pnpm run build
```

## Server

```bash
cd packages/server
pnpm run start
```

## Client
```bash
cd packages/web
pnpm run dev
```
