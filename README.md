# NativeScript Email

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Twitter Follow][twitter-image]][twitter-url]

[npm-image]:http://img.shields.io/npm/v/nativescript-email.svg
[npm-url]:https://npmjs.org/package/nativescript-email
[downloads-image]:http://img.shields.io/npm/dm/nativescript-email.svg
[twitter-image]:https://img.shields.io/twitter/follow/eddyverbruggen.svg?style=social&label=Follow%20me
[twitter-url]:https://twitter.com/eddyverbruggen

You can use thsi plugin to compose emails, edit the draft manually, and send it.

## Installation
Make sure you're running NativeScript 2.3.0 or up. Do `npm install -g nativescript` if not.

The run the following command from the root of your project:

```
tns plugin add nativescript-email
```

## API

To use this plugin you must first require/import it:

#### TypeScript

```typescript
import * as email from "nativescript-email";
// or
import { compose } from "nativescript-email";
// or even
import { compose as composeEmail } from "nativescript-email";
```

#### JavaScript

```js
var email = require("nativescript-email");
```

### `available`

#### TypeScript

```typescript
  email.available((avail: boolean) => {
      console.log("Email available? " + avail);
  })
```

#### JavaScript

```js
  email.available().then(function(avail) {
      console.log("Email available? " + avail);
  })
```

### `compose`

#### JavaScript

```js
  // let's first create a File object using the tns file module
  var fs = require("file-system");
  var appPath = fs.knownFolders.currentApp().path;
  var logoPath = appPath + "/res/telerik-logo.png";

  email.compose({
      subject: "Yo",
      body: "Hello <strong>dude</strong> :)",
      to: ['eddyverbruggen@gmail.com', 'to@person2.com'],
      cc: ['ccperson@somewhere.com'],
      bcc: ['eddy@combidesk.com', 'eddy@x-services.nl'],
      attachments: [
        {
            fileName: 'arrow1.png',
            path: 'base64://iVBORw0KGgoAAAANSUhEUgAAABYAAAAoCAYAAAD6xArmAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAHGlET1QAAAACAAAAAAAAABQAAAAoAAAAFAAAABQAAAB5EsHiAAAAAEVJREFUSA1iYKAimDhxYjwIU9FIBgaQgZMmTfoPwlOmTJGniuHIhlLNxaOGwiNqNEypkwlGk9RokoIUfaM5ijo5Clh9AAAAAP//ksWFvgAAAEFJREFUY5g4cWL8pEmT/oMwiM1ATTBqONbQHA2W0WDBGgJYBUdTy2iwYA0BrILDI7VMmTJFHqv3yBUEBQsIg/QDAJNpcv6v+k1ZAAAAAElFTkSuQmCC',
            mimeType: 'image/png'
        },
        {
            fileName: 'telerik-logo.png',
            path: logoPath,
            mimeType: 'image/png'
      }]
  }).then(
    function() {
      console.log("Email composer closed");
    }, function(err) {
      console.log("Error: " + err);
    });
```

Full attachment support has been added to 1.3.0 per the example above.

Since 1.4.0 the promise will be rejected in case a file can't be found.

## Usage with Angular
Check out [this tutorial (YouTube)](https://www.youtube.com/watch?v=fSnQb9-Gtdk) to learn how to use this plugin in a NativeScript-Angular app.

## Known issues
On iOS you can't use the simulator to test the plugin because of an iOS limitation.
To prevent a crash this plugin returns `false` when `available` is invoked on the iOS sim.
