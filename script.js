const subredditsContainer = document.getElementById('subreddits');
const threadsContainer = document.getElementById('threads');

let afterSubreddit = null; // Параметр для пагинации
const limit = 10; // Количество сабреддитов на страницу

// Функция для загрузки сабреддитов с пагинацией
async function fetchSubreddits() {
    console.log('Loading subreddits started...');
    try {
        const redditUrl = `https://www.reddit.com/subreddits.json?limit=${limit}${afterSubreddit ? `&after=${afterSubreddit}` : ''}`;
        const response = await fetch(redditUrl);
        
        const data = await response.json();
        console.log('Response from Reddit:', data);

        const subreddits = data.data.children;
        subreddits.forEach(subreddit => {
            const subData = subreddit.data;

            const subredditElement = document.createElement('div');
            subredditElement.innerHTML = `
                <h3>${subData.title}</h3>
                <p>${subData.public_description}</p>
                ${subData.icon_img ? `<img src="${subData.icon_img}" alt="${subData.title}" width="50">` : ''}
                <button onclick="fetchThreads('${subData.display_name}')">View Threads</button>
                <hr>
            `;

            subredditsContainer.appendChild(subredditElement);
        });

        afterSubreddit = data.data.after;

        if (afterSubreddit) {
            const loadMoreButton = document.createElement('button');
            loadMoreButton.textContent = 'Load more subreddits';
            loadMoreButton.onclick = fetchSubreddits;
            subredditsContainer.appendChild(loadMoreButton);
        }
    } catch (error) {
        console.error('Error loading subreddits:', error);
    }
}

let afterThread = null; // Параметр для пагинации тредов

async function fetchThreads(subredditName) {
    console.log(`Loading threads for subreddit: ${subredditName}`);

    try {
        const url = `https://www.reddit.com/r/${subredditName}.json?limit=${limit}${afterThread ? `&after=${afterThread}` : ''}`;
        const response = await fetch(url);
        const data = await response.json();
        const threads = data.data.children;

        // Очищаем контейнер только при первой загрузке
        if (!afterThread) {
            threadsContainer.innerHTML = '';
        }

        threads.forEach(thread => {
            const threadData = thread.data;
            const postText = threadData.selftext ? threadData.selftext : 'Text is missing';

            const threadElement = document.createElement('div');
            threadElement.innerHTML = `
                <h4>${threadData.title}</h4>
                <p><strong>Автор:</strong> ${threadData.author}</p>
                <p>${postText.substring(0, 200)}${postText.length > 200 ? '...' : ''}</p>
                <a href="https://www.reddit.com${threadData.permalink}" target="_blank">Go to thread</a>
                <hr>
            `;

            threadsContainer.appendChild(threadElement);
        });

        afterThread = data.data.after;

        // Кнопка для загрузки следующих тредов
        if (afterThread) {
            const loadMoreButton = document.createElement('button');
            loadMoreButton.textContent = 'Load more threads';
            loadMoreButton.onclick = () => fetchThreads(subredditName);
            threadsContainer.appendChild(loadMoreButton);
        }

    } catch (error) {
        console.error('Error loading threads:', error);
    }
}

// Загружаем сабреддиты при открытии страницы
fetchSubreddits();