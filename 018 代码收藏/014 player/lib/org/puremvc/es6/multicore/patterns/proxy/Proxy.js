/**
 * ...
 * @author minliang_1112@foxmail.com
 */

'use strict';

import {Notifier} from '../observer/Notifier';

export class Proxy extends Notifier {

  /**
   * The name of the <code>Proxy</code>.
   *
   * @protected
   */
  proxyName = null;
  /**
   * The data object controlled by the <code>Proxy</code>.
   *
   * @protected
   */
  data = null;
  /**
   * Constructs a <code>Proxy</code> instance.
   *
   * @param proxyName
   *    The name of the <code>Proxy</code> instance.
   *
   * @param data
   *    An initial data object to be held by the <code>Proxy</code>.
   */
  constructor(proxyName, data) {
    super();
    this.proxyName = proxyName || this.constructor.NAME;
    if (data != null) {
      this.setData(data);
    }
  }
  /**
   * Get the name of the <code>Proxy></code> instance.
   *
   * @return
   *    The name of the <code>Proxy></code> instance.
   */
  getProxyName() {
    return this.proxyName;
  }
  /**
   * Set the data of the <code>Proxy></code> instance.
   *
   * @param data
   *    The data to set for the <code>Proxy></code> instance.
   */
  setData(data) {
    this.data = data;
  }
  /**
   * Get the data of the <code>Proxy></code> instance.
   *
   * @return
   *    The data held in the <code>Proxy</code> instance.
   */
  getData() {
    return this.data;
  }
  /**
   * Called by the Model when the <code>Proxy</code> is registered. This method has to be
   * overridden by the subclass to know when the instance is registered.
   */
  onRegister() { }
  /**
   * Called by the Model when the <code>Proxy</code> is removed. This method has to be
   * overridden by the subclass to know when the instance is removed.
   */
  onRemove() { }
  /**
   * The default name of the <code>Proxy</code>
   * 
   * @type
   * @constant
   */
  static NAME = "Proxy";
}