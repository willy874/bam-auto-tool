import { v4 } from 'uuid';
import { reactive, ref, onMounted, onUpdated, h } from 'vue';
import cx from 'classnames';

// import { useDialog } from './use'

/**
 * @property {Number} id
 * @property {VueComponent} view
 * @property {Number} width
 * @property {Number} height
 * @property {Boolean} zIndexLock
 */
class Popup {
  constructor(args) {
    const entity = args || {};
    this.id = entity.id || v4();
    this.view = entity.view;
    this.width = entity.width || 0;
    this.height = entity.height || 0;
    this.zIndexLock = entity.zIndexLock || false;
    this.position = entity.position || {
      x: 'center',
      y: 'center',
    };
    this.onBackgroundClick =
      entity.onBackgroundClick ||
      (() => {
        this.close();
      });
    this.props = Object.assign(
      {
        id: this.id,
      },
      entity.props
    );
  }

  // open(options) {
  //   const dialog = useDialog()
  //   Object.keys(options).forEach(key => {
  //     this[key] = options[key]
  //   })
  //   dialog.popup(this)
  // }

  // close() {
  //   const dialog = useDialog()
  //   dialog.closePopup(this.id)
  // }
}

/**
 * @property {Array<Popup>} popups
 */
class Dialog$1 {
  constructor() {
    this.popups = [];
    this.popupRoot = null;
    this.popupCache = null;
  }

  popup(view, options) {
    document.body.style.overflow = 'hidden';
    const popup =
      view instanceof Popup
        ? view
        : new Popup({
            ...options,
            view,
          });
    this.popups.push(popup);
    return new Promise(resolve => {
      popup.onClose = attrs => {
        resolve(attrs);
      };
    })
  }

  closePopup(id) {
    return new Promise(resolve => {
      Promise.all(
        this.popups
          .filter((popup, index) => {
            if (typeof id === 'number') {
              return id === index
            } else if (typeof id === 'string') {
              return popup.id === id
            } else {
              return true
            }
          })
          .map(popup => {
            return new Promise(resolve => {
              popup.ref.style.opacity = '0';
              const end = () => {
                popup.ref.removeEventListener('transitionend', end);
                if (popup.onClose) popup.onClose(popup);
                resolve();
              };
              popup.ref.addEventListener('transitionend', end);
            })
          })
      ).then(() => {
        if (typeof id === 'number') {
          resolve(this.popups.splice(id, 1));
          if (this.popups.length === 0) document.body.style.overflow = '';
        }
        if (typeof id === 'string') {
          const index = this.popups.map(item => item.id).indexOf(id);
          resolve(this.popups.splice(index, 1));
          if (this.popups.length === 0) document.body.style.overflow = '';
        } else {
          resolve(this.popups.splice(0));
          document.body.style.overflow = '';
        }
      });
    })
  }
}

const DialogNative = reactive(new Dialog$1());

const useDialog = () => {
  return DialogNative
};

