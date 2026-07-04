import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
// Оставляем defaultRules для обычных полей (select, text), но для чисел будем делать проверку вручную
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)
        .forEach((elementName) => {
            const selectElement = elements[elementName];
            if (!selectElement) return;
            
            selectElement.append(
                ...Object.values(indexes[elementName])
                    .map(name => {
                        const option = document.createElement('option');
                        option.value = name;
                        option.textContent = name;
                        return option;
                    })
            );
        });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const parent = action.parentElement;
            const input = parent.querySelector('input');
            
            if (input) {
                input.value = '';
                const fieldName = action.dataset.field;
                if (fieldName) {
                    state[fieldName] = '';
                }
            }
        }

        return data.filter(row => {
            // --- НАЧАЛО РУЧНОЙ ПРОВЕРКИ ДИАПАЗОНОВ (ИСПРАВЛЕНИЕ ДЛЯ ТЕСТОВ) ---
            
            // 1. Проверка нижней границы (totalFrom)
            if (state.totalFrom) {
                const minValue = parseFloat(state.totalFrom);
                // Если в данных число, а фильтр строка - приводим фильтр к числу
                if (isNaN(minValue) || row.total < minValue) {
                    return false; // Не подходит под диапазон
                }
            }

            // 2. Проверка верхней границы (totalTo)
            if (state.totalTo) {
                const maxValue = parseFloat(state.totalTo);
                if (isNaN(maxValue) || row.total > maxValue) {
                    return false; // Не подходит под диапазон
                }
            }
            
            // --- КОНЕЦ РУЧНОЙ ПРОВЕРКИ ---

            // @todo: #4.5 — отфильтровать данные используя компаратор для остальных полей
            // Теперь compare проверяет только остальные поля (customer, seller и т.д.)
            return compare(row, state);
        });
    };
}
