System.register(["angular2/core"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var EmitMessageService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            EmitMessageService = (function () {
                function EmitMessageService() {
                    this.tickCount = 0;
                    this.onEventEmitted = new core_1.EventEmitter();
                    setInterval(this.onTick, 1000, this);
                }
                EmitMessageService.prototype.onTick = function (_context) {
                    _context.tickCount++;
                    _context.onEventEmitted.emit("Event #" + _context.tickCount);
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], EmitMessageService.prototype, "onEventEmitted", void 0);
                EmitMessageService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], EmitMessageService);
                return EmitMessageService;
            }());
            exports_1("EmitMessageService", EmitMessageService);
        }
    }
});
