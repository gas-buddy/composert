# Composert [![wercker status](https://app.wercker.com/status/c3b342d913fc360f95f24ea5aee88ff3/s/master "wercker status")](https://app.wercker.com/project/byKey/c3b342d913fc360f95f24ea5aee88ff3)

Split and concat pem-encoded certs to be supplied as a CA list to an HTTPS agent.

## API

### (require("@gasbuddy/composert"))(...path, [callback]) ⇒ <code>undefined</code> &#124; <code>Promise</code> ⏏
Split pem-encoded crts into individual certs in an array

**Kind**: Exported function  
**Returns**: <code>undefined</code> &#124; <code>Promise</code> - returns a <code>Promise</code> if callback not provided

| Param | Type | Description |
| --- | --- | --- |
| ...path | <code>string</code> | fs path to a .pem.crt |
| [callback] | <code>function</code> | an optional callback |

