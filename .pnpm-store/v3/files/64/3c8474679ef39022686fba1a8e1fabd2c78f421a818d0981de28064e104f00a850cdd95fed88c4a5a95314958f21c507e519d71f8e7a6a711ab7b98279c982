import { BaseUi } from '../base.ui.js';
import { Subject } from 'rxjs';
import { INFO_MSGS, UI_POSITIONS } from '../../constants/index.js';
export class WarningUi extends BaseUi {
    showDeleteAllWarning = false;
    confirm$ = new Subject();
    KEYS = {
        y: () => this.confirm$.next(null),
    };
    onKeyInput({ name }) {
        const action = this.KEYS[name];
        if (action === undefined) {
            return;
        }
        action();
    }
    setDeleteAllWarningVisibility(visible) {
        this.showDeleteAllWarning = visible;
        this.render();
    }
    render() {
        if (this.showDeleteAllWarning) {
            this.printDeleteAllWarning();
        }
    }
    printDeleteAllWarning() {
        this.printAt(INFO_MSGS.DELETE_ALL_WARNING, UI_POSITIONS.WARNINGS);
    }
}
