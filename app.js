﻿const { Telegraf } = require('telegraf')
const rest = require('wireguard-rest')
const TOKEN = "5181690284:AAGbgnTGaOL3uf2QwpDK4KZFJeCF_EC-U1M"

const bot = new Telegraf(TOKEN)


bot.start((ctx) => {
    ctx.reply('Приветствуем Вас на проекте %name%. Мы занимаемся продвижением интернет-технологий. Рады представить наш VPN сервер. В эпоху санкций, политических движений и игр больших дядек, хочется просто позалипать в инстаграм, почитать твиттер без ограничения скорости или даже (это мы не одобряем) скачать фильм торрентом. Большинство бесплатных или очень дешевых VPN сервисов могут ворувать ваши данные и просматривать любые данные передаваемые в сети интернет. Мы против этого и наш девиз прост: "Качественно и красиво".')
    ctx.reply('Мы предлагаем безлимитный трафик с очень малой потерей скорости с несколькими локациями. У нас есть разные тарифы, можете подобрать себе подходящий. Все нужные Вам команды можете узнать с помощью сообщения /help')
})


bot.help((ctx) => ctx.reply('У нас все просто, есть всего 2 основные команды: \nТарифный план \nТехническая поддержка'))

bot.hears(['Тарифный план', 'тарифный план'], (ctx) => ctx.reply('Пока наш проект слишком молодой и чтобы дать Вам гарантию работоспособности мы позволяем покупать подписку максимально на 3 месяца. Но вы можете начать с 2 недель.Если вы знаете на какой срок хотите купить подписку, предлагаем Вам написать что - то из этого "2 недели", "1 месяц", "3 месяца". Если вы не можете определится и Вас терзают сомнения, можете написать "Помогите определится" и кто - то из наших ребят подскажет вам, почему нужно выбрать именно нас.'))

bot.hears(['Подовинников', 'подовинников'], (ctx) => ctx.reply('Опа, нашел пасхалку. Я Данила. У меня есть небольшая компания. Название банальное - Podovinnikov (моя фамилия).Дарю тебе промокод на 3 дня тестирования нашего VPN.'))

bot.hears('1 месяц', (ctx) => ctx.reply('Поздравляем, вы оплатили подписку на 1 месяц, в ближайшее время вам придет сообщение с выбором способом аутентификации.'))



rest.listen(3000, function() {
    console.log('api started on port 3000')
})

'use strict';

class API {

  async call({ method, path, body }) {
    const res = await fetch(`/api${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body
        ? JSON.stringify(body)
        : undefined,
    });

    if (res.status === 204) {
      return undefined;
    }

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || res.statusText);
    }

    return json;
  }

  async getRelease() {
    return this.call({
      method: 'get',
      path: '/release',
    });
  }

  async getSession() {
    return this.call({
      method: 'get',
      path: '/session',
    });
  }

  async createSession({ password }) {
    return this.call({
      method: 'post',
      path: '/session',
      body: { password },
    });
  }

  async deleteSession() {
    return this.call({
      method: 'delete',
      path: '/session',
    });
  }

  async getClients() {
    return this.call({
      method: 'get',
      path: '/wireguard/client',
    }).then(clients => clients.map(client => ({
      ...client,
      createdAt: new Date(client.createdAt),
      updatedAt: new Date(client.updatedAt),
      latestHandshakeAt: client.latestHandshakeAt !== null
        ? new Date(client.latestHandshakeAt)
        : null,
    })));
  }

  async createClient({ name }) {
    return this.call({
      method: 'post',
      path: '/wireguard/client',
      body: { name },
    });
  }

  async deleteClient({ clientId }) {
    return this.call({
      method: 'delete',
      path: `/wireguard/client/${clientId}`,
    });
  }

  async enableClient({ clientId }) {
    return this.call({
      method: 'post',
      path: `/wireguard/client/${clientId}/enable`,
    });
  }

  async disableClient({ clientId }) {
    return this.call({
      method: 'post',
      path: `/wireguard/client/${clientId}/disable`,
    });
  }

  async updateClientName({ clientId, name }) {
    return this.call({
      method: 'put',
      path: `/wireguard/client/${clientId}/name/`,
      body: { name },
    });
  }

  async updateClientAddress({ clientId, address }) {
    return this.call({
      method: 'put',
      path: `/wireguard/client/${clientId}/address/`,
      body: { address },
    });
  }

}



bot.launch()
