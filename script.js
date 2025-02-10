document.addEventListener('DOMContentLoaded', () => {
    fetch('https://www.reddit.com/subreddits.json')
        .then(response => response.json())
        .then(data => {
            const subredditsContainer = document.getElementById('subreddits');
            data.data.children.forEach(subreddit => {
                const { title, public_description, icon_img } = subreddit.data;

                const subredditElement = document.createElement('div');
                subredditElement.innerHTML = `
                    <h2>${title}</h2>
                    <p>${public_description}</p>
                    ${icon_img ? `<img src="${icon_img}" alt="${title}" width="50">` : ''}
                `;

                subredditsContainer.appendChild(subredditElement);
            });
        })
        .catch(error => console.error('Ошибка при загрузке данных:', error));
});