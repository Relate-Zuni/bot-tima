const VK = require("./src/vkontakte");

const updates = require("./src/updates");
const config = require("./cnfg/mongo.json");
const usersModel = require("./src/connect");
const utils = require("./src/utils");

var express = require("express");
var app = express();
var path = require("path");

app.use(express.static(__dirname + "/"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./src/index.html"));
});
app.listen(process.env.PORT || 8080);

const vk = new VK({ token: config.tokenVk });

vk.updates.on("message_new", updates.middleware);

vk.updates.on("message_new", async (context, next) => {
  let row = await usersModel.find({ id: `${context.senderId}` });

  if (!row.length) {
    const [request] = await vk.api.users.get({ user_id: context.senderId });

    regisration = new usersModel({
      uid: row.length + 1,
      id: context.senderId,
      name: request.first_name,
      balance: 100,
      experience: 0,
      admin: 0,
      work: 0,
      airline: 0,
      nameAirline: "false",
      balanceAirline: 0,
      energy: 0,
    });

    regisration.save(function (err) {
      if (err) return console.log(err);

      context.send(`Регистрация прошла успешно!`);
    });
  }

  return next();
});

var text = {};
var list = {};

updates.hear(/^(?:казино)\s?(.*)?$/i, async (context) => {
  const row = await usersModel.findOne({ id: context.senderId });

  const emotionPositive = utils.pick(["😇", "🙂", `🥰`, `😇`, `😉`]);
  const emotionNegative = utils.pick(["😕", "🤕", `😫`, `😰`, `😔`]);

  if (!Number(context.$match[1])) return context.send(`${row.name}, использование: Казино [сумма]`);

  context.$match[1] = Math.floor(Number(context.$match[1]));
  row.balance = Math.floor(Number(row.balance));

  if (context.$match[1] <= 0) return;

  if (context.$match[1] > row.balance) return context.send(`Недостаточно средств ${emotionNegative}`);

    const multiply = utils.pick([false, true, null]);

    if (multiply === true) {
      row.balance += context.$match[1];
      row.save();

      return context.send(
        `Вы выиграли ${utils.sp(
          Math.floor(context.$match[1])
        )}$ ${emotionPositive}
💰 Баланс: ${utils.sp(row.balance)}$`
      );
    }

    if(multiply == false) {
    row.balance -= context.$match[1];
    row.save();

    return context.send(
      `Вы проиграли ${utils.sp(context.$match[1])}$ ${emotionNegative}
💰 Баланс: ${utils.sp(row.balance)}$`
    );
    }

  if (multiply === null) {
    return context.send(`Ваши деньги остаются при вас ${emotionPositive}
💰 Баланс: ${utils.sp(row.balance)}$`);
  }
});

updates.hear(/^(?:профиль)$/i, async (context) => {
  let row = await usersModel.find({ id: `${context.senderId}` });

  row = row[0];

  text.profile = ``;

  if (row.uid) text.profile += `🆔 Ваш ID > ${row.uid}\n`;
  if (row.name) text.profile += `🧿 Ник > ${row.name}\n`;
  if (row.balance) text.profile += `💰 Денег > ${utils.sp(row.balance)}$\n`;
  if (row.experience) text.profile += `\n🏆 Опыт > ${row.experience} ед.\n`;
  if (row.energy) text.profile += `🏋 Энергия > ${row.energy} ед.`;

  return context.send(`📚 ${row.name}, ваш профиль!
  
  ${text.profile}`);
});

updates.hear(/^(?:взять)(.*)(?:валюты)$/i, async (context) => {
  const row = await usersModel.findOne({ id: context.senderId });

  if (!row.admin) return context.send(`${row.name}, у Вас не хватает прав.`);

  context.$match[1] = Number(context.$match[1]);

  if (!Number(context.$match[1])) return;
  if (Number(context.$match[1]) < 1) return;

  if (row.balance > 10000000000) return context.send(`Лимит вашего баланса превышен!`);

    row.balance += context.$match[1];
    row.save();

    return context.send(
      `Вы выдали себе ${utils.sp(
        Number(context.$match[1])
      )}$ игровой валюты. 💵`
    );
});

