/**
 * ...
 * @author minliang_1112@foxmail.com
 */

'use strict';

export class Observer {
  /**
   * The notification method of the interested object.
   */
  notify = null;
  /**
   * The notification context of the interested object.
   */
  context = null;
  /**
   * Constructs an <code>Observer</code> instance.
   * 
   * @param notifyMethod
   *    The notification method of the interested object.
   *
   * @param notifyContext
   *    The notification context of the interested object.
   */
  constructor(notifyMethod, notifyContext) {
    this.setNotifyMethod(notifyMethod);
    this.setNotifyContext(notifyContext);
  }
  /**
   * Set the notification method.
   *
   * The notification method should take one parameter of type <code>INotification</code>.
   * 
   * @param notifyMethod
   *    The notification (callback) method of the interested object.
   */
  setNotifyMethod(notifyMethod) {
    this.notify= notifyMethod;
  }
  /**
   * Set the notification context.
   * 
   * @param notifyContext
   *    The notification context (this) of the interested object.
   */
  setNotifyContext(notifyContext) {
    this.context= notifyContext;
  }
  /**
   * Get the notification method.
   * 
   * @return
   *    The notification (callback) method of the interested object.
   */
  getNotifyMethod() {
    return this.notify;
  }
  /**
   * Get the notification context.
   * 
   * @return
   *    The notification context (<code>this</code>) of the interested object.
   */
  getNotifyContext() {
    return this.context;
  }
  /**
   * Notify the interested object.
   * 
   * @param notification
   *    The <code>INotification</code> to pass to the interested object's notification
   *    method.
   */
  notifyObserver(notification) {
    this.getNotifyMethod().apply(this.getNotifyContext(), [notification]);
  }
  /**
   * Compare an object to the notification context.
   *
   * @param object
   *    The object to compare.
   *
   * @return
   *    The object and the notification context are the same.
   */
  compareNotifyContext(object) {
    return object === this.context;
  }
}