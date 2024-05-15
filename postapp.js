"use strict";

const apiUrl = 'https://jsonplaceholder.typicode.com/posts/';

async function fetchPosts() {
    try {
        const response = await fetch(apiUrl);
        const posts = await response.json();
        return posts.slice(0, 2);
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
}

async function deletePost(postId) {
    try {
        const response = await fetch(apiUrl + postId, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete post');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
}

async function addPost(newPost) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(newPost),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to add post');
        }
        const post = await response.json();
        return post;
    } catch (error) {
        console.error('Error adding post:', error);
        throw error;
    }
}

async function init() {
    const postsList = document.getElementById('posts-list');
    try {
        const posts = await fetchPosts();
        posts.forEach(post => createPostItem(postsList, post));
    } catch (error) {
        console.error('Failed to initialize:', error);
    }
}

function createPostItem(container, post) {
    const postItem = document.createElement('li');
    postItem.classList.add('border', 'border-gray-700', 'p-4', 'hover:bg-gray-700', 'transition', 'rounded', 'cursor-pointer');

    const postTitle = document.createElement('h3');
    postTitle.textContent = post.title;
    postTitle.classList.add('text-lg', 'font-bold');

    const postBody = document.createElement('p');
    postBody.textContent = post.body;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('mt-2', 'mr-2', 'px-3', 'py-2', 'bg-green-600', 'text-white', 'rounded', 'hover:bg-green-400', 'focus:outline-none', 'focus:ring',  'cursor-pointer');
    editButton.addEventListener('click', () => editPostItem(post, postTitle, postBody));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('mt-2', 'px-3', 'py-2', 'bg-yellow-600', 'text-white', 'rounded', 'hover:bg-yellow-400', 'focus:outline-none', 'focus:ring', 'cursor-pointer');
    deleteButton.addEventListener('click', async () => {
        try {
            await deletePost(post.id);
            postItem.remove();
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    });

    postItem.appendChild(postTitle);
    postItem.appendChild(postBody);
    postItem.appendChild(editButton);
    postItem.appendChild(deleteButton);
    container.appendChild(postItem);
}

function editPostItem(post, postTitleElement, postBodyElement) {
    const newTitle = prompt('Edit Post Title:', post.title);
    const newBody = prompt('Edit Post Body:', post.body);

    if (newTitle !== null && newBody !== null) {
        post.title = newTitle;
        post.body = newBody;
        postTitleElement.textContent = newTitle;
        postBodyElement.textContent = newBody;
    }
}

const addPostButton = document.getElementById('add-post');
addPostButton.addEventListener('click', async () => {
    const newPost = {
        title: prompt('Enter post title:'),
        body: prompt('Enter post body:'),
        userId: 1,
    };

    if (newPost.title && newPost.body) {
        try {
            const post = await addPost(newPost);
            const postsList = document.getElementById('posts-list');
            createPostItem(postsList, post);
        } catch (error) {
            console.error('Failed to add post:', error);
        }
    }
});

init();
