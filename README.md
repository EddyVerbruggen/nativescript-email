# NativeScript Email

An Email plugin for use in your NativeScript app.
You can use it to compose emails, edit the draft manually, and send it.

## Installation
Run the following command from the root of your project:

```
tns plugin add nativescript-email
```

## Usage

To use this plugin you must first require() it:

```js
var email = require("nativescript-email");
```

### available

```js
  email.available().then(function(avail) {
      console.log("Email available? " + avail);
  })
```

### compose
```js
  email.compose({
      subject: "Yo",
      body: "Hello <strong>dude</strong> :)",
      to: ['eddyverbruggen@gmail.com', 'to@person2.com'],
      cc: ['ccperson@somewhere.com'],
      bcc: ['eddy@combidesk.com', 'eddy@x-services.nl']
  }).then(function(r) {
      console.log("Email composer closed");
  });
```

## Known issues
On Android, you can pass an array of to/cc/bcc, but only the first one is added.
Should be able to fix that in a future release.

## Future work
Add attachment support