$(document).ready(function(){
    var username = $('li.userMenu').text()
    $('.help').one('click', function(){
        $('.feedback').text('This is your home page!' +
            ' Your news feed will notify you of important things' +
            ' that happened on this site.' +
            ' All of the interactive content on this site' +
            ' can be accessed from the "Toys/Tools" menu.' +
            ' Check out the daily, monthly, or all-time leaderboards' +
            ' under the "Leaderboards" menu to see how your best score' +
            " compares with other users' scores." +
            ' Use the "' + username + '" menu to change' +
            ' your account settings or view all of the totally rad' +
            " awards you've earned from using this site." +
            ' Click the "?" button to view the message you'+"'"+'re' +
            ' currently reading.')
    })
})