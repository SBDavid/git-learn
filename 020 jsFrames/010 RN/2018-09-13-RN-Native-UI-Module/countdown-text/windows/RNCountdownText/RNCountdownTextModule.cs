using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Countdown.Text.RNCountdownText
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNCountdownTextModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNCountdownTextModule"/>.
        /// </summary>
        internal RNCountdownTextModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNCountdownText";
            }
        }
    }
}
