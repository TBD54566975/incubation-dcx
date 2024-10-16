import { Observable, of } from 'rxjs';
class Buffer {
    values = '';
    append(value) {
        this.values += value;
    }
    reset() {
        this.values = '';
    }
}
export function bufferUntil(filter, resetNotifier = of()) {
    return function (source$) {
        const buffer = new Buffer();
        return new Observable((observer) => {
            const resetNotifierSubscription = resetNotifier.subscribe(() => buffer.reset());
            source$.subscribe({
                next: (value) => {
                    buffer.append(value);
                    if (filter(buffer.values)) {
                        observer.next(buffer.values);
                        buffer.reset();
                    }
                },
                error: (err) => {
                    resetNotifierSubscription.unsubscribe();
                    observer.error(err);
                },
                complete: () => {
                    resetNotifierSubscription.unsubscribe();
                    observer.complete();
                },
            });
        });
    };
}
