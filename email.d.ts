declare module "nativescript-email" {

    interface Attachment {
      /**
       * The name used for the attachment.
       * Example:
       * 
       *   fileName: 'Cute-Kitten.png'
       */
      fileName: string;

      /**
       * At the moment use a base64 encoded file only, this will be extended soon.
       * Example:
       * 
       *   path: 'base64://iVBORw..XYZ'
       * 
       */
      path: string;

      /**
       * Used to help the OS figure out how to send the file.
       * Exampe:
       * 
       *   mimeType: 'image/png'
       */
      mimeType: string;
    }

    /**
     * The options object passed into the compose function.
     */
    export interface ComposeOptions {
      /**
       * The subject of your email.
       */
      subject?: string;

      /**
       * The plugin will automatically handle plain and html email content.
       */
      body?: string;

      /**
       * A string array of email addresses.
       * Known issue: on Android only the first item in the array is added.
       */
      to?: string[];

      /**
       * A string array of email addresses.
       * Known issue: on Android only the first item in the array is added.
       */
      cc?: string[];

      /**
       * A string array of email addresses.
       * Known issue: on Android only the first item in the array is added.
       */
      bcc?: string[];

      /**
       * An optional Array of attachments.
       */
      attachments?: Array<Attachment>;

      /**
       * On Android the user may have more than one app able to send email with.
       * That will trigger a picker which has a title. You can change the default title here.
       */
      appPickerTitle?: string;
    }

    /**
     * No email client may be available, so test first.
     */
    export function available(): Promise<boolean>;
    /**
     * On iOS the returned boolean indicates whether or not the email was sent by the user.
     * On Android it's always true, unfortunately.
     */
    export function compose(options: ComposeOptions): Promise<boolean>;
}