This repository helps familiarize with async-reactivity approach to browser and server communication.

# Modes

## HTTP REST

HTTP REST mode affects only browser and it provides many benefits comparing to traditional approach:

* Query is lazy loaded (loaded only when actually used in the view)
* Query result is cached and could be reused in multiple components
* Query refresh is replaced by query result invalidation, which is beneficial because cache invalidation does not always result in refreshing (for example when not actually used in the view)

## HTTP Query

HTTP Query needs to be used in browser and server and it provides even more benefits:

* Browser and server shared types and logic
* Query usage in server
* Query takes care of communication between browser and server (API)

## Socket

Socket mode gives everything mentioned earlier + these superpowers:

* Fully declarative
    * Browser gets real-time updates
    * No need to care about refresh
* Query can be adjusted, minimal amount of recalculations is ensured

# Sample

This app provides simple todo list to illustrate async-reactivity capabilities.

User can:

* view todo items
  * filter by text
  * filter by status
* edit todo items
  * change text
  * change status (done / not done)
  * remove
* get notification if not valid not done items exist

There is no data persistence, memory is used.

Code is not shared between modes.

# Packages

## Business Logic

Shared code among server and web.

* [data.ts](packages/business-logic/src/data.ts) (server-only) is a in-memory database. It provides `get`, `write`, `subscribe`, `unsubscribe` methods.
* [Item.ts](packages/business-logic/src/Item.ts) is todo item entity class
* [http](packages/business-logic/src/http) illustrates HTTP Query mode
  * [SampleQuery.ts](packages/business-logic/src/http/SampleQuery.ts) - shared code
  * [SampleQuery.browser.ts](packages/business-logic/src/http/SampleQuery.browser.ts) - browser version
  * [SampleQuery.server.ts](packages/business-logic/src/http/SampleQuery.server.ts) - server version
* [socket](packages/business-logic/src/socket) illustrates Socket mode
  * [SampleQuery.ts](packages/business-logic/src/socket/SampleQuery.ts) - shared code
  * [SampleLiveQuery.browser.ts](packages/business-logic/src/socket/SampleLiveQuery.browser.ts) - browser version
  * [SampleLiveQuery.server.ts](packages/business-logic/src/socket/SampleLiveQuery.server.ts) - server version for communication with browser
  * [SampleQuery.server.ts](packages/business-logic/src/socket/SampleQuery.server.ts) - server version for internal use

## Server

* [http/rest.ts](packages/server/src/http/rest.ts) takes care of HTTP REST mode
* [http/query.ts](packages/server/src/http/query.ts) takes care of HTTP Query mode
* [socket.ts](packages/server/src/socket.ts) takes care of Socket mode
* [monitors.ts](packages/server/src/monitors.ts) illustrates query usage in server

## Web (browser)

* [HttpRest.vue](packages/web/src/HttpRest.vue) illustrates HTTP REST mode
* [Http.vue](packages/web/src/Http.vue) illustrates HTTP Query mode
* [Socket.vue](packages/web/src/Socket.vue) illustrates Socket mode

HTTP modes have **Invalidate** button as it is unknown when server state changes.

`async-reactivity-vue` takes care of integration between `async-reactivity` and `@vue/reactivity`

# Run

Build

```bash
cd packages/business-logic
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
