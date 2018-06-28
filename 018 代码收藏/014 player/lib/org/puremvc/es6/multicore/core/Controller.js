/**
 * ...
 * @author minliang_1112@foxmail.com
 */

'use strict';

import {Observer} from '../patterns/observer/Observer';
import {View} from './View';

export class Controller {
  
  /**
   * Local reference to the <code>View</code> singleton.
   *
   * @protected
   */ 
  view = null;
  /**
   * Mapping of <code>Notification<code> names to <code>Command</code> constructors references.
   *
   * @protected
   */ 
  commandMap = null;
  /**
   * The multiton Key for this Core.
   *
   * @protected
   */
  multitonKey = null;
  /**
   * <code>Controller</code> singleton instance map.
   *
   * @protected
   */
  static instanceMap = [];
  /**
   * Error message used to indicate that a <code>Controller</code> singleton instance is
   * already constructed for this multiton key.
   *
   * @protected
   * @constant
   */
  static MULTITON_MSG = "controller key for this Multiton key already constructed";
  /**
   * <code>Controller</code> multiton factory method.
   *
   * @param key
   *    The multiton key of the instance of <code>Controller</code> to create or retrieve.
   *
   * @return
   *    The multiton instance of <code>Controller</code>
   */
  static getInstance(key) {
    if (Controller.instanceMap[key] == null) {
      Controller.instanceMap[key] = new Controller(key);
    }
    return Controller.instanceMap[key];
  }
  /**
   * Constructs a <code>Controller</code> instance.
   *
   * This <code>IController</code> implementation is a multiton, so you should not call the
   * constructor directly, but instead call the static multiton Factory method
   * <code>Controller.getInstance( key )</code>.
   * 
   * @param key
   *    Multiton key for this instance of <code>Controller</code>
   *
   * @throws Error
   *    Throws an error if an instance for this multiton key has already been constructed.
   */
  constructor(key) {
    if (Controller.instanceMap[key] != null) {
      throw new Error(Controller.MULTITON_MSG);
    }

    this.multitonKey = key;
    Controller.instanceMap[this.multitonKey] = this;
    this.commandMap = new Array();
    this.initializeController();
  }
  /**
   * Initialize the multiton <code>Controller</code> instance.
   * 
   * Called automatically by the constructor.
   * 
   * Note that if you are using a subclass of <code>View</code> in your application, you
   * should <i>also</i> subclass <code>Controller</code> and override the
   * <code>initializeController</code> method in the following way:
   * 
   * <pre>
   *    // Ensure that the Controller is talking to my <code>IView</code> implementation.
   *    initializeController():void
   *    {
   *      this.view = MyView.getInstance( this.multitonKey );
   *    }
   * </pre>
   *
   * @protected
   */
  initializeController() {
    this.view = View.getInstance(this.multitonKey);
  }
  /**
   * If an <code>ICommand</code> has previously been registered to handle the given
   * <code>INotification</code>, then it is executed.
   * 
   * @param notification
   *    The <code>INotification</code> the command will receive as parameter.
   */
  executeCommand(note) {
    let commandClassRef = this.commandMap[note.getName()];
    if (commandClassRef == null) {
      return;
    }

    let commandInstance = new commandClassRef();
    commandInstance.initializeNotifier(this.multitonKey);
    commandInstance.execute(note);
  }
  /**
   * Register a particular <code>ICommand</code> class as the handler for a particular
   * <code>INotification</code>.
   *
   * If an <code>ICommand</code> has already been registered to handle
   * <code>INotification</code>s with this name, it is no longer used, the new
   * <code>ICommand</code> is used instead.
   * 
   * The <code>Observer</code> for the new <code>ICommand</code> is only created if this is
   * the first time an <code>ICommand</code> has been registered for this
   * <code>Notification</code> name.
   * 
   * @param notificationName
   *    The name of the <code>INotification</code>.
   *
   * @param commandClassRef
   *    The constructor of the <code>ICommand</code>.
   */
  registerCommand(notificationName, commandClassRef) {
    if (this.commandMap[notificationName] == null) {
      this.view.registerObserver(notificationName, new Observer(this.executeCommand, this));
    }

    this.commandMap[notificationName] = commandClassRef;
  }
  /**
   * Check if an <code>ICommand</code> is registered for a given <code>Notification</code>.
   * 
   * @param notificationName
   *    Name of the <code>Notification</code> to check wheter an <code>ICommand</code> is
   *    registered for.
   *
   * @return
   *    An <code>ICommand</code> is currently registered for the given
   *    <code>notificationName</code>.
   */
  hasCommand(notificationName) {
    return this.commandMap[notificationName] != null;
  }
  /**
   * Remove a previously registered <code>ICommand</code> to <code>INotification</code>
   * mapping.
   *
   * @param notificationName
   *    The name of the <code>INotification</code> to remove the <code>ICommand</code>
   *    mapping for.
   */
  removeCommand(notificationName) {
    if (this.hasCommand(notificationName)) {
      this.view.removeObserver(notificationName, this);
      this.commandMap[notificationName] = null;
    }
  }
  /**
   * Remove a <code>Controller</code> instance.
   * 
   * @param key
   *    Multiton key of the <code>Controller</code> instance to remove.
   */
  static removeController(key) {
    delete Controller.instanceMap[key];
  }
}