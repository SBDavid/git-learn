/**
 * ...
 * @author minliang_1112@foxmail.com
 */

'use strict';

import { View } from './org/puremvc/es6/multicore/core/View';
import { Model } from './org/puremvc/es6/multicore/core/Model';
import { Controller } from './org/puremvc/es6/multicore/core/Controller';
import { SimpleCommand } from './org/puremvc/es6/multicore/patterns/command/SimpleCommand';
import { MacroCommand } from './org/puremvc/es6/multicore/patterns/command/MacroCommand';
import { Facade } from './org/puremvc/es6/multicore/patterns/facade/Facade';
import { Mediator } from './org/puremvc/es6/multicore/patterns/mediator/Mediator';
import { Observer } from './org/puremvc/es6/multicore/patterns/observer/Observer';
import { Notification } from './org/puremvc/es6/multicore/patterns/observer/Notification';
import { Notifier } from './org/puremvc/es6/multicore/patterns/observer/Notifier';
import { Proxy } from './org/puremvc/es6/multicore/patterns/proxy/Proxy';

const puremvc = {
  View: View,
  Model: Model,
  Controller: Controller,
  SimpleCommand: SimpleCommand,
  MacroCommand: MacroCommand,
  Facade: Facade,
  Mediator: Mediator,
  Observer: Observer,
  Notification: Notification,
  Notifier: Notifier,
  Proxy: Proxy
}

export default puremvc