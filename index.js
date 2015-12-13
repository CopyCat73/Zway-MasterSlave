/*** MasterSlave Z-Way module *******************************************

Version: 1.00
(c) CopyCatz, 2015
-----------------------------------------------------------------------------
Author: CopyCatz <copycat73@outlook.com>
Description: Slave light switching based on master device

******************************************************************************/

function MasterSlave (id, controller) {
    // Call superconstructor first (AutomationModule)
    MasterSlave.super_.call(this, id, controller);

}

inherits(MasterSlave, AutomationModule);

_module = MasterSlave;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

MasterSlave.prototype.init = function (config) {
    MasterSlave.super_.prototype.init.call(this, config);

    var self = this;
    var that = this;

    this.handleMasterUpdates = function (sDev) {
 
        var value = sDev.get("metrics:level");
        console.log("[MasterSlave] received update "+value);
        
        if (value === 'on') {
            console.log("[MasterSlave] switching on lights");
            _.each(that.config.slaves,function(element) {
                var vDev = that.controller.devices.get(element.device);
                if (vDev) {
                    vDev.performCommand("on");
                }
            });
        }
        else if (value === 'off') {
            console.log("[MasterSlave] switching off lights");
            _.each(that.config.slaves,function(element) {
                var vDev = that.controller.devices.get(element.device);
                if (vDev) {
                    vDev.performCommand("off");
                }
            });           
        }
    };
    
    // Setup event listener
    self.controller.devices.on(this.config.master, 'change:metrics:level', self.handleMasterUpdates);        
};
    


MasterSlave.prototype.stop = function () {
    
    var self = this;
    
    // Remove event listeners
    self.controller.devices.off(this.config.master, 'change:metrics:level', self.handleMasterUpdates);  
       
    MasterSlave.super_.prototype.stop.call(this);
 
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------
