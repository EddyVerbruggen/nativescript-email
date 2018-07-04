var fs = require("tns-core-modules/file-system");
var utils = require("tns-core-modules/utils/utils");

var _isEmailAvailable = null;

var _determineAvailability = function() {
  if (_isEmailAvailable === null) {
    var isSimulator;
    var processInfo = utils.ios.getter(NSProcessInfo, NSProcessInfo.processInfo);
    var isMinIOS9 = processInfo.isOperatingSystemAtLeastVersion({majorVersion: 9, minorVersion: 0, patchVersion: 0});
    if (isMinIOS9) {
      var simDeviceName = processInfo.environment.objectForKey("SIMULATOR_DEVICE_NAME");
      isSimulator = simDeviceName !== null;
    } else {
      var currentDevice = utils.ios.getter(UIDevice, UIDevice.currentDevice);
      isSimulator = currentDevice.name.toLowerCase().indexOf("simulator") > -1;
    }

    if (isSimulator) {
      console.log("Email is not available on the Simulator");
    }

    _isEmailAvailable = !isSimulator && MFMailComposeViewController.canSendMail();
  }
  return _isEmailAvailable;
};

exports.available = function () {
  return new Promise(function (resolve, reject) {
    try {
      resolve(_determineAvailability());
    } catch (ex) {
      console.log("Error in email.available: " + ex);
      reject(ex);
    }
  });
};

exports.compose = function (arg) {
  return new Promise(function (resolve, reject) {
    try {

      if (!_determineAvailability()) {
        reject("No mail available");
        return;
      }

      var mail = MFMailComposeViewController.new();

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
        for (var a in arg.attachments) {
          var attachment = arg.attachments[a];
          var path = attachment.path;
          var data = _getDataForAttachmentPath(path);
          if (data === null) {
            reject("File not found for path: " + path);
            return;
          } else if (!attachment.fileName) {
            console.log("attachment.fileName is mandatory");
          } else if (!attachment.mimeType) {
            console.log("attachment.mimeType is mandatory");
          } else {
            mail.addAttachmentDataMimeTypeFileName(
                data, attachment.mimeType, attachment.fileName);
          }
        }
      }

      var app = utils.ios.getter(UIApplication, UIApplication.sharedApplication);

      // Assign first to local variable, otherwise it will be garbage collected since delegate is weak reference.
      var delegate = MFMailComposeViewControllerDelegateImpl.new().initWithCallback(function (result, error) {
        // invoke the callback / promise
        resolve(result == MFMailComposeResultSent);
        // close the mail
        app.keyWindow.rootViewController.dismissViewControllerAnimatedCompletion(true, null);
        // release the delegate instance
        CFRelease(delegate);
      });

      // retain the delegate because the mailComposeDelegate property won't do it for us
      CFRetain(delegate);

      mail.mailComposeDelegate = delegate;

      app.keyWindow.rootViewController.presentViewControllerAnimatedCompletion(mail, true, null);

    } catch (ex) {
      console.log("Error in email.compose: " + ex);
      reject(ex);
    }
  });
};

function _getDataForAttachmentPath(path) {
  var data = null;
  if (path.indexOf("file:///") === 0) {
    data = _dataForAbsolutePath(path);
  } else if (path.indexOf("file://") === 0) {
    data = _dataForAsset(path);
  } else if (path.indexOf("base64:") === 0) {
    data = _dataFromBase64(path);
  } else {
    var fileManager = utils.ios.getter(NSFileManager, NSFileManager.defaultManager);
    if (fileManager.fileExistsAtPath(path)) {
      data = fileManager.contentsAtPath(path);
    }
  }
  return data;
}

function _dataFromBase64(base64String) {
  base64String = base64String.substring(base64String.indexOf("://")+3);
  return NSData.alloc().initWithBase64EncodedStringOptions(base64String, 0);
}

function _dataForAsset(path) {
  path = path.replace("file://", "/");

  if (!fs.File.exists(path)) {
    console.log("File does not exist: " + path);
    return null;
  }

  var localFile = fs.File.fromPath(path);
  return localFile.readSync(function(e) { error = e; });
}

function _dataForAbsolutePath(path) {
  var fileManager = utils.ios.getter(NSFileManager, NSFileManager.defaultManager);
  var absPath = path.replace("file://", "");

  if (!fileManager.fileExistsAtPath(absPath)) {
    console.log("File not found: " + absPath);
    return null;
  }

  return fileManager.contentsAtPath(absPath);
}

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