updates.hear(/^(?:взять)(.*)(?:опыта)$/i, async (context) => {
  const row = await usersModel.findOne({ id: context.senderId });

  if (!row.admin) return context.send(`${row.name}, у Вас не хватает прав.`);

  context.$match[1] = Number(context.$match[1]);

  if (!Number(context.$match[1])) return;
  if (Number(context.$match[1]) < 1) return;

  if (row.experience > 10000000000) return context.send(`Лимит вашего опыта превышен!`);

    row.experience += context.$match[1];
    row.save();

    return context.send(
      `Вы выдали себе ${utils.sp(Number(context.$match[1]))} ед. опыта. 💵`
    );
});

updates.hear(/^(?:взять)(.*)(?:энергии)$/i, async (context) => {
  const row = await usersModel.findOne({ id: context.senderId });

  if (!row.admin) return context.send(`${row.name}, у Вас не хватает прав.`);

  context.$match[1] = Number(context.$match[1]);

  if (!Number(context.$match[1])) return;
  if (Number(context.$match[1]) < 1) return;

  if (row.energy > 10000000000) return context.send(`Лимит вашей энергии превышен!`);

    row.energy += context.$match[1];
    row.save();

    return context.send(
      `Вы выдали себе ${utils.sp(Number(context.$match[1]))} ед. энергии. 💵`
    );
});

updates.hear(/^(?:баланс)$/i, async (context) => {
  const row = await usersModel.findOne({ id: context.senderId });
  text.balance = ``;

  if (row.balance) text.balance += `💵 На руках > ${utils.sp(row.balance)}$`;

  text.balance += `😖 Денег нет, но вы держитесь!`;

  return context.send(`${text.balance}`);
});

updates.hear(/^(?:помощь)$/i, async (context) => {
  const row = await usersModel.findOne({ id: context.senderId });

  return context.send({
    message: `🎮 ${row.name}, помощь по играм!

🔥 Основное
⠀📚 Профиль
⠀💰 Баланс

🕹 Игры
⠀🎰 Казино
⠀📈 Трейд
⠀
💰 Доход
⠀💼 Работа
⠀✈ Авиакомпания`,
  });
});

updates.hear(/^(?:трейд)$/i, async (context) => {
  const row = await usersModel.findOne({ id: context.senderId });

  return context.send(`${row.name}, использование: Трейд [вверх/вниз] [сумма]`);
});

updates.hear(/^(?:трейд вверх)\s?(.*)?$/i, async (context) => {
  const row = await usersModel.findOne({ id: context.senderId });

  context.$match[1] = Number(context.$match[1]);

  if (!Number(context.$match[1])) return context.send(`${row.name}, использование > Трейд вверх [сумма] 📈`);

  context.$match[1] = Number(context.$match[1]);

  if (row.balance < context.$match[1]) return context.send(`${row.name}, недостаточно денег 😣`);
  if (context.$match[1] < 50) return context.send(`${row.name}, сумма трейда должна быть не менее 50$ 😣`);

  let kyrc = utils.random(1, 1000);
  let win = utils.random(1, 2);
  let losesmile = utils.pick([`😲`, `😣`, ` 😮`, `😔`]);
  let winsmile = utils.pick([`😎`, `😀`, ` 🤑`, `😇`]);

  if (win == 1) {
    let prize = Number(context.$match[1]);
    row.balance += prize;
    row.save();
    return context.send(`${row.name}, курс подорожал⤴ на ${utils.sp(kyrc)}$
  ✅ Вы заработали > ${utils.sp(prize)}$ ${winsmile}
  💰 Ваш баланс > ${utils.sp(row.balance)}$`);
  }

  if (win == 2) {
    row.balance -= context.$match[1];
    row.save();
    return context.send(`${row.name}, курс подешевел⤵ на ${utils.sp(kyrc)}$
  ❌ Вы потеряли > ${utils.sp(context.$match[1])}$ ${losesmile}
  💰 Ваш баланс > ${utils.sp(row.balance)}$`);
  }
});

