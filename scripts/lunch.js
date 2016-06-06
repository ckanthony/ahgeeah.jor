import moment from 'moment';
import later from 'later';

export default function(robot) {

  var sched = later.parse.text('at 1:00pm every weekday');
  later.date.localTime();

  var callForLunch = later.setInterval(Lunch.call, sched);

  var state = {}

  const Lunch = {
    set: (who, item) => {
      const lunch = robot.brain.get('lunch') || {};
      lunch[who] = item;
      robot.brain.set('lunch', lunch);
    },
    get: () => robot.brain.get('lunch'),
    votes: () => {
      const lunch = Lunch.get();
      return Object.keys(lunch).map(n => `*${n}* wants *${lunch[n]}*`)
    },
    call: () => {
      var hungry = ['I am hungry', 'FEED ME', 'YO'];
      res.send(`${res.random(hungry)}, shall we have lunch?`);
      state.callWaiting = true;
    }
  }

  suggest (res suggested = false) => {
    if (suggested.length === suggestion.length) {
       return false; // no more choice !@
    }
    var suggestion = ['KFC', 'Camper Japanese food', 'si fong choi', 'pizza', 'gok fan', 'vietnam food', 'Sister Wah', 'Sheung Hai food', 'Shanghai Lane', 'Tam Chai', 'Yoshinoya'];
    let c = res.random(suggestion);
    if (suggested === false || suggested.indexOf(c) !== -1) {
      return c;
    } else {
      suggest(res, suggested);
    }
  }

  robot.listen(
    (message) => {
      if (state.callWaiting === true){
        return message.text;
      } else {
        return false;
      }
    }, 
    (res) => {
      if (RegExp("/SHUT UP/i").test(res.match)) {
        res.send("ok...");
      } else {
        let suggestion = suggest(res);
        res.send("how about ${suggestion}?"); 
        state.suggesting = suggestion;
      }
    }
  );

  robot.listen(
    (message) => {
      if (state.suggesting === true){
        return message.text;
      } else {
        return false;
      }
    }, 
    (res) => {
      if (RegExp("/ok|done|good|cool|yes|right|fine|nice|go/i").test(res.match)) {
        res.send("ok! Go Go Go!");
      } else {
      }
    }
  );

  robot.hear(/date (.*)/, res => {
    res.reply(moment(res.match[1]).toString());
  })

  robot.hear(/lunch\?/, res => {
    res.reply("what do you want to have for lunch?");
  });

  robot.hear(/i want\ (.*)/i, res => {
    const item = res.match[1];
    const who = res.message.user.name;
    Lunch.set(who, item);
    res.reply(`ok ${who} got you down for ${item}`)
    res.reply(Lunch.votes());
  })
}
