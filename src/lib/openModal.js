// Natív <dialog> nyitása görgetészárral. A html:has(dialog[open]) CSS-zár nem minden böngészőben
// elég (iOS Safari), ezért nyitva tartás alatt a görgetést is elfogjuk: csak a dialogon belül
// görgető elem mozoghat, és csak addig, amíg van hova.
function canScroll(target, dialog, dy) {
  for (let el = target; el && dialog.contains(el); el = el.parentElement) {
    if (el.scrollHeight <= el.clientHeight) continue;
    const { overflowY } = getComputedStyle(el);
    if (overflowY !== "auto" && overflowY !== "scroll") continue;
    if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
  }
  return false;
}

export function openModal(dialog) {
  if (!dialog || dialog.open) return;
  dialog.showModal();

  let lastY = 0;
  function guard(e, dy) {
    // A close esemény késhet, és el is maradhat, ha a dialog kikerül az oldalból.
    if (!dialog.open || !dialog.isConnected) return unlock();
    if (e.cancelable && !canScroll(e.target, dialog, dy)) e.preventDefault();
  }
  function onWheel(e) {
    if (!e.ctrlKey && e.deltaY !== 0) guard(e, e.deltaY);
  }
  function onTouchStart(e) {
    lastY = e.touches[0].clientY;
  }
  function onTouchMove(e) {
    if (e.touches.length > 1) return;
    const y = e.touches[0].clientY;
    guard(e, lastY - y);
    lastY = y;
  }
  function unlock() {
    document.removeEventListener("wheel", onWheel);
    document.removeEventListener("touchstart", onTouchStart);
    document.removeEventListener("touchmove", onTouchMove);
    dialog.removeEventListener("close", unlock);
  }

  document.addEventListener("wheel", onWheel, { passive: false });
  document.addEventListener("touchstart", onTouchStart, { passive: true });
  document.addEventListener("touchmove", onTouchMove, { passive: false });
  dialog.addEventListener("close", unlock);
}
