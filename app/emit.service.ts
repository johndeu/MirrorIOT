import {Injectable,EventEmitter,Output} from "angular2/core";

@Injectable()
export class EmitMessageService{
  private tickCount: number = 0

    @Output() onEventEmitted: EventEmitter<string>;

    constructor() {
        this.onEventEmitted = new EventEmitter();
        setInterval(this.onTick, 1000, this);
    }

    onTick(_context) {
        _context.tickCount++;
        _context.onEventEmitted.emit("Event #" + _context.tickCount);
    }    

}

