import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const modalStack: HTMLElement[] = [];
let scrollLockCount = 0;
let savedBodyOverflow = "";
let savedBodyPaddingRight = "";

function focusableElements(dialog: HTMLElement) {
  return [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(element => {
    if (element.hidden || element.getAttribute("aria-hidden") === "true") return false;
    return element.getClientRects().length > 0;
  });
}

/**
 * Keeps keyboard focus inside the top-most Atlas modal, closes it on Escape,
 * restores focus to the opener, and prevents the page behind it from scrolling.
 */
export function useModalDialog<T extends HTMLElement>(onClose: () => void): RefObject<T | null> {
  const dialogRef = useRef<T>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modalStack.push(dialog);

    if (scrollLockCount === 0) {
      savedBodyOverflow = document.body.style.overflow;
      savedBodyPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
      if (scrollbarWidth > 0) {
        const currentPadding = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
        document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
      }
      document.body.style.overflow = "hidden";
    }
    scrollLockCount += 1;

    const focusInitial = () => {
      const initial = dialog.querySelector<HTMLElement>("[data-dialog-initial-focus]") ?? focusableElements(dialog)[0] ?? dialog;
      initial.focus({ preventScroll: true });
    };
    const frame = window.requestAnimationFrame(focusInitial);

    const keydown = (event: KeyboardEvent) => {
      if (modalStack.at(-1) !== dialog) return;

      if (event.key === "Escape" && !event.isComposing) {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = focusableElements(dialog);
      if (!focusable.length) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    const focusin = (event: FocusEvent) => {
      if (modalStack.at(-1) !== dialog) return;
      const target = event.target;
      if (target instanceof Node && !dialog.contains(target)) focusInitial();
    };

    document.addEventListener("keydown", keydown, true);
    document.addEventListener("focusin", focusin, true);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", keydown, true);
      document.removeEventListener("focusin", focusin, true);

      const index = modalStack.lastIndexOf(dialog);
      if (index >= 0) modalStack.splice(index, 1);

      scrollLockCount = Math.max(0, scrollLockCount - 1);
      if (scrollLockCount === 0) {
        document.body.style.overflow = savedBodyOverflow;
        document.body.style.paddingRight = savedBodyPaddingRight;
      }

      window.requestAnimationFrame(() => {
        if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      });
    };
  }, []);

  return dialogRef;
}
