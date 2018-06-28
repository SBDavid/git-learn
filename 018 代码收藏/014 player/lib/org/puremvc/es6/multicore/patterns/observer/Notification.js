/**
 * ...
 * @author minliang_1112@foxmail.com
 */

'use strict';

export class Notification {

  /**
   * The name of the <code>Notification</code>.
   */
  name = null;
  /**
   * The type identifier of the <code>Notification</code>.
   */
  type = null;
  /**
   * The body data to send with the <code>Notification</code>.
   */
  body = null;
  /**
   * Constructs a <code>Notification</code> instance.
   *
   * @param name
   *    The name of the notification.
   *
   * @param body
   *    Body data to send with the <code>Notification</code>.
   * 
   * @param type
   *    Type identifier of the <code>Notification</code>.
   */
  constructor(name, body, type) {
    this.name = name;
    this.body = body;
    this.type = type;
  }
  /**
   * Get the name of the <code>Notification</code> instance.
   * 
   * @return
   *    The name of the <code>Notification</code> instance.
   */
  getName() {
    return this.name;
  }
  /**
   * Set the body of the <code>Notification</code> instance.
   *
   * @param body
   *    The body of the <code>Notification</code> instance.
   */
  setBody(body) {
    this.body = body;
  }
  /**
   * Get the body of the <code>Notification</code> instance.
   * 
   * @return
   *    The body object of the <code>Notification</code> instance.
   */
  getBody() {
    return this.body;
  }
  /**
   * Set the type of the <code>Notification</code> instance.
   *
   * @param type
   *    The type of the <code>Notification</code> instance.
   */
  setType(type) {
    this.type = type;
  }
  /**
   * Get the type of the <code>Notification</code> instance.
   * 
   * @return
   *    The type of the <code>Notification</code> instance.
   */
  getType() {
    return this.type;
  }
  /**
   * Get a textual representation of the <code>Notification</code> instance.
   *
   * @return
   *    The textual representation of the <code>Notification</code> instance.
   */
  toString() {
    let msg = "Notification Name: " + this.getName();
    msg += "\nBody:" + ((this.body == null) ? "null" : this.body.toString());
    msg += "\nType:" + ((this.type == null) ? "null" : this.type);
    return msg;
  }
}