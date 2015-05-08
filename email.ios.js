var frame = require("ui/frame");

exports.available = function () {
  return new Promise(function (resolve, reject) {
    try {
      resolve(MFMailComposeViewController.canSendMail());
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

      var mail = MFMailComposeViewController.alloc().init();

      var message = arg.body;
      if (message) {
        var messageAsNSString = NSString.stringWithString(message);
        var isHTML = messageAsNSString.rangeOfStringOptions("<[^>]+>", NSRegularExpressionSearch).location != NSNotFound;
        mail.setMessageBodyIsHTML(arg.body, isHTML);
      }
      mail.setSubject(arg.subject);
      mail.setToRecipients(arg.to);
      mail.setCcRecipients(arg.cc);
      mail.setBccRecipients(arg.bcc);
      if (arg.attachments) {
        // TODO
        //mail.addAttachmentDataMimeTypeFileName(data, mimeType, fileName);
      }

      // Assign first to local variable, otherwise it will be garbage collected since delegate is weak reference.
      var delegate = MFMailComposeViewControllerDelegateImpl.new().initWithCallback(function (result, error) {
        // invoke the callback / promise
        resolve();
        // close the mail
        UIApplication.sharedApplication().keyWindow.rootViewController.dismissViewControllerAnimatedCompletion(true, null);
        // Remove the local variable for the delegate.
        delegate = undefined;
      });

      mail.mailComposeDelegate = delegate;

      UIApplication.sharedApplication().keyWindow.rootViewController.presentViewControllerAnimatedCompletion(mail, true, null);

    } catch (ex) {
      console.log("Error in email.compose: " + ex);
      reject(ex);
    }
  });
};

var MFMailComposeViewControllerDelegateImpl = (function (_super) {
  __extends(MFMailComposeViewControllerDelegateImpl, _super);
  function MFMailComposeViewControllerDelegateImpl() {
    _super.apply(this, arguments);
  }

  MFMailComposeViewControllerDelegateImpl.new = function () {
    return _super.new.call(this);
  };
  MFMailComposeViewControllerDelegateImpl.prototype.initWithCallback = function (callback) {
    this._callback = callback;
    return this;
  };
  MFMailComposeViewControllerDelegateImpl.prototype.mailComposeControllerDidFinishWithResultError = function (controller, result, error) {
    this._callback(result, error);
  };
  MFMailComposeViewControllerDelegateImpl.ObjCProtocols = [MFMailComposeViewControllerDelegate];
  return MFMailComposeViewControllerDelegateImpl;
})(NSObject);