/**
 * ...
 * @author minliang_1112@foxmail.com
 */

'use strict';

import {Facade} from '../facade/Facade';

export class Notifier {

  /**
   * The multiton key for this core.
   *
   * @protected
   */
  multitonKey = null;
  /**
   * Create and send a <code>Notification</code>.
   *
   * Keeps us from having to construct new <code>Notification</code> instances in our
   * implementation code.
   * 
   * @param name
   *    The name of the notification to send.
   * 
   * @param body
   *    The body of the notification.
   *
   * @param type
   *    The type of the notification.
   */
  sendNotification(notificationName, body, type) {
    if (this.facade) {
      this.facade.sendNotification(notificationName, body, type);
    }
  }
  /**
   * Initialize a <code>Notifier</code> instance with its cor multiton key.
   *
   * This is how a <code>Notifier</code> gets its multiton key. Calls to 
   * <code>sendNotification <code> or to access the facade will fail until after this method
   * has been called.
   * 
   * <code>Mediator</code>s, <code>Command</code>s or <code>Proxies</code> may override
   * this method in order to send notifications or access the multiton Facade instance as
   * soon as possible. They CANNOT access the facade in their constructors, since this
   * method will not yet have been called.
   * 
   * @param key
   *    The multiton key for this <code>Notifier</code> to use.
   */
  initializeNotifier(key) {
    this.multitonKey = String(key);
  }
  /**
   * Return the multiton <code>Facade</code> instance.
   *
   * @return
   *    The multiton <code>Facade</code> instance.
   *
   * @throws
   *    Throws an error if the multiton key for this Notifier is not yet initialized.
   */
  get facade() {
    if (this.multitonKey == null) {
      throw new Error(Notifier.MULTITON_MSG);
    }

    return Facade.getInstance(this.multitonKey);
  }
  /**
   * Message Constants
   *
   * @constant
   * @protected
   */
  static MULTITON_MSG = "multitonKey for this Notifier not yet initialized!";
}