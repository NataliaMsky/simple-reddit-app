// Получаем элемент, куда будем добавлять сабреддиты
const subredditsContainer = document.getElementById('subreddits');
const threadsContainer = document.getElementById('threads');

// Функция для получения сабреддитов
async function fetchSubreddits() {
    try {
        const response = await fetch('https://www.reddit.com/subreddits.json');
        const data = await response.json();
        const subreddits = data.data.children; // Доступ к списку сабреддитов

        // Отображаем сабреддиты на странице
        subreddits.forEach(subreddit => {
            const subData = subreddit.data;

            const subredditElement = document.createElement('div');
            subredditElement.innerHTML = `
                <h3>${subData.title}</h3>
                <p>${subData.public_description}</p>
                ${subData.icon_img ? `<img src="${subData.icon_img}" alt="${subData.title}" width="50">` : ''}
                <button onclick="fetchThreads('${subData.display_name}')">Посмотреть темы</button>
                <hr>
            `;

            subredditsContainer.appendChild(subredditElement);
        });
    } catch (error) {
        console.error('Ошибка при получении сабреддитов:', error);
    }
}

// Функция для получения тредов по выбранному сабреддиту
async function fetchThreads(subredditName) {
    console.log(`Загружаем темы для сабреддита: ${subredditName}`);
    
    try {
        const response = await fetch(`https://www.reddit.com/r/${subredditName}.json`);
        const data = await response.json();
        const threads = data.data.children;

        threadsContainer.innerHTML = ''; // Очищаем старые треды

        threads.forEach(thread => {
            const threadData = thread.data;

            // Проверяем, есть ли текст в посте (selftext)
            const postText = threadData.selftext ? threadData.selftext : 'Текст отсутствует';

            const threadElement = document.createElement('div');
            threadElement.innerHTML = `
                <h4>${threadData.title}</h4>
                <p><strong>Автор:</strong> ${threadData.author}</p>
                <p>${postText.substring(0, 200)}${postText.length > 200 ? '...' : ''}</p> 
                <a href="https://www.reddit.com${threadData.permalink}" target="_blank">Перейти к треду</a>
                <hr>
            `;

            threadsContainer.appendChild(threadElement);
        });
    } catch (error) {
        console.error('Ошибка при получении тредов:', error);
    }
}

// Загружаем сабреддиты при открытии страницы
fetchSubreddits();