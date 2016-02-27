declare module "nativescript-email" {

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
    }

    export function available(): Promise<boolean>;
    export function compose(options: ComposeOptions): Promise<any>;
}