import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';

import {
  THEME_IDS,
  THEMES,
  type Theme,
} from '../../../app/providers/theme/themes';
import { useTheme } from '../../../app/providers/theme/ThemeProvider';

import './ThemeSelector.css';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    selectorRef.current
      ?.querySelector<HTMLButtonElement>('[role="menuitemradio"]')
      ?.focus();

    function handlePointerDown(event: PointerEvent) {
      if (
        selectorRef.current &&
        !selectorRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function handleThemeSelect(nextTheme: Theme) {
    setTheme(nextTheme);
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function handleMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      return;
    }

    const menuItems = selectorRef.current?.querySelectorAll<HTMLButtonElement>(
      '[role="menuitemradio"]',
    );

    if (!menuItems?.length) {
      return;
    }

    event.preventDefault();

    const currentIndex = Array.from(menuItems).findIndex(
      (item) => item === document.activeElement,
    );

    let nextIndex = currentIndex;

    if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = menuItems.length - 1;
    } else if (event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % menuItems.length;
    } else {
      nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
    }

    menuItems[nextIndex]?.focus();
  }

  return (
    <div className="theme-selector" ref={selectorRef}>
      <button
        ref={triggerRef}
        className="theme-selector-trigger"
        type="button"
        title={`Theme: ${THEMES[theme].label}`}
        aria-label={`Choose interface theme. Current theme: ${THEMES[theme].label}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="theme-selector-menu"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span className="theme-selector-icon" aria-hidden="true">
          ◐
        </span>
      </button>

      <div
        className="theme-selector-menu"
        id="theme-selector-menu"
        role="menu"
        aria-label="Choose interface theme"
        hidden={!isOpen}
        onKeyDown={handleMenuKeyDown}
      >
        <p className="theme-selector-heading">Appearance</p>

        <div className="theme-selector-options">
          {THEME_IDS.map((themeId) => {
            const option = THEMES[themeId];
            const isSelected = themeId === theme;

            return (
              <button
                key={themeId}
                className={`theme-option${isSelected ? ' is-selected' : ''}`}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                onClick={() => handleThemeSelect(themeId)}
              >
                <span
                  className="theme-option-swatch"
                  style={{ backgroundColor: option.swatch }}
                  aria-hidden="true"
                />

                <span className="theme-option-copy">
                  <span className="theme-option-label">
                    {option.label}
                  </span>
                  <span className="theme-option-description">
                    {option.description}
                  </span>
                </span>

                {isSelected && (
                  <span className="theme-option-check" aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
