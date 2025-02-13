## Описание проекта
Реализована функциональность согласно требованиям ТЗ.
Дополнительно добавлена возможность управления с клавиатуры.

## Архитектура
- Логика вынесена в кастомный хук для удобства поддержки и изменения визуализации.
- Использован `useReducer` для управления состоянием компонента.
- Добавлена мемоизация, чтобы оптимизировать работу со списками.
- Реализован модульный подход.

## Использование `useReducer`
Редьюсер используется для управления состоянием дропдауна.

### Доступные действия:
- `TOGGLE_DROPDOWN` — открыть/закрыть выпадающий список.
- `CLOSE_DROPDOWN` — закрыть дропдаун и обновить выбранное значение.
- `SEARCH_UPDATED` — обновить поисковой запрос и отфильтровать список опций.
- `OPTION_SELECTED` — выбрать значение из списка.

## Управление с клавиатуры
### Доступные действия:
- `Enter` — открыть/закрыть дропдаун, выбрать выделенный элемент.
- `ArrowDown` — перемещение вниз по списку.
- `ArrowUp` — перемещение вверх по списку.
- `Escape` — закрыть дропдаун.

## Дополнительные возможности
- `useHandleClickOutside` используется для закрытия дропдауна при клике вне области.
- Поддержка работы с клавиатурой и мышью (фиксирует последнее взаимодействие).
- Автоматический скролл к выделенному элементу в списке.
