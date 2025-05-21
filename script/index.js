

const showLoader = () => { 
  
  document.getElementById('loader').classList.remove('hidden');
  document.getElementById('video-container').classList.add('hidden');
}

const hideLoader = () => {
  document.getElementById('loader').classList.add('hidden');
  document.getElementById('video-container').classList.remove('hidden');
};
function removeActiveClass() {
  // Get all buttons with the class 'active'
  const activeButtons = document.getElementsByClassName('active');
  // Loop through the active buttons and remove the 'active' class
  for (let btn of activeButtons) {
    btn.classList.remove('active');
  }
}
function loadCategories() {
  // Fetch categories from the API
  fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
    // Check if the response is ok
    .then(res => res.json())
    .then(data => displayCategories(data.categories))
    // Handle any errors that occur during the fetch
    // and display an error message
    .catch(error => console.error('Error fetching categories:', error));
}

function loadVideos(searchText = '') {

  showLoader();
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
  )
    .then(Response => Response.json())
    .then(data => {
      removeActiveClass();
      displayVideos(data.videos);
      document.getElementById('btn-all').classList.add('active');
    });
}

function loadCategoryVideo(id)
{
  showLoader();
  const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
  console.log(url);
  fetch(url)
    .then(res => res.json())
    .then(data => {
      removeActiveClass();
      const clickedButton = document.getElementById(`btn-${id}`);
      clickedButton.classList.add('active');
      displayVideos(data.category);
    });
}

function loadVideoDetails(videoId) {
  console.log(videoId);
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  fetch(url)
    .then(res => res.json())
    .then(data => displayVideoDetails(data.video));
}
function displayVideoDetails(video) {
  console.log(video);
  document.getElementById('video_details').showModal();
  const videoDetailsContainer = document.getElementById(
    'video-details-container'
  );
  videoDetailsContainer.innerHTML = `
<div class="card bg-base-100 image-full  shadow-sm">
  <figure>
    <img
      src="${video.thumbnail}" />
  </figure>
  <div class="card-body">
  <img class="w-[100px] h-[100px] rounded-full" src="${video.authors[0].profile_picture}" alt="">
    <h2 class="card-title">${video.authors[0].profile_name}</h2>
    <p>${video.description}</p>
   
  </div>
</div>
  `;
}

// Display the categories in the console
function displayCategories(categories) {
  const categoriesContainer = document.getElementById('category-container');

  for (const cat of categories) {
    const categoryDiv = document.createElement('div');
    categoryDiv.innerHTML = `
    <button id="btn-${cat.category_id}" onclick="loadCategoryVideo(${cat.category_id})" class="btn btn-sm hover:bg-[#FF1F3D] hover:text-white">${cat.category}
    </button>`;
    categoriesContainer.appendChild(categoryDiv);
    // Add an event listener to the button
  }
}

const displayVideos = videos => {
  console.log(videos);

  const videoContainer = document.getElementById('video-container');
  videoContainer.innerHTML = '';

  if (videos.length === 0) {
    
    videoContainer.innerHTML = `
    <div class=" py-20 col-span-full flex flex-col justify-center items-center text-center">
      <img class="w-[120px]" src="./assets/Icon.png" alt="">
      <h2 class="text-2xl font-bold">Oops!! Sorry,There is no content here</h2>
    </div>
    `;
    hideLoader();
    return;
  }
  // Loop through the videos and create a card for each one

  videos.forEach(video => {
    const videoCard = document.createElement('div');
    videoCard.innerHTML = ` <div class="card bg-base-100">
      <figure class="relative">
        <img class="w-full h-[150px] object-cover" src="${video.thumbnail}" />
        <span class="absolute bottom-2 right-2 text-sm rounded text-white bg-black px-2">3hrs 56 min ago</span>
      </figure>
      <div class="flex gap-3 px-0 py-5">
        <div class="profile">
          <div class="avatar">
            <div class="ring-primary ring-offset-base-100 w-6 rounded-full ring-2 ring-offset-2">
              <img src="${video.authors[0].profile_picture}" />
            </div>
          </div>
        </div>
        <div class="intro">
          <h2 class="text-sm font-semibold">${video.title}</h2>
          <p class="text-sm text-gray-400 flex gap-2">
          ${video.authors[0].profile_name} 
          ${
            video.authors[0].verified == true
              ? `<img 
              class="w-5 h-5"
              src="https://cdn-icons-png.flaticon.com/128/7641/7641727.png" 
              alt=""/>`
              : `<img 
              class="w-5 h-5"
              src="https://cdn-icons-png.flaticon.com/128/13268/13268702.png" 
              alt=""/>`
          } 
          </p>
            <p class="text-sm text-gray-400 flex gap-2">${
              video.others.views
            }</p>
        </div>
      </div>
      <button onclick="loadVideoDetails('${
        video.video_id
      }')" class="btn btn-block">Description</button>
    </div>
    `;
    videoContainer.appendChild(videoCard);
  });
  hideLoader();
};


document.getElementById('search-input').addEventListener("keyup",
  (e) => {
  const input = e.target.value;
  loadVideos(input);
} )
  

loadCategories();
