/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

 $(document).ready(function () {

    $('.new-tweet').hide() //only show textarea for creating tweet when navigation arrow is clicked, see navigation event handlers below 
    $('#error').hide()

    //apply html to each tweet and add html to DOM for UI
    const renderTweets = function (tweetData) {
      $('.tweet-container').empty() //empty tweet container upon loading tweets so tweets don't duplicate
      for (let tweet of tweetData) {
        const htmlMarkup = createTweetElement(tweet)
        $('.tweet-container').prepend(htmlMarkup)
      }
    }

    //escape function to prevent XSS attacks
    const escape = function (str) {
      let div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }

    //calculate when tweet was submitted
    const tweetDate = function (timeOfTweet) {
      const timeNow = Date.now()
      let difference = timeNow - timeOfTweet //difference between current time and time of user-submitted tweet, in milliseconds
      let diffInSeconds = difference / 1000
      let diffInMinutes = Math.floor(diffInSeconds / 60)
      let diffInHours = Math.floor(diffInMinutes / 60)
      if (diffInSeconds / 60 < 1) {
        return 'Just now'
      } else if (diffInSeconds / 60 >= 1 && diffInSeconds / 60 < 2){
        return '1 minute ago'
      } else if (diffInSeconds / 60 >= 2 && diffInSeconds / 60 < 60) {
        return `${diffInMinutes} minutes ago`
      } else if (diffInSeconds / 60 >= 60 && diffInSeconds / 60 < 120) {
        return '1 hour ago'
      } else if (diffInSeconds / 60 >= 120 && diffInSeconds / 60 < 1440) {
        return `${diffInHours} hours ago`
      } else if (diffInSeconds / 60 >= 1440 && diffInSeconds / 60 < 2880) {
        return 'Yesterday'
      } else if (diffInSeconds / 60 >= 2880 && diffInSeconds / 60 < 10080) {
        return `${diffInHours} days ago`
      } 
    }

    //html markup for each tweet
    const createTweetElement = function (tweet) {
      const $tweet = 
        `<article>
          <header>
            <div id="name-and-icon">
              <span><img src ="${tweet.user.avatars}" alt="user-avatar"/></span>
              <span id ="name">${tweet.user.name}</span>
            </div>
            <span id="user-handle">${tweet.user.handle}</span>
          </header>
            <p>${escape(tweet.content.text)}</p>
          <footer>
            <span>${tweetDate(tweet.created_at)}</span>
            <div id="icons">
              <i class="fas fa-retweet"></i>
              <i class="fas fa-flag"></i>
              <i class="fas fa-heart"></i>
            </div>
          </footer>
        </article>`
      ;
      return $tweet
    }

    //ajax request sends data from form submission, i.e. user tweet, to tweet database 
    $('#submit-tweet').submit(function (event) {
      event.preventDefault(); 
      if ($('#tweet-text').val() === '') { //error handling for empty tweet
        $('#error span').text('Error: Tweet cannot be empty!')
        $('#error').slideDown()
      } else if ($('.counter').val() < 0) { //error handling for tweets exceeding character limit
        $('#error span').text('Error: Tweet cannot be longer than 140 characters!')
        $('#error').slideDown()
      } else {
        $('#error').slideUp()
        const tweetContent = ($(this).serialize())
        $.post("/tweets", tweetContent) //add user tweet to tweet database
          .then(function () {
            loadTweets() //calling loadtweets allows user to see newly created tweet upon form submission
          })
        $('#tweet-text').val('')
        $('.counter').text('140')
      }
    })

    //ajax request fetches tweets from locally stored tweet database
    const loadTweets = function () {
      $.get('/tweets')
        .then (function (data) {
          renderTweets(data) //applies html to tweets for UI
        })
    }

    //event handlers for user navigation
    $('#down-arrow').on('click', function () {
      $('.new-tweet').slideDown()
      $('.counter').text('140').css('color', 'inherit')
      $('#tweet-text').val('')
      $( "#tweet-text" ).focus();
      $('#error').hide()
    })      

    $('#up-arrow').on('click', function () {
      $('.new-tweet').slideUp()
      $('.counter').text('140').css('color', 'inherit')
      $('#tweet-text').val('')
      $('#error').hide()
    })    

    $( "#tweet-text" ).on('focus', function () {
      $('#error').hide()
    })

    //load tweets upon page load 
    loadTweets()

  })

