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
      bcc: ['eddy@combidesk.com', 'eddy@x-services.nl'],
      attachments: [{
          fileName: 'arrow.png',
          path: 'base64://iVBORw0KGgoAAAANSUhEUgAAABYAAAAoCAYAAAD6xArmAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAHGlET1QAAAACAAAAAAAAABQAAAAoAAAAFAAAABQAAAB5EsHiAAAAAEVJREFUSA1iYKAimDhxYjwIU9FIBgaQgZMmTfoPwlOmTJGniuHIhlLNxaOGwiNqNEypkwlGk9RokoIUfaM5ijo5Clh9AAAAAP//ksWFvgAAAEFJREFUY5g4cWL8pEmT/oMwiM1ATTBqONbQHA2W0WDBGgJYBUdTy2iwYA0BrILDI7VMmTJFHqv3yBUEBQsIg/QDAJNpcv6v+k1ZAAAAAElFTkSuQmCC',
          mimeType: 'image/png'
      }],
      appPickerTitle: 'Compose with..' // for Android, default: 'Open with..'
  }).then(function() {
      console.log("Email composer closed");
  });
```

Version 1.2.0 will support add attachments per the example above.

At the moment you need to use base64 encoding, but this will soon be extended.

## Known issues
On iOS you can't use the simulator to test the plugin because of an iOS limitation.
To prevent a crash this plugin returns `false` when `available` is invoked on the iOS sim.

## Future work
Add attachment support