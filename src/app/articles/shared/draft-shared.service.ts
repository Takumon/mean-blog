import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable()
export class DraftSharedService {
    private emitChangeSource = new Subject<any>();

    changeEmitted$ = this.emitChangeSource.asObservable();

    emitChange(change: any) {
        this.emitChangeSource.next(change);
    }
}
