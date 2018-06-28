/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import puremvc from "puremvc";
import {H5ViewCommand} from "./command/H5ViewCommand";
import {H5ModelCommand} from "./command/H5ModelCommand";
import {H5ControllerCommand} from "./command/H5ControllerCommand";

export class H5StartupCommand extends puremvc.MacroCommand {

 	initializeMacroCommand() {
		this.addSubCommand(H5ControllerCommand);
		this.addSubCommand(H5ModelCommand);
		this.addSubCommand(H5ViewCommand);
	}
}