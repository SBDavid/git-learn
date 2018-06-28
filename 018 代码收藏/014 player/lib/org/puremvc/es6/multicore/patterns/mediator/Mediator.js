/**
 * ...
 * @author minliang_1112@foxmail.com
 */

'use strict';

import {Notifier} from '../observer/Notifier';

export class Mediator extends Notifier {

  /**
   * The name of the <code>Mediator</code>.
   *
   * @protected
   */
  mediatorName = null;
  /**
   * The <code>Mediator</code>'s view component.
   *
   * @protected
   */
  viewComponent = null;
  /**
   * Constructs a <code>Mediator</code> instance.
   *
   * @param mediatorName
   *    The name of the <code>Mediator</code>.
   *
   * @param viewComponent
   *    The view component handled by this <code>Mediator</code>.
   */
  constructor(mediatorName, viewComponent) {
    super();
    this.mediatorName= mediatorName || this.constructor.NAME;
    this.viewComponent=viewComponent;  
  }
  /**
   * Get the <code>Mediator</code> instance name.
   *
   * @return
   *    The <code>Mediator</code> instance name
   */ 
  getMediatorName() {
    return this.mediatorName;
  }
  /**
   * Set the <code>IMediator</code>'s view component.
   * 
   * @param viewComponent
   *    The default view component to set for this <code>Mediator</code>.
   */
  setViewComponent(viewComponent) {
    this.viewComponent = viewComponent;
  }
  /**
   * Get the <code>Mediator</code>'s view component.
   *
   * Additionally, an implicit getter will usually be defined in the subclass that casts the
   * view object to a type, like this:
   * 
   * <code>
   *    getMenu():Menu
   *    {
   *      return <Menu> this.viewComponent;
   *    }
   * </code>
   * 
   * @return
   *    The <code>Mediator</code>'s default view component.
   */
  getViewComponent() {
    return this.viewComponent;
  }
  /**
   * List the <code>INotification</code> names this <code>IMediator</code> is interested in
   * being notified of.
   *
   * @return
   *    The list of notifications names in which is interested the <code>Mediator</code>.
   */
  listNotificationInterests() {
    return [];
  }
  /**
   * Handle <code>INotification</code>s.
   * 
   *
   * Typically this will be handled in a switch statement, with one 'case' entry per
   * <code>INotification</code> the <code>Mediator</code> is interested in.
   *
   * @param notification
   *    The notification instance to be handled.
   */ 
  handleNotification(notification) { }
  /**
   * Called by the View when the Mediator is registered. This method has to be overridden
   * by the subclass to know when the instance is registered.
   */ 
  onRegister() { }
  /**
   * Called by the View when the Mediator is removed. This method has to be overridden
   * by the subclass to know when the instance is removed.
   */ 
  onRemove() { }
  /**
   * Default name of the <code>Mediator</code>.
   *
   * @constant
   */
  static NAME = "Mediator";

}