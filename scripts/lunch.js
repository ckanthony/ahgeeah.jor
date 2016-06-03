import moment from 'moment';

export default function(robot) {
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
    }
  }


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
