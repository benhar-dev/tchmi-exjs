// Keep these lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.750.1/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    // If you want to unregister an event outside the event code you need to use the return value of the method register()
    var destroyOnInitialized = TcHmi.EventProvider.register('onInitialized', function (e, data) {
        // This event will be raised only once, so we can free resources. 
        // It's best practice to use destroy function of the event object within the callback function to avoid conflicts.
        e.destroy();

        // Base 

        // new callback event class

        class ExEvent {

            constructor() {
                this.events = {};
            }

            on(eventName, fn) {

                this.events[eventName] = this.events[eventName] || [];
                this.events[eventName].push(fn);
            }

            off(eventName, fn) {

                if (this.events[eventName]) {
                    for (var i = 0; i < this.events[eventName].length; i++) {
                        if (this.events[eventName][i] === fn) {
                            this.events[eventName].splice(i, 1);
                            break;
                        }
                    };
                }
            }

            trigger(eventName, data) {

                var that = this;

                setTimeout(function () { 

                    if (that.events[eventName]) {
                        that.events[eventName].forEach(function (fn) {
                            fn(data);
                        });
                    }

                }, 0);
            }

        }

        // Bindings 

        // Added the following callback events
        //      stateInvalid, stateInitializing, stateResuming, stateReady, stateSuspended, stateDestroyed

        class Binding extends TcHmi.System.Binding {

            constructor(expression, propertyName, control) {

                super(expression, propertyName, control);

                this.exEvents = new ExEvent()
                this.__exState = this.__state;

                Object.defineProperty(this, '__state', {
                    get() {
                        return this.__exState;
                    },

                    set(value) {

                        if (value == TcHmi.System.Binding.State.Invalid)
                            this.exEvents.trigger('stateInvalid', this);

                        if (value == TcHmi.System.Binding.State.Initializing)
                            this.exEvents.trigger('stateInitializing', this);

                        if (value == TcHmi.System.Binding.State.Resuming)
                            this.exEvents.trigger('stateResuming', this);

                        if (value == TcHmi.System.Binding.State.Ready)
                            this.exEvents.trigger('stateReady', this);

                        if (value == TcHmi.System.Binding.State.Suspended)
                            this.exEvents.trigger('stateSuspended', this);

                        if (value == TcHmi.System.Binding.State.Destroyed)
                            this.exEvents.trigger('stateDestroyed', this);

                        this.__exState = value;
                    }
                });

            }    
        }

        TcHmi.System.Binding = Binding;

    });
})(TcHmi);
