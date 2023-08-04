const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options.js');

const token = '6623359654:AAFQdt7LApaLvUs1oW9IMyj9VLgf2dt_Msg';

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Я загадаю от 0 до 9 а ты отгадай`);
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Получить информ о пользователе' },
    { command: '/game', description: 'Начинаем игру' },
  ]);

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://telegram.org.ru/uploads/posts/2017-03/1490198448_2.png',
      );
      return bot.sendMessage(chatId, `Ты написал мне какую то херню типа ${text}`);
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
    }

    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, 'Моя твоя не понимать');
  });

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Поздравляю ты угадал цифру ${chats[chatId]}`,
        againOptions,
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `Ты не угадал, бот загадал цифру ${chats[chatId]}`,
        againOptions,
      );
    }
  });
};

start();
