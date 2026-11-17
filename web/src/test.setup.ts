import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(cleanup);

HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
}

HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.open = false;
    this.dispatchEvent(new Event('close'));
}