updates.hear(/^(?:трейд вниз)\s?(.*)?$/i, async (context) => {
  const row = await usersModel.findOne({ id: context.senderId });

  context.$match[1] = Number(context.$match[1]);

  if (!Number(context.$match[1])) return context.send(`${row.name}, использование > Трейд вниз [сумма] 📈`);

  res = Number(context.$match[1]);

  if (row.balance < res) return context.send(`${row.name}, недостаточно денег 😣`);
  if (res < 50) return context.send(`${row.name}, сумма трейда должна быть не менее 50$ 😣`);

  let kyrc = utils.random(1, 1000);
  let win = utils.random(1, 2);
  let losesmile = utils.pick([`😲`, `😣`, ` 😮`, `😔`]);
  let winsmile = utils.pick([`😎`, `😀`, ` 🤑`, `😇`]);
  if (win == 2) {
    let prize = Number(res);
    row.balance += prize;
    row.save();
    return context.send(`${row.name}, курс подешевел⤵ на ${utils.sp(kyrc)}$
  ✅ Вы заработали > ${utils.sp(prize)}$ ${winsmile}
  💰 Ваш баланс > ${utils.sp(row.balance)}$`);
  }

  if (win == 1) {
    row.balance -= res;
    row.save();
    return context.send(`${row.name}, курс подорожал⤴ на ${utils.sp(kyrc)}$
  ❌ Вы потеряли > ${utils.sp(res)}$ ${losesmile}
  💰 Ваш баланс > ${utils.sp(row.balance)}$`);
  }
});

updates.hear(/^(?:работать)$/i, async (context) => {
  const row = await usersModel.findOne({ id: context.senderId });

  if (!row.work) return context.send(`${list.works1}`);
  if (!row.energy) return context.send(`🥴 ${row.name}, нет энергии!\n\nℹ Энергия восстанавливается каждые 5 мин.`);
  if (!row.work) return context.send(`${list.works1}`);

  row.balance += list.works[row.work - 1].profit;
  row.energy -= 1;
  row.save();
  if (row.energy > 1) return context.send( `${row.name}, смена окончена!

💸 Зарплата > ${utils.sp(list.works[row.work - 1].profit)}$
🏋 Энергии > ${row.energy} ед.`);

  return context.send( `${row.name}, смена окончена! 

💸 Зарплата > ${utils.sp(list.works[row.work - 1].profit)}$
🏋 Энергии закончилась!`
    );
});

updates.hear(/^(?:работа)\s?(.*)?$/i, async (context) => {
  const row = await usersModel.findOne({ id: context.senderId });

  if (!context.$match[1]) return context.send(`${list.works1}`);
  if (!row.experience) {row.experience = 1; row.save();}

  context.$match[1] = Number(context.$match[1]);

  if (context.$match[1] > 9) return context.send(`${list.works1}`);
  if (context.$match[1] < 1) return context.send(`${list.works1}`);
  if (!Number(context.$match[1])) return context.send(`${list.works1}`);
  if (row.experience < list.works[context.$match[1] - 1].experience) return context.send(`${row.name}, для трудоустройства на работу "${list.works[context.$match[1] - 1].name}" нужно ${list.works[context.$match[1] - 1].experience} ед.опыта. У вас › ${row.experience} ед опыта.`);

      row.work = context.$match[1];
      row.save();
      return context.send(`Вы устроились на работу "${list.works[context.$match[1] - 1].name}".\n\n Начать смену > работать`);
});

updates.hear(/^(?:Авиакомпания|ак)$/i, async (context) => {
  const row = await usersModel.findOne({ id: context.senderId });

  text.lvl = ``;
  text.money = ``;

  if (list.airline[row.airline]) text.lvl += `ℹ Доступно улучшение за ${utils.sp(list.airline[row.airline].cost)}$, чтобы улучшить авиакомпанию отправьте > улучшить ак`;
  if (row.balanceAirline) text.money += `🤑 Доступно ${utils.sp(row.balanceAirline)}$, чтобы обналичить отправьте > обналичить ак`;
  if (!row.airline) context.send(`✈️ ${row.name}, у вас нет авиакомпаний!\n\nℹ Для создания используйте: авиакомпания [название]`);


    return context.send(`✈️ ${row.name}, информация о авиакомпаний!
✉️ Наименование > ${row.nameAirline}
💸 Прибыль > ${utils.sp(list.airline[row.airline - 1].profit)}$/В час
💰 Счёт > ${utils.sp(row.balanceAirline)}$
⭐️ Уровень > ${row.airline} \n\n${text.lvl}\n\n${text.money}`);
});

