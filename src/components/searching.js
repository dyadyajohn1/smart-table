import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    
    // Мы НЕ используем createComparison для логики поиска, так как не можем передать туда аргументы.
    // Вместо этого мы реализуем логику явно.
    
    return (data, state, action) => {
        const query = state[searchField];
        
        // 1. Обработка пустого поиска.
        // Если поле пустое или состоит только из пробелов, возвращаем все данные.
        if (!query || query.trim() === '') {
            return data;
        }

        const q = query.toLowerCase();
        const fieldsToSearch = ['date', 'customer', 'seller'];

        // 2. Фильтрация данных вручную
        return data.filter(row => {
            // Ищем совпадение хотя бы в одном из указанных полей
            return fieldsToSearch.some(key => {
                const val = row[key];
                if (!val) return false;
                
                // Приводим к строке и проверяем вхождение подстроки
                return String(val).toLowerCase().includes(q);
            });
        });
    };
}