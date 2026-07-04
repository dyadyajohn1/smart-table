import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    
    // 1. Создаем ПРАВИЛО поиска вручную через замыкание.
    // Мы жестко прописываем поля ['date', 'customer', 'seller'], как в задании.
    const searchRule = (row, state) => {
        const query = state[searchField] || '';
        if (!query) return true; // Если пусто, показываем всё (аналог skipEmpty)
        
        const q = query.toLowerCase();
        
        // Проверяем наличие подстроки в нужных полях
        const fieldsToSearch = ['date', 'customer', 'seller'];
        
        return fieldsToSearch.some(key => {
            const val = row[key];
            if (!val) return false;
            return String(val).toLowerCase().includes(q);
        });
    };

    // 2. Используем createComparison ТОЛЬКО для правила пропуска пустых значений.
    // Передаем строку 'skipEmptyTargetValues', чтобы библиотека не упала на map.
    const skipEmpty = createComparison(['skipEmptyTargetValues']);

    // 3. Объединяем логику: сначала проверяем, не пуст ли поиск (через библиотеку),
    // потом применяем наш ручной поиск.
    const compare = (row, state) => {
        // Если библиотека говорит "пропустить фильтрацию" (потому что поле пустое), возвращаем true
        if (skipEmpty(row, state)) return true;
        
        // Иначе применяем наш поиск
        return searchRule(row, state);
    };

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        return data.filter(row => compare(row, state));
    };
}