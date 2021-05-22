const restify = require('restify')

const { BotFrameworkAdapter, ConversationState, MemoryStorage } = require('botbuilder')
const { BotActivityHandler } = require('./BotActivityHandler')

//adapter init
const adapter = new BotFrameworkAdapter({
    appId: '',
    appPassowrd: ''
});

//adapter error handler

adapter.onTurnError = async(context,error) => {
    console.log('Some error has been occured', error);
    await context.sendActivity('Error has been encountered to Bot');
}

//server creation

const server = restify.createServer();

server.listen(3978, () => {
    console.log(`${server.name} is listing to the port ${server.url}`);
})

const memory = new MemoryStorage();

let conversationState = new ConversationState(memory);

const mainBot = new BotActivityHandler(conversationState);

server.post('/api/messages', (req,res) => {
    adapter.processActivity(req,res, async(context) => {
        await mainBot.run(context);
    })
})