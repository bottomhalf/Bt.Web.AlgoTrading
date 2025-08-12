import { Injectable } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}
}

export function Toast(message: string, timeSpan: number = 5) {
  let $Toast = document.getElementById('toast');
  if ($Toast) {
    $Toast.classList.add('success-toast');
    $Toast.classList.remove('error-toast');
    $Toast.classList.remove('warning-toast');

    $Toast.classList.remove('d-none');

    document.getElementById('toastmessage').innerHTML = message;
    document.getElementById('success-box').classList.remove('d-none');
    document.getElementById('warning-box').classList.add('d-none');
    document.getElementById('error-box').classList.add('d-none');

    setTimeout(() => {
      HideToast();
    }, timeSpan * 998);
  }
}

export function ErrorToast(message: string, timeSpan: number = 10) {
  let $Toast = document.getElementById('toast');
  if ($Toast) {
    $Toast.classList.remove('success-toast');
    $Toast.classList.add('error-toast');
    $Toast.classList.remove('warning-toast');

    $Toast.classList.remove('d-none');

    document.getElementById('toastmessage').innerHTML = message;
    document.getElementById('success-box').classList.add('d-none');
    document.getElementById('warning-box').classList.add('d-none');
    document.getElementById('error-box').classList.remove('d-none');

    setTimeout(() => {
      HideToast();
    }, timeSpan * 998);
  }
}

export function WarningToast(message: string, timeSpan: number = 5) {
  let $Toast = document.getElementById('toast');
  if ($Toast) {
    $Toast.classList.remove('success-toast');
    $Toast.classList.remove('error-toast');
    $Toast.classList.add('warning-toast');

    $Toast.classList.remove('d-none');

    document.getElementById('toastmessage').innerHTML = message;
    document.getElementById('success-box').classList.add('d-none');
    document.getElementById('warning-box').classList.remove('d-none');
    document.getElementById('error-box').classList.add('d-none');

    setTimeout(() => {
      HideToast();
    }, timeSpan * 998);
  }
}

export function HideToast() {
  let $Toast = document.getElementById('toast');
  let $Error = document.getElementById('warning-box');
  let $Warning = document.getElementById('error-box');
  if ($Toast) {
    $Toast.classList.add('d-none');
    $Error.classList.add('d-none');
    $Warning.classList.add('d-none');
  }
}

export function ShowModal(id: string) {
  let modalElement = document.getElementById(id);
  var modal = new bootstrap.Modal(modalElement);
  if (modal) modal.show();
}

export function HideModal(id: string) {
  let modalElement = document.getElementById(id);
  var modal = bootstrap.Modal.getInstance(modalElement);
  if (modal) {
    modal.hide();
  }

  removeBackdrop();
}

function removeBackdrop(): void {
  const backdropElement = document.querySelectorAll('.modal-backdrop');
  if (backdropElement && backdropElement.length > 0) {
    backdropElement.forEach((x) => {
      x.remove();
    });
  }

  // Remove modal-open class from body
  document.body.classList.remove('modal-open');
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('padding-right');
}

export function FireBrowser(id: string) {
  const uploadDocumentButton = document.getElementById(id);
  if (uploadDocumentButton) {
    const clickEvent = new MouseEvent('click');
    uploadDocumentButton.dispatchEvent(clickEvent);
  }
}
