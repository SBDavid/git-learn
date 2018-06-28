/**
 * ...
 * @author minliang_1112@foxmail.com
 */

'use strict';

export class Model {

  /**
   * HashTable of <code>IProxy</code> registered with the <code>Model</code>.
   *
   * @protected
   */
  proxyMap = null;
  /**
   * The multiton key for this core.
   *
   * @protected
   */
  multitonKey= null;
  /**
   * <code>Model</code> singleton instance map.
   *
   * @protected
   */
  static instanceMap = [];
  /**
   * Error message used to indicate that a <code>Model</code> singleton instance is
   * already constructed for this multiton key.
   *
   * @constant
   * @protected
   */
  static MULTITON_MSG = "Model instance for this Multiton key already constructed!";
  /**
   * Remove a <code>Model</code> instance
   * 
   * @param key
   *    Multiton key identifier for the <code>Model</code> instance to remove.
   */
  static removeModel(key) {
    delete Model.instanceMap[key];
  }
  /**
   * <code>Model</code> multiton factory method.
   *
   * @param key
   *    The multiton key of the instance of <code>Model</code> to create or retrieve.
   *
   * @return
   *    The singleton instance of the <code>Model</code>.
   */
  static getInstance(key) {
    if (Model.instanceMap[key] == null) {
      Model.instanceMap[key] = new Model(key);
    }

    return Model.instanceMap[key];
  }

  /**
   * This <code>IModel</code> implementation is a multiton, so you should not call the
   * constructor directly, but instead call the static multiton Factory method
   * <code>Model.getInstance( key )</code>.
   * 
   * @param key
   *    Multiton key for this instance of <code>Model</code>.
   *
   * @throws Error
   *    Throws an error if an instance for this multiton key has already been constructed.
   */
  constructor(key) {
    if (Model.instanceMap[key]) {
      throw new Error(Model.MULTITON_MSG);
    }

    this.multitonKey = key;
    Model.instanceMap[key] = this;
    this.proxyMap = [];
    this.initializeModel();
  }
  /**
   * Initialize the multiton <code>Model</code> instance.
   *
   * Called automatically by the constructor. This is the opportunity to initialize the
   * multiton instance in a subclass without overriding the constructor.
   *
   * @protected
   */
  initializeModel() { }

  /**
   * Register an <code>IProxy</code> with the <code>Model</code>.
   * 
   * @param proxy
   *    An <code>IProxy</code> to be held by the <code>Model</code>.
   */
  registerProxy(proxy) {
    proxy.initializeNotifier(this.multitonKey);
    this.proxyMap[proxy.getProxyName()] = proxy;
    proxy.onRegister();
  }

  /**
   * Retrieve an <code>IProxy</code> from the <code>Model</code>.
   * 
   * @param proxyName
   *     The <code>IProxy</code> name to retrieve from the <code>Model</code>.
   *
   * @return
   *    The <code>IProxy</code> instance previously registered with the given
   *    <code>proxyName</code> or an explicit <code>null</code> if it doesn't exists.
   */
  retrieveProxy(proxyName) {
    return this.proxyMap[proxyName];
  }

  /**
   * Check if an <code>IProxy</code> is registered.
   * 
   * @param proxyName
   *    The name of the <code>IProxy</code> to verify the existence of its registration.
   *
   * @return
   *    A Proxy is currently registered with the given <code>proxyName</code>.
   */
  hasProxy(proxyName) {
    return this.proxyMap[proxyName] != null;
  }

  /**
   * Remove an <code>IProxy</code> from the <code>Model</code>.
   *
   * @param proxyName
   *    The name of the <code>Proxy</code> instance to be removed.
   *
   * @return
   *    The <code>IProxy</code> that was removed from the <code>Model</code> or an
   *    explicit <code>null</null> if the <code>IProxy</code> didn't exist.
   */
  removeProxy(proxyName) {
    var proxy = this.proxyMap[proxyName];
    if (proxy) {
      this.proxyMap[proxyName] = null;
      proxy.onRemove();
    }

    return proxy;
  }
}