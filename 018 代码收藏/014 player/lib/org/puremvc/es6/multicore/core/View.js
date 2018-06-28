/**
 * ...
 * @author minliang_1112@foxmail.com
 */

'use strict';

import {Observer} from '../patterns/observer/Observer';

export class View {
  /**
   * Mapping of <code>Mediator</code> names to <code>Mediator</code> instances.
   *
   * @protected
   */
  mediatorMap = null;
  /**
   * Mapping of <code>Notification</code> names to <code>Observers</code> lists.
   *
   * @protected
   */
  observerMap = null;
  /**
   * Multiton key for this <code>View</code> instance.
   *
   * @protected
   */
  multitonKey = null;
  /**
   * <code>View</code> singleton instance map.
   *
   * @protected
   */
  static instanceMap = [];
  /**
   * Error message used to indicate that a <code>View</code> singleton instance is
   * already constructed for this multiton key.
   *
   * @constant
   * @protected
   */
  static MULTITON_MSG = "View instance for this Multiton key already constructed!";
  /**
   * Remove a <code>View</code> instance.
   *
   * @param key
   *    Key identifier of <code>View</code> instance to remove.
   */
  static removeView(key) {
    delete View.instanceMap[key];
  }
  /**
   * <code>View</code> multiton factory method.
   *
   * @param key
   *    The multiton key of the instance of <code>View</code> to create or retrieve.
   *
   * @return
   *    The singleton instance of <code>View</code>.
   */
  static getInstance(key) {
    if (null == key) {
      return null;
    }

    if (View.instanceMap[key] == null) {
      View.instanceMap[key] = new View(key);
    }

    return View.instanceMap[key];
  }

