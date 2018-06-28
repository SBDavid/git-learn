/**
 * ...
 * @author minliang_1112@foxmail.com
 */

'use strict';

import {Notifier} from '../observer/Notifier';

export class MacroCommand extends Notifier {
  /**
   * An array of <code>ICommand</code>s.
   *
   * @protected
   */
  subCommands = null;
  /**
   * Constructs a <code>MacroCommand</code> instance.
   *
   * You should not need to define a constructor in your subclasses, instead, override the
   * <code>initializeMacroCommand</code> method.
   *
   * If your subclass does define a constructor, be  sure to call <code>super()</code>.
   */
  constructor() {
    super();
    this.subCommands = [];
    this.initializeMacroCommand();
  }
  /**
   * Initialize the <code>MacroCommand</code>.
   * 
   * In your subclass, override this method to  initialize the <code>MacroCommand</code>'s
   * <i>subCommand</i> list with <code>ICommand</code> class references like this:
   * 
   * <pre>
   *    // Initialize MyMacroCommand
   *    initializeMacroCommand():void
   *    {
   *      this.addSubCommand( FirstCommand );
   *      this.addSubCommand( SecondCommand );
   *      this.addSubCommand( ThirdCommand );
   *    }
   * </pre>
   * 
   * Note that <i>subCommand</i>s may be any <code>ICommand</code> implementor so
   * <code>MacroCommand</code>s or <code>SimpleCommand</code>s are both acceptable.
   *
   * @protected
   */
  initializeMacroCommand() { }
  /**
   * Add an entry to the <i>subCommands</i> list.
   * 
   * The <i>subCommands</i> will be called in First In/First Out (FIFO) order.
   * 
   * @param commandClassRef
   *    A reference to the constructor of the <code>ICommand</code>.
   *
   * @protected
   */
  addSubCommand(commandClassRef) {
    this.subCommands.push(commandClassRef);
  }
  /** 
   * Execute this <code>MacroCommand</code>'s <i>SubCommands</i>.
   *
   * The <i>SubCommands</i> will be called in First In/First Out (FIFO)
   * order. 
   * 
   * @param notification
   *    The <code>INotification</code> object to be passed to each <i>SubCommand</i> of
   *    the list.
   *
   * @final
   */
  execute(note) {
    while (this.subCommands.length > 0) {
      var ref = this.subCommands.shift();
      var cmd = new ref;
      cmd.initializeNotifier(this.multitonKey);
      cmd.execute(note);
    }
  }
}