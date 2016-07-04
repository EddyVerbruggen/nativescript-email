var application = require("application");

exports.available = function () {
  return new Promise(function (resolve, reject) {
    try {
      var uri = android.net.Uri.fromParts("mailto", "eddyverbruggen@gmail.com", null);
      var intent = new android.content.Intent(android.content.Intent.ACTION_SENDTO, uri);
      var packageManager = application.android.context.getPackageManager();
      var nrOfMailApps = packageManager.queryIntentActivities(intent, 0).size();
      resolve(nrOfMailApps > 0);
    } catch (ex) {
      console.log("Error in email.available: " + ex);
      reject(ex);
    }
  });
};

exports.compose = function (arg) {
  var that = this;
  return new Promise(function (resolve, reject) {
    try {

      if (!that.available()) {
        reject("No mail available");
      }

      var mail = new android.content.Intent(android.content.Intent.ACTION_SEND_MULTIPLE);
      if (arg.body) {
        var htmlPattern = java.util.regex.Pattern.compile(".*\\<[^>]+>.*", java.util.regex.Pattern.DOTALL);
        if (htmlPattern.matcher(arg.body).matches()) {
          mail.putExtra(android.content.Intent.EXTRA_TEXT, android.text.Html.fromHtml(arg.body));
          mail.setType("text/html");
        } else {
          mail.putExtra(android.content.Intent.EXTRA_TEXT, arg.body);
          mail.setType("text/plain");
        }
      }

      if (arg.subject) {
        mail.putExtra(android.content.Intent.EXTRA_SUBJECT, arg.subject);
      }
      if (arg.to) {
        mail.putExtra(android.content.Intent.EXTRA_EMAIL, toStringArray(arg.to));
      }
      if (arg.cc) {
        mail.putExtra(android.content.Intent.EXTRA_CC, toStringArray(arg.cc));
      }
      if (arg.bcc) {
        mail.putExtra(android.content.Intent.EXTRA_BCC, toStringArray(arg.bcc));
      }
      if (arg.attachments) {
        var uris = new java.util.ArrayList();
        for (var a in arg.attachments) {
          var attachment = arg.attachments[a];
          var path = attachment.path;
          var fileName = attachment.fileName;
          var uri = _getUriForPath(path, fileName, application.android.context);

          if (!uri) {
            console.log("File not found for path: " + path);
            continue;
          }
          uris.add(uri);
        }

        if (!uris.isEmpty()) {
          mail.setType("message/rfc822");
          mail.putParcelableArrayListExtra(android.content.Intent.EXTRA_STREAM, uris);
        }
      }

      mail.setType("application/octet-stream");

      var mailIntent = android.content.Intent.createChooser(mail, arg.appPickerTitle || "Open with..");
      mailIntent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
      application.android.context.startActivity(mailIntent);

      // we can wire up an intent receiver but it's always the same resultCode anyway so that's useless.. thanks Android!
      resolve(true);
    } catch (ex) {
      console.log("Error in email.compose: " + ex);
      reject(ex);
    }
  });
};

function _getUriForPath(path, fileName, ctx) {
  // TODO non-base64 methods
  if (path.indexOf("res:") === 0) {
    // return getUriForResourcePath(path, ctx);
    return null;
  } else if (path.indexOf("file:///") === 0) {
    // return getUriForAbsolutePath(path);
    return null;
  } else if (path.indexOf("file://") === 0) {
    // return getUriForAssetPath(path, ctx);
    return null;
  } else if (path.indexOf("base64:") === 0) {
    return _getUriForBase64Content(path, fileName, ctx);
  } else {
    return android.net.Uri.parse(path);
  }
}

function _getUriForBase64Content(content, fileName, ctx) {
  var resData = content.substring(content.indexOf("://") + 3);
  var dir = ctx.getExternalCacheDir();
  var bytes;

  try {
    bytes = android.util.Base64.decode(resData, 0);
  } catch (ex) {
    console.log("Invalid Base64 string: " + resData);
    return android.net.Uri.EMPTY;
  }

  if (dir === null) {
    console.log("Missing external cache dir");
    return android.net.Uri.EMPTY;
  }

  var storage = dir.toString() + "/emailcomposer";
  var file = new java.io.File(storage, fileName);
  new java.io.File(storage).mkdir();

  console.log("dir created: " + storage);
  console.log("res: " + fileName);
  console.log("file: " + file);


  var fileOutStream;
  try {
    fileOutStream = new java.io.FileOutputStream(file);
    fileOutStream.write(bytes);
    fileOutStream.flush();
  } catch (ex) {
    console.log("Error writing file: " + ex);
  } finally {
    if (fileOutStream !== null) {
      try {
        fileOutStream.close();
      } catch (ex2) {
        console.log("Close exception.. ignoring: " + ex2);
      }
    }
  }
  return android.net.Uri.fromFile(file);
}

var toStringArray = function (arg) {
  var arr = java.lang.reflect.Array.newInstance(java.lang.String.class, arg.length);
  for (var i = 0; i < arg.length; i++) {
    arr[i] = arg[i];
  }
  return arr;
};