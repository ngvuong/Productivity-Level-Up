import { useEffect, useRef, useState } from 'react';

export default function useModal(initState) {
  const [show, setShow] = useState(initState);
  const triggerRef = useRef(null);
  const nodeRef = useRef(null);

  const delta = 6;
  let startX;
  let startY;

  const onClickOutside = (e) => {
    if (e.type === 'mousedown') {
      startX = e.pageX;
      startY = e.pageY;
      return;
    }

    if (
      e.type === 'keydown' &&
      triggerRef.current &&
      triggerRef.current.contains(e.target)
    ) {
      if (e.keyCode === 27) {
        return setShow(false);
      } else if (e.keyCode === 13) return setShow(true);
    }

    if (e.type === 'mouseup') {
      if (
        Math.abs(startX - e.pageX) < delta &&
        Math.abs(startY - e.pageY) < delta
      ) {
        if (triggerRef.current && triggerRef.current.contains(e.target)) {
          return setShow(!show);
        }
        if (nodeRef.current && !nodeRef.current.contains(e.target)) {
          return setShow(false);
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', onClickOutside, true);
    document.addEventListener('mouseup', onClickOutside, true);
    document.addEventListener('keydown', onClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', onClickOutside, true);
      document.removeEventListener('mouseup', onClickOutside, true);
      document.removeEventListener('keydown', onClickOutside, true);
    };
  });

  return {
    triggerRef,
    nodeRef,
    show,
    setShow,
  };
}
