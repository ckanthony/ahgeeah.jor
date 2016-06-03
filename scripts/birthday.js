//jor is happy

var moment = require('moment');
var fs = require('fs');

module.exports = (jor) => {
  const state = {};
  var userData = {}
  try {
    userData = require(`${__dirname}/birthday.json`) || {};
  } catch (e) {
    userData = {}
  }


  jor.listen(
    (message) => {
      if (state.askingBirthday === message.user.id) {
        return message.text;
      } else {
        return false;
      }
    },
    (res) => {
      const id = res.message.user.id;
      if (moment(res.match).isValid()) {
        userData[id] = userData[id] || {};
        userData[id].birthday = moment(res.match).toDate();
        res.reply("got it! if you didn't tell me, I thought you're 18!");
        state.askingBirthday = false;
        fs.writeFile(`${__dirname}/birthday.json`, JSON.stringify(userData), (err) => {
          console.log('I fucken remembered their birthdays!');
        });
      } else {
        res.reply("Sorry, I didn't get it.  I only understand ENGLISH && numbers");
      }
    }
  );

  jor.respond(/(.*) on board/i, (res) => {
    const newb = res.match[1];
    res.reply('Whats your Birthday?');
//    setTimeout(() => state.askingBirthday = true, 50);
     state.askingBirthday = res.message.user.id;
  });
}
