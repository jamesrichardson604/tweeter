$(document).ready(function() {
  $('#tweet-text').on('keyup', function() {
    let charCount = this.value.length
    let charsLeft = 140 - charCount
    $(this).siblings('div').children('.counter').html(charsLeft)
    if (charCount > 140) {
      $(this).siblings('div').children('.counter').css('color', 'red')
    } else {
      $(this).siblings('div').children('.counter').css('color', '#545149')
    }
  })
});