//Настройка пакетов
//#region Packages 
//Dependencies
const config = require('./config')
const fs = require('fs');
const texts = require('./texts')
//Telegraf
const telegraf = require('telegraf');
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const session = require('telegraf/session');
const stage = new Stage()
const bot = new telegraf(config.token)
bot.log = (text) => {
    if (config.logger) console.log(text)
}
const callbackWallet = new(require('node-qiwi-api')).callbackApi(config.qiwi_token);

//Data Managment
global.cooldown = {};
try {
    global.users = {};
    if (config.cleardata) {
        fs.writeFileSync("./data.json", JSON.stringify({}, null, '\t'), (err) => {
            if (err) bot.log(err);
        });
    } else {
        if (!fs.existsSync('./data.json'))
            fs.writeFileSync("./data.json", JSON.stringify({}, null, '\t'), (err) => {
                if (err) bot.log(err);
            });
        else global.users = require('./data.json')
    }
} catch (e) {}

//#endregion

//#region Stages
//#region Main
const main = new Scene('main')
main.enter((ctx) => {
    try {
        ctx.reply(texts.Main_Choose, {
            reply_markup: {
                keyboard: [
                    ['HQD'],
                    ['Картриджи'],
                    ['ПОД-системы'],
                    [texts.Return_Button]
                ],
                resize_keyboard: true
            }
        })
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
main.hears('HQD', async (ctx) => {
    try {
        ctx.scene.enter('hqd')
    } catch (e) {
        CatchHandler(ctx, e)
    }
});
main.hears('Картриджи', async (ctx) => {
    try {
        ctx.scene.enter('cartridj')
    } catch (e) {
        CatchHandler(ctx, e)
    }
});
main.hears('ПОД-системы', async (ctx) => {
    try {
        ctx.scene.enter('pods')
    } catch (e) {
        CatchHandler(ctx, e)
    }
});
stage.register(main)
//#endregion

//#region Cartridj
const cartridj = new Scene('cartridj')
cartridj.enter((ctx) => {
    try {
        ctx.reply(texts.Cartridj_Choose, {
            reply_markup: {
                keyboard: [
                    [`JUUL: ${config.prices.juul}₽`],
                    [`LOGIC: ${config.prices.logic}₽`],
                    [texts.Back_Button],
                    [texts.Return_Button]
                ],
                resize_keyboard: true
            }
        })
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
cartridj.hears(`JUUL: ${config.prices.juul}₽`, (ctx) => {
    try {
        global.users[ctx.message.from.id] = 'juul';
        ctx.scene.enter('juul')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
cartridj.hears(`LOGIC: ${config.prices.logic}₽`, (ctx) => {
    try {
        global.users[ctx.message.from.id] = 'logic';
        ctx.scene.enter('logic')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
cartridj.hears(texts.Back_Button, (ctx) => {
    try {
        ctx.scene.enter('main')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
stage.register(cartridj)
//#endregion

//#region Pods
const pods = new Scene('pods')
pods.enter((ctx) => {
    try {
        ctx.reply(texts.Pods_Choose, {
            reply_markup: {
                keyboard: [
                    [`LOGIC COMPACT: ${config.prices.logic_pods}₽`],
                    [`JUUL: ${config.prices.juul_pods}₽`],
                    [texts.Back_Button],
                    [texts.Return_Button]
                ],
                resize_keyboard: true
            }
        })
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
pods.hears(`LOGIC COMPACT: ${config.prices.logic_pods}₽`, (ctx) => {
    try {
        global.users[ctx.message.from.id] = 'logic_pods';
        ctx.scene.enter('logic_pods')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
pods.hears(`JUUL: ${config.prices.juul_pods}₽`, (ctx) => {
    try {
        global.users[ctx.message.from.id] = 'juul_pods';
        ctx.scene.enter('juul_pods')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
pods.hears(texts.Back_Button, (ctx) => {
    try {
        ctx.scene.enter('main')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
stage.register(pods)
//#endregion

//#region Juul_Pods
const juul_pods = new Scene('juul_pods')
juul_pods.enter((ctx) => {
    try {
        let keys = texts.Juul_Colors.map(value => [value]);
        keys.push( [texts.Back_Button],[texts.Return_Button]);
        ctx.reply(texts.JuulColor_Choose, {
            reply_markup: {
                keyboard: keys,
                resize_keyboard: true
            }
        })
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
juul_pods.hears(texts.Juul_Colors, (ctx) => {
    try {
        ctx.scene.enter('city')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
juul_pods.hears(texts.Back_Button, (ctx) => {
    try {
        ctx.scene.enter('pods')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
stage.register(juul_pods)
//#endregion

//#region Logic_Pods
const logic_pods = new Scene('logic_pods')
logic_pods.enter((ctx) => {
    try {
        let keys = texts.Logic_Colors.map(value => [value]);
        keys.push([texts.Back_Button],[texts.Return_Button]);
        ctx.reply(texts.LogicColor_Choose, {
            reply_markup: {
                keyboard: keys,
                resize_keyboard: true
            }
        })
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
logic_pods.hears(texts.Logic_Colors, (ctx) => {
    try {
        ctx.scene.enter('city')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
logic_pods.hears(texts.Back_Button, (ctx) => {
    try {
        ctx.scene.enter('pods')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
stage.register(logic_pods)
//#endregion

//#region HQD
const hqd = new Scene('hqd')
hqd.enter((ctx) => {
    try {
        ctx.reply(texts.HQD_Choose, {
            reply_markup: {
                keyboard: [
                    [`CUVIE (350 тяг): ${config.prices.cuvie}₽`, ],
                    [`MAXIM (400 тяг): ${config.prices.maxim}₽`],
                    [`ROSY (500 тяг): ${config.prices.rosy}₽`],
                    [`ULTRA (500 тяг): ${config.prices.ultra}₽`],
                    [`CUVIE PLUS (1200 тяг): ${config.prices.cuvie_plus}₽`],
                    [texts.Back_Button],
                    [texts.Return_Button]
                ],
                resize_keyboard: true
            }
        })
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
hqd.hears(`CUVIE (350 тяг): ${config.prices.cuvie}₽`, (ctx) => {
    try {
        global.users[ctx.message.from.id] = 'cuvie';
        ctx.scene.enter('hqdtastes')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
hqd.hears(`MAXIM (400 тяг): ${config.prices.maxim}₽`, (ctx) => {
    try {
        global.users[ctx.message.from.id] = 'maxim';
        ctx.scene.enter('hqdtastes')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
hqd.hears(`ULTRA (500 тяг): ${config.prices.ultra}₽`, (ctx) => {
    try {
        global.users[ctx.message.from.id] = 'ultra';
        ctx.scene.enter('hqdtastes')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
hqd.hears(`ROSY (500 тяг): ${config.prices.rosy}₽`, (ctx) => {
    try {
        global.users[ctx.message.from.id] = 'rosy';
        ctx.scene.enter('hqdtastes')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
hqd.hears(`CUVIE PLUS (1200 тяг): ${config.prices.cuvie_plus}₽`, (ctx) => {
    try {
        global.users[ctx.message.from.id] = 'cuvie_plus';
        ctx.scene.enter('hqdtastes')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
hqd.hears(texts.Back_Button, (ctx) => {
    try {
        ctx.scene.enter('main')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
stage.register(hqd)

//#region HQDTastes
const hqdtastes = new Scene('hqdtastes')
hqdtastes.enter((ctx) => {
    try {
        let keys = texts.HQD_TasteList.map(value => [value]);
        keys.push([texts.Back_Button],[texts.Return_Button]);
        ctx.reply(texts.Taste_Choose, {
            reply_markup: {
                keyboard: keys,
                resize_keyboard: true
            }
        })
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
hqdtastes.hears(texts.HQD_TasteList, (ctx) => {
    try {
        ctx.scene.enter('city')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
hqdtastes.hears(texts.Back_Button, (ctx) => {
    try {
        ctx.scene.enter('hqd')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
stage.register(hqdtastes)
//#endregion

//#endregion

//#region JUUL
const juul = new Scene('juul')
juul.enter((ctx) => {
    try {
        let keys = texts.JUUL_TasteList.map(value => [value]);
        keys.push([texts.Back_Button],[texts.Return_Button]);
        ctx.reply(texts.Taste_Choose, {
            reply_markup: {
                keyboard: keys,
                resize_keyboard: true
            }
        })
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
juul.hears(texts.JUUL_TasteList, (ctx) => {
    try {
        ctx.scene.enter('city')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
juul.hears(texts.Back_Button, (ctx) => {
    try {
        ctx.scene.enter('cartridj')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
stage.register(juul)
//#endregion

//#region LOGIC
const logic = new Scene('logic')
logic.enter((ctx) => {
    try {
        let keys = texts.LOGIC_TasteList.map(value => [value]);
        keys.push([texts.Back_Button],[texts.Return_Button]);
        ctx.reply(texts.Taste_Choose, {
            reply_markup: {
                keyboard: keys,
                resize_keyboard: true
            }
        });
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
logic.hears(texts.LOGIC_TasteList, (ctx) => {
    try {
        ctx.scene.enter('city')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
logic.hears(texts.Back_Button, (ctx) => {
    try {
        ctx.scene.enter('cartridj')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
stage.register(logic)
//#endregion

//#region City
const city = new Scene('city')
city.enter((ctx) => {
    try {
        let keys = texts.City_List.map(value => [value]);
        keys.push([texts.Return_Button]);
        ctx.reply(texts.City_Choose, {
            reply_markup: {
                keyboard: keys,
                resize_keyboard: true
            }
        })
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
city.hears(texts.City_List, (ctx) => {
    try {
        SetData(ctx);
        ctx.scene.enter('payment')
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
stage.register(city)
//#endregion

//#region Payment
const payment = new Scene('payment');
payment.enter((ctx) => {
    try {
        ctx.reply(texts.QIWI_info
            .replace('[ID]', config.qiwi_id)
            .replace('[PRICE]', global.users[ctx.message.from.id].price)
            .replace('[COMMENT]', global.users[ctx.message.from.id].num)
            .replace('[NICKNAME]', config.admin), {
                reply_markup: {
                    keyboard: [
                        [texts.Check_Button],
                        [texts.Return_Button]
                    ],
                    resize_keyboard: true
                }
            })
        bot.log(`Новый Запрос: \
            \nID: ${ctx.message.from.id}\
            \nЦена: ${global.users[ctx.message.from.id].price}\
            \nКод Подтверждения: ${global.users[ctx.message.from.id].num}\n`)
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
stage.register(payment)
//#endregion

//#region Bot Setup
bot.use(session())
bot.use(stage.middleware())
bot.start(StartHandler);
bot.hears(texts.Buy_Button, async (ctx) => ctx.scene.enter('main'));
bot.hears(texts.Check_Button, PaymentHandler)
bot.hears(texts.Return_Button, StartHandler);
bot.hears(texts.FAQ_Button, async (ctx) => {
    try {
        ctx.reply(texts.FAQ.replace('[NICKNAME]', config.admin), {
            reply_markup: {
                keyboard: [
                    [
                        texts.Buy_Button,
                        texts.FAQ_Button,
                    ]
                ],
                resize_keyboard: true
            }
        })
    } catch (e) {
        CatchHandler(ctx, e)
    }
})
//#endregion
//#endregion

bot.log("Запуск ...");
bot.startPolling();

//#region Handlers and Functions
async function StartHandler(ctx) {
    try {
        ctx.reply(texts.Start.replace('[NICKNAME]', ctx.message.from.first_name), {
            reply_markup: {
                keyboard: [
                    [
                        texts.Buy_Button,
                        texts.FAQ_Button,
                    ]
                ],
                resize_keyboard: true
            }
        })
    } catch (e) {
        CatchHandler(ctx, e)
    }
}
function SetData(ctx) {
    let randnum = parseInt(Math.random() * 899999 + 100000);
    if (global.users[ctx.message.from.id] && typeof (global.users[ctx.message.from.id]) == 'string') {
        global.users[ctx.message.from.id] = {
            price: config.prices[global.users[ctx.message.from.id]],
            num: randnum
        }
    } else {
        global.users[ctx.message.from.id] = {
            price: config.prices[0],
            num: randnum
        }
    }
    fs.writeFileSync("./data.json", JSON.stringify(global.users, null, '\t'), (err) => {
        if (err) bot.log(err);
    });
}
function CatchHandler(ctx, e) {
    try {
        if (texts && texts.Error) {
            ctx.reply(texts.Error.replace("[ERROR]", e.name), {
                keyboard: [
                    [texts.Return_Button]
                ],
                resize_keyboard: true
            })
        } else {
            ctx.reply("Произошла ошибка. Сообщите Администрации!", {
                keyboard: [
                    [texts.Return_Button]
                ],
                resize_keyboard: true
            })
        }
        bot.log(e);
    } catch (e) {}
}
async function PaymentHandler(ctx) {
    try {
        let cooldown = config.cooldown === undefined || parseInt(config.cooldown) < 0 ? 120 : config.cooldown;
        let sec1 = parseInt(new Date().getTime())
        if (global.cooldown[ctx.message.from.id] && (sec1 - global.cooldown[ctx.message.from.id] < cooldown * 1000)) {
            let seconds = cooldown - parseInt((sec1 - global.cooldown[ctx.message.from.id]) / 1000);
            let timetext = `${parseInt(seconds/60)}м ${parseInt(seconds%60)}с`
            return ctx.reply(texts.Cooldown_Text.replace('[TIME]', timetext), {
                reply_markup: {
                    keyboard: [
                        [texts.Check_Button],
                        [texts.Return_Button]
                    ],
                    resize_keyboard: true
                }
            })
        }
        let info = global.users[ctx.message.from.id];
        if (!info || typeof (info) !== 'object') {
            delete require.cache['./data.json'];
            let backupdata = require('./data.json');
            if (backupdata[ctx.message.from.id] && typeof (backupdata[ctx.message.from.id]) == 'object') {
                info = backupdata[ctx.message.from.id];
            } else return ctx.reply(texts.Couldnt_Find_Error, {
                reply_markup: {
                    keyboard: [
                        [texts.Return_Button]
                    ],
                    resize_keyboard: true
                }
            })
        }
        ctx.reply(texts.Starting)
        global.cooldown[ctx.message.from.id] = new Date().getTime();
        callbackWallet.getOperationHistory(config.qiwi_id, {
            rows: 50,
            operation: 'IN'
        }, (err, data) => {
            try {
                if (err || !data.data) {
                    return ctx.reply(texts.Check_Error.replace(`[NICKNAME]`, config.admin), {
                        reply_markup: {
                            keyboard: [
                                [texts.Check_Button],
                                [texts.Return_Button]
                            ],
                            resize_keyboard: true
                        }
                    })
                }
                for (let i = 0; i < data.data.length; i++) {
                    let transaction = data.data[i];
                    if (transaction.comment == info.num && transaction.total.currency == 643 && transaction.total.amount >= info.price) {
                        delete global.users[ctx.message.from.id]
                        fs.writeFileSync("./data.json", JSON.stringify(global.users, null, '\t'), (err) => {
                            if (err) bot.log(err);
                        });
                        bot.log(`Оплата Получена: \
                    \nID: ${ctx.message.from.id}\
                    \nСумма: ${transaction.total.amount}`)
                        return ctx.reply(texts.Payment_Success.replace(`[NICKNAME]`, config.admin), {
                            reply_markup: {
                                keyboard: [
                                    [texts.Return_Button]
                                ],
                                resize_keyboard: true
                            }
                        })
                    }
                }
                return ctx.reply(texts.Payment_Failed.replace(`[NICKNAME]`, config.admin), {
                    reply_markup: {
                        keyboard: [
                            [texts.Check_Button],
                            [texts.Return_Button]
                        ],
                        resize_keyboard: true
                    }
                })
            } catch (e) {
                bot.log(e)
                return ctx.reply(texts.Payment_Failed.replace(`[NICKNAME]`, config.admin), {
                    reply_markup: {
                        keyboard: [
                            [texts.Check_Button],
                            [texts.Return_Button]
                        ],
                        resize_keyboard: true
                    }
                })
            }
        })
    } catch (e) {
        CatchHandler(ctx, e)
    }
}
//#endregion
