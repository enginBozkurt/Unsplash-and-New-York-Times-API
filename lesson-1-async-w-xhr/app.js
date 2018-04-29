(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');

    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    function addImage() {
      let  htmlContent = '';
      //conver JSON response to Javascript object
     const data = JSON.parse(this.responseText);

      //add a figure elemnet with an image point to the imagefrom unsplash and
      //the caption of the person that took the photo. This code will add this
      //inside the responseContainer as the first element
      if (data && data.results && data.results[0]) {
      const firstImg = data.results[0];   //we get the first addImage
      htmlContent = `<figure>
        <img src="${firstImg.urls.regular}" alt="searchedForText"/>
        <figcaption>${searchedForText} by ${firstImg.user.name}</figcaption>
        </figure>`;
}

else {
  htmlContent = '<div class="error-no-image ">no images available</div>';
}
    // add the response inside the respond container as the first element
     responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
}

function addArticles() {
    let content = '';
    const data = JSON.parse(this.responseText);
    if (data.response && data.response.docs && data.response.docs.length > 1) {
      content =
        '<ul>' +
        data.response.docs
          .map(
            article => `<li class='article'>
       <h2><a href='${article.web_url}'>${article.headline.main}</a></h2>
       <p>${article.snippet}</p></li>`
          )
          .join('') +
        '</ul>';
    } else {
      content = '<div class="error-no-articles">No Articles Available</div>';
    }
    responseContainer.insertAdjacentHTML('beforeend', content);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    responseContainer.innerHTML = '';
    searchedForText = searchField.value;

    //send img request
    const unsplashRequest = new XMLHttpRequest();
    unsplashRequest.open(
      'GET',
      `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`
    );
    unsplashRequest.onload = addImage;
    unsplashRequest.setRequestHeader(
      'Authorization',
      'Client-ID 80ba988bf87bd616d36563c05a5d62979a18660e1bdd3b033b7e062f4a0f7889'
    );
    unsplashRequest.send();

    //send article request
    const articleRequest = new XMLHttpRequest();
    articleRequest.onload = addArticles;
    articleRequest.open(
      'GET',
      `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=10cbb059af054687af59a32196fe6008`
    );
    articleRequest.send();
        });
})();