updates.hear(/^(?:Авиакомпания|ак)\s?(.*)?$/i, async (context) => {
  const row = await usersModel.findOne({ id: context.senderId });
  const name = context.$match[1];

  if (!name) return context.send(`✈️ ${row.name}, введите название!\n\nℹ Использование: авиакомпания [название]`);
  if (row.balance < 50000000) return context.send(`${row.name}, недостаточно денег 😣`);
  if (row.experience < 30) return context.send(`✈️ Для создания авиакомпаний нужно 30 ед.опыта.`);

  row.balance -= 50000000;
  row.airline = 1;
  row.nameAirline = name;
  row.save();

  return context.send(`✈️ Вы создали авиакомпанию.\n\nℹ Просмотреть информацию > авиакомпнаия.`);
});

updates.hear(/^(?:улучшить ак)$/i, async (context) => {
  const row = await usersModel.findOne({ id: context.senderId });

  if (!row.airline) return context.send(list.works1);
  if (!list.airline[row.airline]) return context.send(`${row.name}, ак максимально улучшена ☺️`);
  if (row.balance < list.airline[row.airline].cost) return context.send(`${row.name}, недостаточно денег 😣`);

  const m = list.airline[row.airline].cost;

    row.balance -= m;
    row.airline += 1;
    row.save();
    return context.send(`${row.name}, вы улучшили авиокампанию за ${utils.sp(m)} 👍`);
});

updates.hear(/^(?:обналичить ак)$/i, async (context) => {
  const row = await usersModel.findOne({ id: context.senderId });

  if (!row.airline) return context.send(list.works1);
  if (!row.balanceAirline) return context.send(`${row.name}, на счёте нет денег 😪`);

  const m = row.balanceAirline;
  row.balanceAirline = 0;
  row.balance += m;
  row.save();
  return context.send(`${row.name}, вы сняли ${utils.sp(m)}$! 💸`);
});

list.works1 = `💼 Список работ!
  
🧹 1.Уборщик - 1,000$/Смена
🔧 2.Сантехник - 1,500$/Смена
🪓 3.Слесарь - 2,000$/Смена
👩‍💼 4.Бухгалтер - 5,000$/Смена
👩‍⚖️ 5.Секретарь - 7,000$/Смена
👨🏻‍✈️ 6.Директор - 10,000$/Смена
💻 7.Системный админ - 15,000$/Смена
🧣 8.Дизайнер - 20,000$/Смена
👨🏻‍💻 9.IT-Специалист - 30,000$/Смена

ℹ Трудоустроиться > Работа [номер]`;

list.airline = [
  { lvl: 1, cost: 1000, profit: 15000 },
  { lvl: 2, cost: 1000000, profit: 50000 },
  { lvl: 3, cost: 10000000, profit: 60000 },
  { lvl: 4, cost: 20000000, profit: 80000 },
];

list.works = [
  { id: 1, icon: "🧹", name: "уборщик", profit: 1000, experience: 1 },
  { id: 2, icon: "🔧", name: "cантехник", profit: 1500, experience: 5 },
  { id: 3, icon: "🪓", name: "cлесарь", profit: 2000, experience: 10 },
  { id: 4, icon: "👩‍💼", name: "бухгалтер", profit: 5000, experience: 20 },
  { id: 5, icon: "👩‍⚖️", name: "секретарь", profit: 7000, experience: 30 },
  { id: 6, icon: "👨🏻‍✈️", name: "директор", profit: 10000, experience: 40 },
  { id: 7, icon: "💻", name: "системный админ", profit: 15000, experience: 50 },
  { id: 8, icon: "🧣", name: "дизайнер", profit: 20000, experience: 60 },
  { id: 9, icon: "👨🏻‍💻", name: "IT-Специалист", profit: 30000, experience: 70 },
];

//var awesome_instance = new usersModel({ id: 1, name: "awesome", balance: 30 });

/*awesome_instance.save(function (err) {
  if (err) return console.log(err);
  // сохранили!
});*/

return vk.updates.start();
