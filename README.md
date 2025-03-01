# Select Component

## Реализованные фичи (согласно ТЗ)

✔️ **Открытие/закрытие селекта** при клике на инпут, выборе значения и клике вне компонента (через `useHandleClickOutside`).  
✔️ **Прокручиваемый список** при большом количестве элементов (с `dropdownRef`).  
✔️ **Поиск по названию элементов** с фильтрацией списка (управляется `selectReducer`).  
✔️ **Выбор элемента** с отображением его в инпуте и стилизацией выбранного элемента (`selectedIndex`).  
✔️ **Отображение сообщения** “Нет вариантов для выбора” при отсутствии данных.  
✔️ **Рендер через портал** (`createPortal`).  
✔️ **Доступность (ARIA-атрибуты)**: `role`, `aria-expanded`, `aria-haspopup`.

---

## Дополнительно реализовано

✅ **Управление с клавиатуры** (`Enter`, `ArrowUp`, `ArrowDown`, `Escape`).  
✅ **Автоматический скролл** к выделенному элементу (`dropdownRef.scrollTop`).  
✅ **Фиксация последнего способа взаимодействия** (мышь/клавиатура) для корректной работы выделения (`lastInteraction`).  
✅ **Обработчик клика вне компонента** (`useHandleClickOutside`).

---

## Архитектура

🛠 **Логика вынесена в кастомный хук** (`useSelect`) для удобства поддержки и расширяемости.  
🛠 **Использование `useReducer`** для управления состоянием дропдауна, поиска и выбора элемента.  
🛠 **Мемоизация списка** (`useMemo`) для оптимизации рендера.  
🛠 **Использование `useRef`** для работы с DOM-элементами (`selectRef`, `dropdownRef`).  
🛠 **Модульный подход**, обеспечивающий удобство в масштабировании и поддержке.  
