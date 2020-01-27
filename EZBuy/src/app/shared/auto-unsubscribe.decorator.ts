export function AutoUnsubscribe(blacklist: any[] = []) {
  return function (consturctor) {
    const original = consturctor.prototype.ngOnDestroy;
    consturctor.prototype.ngOnDestroy = function () {
      for (let propName in this) {
        const prop = this[propName];
        if (blacklist.indexOf(propName) >= 0) {
          if (prop && (typeof prop.unsubscribe === 'function')) {
            prop.unsubscribe();
          }
        }
      }
      original && typeof original === 'function' && original.apply(this, arguments);
    };
  };
}
