var application = require("application");
var context = application.android.context;

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

      mail.putExtra(android.content.Intent.EXTRA_SUBJECT, arg.subject);

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
        // TODO
        //mail.addAttachmentDataMimeTypeFileName(data, mimeType, fileName);
      }

      mail.setType("application/octet-stream");

      var mailIntent = android.content.Intent.createChooser(mail, "Open with..");
      mailIntent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
      context.startActivity(mailIntent);
    } catch (ex) {
      console.log("Error in email.compose: " + ex);
      reject(ex);
    }
  });
};

var toStringArray = function (arg) {
  // TODO String[] is not correctly mapped via the {N} bridge, so only the first element is passed.. find another way or wait for a {N} fix
  var arr = java.lang.reflect.Array.newInstance(java.lang.String.class, arg.length);
  for (var i = 0; i < arg.length; i++) {
    arr[i] = arg[i];
  }
  return arr;
};