var PopupComponent = {
  props: {
    popup: {
      type: Popup,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    // 解除 Proxy 代理
    const PopupView = {};
    Object.keys(props.popup.view).forEach(key => {
      PopupView[key] = props.popup.view[key];
    });
    const dialog = useDialog();
    const popupItem = ref({});
    props.popup.updated = () => {
      props.popup.offsetWidth = popupItem.value.offsetWidth;
      props.popup.offsetHeight = popupItem.value.offsetHeight;
    };
    onMounted(() => {
      props.popup.ref = popupItem;
      const position = props.popup.position;
      const correctionValue = 20;
      const topMath = top => {
        if (typeof top === 'number') {
          return top + 'px'
        } else if (typeof top === 'string') {
          if (top === 'top') {
            return correctionValue + 'px'
          } else if (top === 'center') {
            return (window.innerHeight - popupItem.value.offsetHeight) / 2 + 'px'
          } else if (top === 'bottom') {
            return window.innerHeight - correctionValue + 'px'
          }
          return top
        }
        return 0
      };
      const leftMath = left => {
        if (typeof left === 'number') {
          return left + 'px'
        } else if (typeof left === 'string') {
          if (left === 'left') {
            return correctionValue + 'px'
          } else if (left === 'center') {
            return (window.innerWidth - popupItem.value.offsetWidth) / 2 + 'px'
          } else if (left === 'bottom') {
            return window.innerWidth - correctionValue + 'px'
          }
          return left
        }
        return 0
      };
      if (position.x || position.y) {
        popupItem.value.style.left = position.x ? leftMath(position.x) : 0;
        popupItem.value.style.top = position.y ? topMath(position.y) : 0;
      }
      if (position.left || position.top) {
        popupItem.value.style.left = position.left ? leftMath(position.left) : 0;
        popupItem.value.style.top = position.top ? topMath(position.top) : 0;
      }
      props.popup.updated();
    });
    onUpdated(() => {
      props.popup.updated();
    });
    return () => {
      return h(
        'div',
        {
          ref: popupItem,
          class: cx('absolute transition-opacity duration-300'),
          onClick: e => e.stopPropagation(),
          // change zIndex
          onMouseDown: () => {
            const indexOf = dialog.popups.indexOf(props.popup);
            if (dialog.popups[indexOf].zIndexLock) {
              return
            }
            if (indexOf !== dialog.popups.length - 1) {
              dialog.popups.push(dialog.popups.splice(indexOf, 1)[0]);
            }
          },
          style: {
            maxWidth: props.width || 'auto',
            width: props.width ? '100%' : 'auto',
            maxHeight: props.height || 'auto',
            height: props.height ? '100%' : 'auto',
            zIndex: (props.index + 1) * 1,
          },
        },
        [
          h(PopupView, {
            props: Object.assign(props.popup.props, {
              index: props.index,
            }),
            drag: e => {
              e.dataTransfer.setDragImage(new Image(), 0, 0);
              dialog.dropTarget = popupItem;
              dialog.dropOffsetX = e.pageX - popupItem.value.offsetLeft;
              dialog.dropOffsetY = e.pageY - popupItem.value.offsetTop;
            },
            touch: event => {
              const e = Array.apply([], event.touches).find(p => p.target === event.target);
              dialog.dropTarget = popupItem;
              dialog.dropOffsetX = e.pageX - popupItem.value.offsetLeft;
              dialog.dropOffsetY = e.pageY - popupItem.value.offsetTop;
            },
          }),
        ]
      )
    }
  },
};

var Dialog = {
  setup() {
    const dialog = useDialog();
    const isPopupOpen = () => dialog.popups.length;
    const popupMove = e => {
      const offsetWidth = dialog.dropTarget.offsetWidth;
      const offsetHeight = dialog.dropTarget.offsetHeight;
      if (window.innerWidth - offsetWidth < e.pageX - dialog.dropOffsetX) {
        dialog.dropTarget.style.left = window.innerWidth - offsetWidth - 1 + 'px';
      } else if (e.pageX - dialog.dropOffsetX < 1) {
        dialog.dropTarget.style.left = 0;
      } else {
        dialog.dropTarget.style.left = e.pageX - dialog.dropOffsetX + 'px';
      }
      if (window.innerHeight - offsetHeight < e.pageY - dialog.dropOffsetY) {
        dialog.dropTarget.style.top = window.innerHeight - offsetHeight - 1 + 'px';
      } else if (e.pageY - dialog.dropOffsetY < 1) {
        dialog.dropTarget.style.top = 0;
      } else {
        dialog.dropTarget.style.top = e.pageY - dialog.dropOffsetY + 'px';
      }
    };
    const windowResize = () => {
      if (isPopupOpen()) {
        dialog.popups.forEach(popup => {
          const target = popup.ref;
          const correctionValue = 8;
          const offsetRight = target.offsetWidth + target.offsetLeft;
          const offsetBottom = target.offsetHeight + target.offsetTop;
          if (window.innerWidth - correctionValue <= offsetRight) {
            if (window.innerWidth - correctionValue > target.offsetWidth) {
              target.style.left = window.innerWidth - popup.offsetWidth - correctionValue + 'px';
            }
          }
          if (window.innerHeight - correctionValue <= offsetBottom) {
            if (window.innerHeight - correctionValue > target.offsetHeight) {
              target.style.top = window.innerHeight - popup.offsetHeight - correctionValue + 'px';
            }
          }
          requestAnimationFrame(() => {
            popup.updated();
          });
        });
      }
    };
    window.addEventListener('resize', windowResize);
    return () => {
      return h(
        'div',
        {
          class: cx('fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300', {
            'pointer-events-none opacity-0': !isPopupOpen(),
          }),
          onClick: () => {
            dialog.popups.forEach(popup => {
              if (popup.onBackgroundClick) popup.onBackgroundClick(popup);
            });
          },
          onDragover: e => {
            if (dialog.dropTarget) {
              popupMove(e);
            }
          },
          onTouchMove: event => {
            if (dialog.dropTarget) {
              const e = Array.apply([], event.touches).find(p => p.target === event.target);
              popupMove(e);
            }
          },
        },
        [
          dialog.popups.map((popup, index) => {
            return h(PopupComponent, {
              popup,
              index,
              key: popup.id,
            })
          }),
        ]
      )
    }
  },
};

const DialogInstall = {
  install(app) {
    app.component('Dialog', Dialog);
  },
};

export { Dialog$1 as Dialog, DialogInstall, Popup, Dialog as VueDialog, PopupComponent as VuePopup, useDialog };
