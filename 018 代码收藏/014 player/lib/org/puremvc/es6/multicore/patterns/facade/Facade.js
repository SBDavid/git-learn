/**
 * ...
 * @author minliang_1112@foxmail.com
 */

'use strict';

import {Controller} from '../../core/Controller';
import {Model} from '../../core/Model';
import {View} from '../../core/View';
import {Notification} from '../observer/Notification';

export class Facade {

  /**
   * Local reference to the <code>Controller</code> multiton.
   *
   * @protected
   */
  controller = null;
  /**
   * Local reference to the <code>Model</code> multiton.
   *
   * @protected
   */
  model = null;
  /**
   * Local reference to the <code>View</code> multiton.
   *
   * @protected
   */
  view = null;
  /**
   * The multiton Key for this Core.
   *
   * @protected
   */
  multitonKey = null;
  /**
   * <code>Facade</code> singleton instance map.
   *
   * @protected
   */
  static instanceMap = [];
  /**
   * @constant
   * @protected
   */
  static MULTITON_MSG = "Facade instance for this Multiton key already constructed!";
  /**
   * Check if a core is registered or not.
   * 
   * @param key
   *    The multiton key for the Core in question.
   *
   * @return
   *    The core is registered with the given <code>key</code>.
   */
  static hasCore(key) {
    return Facade.instanceMap[key] != null;
  }
  /**
   * Remove a core.
   *
   * Remove the <code>Model</code>, <code>View</code>, <code>Controller</code> and
   * <code>Facade</code> instances for the given key.
   * 
   * @param key
   *    Key identifier of the core to remove.
   */
  static removeCore(key) {
    if (Facade.instanceMap[key] == null) {
      return;
    }

    Model.removeModel(key);
    View.removeView(key);
    Controller.removeController(key);
    delete Facade.instanceMap[key];
  }
  /**
   * <code>Facade</code> multiton factory method.
   * 
   * @param key
   *    The multiton key of the instance of <code>Facade</code> to create or retrieve.
   * 
   * @return
   *    The singleton instance of <code>Facade</code>.
   */
  static getInstance(key) {
    if (Facade.instanceMap[key] == null) {
      Facade.instanceMap[key] = new Facade(key);
    }

    return Facade.instanceMap[key];
  }
  /**
   * Constructs a <code>Controller</code> instance.
   *
   * This <code>IFacade</code> implementation is a multiton, so you should not call the
   * constructor directly, but instead call the static multiton factory method
   * <code>Facade.getInstance( key )</code>.
   * 
   *
   * @param key
   *    Multiton key for this instance of <code>Facade</code>
   *
   * @throws Error
   *    Throws an error if an instance for this multiton key has already been constructed.
   */
  constructor(key) {
    if (Facade.instanceMap[key] != null) {
      throw new Error(Facade.MULTITON_MSG);
    }

    this.initializeNotifier(key);
    Facade.instanceMap[key] = this;
    this.initializeFacade();
  }
  /**
   * Called automatically by the constructor.
   * Initialize the singleton <code>Facade</code> instance.
   *
   * Override in your subclass to do any subclass specific initializations. Be sure to
   * extend the <code>Facade</code> with the methods and properties on your implementation
   * and call <code>Facade.initializeFacade()</code>.
   *
   * @protected
   */
  initializeFacade() {
    this.initializeModel();
    this.initializeController();
    this.initializeView();
  }
  /**
   * Initialize the <code>Controller</code>.
   * 
   * Called by the <code>initializeFacade</code> method. Override this method in your
   * subclass of <code>Facade</code> if one or both of the following are true:
   * 
   * <UL>
   * <LI>You wish to initialize a different <code>IController</code>.
   * <LI>You have <code>ICommand</code>s to register with the <code>Controller</code> at
   * startup.
   *
   * If you don't want to initialize a different <code>IController</code>, call
   * <code>super.initializeController()</code> at the beginning of your method, then register
   * <code>Command</code>s.
   *
   * @protected
   */
  initializeController() {
    if (this.controller != null) return;
    this.controller = Controller.getInstance(this.multitonKey);
  }
  /**
   * Initialize the <code>Model</code>.
   * 
   * Called by the <code>initializeFacade</code> method. Override this method in your
   * subclass of <code>Facade</code> if one or both of the following are true:
   *
   * <UL>
   * <LI> You wish to initialize a different <code>IModel</code>.
   * <LI> You have <code>Proxy</code>s to register with the <code>Model</code> that do not
   * retrieve a reference to the <code>Facade</code> at construction time.
   *
   * If you don't want to initialize a different <code>IModel</code>, call
   * <code>super.initializeModel()</code> at the beginning of your method, then register
   * <code>Proxy</code>s.
   *
   * Note: This method is <i>rarely</i> overridden; in practice you are more likely to use a
   * <code>Command</code> to create and register <code>Proxy</code>s with the
   * <code>Model</code>, since <code>Proxy</code>s with mutable data will likely need to send
   * <code>INotification</code>s and thus will likely want to fetch a reference to the
   * <code>Facade</code> during their construction.
   *
   * @protected
   */
  initializeModel() {
    if (this.model != null) return;
    this.model = Model.getInstance(this.multitonKey);
  }
  /**
   * Initialize the <code>View</code>.
   *
   * Called by the <code>initializeFacade</code> method. Override this method in your
   * subclass of <code>Facade</code> if one or both of the following are true:
   * <UL>
   * <LI> You wish to initialize a different <code>IView</code>.
   * <LI> You have <code>Observers</code> to register with the <code>View</code>
   *
   * If you don't want to initialize a different <code>IView</code>, call
   * <code>super.initializeView()</code> at the beginning of your method, then register
   * <code>IMediator</code> instances.
   *
   * Note: This method is <i>rarely</i> overridden; in practice you are more likely to use a
   * <code>Command</code> to create and register <code>Mediator</code>s with the
   * <code>View</code>, since <code>IMediator</code> instances will need to send 
   * <code>INotification</code>s and thus will likely want to fetch a reference to the
   * <code>Facade</code> during their construction. 
   *
   * @protected
   */
  initializeView() {
    if (this.view != null) return;
    this.view = View.getInstance(this.multitonKey);
  }
  /**
   * Register an <code>ICommand</code> with the <code>IController</code> associating it to a
   * <code>INotification</code> name.
   * 
   * @param notificationName
   *    The name of the <code>INotification</code> to associate the <code>ICommand</code>
   *    with.
   
   * @param commandClassRef
   *    A reference to the constructor of the <code>ICommand</code>.
   */
  registerCommand(notificationName, commandClassRef) {
    this.controller.registerCommand(notificationName, commandClassRef);
  }
  /**
   * Remove a previously registered <code>ICommand</code> to <code>INotification</code>
   * mapping from the <code>Controller</code>.
   *
   * @param notificationName
   *    The name of the <code>INotification</code> to remove the <code>ICommand</code>
   *    mapping for.
   */
  removeCommand(notificationName) {
    this.controller.removeCommand(notificationName);
  }
  /**
   * Check if an <code>ICommand</code> is registered for a given <code>Notification</code>.
   * 
   * @param notificationName
   *    The name of the <code>INotification</code> to verify for the existence of an
   *    <code>ICommand</code> mapping for.
   *
   * @return
   *    A <code>Command</code> is currently registered for the given
   *    <code>notificationName</code>.
   */
  hasCommand(notificationName) {
    return this.controller.hasCommand(notificationName);
  }
  /**
   * Register an <code>IProxy</code> with the <code>Model</code> by name.
   *
   * @param proxy
   *    The <code>IProxy</code> to be registered with the <code>Model</code>.
   */
  registerProxy(proxy) {
    this.model.registerProxy(proxy);
  }
  /**
   * Retrieve an <code>IProxy</code> from the <code>Model</code> by name.
   * 
   * @param proxyName
   *    The name of the <code>IProxy</code> to be retrieved.
   *
   * @return
   *    The <code>IProxy</code> previously registered with the given
   *    <code>proxyName</code>.
   */
  retrieveProxy(proxyName) {
    return this.model.retrieveProxy(proxyName);
  }
  /**
   * Remove an <code>IProxy</code> from the <code>Model</code> by name.
   *
   * @param proxyName
   *    The <code>IProxy</code> to remove from the <code>Model</code>.
   *
   * @return
   *    The <code>IProxy</code> that was removed from the <code>Model</code>
   */
  removeProxy(proxyName) {
    let proxy = null;
    if (this.model != null) {
      proxy = this.model.removeProxy(proxyName);
    }

    return proxy;
  }
  /**
   * Check if a <code>Proxy</code> is registered.
   * 
   * @param proxyName
   *    The <code>IProxy</code> to verify the existence of a registration with the
   *    <code>IModel</code>.
   *
   * @return
   *    A <code>Proxy</code> is currently registered with the given <code>proxyName</code>.
   */
  hasProxy(proxyName) {
    return this.model.hasProxy(proxyName);
  }
  /**
   * Register a <code>IMediator</code> with the <code>IView</code>.
   *
   * @param mediator
   *    A reference to the <code>IMediator</code>.
   */
  registerMediator(mediator) {
    if (this.view != null) {
      this.view.registerMediator(mediator);
    }
  }
  /**
   * Retrieve an <code>IMediator</code> from the <code>IView</code>.
   * 
   * @param mediatorName
   *    The name of the registered <code>Mediator</code> to retrieve.
   *
   * @return
   *    The <code>IMediator</code> previously registered with the given
   *    <code>mediatorName</code>.
   */
  retrieveMediator(mediatorName) {
    return this.view.retrieveMediator(mediatorName);
  }
  /**
   * Remove an <code>IMediator</code> from the <code>IView</code>.
   * 
   * @param mediatorName
   *    Name of the <code>IMediator</code> to be removed.
   *
   * @return
   *    The <code>IMediator</code> that was removed from the <code>IView</code>
   */
  removeMediator(mediatorName) {
    var mediator = null;
    if (this.view != null) {
      mediator = this.view.removeMediator(mediatorName);
    }

    return mediator;
  }
  /**
   * Check if a <code>Mediator</code> is registered or not
   * 
   * @param mediatorName
   *    The name of the <code>IMediator</code> to verify the existence of a registration
   *    for.
   *
   * @return
   *    An <code>IMediator</code> is registered with the given <code>mediatorName</code>.
   */
  hasMediator(mediatorName) {
    return this.view.hasMediator(mediatorName);
  }
  /**
   * Create and send an <code>INotification</code>.
   * 
   * Keeps us from having to construct new notification instances in our implementation code.
   *
   * @param name
   *    The name of the notification to send.
   *
   * @param body
   *    The body of the notification to send.
   *
   * @param type
   *    The type of the notification to send.
   */
  sendNotification(notificationName, body, type) {
    this.notifyObservers(new Notification(notificationName, body, type));
  }
  /**
   * Notify the <code>IObserver</code>s for a particular <code>INotification</code>.
   *
   * This method is left public mostly for backward compatibility, and to allow you to
   * send custom notification classes using the <code>Facade</code>.
   *
   *
   * Usually you should just call <code>sendNotification</code> and pass the parameters,
   * never having to construct the <code>INotification</code> yourself.
   * 
   * @param notification
   *    The <code>INotification</code> to have the <code>IView</code> notify
   *    <code>IObserver</code>s of.
   */
  notifyObservers(notification) {
    if (this.view != null) {
      this.view.notifyObservers(notification);
    }
  }
  /** 
   * Set the multiton key for this <code>Facade</code> instance.
   *
   * Not called directly, but instead from the constructor when
   * <code>Facade.getInstance(key)</code> is invoked.
   *
   * @param key
   *    The multiton key for this <code>Facade</code> instance to initialize the
   *    <code>Notifier</code> with.
   */
  initializeNotifier(key) {
    this.multitonKey = key;
  }
}