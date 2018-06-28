/**
 * ...
 * @author minliang_1112@foxmail.com
 */

'use strict';

import {Notifier} from '../observer/Notifier';

export class SimpleCommand extends Notifier {
  
  /**
   * Fulfill the use-case initiated by the given <code>INotification</code>.
   * 
   * In the Command Pattern, an application use-case typically begins with some user action,
   * which results in an <code>INotification</code> being broadcast, which is handled by
   * business logic in the <code>execute</code> method of an <code>ICommand</code>.
   * 
   * @param notification
   * 		The <code>INotification</code> to handle.
   */
  execute(note) { }
}