  /**
   * This <code>IView</code> implementation is a multiton, so you should not call the
   * constructor directly, but instead call the static multiton Factory method
   * <code>View.getInstance( key )</code>.
   *
   * @param key
   *    Multiton key for this instance of <code>View</code>.
   *
   * @throws Error
   *    Throws an error if an instance for this multiton key has already been constructed.
   */
  constructor(key) {
    if (View.instanceMap[key] != null) {
      throw new Error(View.MULTITON_MSG);
    }

    this.multitonKey = key;
    View.instanceMap[this.multitonKey] = this;
    this.mediatorMap = [];
    this.observerMap = [];
    this.initializeView();
  }
  /**
   * Initialize the multiton <code>View</code> instance.
   * 
   * Called automatically by the constructor. This is the opportunity to initialize the
   * multiton instance in a subclass without overriding the constructor.
   */
  initializeView() { }
  /**
   * Register an <code>IObserver</code> to be notified of <code>INotifications</code> with a
   * given name.
   * 
   * @param notificationName
   *    The name of the <code>INotifications</code> to notify this <code>IObserver</code>
   *    of.
   *
   * @param observer
   *    The <code>IObserver</code> to register.
   */
  registerObserver(notificationName, observer) {
    if (this.observerMap[notificationName] != null) {
      this.observerMap[notificationName].push(observer);
    } else {
      this.observerMap[notificationName] = [observer];
    }
  }
  /**
   * Notify the <code>IObserver</code>s for a particular <code>INotification</code>.
   *
   * All previously attached <code>IObserver</code>s for this <code>INotification</code>'s
   * list are notified and are passed a reference to the <code>INotification</code> in the
   * order in which they were registered.
   * 
   * @param notification
   *    The <code>INotification</code> to notify <code>IObserver</code>s of.
   */
  notifyObservers(notification) {
    if (this.observerMap[notification.getName()] != null) {
      let observers_ref = this.observerMap[notification.getName()],
          observers = [],
          observer;

      for (let i = 0, len = observers_ref.length; i < len; i++) {
        observer = observers_ref[i];
        observers.push(observer);
      }

      for (let i = 0, len = observers.length; i < len; i++) {
        observer = observers[i];
        observer.notifyObserver(notification);
      }
    }
  }
  /**
   * Remove a list of <code>IObserver</code>s for a given <code>notifyContext</code> from an
   * <code>IObserver</code> list for a given <code>INotification</code> name.
   *
   * @param notificationName
   *    Which <code>IObserver</code> list to remove from.
   *
   * @param notifyContext
   *    Remove the <code>IObserver</code> with this object as its
   *    <code>notifyContext</code>.
   */
  removeObserver(notificationName, notifyContext) {
    var observers = this.observerMap[notificationName];
    for (let i = 0, len = observers.length; i < len; i++) {
      if (observers[i].compareNotifyContext(notifyContext) == true) {
        observers.splice(i, 1);
        break;
      }
    }

    if (observers.length == 0) {
      delete this.observerMap[notificationName];
    }
  }
  /**
   * Register an <code>IMediator</code> instance with the <code>View</code>.
   *
   * Registers the <code>IMediator</code> so that it can be retrieved by name, and further
   * interrogates the <code>IMediator</code> for its <code>INotification</code> interests.
   *
   * If the <code>IMediator</code> returns any <code>INotification</code> names to be
   * notified about, an <code>Observer</code> is created to encapsulate the
   * <code>IMediator</code> instance's <code>handleNotification</code> method and register
   * it as an <code>Observer</code> for all <code>INotification</code>s the
   * <code>IMediator</code> is interested in.
   *
   * @param mediator
   *    A reference to an <code>IMediator</code> implementation instance.
   */
  registerMediator(mediator) {
    if (this.mediatorMap[mediator.getMediatorName()] != null) return;

    mediator.initializeNotifier(this.multitonKey);
    // register the mediator for retrieval by name
    this.mediatorMap[mediator.getMediatorName()] = mediator;

    // get notification interests if any
    let interests = mediator.listNotificationInterests();

    // register mediator as an observer for each notification
    if (interests.length > 0) {
      // create observer referencing this mediators handleNotification method
      let observer = new Observer(mediator.handleNotification, mediator);
      for (let i = 0, len = interests.length; i < len; i++) {
        this.registerObserver(interests[i], observer);
      }
    }

    mediator.onRegister();
  }
  /**
   * Retrieve an <code>IMediator</code> from the <code>View</code>.
   * 
   * @param mediatorName
   *    The name of the <code>IMediator</code> instance to retrieve.
   *
   * @return
   *    The <code>IMediator</code> instance previously registered with the given
   *    <code>mediatorName</code> or an explicit <code>null</code> if it doesn't exists.
   */
  retrieveMediator(mediatorName) {
    return this.mediatorMap[mediatorName];
  }
  /**
   * Remove an <code>IMediator</code> from the <code>View</code>.
   * 
   * @param mediatorName
   *    Name of the <code>IMediator</code> instance to be removed.
   *
   * @return
   *    The <code>IMediator</code> that was removed from the <code>View</code> or a
   *    strict <code>null</null> if the <code>Mediator</code> didn't exist.
   */
  removeMediator(mediatorName) {
    let mediator = this.mediatorMap[mediatorName];
    if (mediator) {
      // for every notification the mediator is interested in...
      var interests = mediator.listNotificationInterests();
      for (let i = 0, len = interests.length; i < len; i++) {
        // remove the observer linking the mediator to the notification
        // interest
        this.removeObserver(interests[i], mediator);
      }

      // remove the mediator from the map
      delete this.mediatorMap[mediatorName];

      // alert the mediator that it has been removed
      mediator.onRemove();
    }

    return mediator;
  }
  /**
   * Check if a <code>IMediator</code> is registered or not.
   * 
   * @param mediatorName
   *    The <code>IMediator</code> name to check whether it is registered.
   *
   * @return
   *    An <code>IMediator</code> is registered with the given <code>mediatorName</code>.
   */
  hasMediator(mediatorName) {
    return this.mediatorMap[mediatorName] != null;
  }
}